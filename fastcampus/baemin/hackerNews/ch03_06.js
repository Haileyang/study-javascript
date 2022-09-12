//페이징 구현하기

//학습목표 
// 1. 현재 페이지 위치 판별
// 2. 이전페이지와 다음페이지 기능 추가

const ajax = new XMLHttpRequest();  
const content = document.createElement('div')
const root = document.getElementById('root')
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json'
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json'
// 페이지를 구현하기 위해서는 현재 페이지의 위치를 알아야되고, 해당 페이지의 위치의 값은 계속 바뀐다. 
// 글목록에서 페이지네이션이 사용하므로 글목록 즉 newsFeed() 안에 let currentPage = 1; 해서 정의 할 수도 있지만. 
// 문제는, 상세에서 목록으로 페이지가 리다이렉트 되었을 때, newsFeed()가 실행되면서 page는 1로 계속 리셋된다. 
// 따라서, current page는 newsDetail에서도 필요하며, 공통으로 사용되는 부분이기 때문에 store라는 변수에 보관한다.
let store = {
    currentPage : 1
}

function getData (url){
    ajax.open('GET', url, false)
    ajax.send(); 

    return JSON.parse(ajax.response);
}

function newsFeed(){
    const newsFeed = getData(NEWS_URL);
    const newsList = [];
    newsList.push('<ul>')
    //for 문도 페이징에 맞게 변경
    // i = store.currentPage - 1 을 사용한 이유는, page가 1 2 3 이렇게 들어가고 0부터 시작이 필요
    // 한페이지의 단위 10개의 데이터, 10n
    for(let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++){
        console.log(newsFeed.length)
        newsList.push(`
            <li>
                <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}(${newsFeed[i].comments_count})</a>
            </li>
        `)
    }
    
    newsList.push('</ul>')
    //이전 다음 추가 
    newsList.push(`
        <ul>
            <li><a href="#/page/${store.currentPage > 1 ? store.currentPage - 1 : 1}">이전페이지</li>
            <li><a href="#/page/${store.currentPage < (newsFeed.length / 10) ? store.currentPage + 1 : store.currentPage}">다음페이지</li>
        </ul>
    `)

    // 아래의 방식으로 이전과 다음페이지를 불러올 수 있지만, 상세페이지의 해쉬랑 구분이 안되므로 구분할 수 있는 대안책이 필요 /page/
    //  <li><a href="#${store.currentPage - 1}">이전페이지</li>
    //삼항연산자를 사용해 데이터가 없는 페이지로 + - 를 방지
    root.innerHTML = newsList.join('')
}

function newsDetail(){
    // /page/ /show/ 추가로 substr 1 --> 7
    const id = location.hash.substr(7)
    const newsContent = getData(CONTENT_URL.replace('@id', id));

    // anchor 태그에 클릭한 기준, 목록보기 클릭시 이전페이지로 기억해서 돌아가는 작업필요
    root.innerHTML = `
        <span><a href="#/page/${store.currentPage}">목록으로</a></span>
        <h1>${newsContent.title}</h1>
    `
}

function router(){
    const routePath = location.hash
    if(routePath === ''){
        newsFeed()
    }else if (routePath.indexOf('#/page/') >= 0){
        //페이지 숫자값 추출
        // store.currentPage = routePath.substr(7); //숫자가 아니라 문자열이므로 숫자 두개가 합쳐진다
        // substr(7) #/page/ 0 1 2 3 4 5 6 --> 7
        store.currentPage = Number(routePath.substr(7))
        newsFeed()
    } else{
        newsDetail() 
    }
}
window.addEventListener('hashchange', router)

router()
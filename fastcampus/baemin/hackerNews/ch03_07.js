//복잡한 UI 구현을 위한 준비 작업 - 템플릿

//학습목표 
// 1. 기존의 newsFeed의 배열방식을, 템플릿을 활용해 조금 더 마크업에 가깝게 수정하기
// 2. 스타일을 적용시키되, 복잡한 코드는 만들지 않도록하기

const ajax = new XMLHttpRequest();  
const content = document.createElement('div')
const root = document.getElementById('root')
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json'
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json'

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
    let template = `
        <div>
            <h1>Hacker News</h1>
            <ul>
                {{__news_feed__}}
            </ul>
            <ul>
                <li>
                    <a href="#/page/{{__prev_page__}}">이전 페이지</a>
                </li>
                <li>
                    <a href="#/page/{{__next_page__}}">디음 페이지</a>
                </li>
            </ul>
        </div>
    `
    // newsFeed 의 마크업의 경우, DOM API 의 구조보다는 덜 복잡한 것은 사실이지만, 마크업은 분산되어져있음
    // 결론적으로, 조금 더 복잡한 UI일 경우, 가독성이 떨어지므로 배열을 최소화해서 가독성을 늘려야되는데 
    // 템플릿을 사용해 만들어 볼 수 있다.
    
    // newsList.push('<ul>')
    for(let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++){
        console.log(newsFeed.length)
        newsList.push(`
            <li>
                <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}(${newsFeed[i].comments_count})</a>
            </li>
        `)
    }

    // newsList.push('</ul>')
    // newsList.push(`
    //     <ul>
    //         <li><a href="#/page/${store.currentPage > 1 ? store.currentPage - 1 : 1}">이전페이지</li>
    //         <li><a href="#/page/${store.currentPage < (newsFeed.length / 10) ? store.currentPage + 1 : store.currentPage}">다음페이지</li>
    //     </ul>
    // `)


    //template으로 묶였으니, feed를 newsList 배열 안에 넣어 정리 
    //정리된 template으로 hashchange가 일어났을 때, root innerHTML overwrite
    template = template.replace('{{__news_feed__}}', newsList.join(''))
    template = template.replace('{{__prev_page__}}', store.currentPage > 1 ? store.currentPage - 1 : 1)
    template = template.replace('{{__next_page__}}', store.currentPage < (newsFeed.length / 10) ? store.currentPage + 1 : store.currentPage)
    root.innerHTML = template
    // root.innerHTML = newsList.join('')
}

function newsDetail(){
    const id = location.hash.substr(7)
    const newsContent = getData(CONTENT_URL.replace('@id', id));

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
        store.currentPage = Number(routePath.substr(7))
        newsFeed()
    } else{
        newsDetail() 
    }
}
window.addEventListener('hashchange', router)

router()

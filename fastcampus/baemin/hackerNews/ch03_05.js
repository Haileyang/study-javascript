// 라우터? 화면처리기 만들기
//학습목표 
// 1. 중복되는 코드 함수를 활용해 코드 개선
// 2. DOM API를 활용해 발생하는 UI의 구조적인 문제를 문자열을 이용해 해결
// 3. 라우터를 이용해 두개의 웹 페이지 구현

const ajax = new XMLHttpRequest();  
const content = document.createElement('div')
const root = document.getElementById('root')
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json'
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json'

function getData (url){
    ajax.open('GET', url, false)
    ajax.send(); 

    return JSON.parse(ajax.response);
}

// 코드 재활용을 위해 함수로 리팩토링한다.
// 라우터에서 글 목록화면을 호출
function newsFeed(){
    const newsFeed = getData(NEWS_URL);
    const newsList = [];
    newsList.push('<ul>')
    for(let i=0; i<10; i++){
        console.log(newsFeed.length)
        newsList.push(`
            <li>
                <a href="#${newsFeed[i].id}">${newsFeed[i].title}(${newsFeed[i].comments_count})</a>
            </li>
        `)
    }
    newsList.push('</ul>')
    root.innerHTML = newsList.join('')
}

//라우터에서 글 내용화면 호출을 위해서, 함수 이름이 필요. 
function newsDetail(){
    
    const id = location.hash.substr(1)
    const newsContent = getData(CONTENT_URL.replace('@id', id));

    root.innerHTML = `
        <span><a href="#">목록으로</a></span>
        <h1>${newsContent.title}</h1>
    `
}

//newsFeed를 처음에 호출하는 라우터 함수가 필요함 
function router(){
    const routePath = location.hash
    //location.hash 에 #만 있을 경우, 빈 값을 반환
    if(routePath === ''){
        newsFeed()
    }else{
        newsDetail()
    }
}
window.addEventListener('hashchange', router)

// window onload시, router호출
router()
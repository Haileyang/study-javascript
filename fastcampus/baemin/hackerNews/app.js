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
    newsList.push('<ul>')
    for(let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++){
        console.log(newsFeed.length)
        newsList.push(`
            <li>
                <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}(${newsFeed[i].comments_count})</a>
            </li>
        `)
    }

    newsList.push('</ul>')
    newsList.push(`
        <ul>
            <li><a href="#/page/${store.currentPage > 1 ? store.currentPage - 1 : 1}">이전페이지</li>
            <li><a href="#/page/${store.currentPage < (newsFeed.length / 10) ? store.currentPage + 1 : store.currentPage}">다음페이지</li>
        </ul>
    `)

    root.innerHTML = newsList.join('')
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
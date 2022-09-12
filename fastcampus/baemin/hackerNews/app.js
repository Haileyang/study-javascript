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
    for(let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++){
        console.log(newsFeed.length)
        newsList.push(`
            <li>
                <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}(${newsFeed[i].comments_count})</a>
            </li>
        `)
    }

    template = template.replace('{{__news_feed__}}', newsList.join(''))
    template = template.replace('{{__prev_page__}}', store.currentPage > 1 ? store.currentPage - 1 : 1)
    template = template.replace('{{__next_page__}}', store.currentPage < (newsFeed.length / 10) ? store.currentPage + 1 : store.currentPage)
    root.innerHTML = template
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
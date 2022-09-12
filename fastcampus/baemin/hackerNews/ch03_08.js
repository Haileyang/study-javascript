//댓글 목록이 표시되는 아름다운 UI 만들기

//학습목표 
// 1. UI 스타일 변경
// 2. 댓글목록 표시

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
        <div class="bg-gray-600 min-h-screen">
            <div class="bg-white text-xl">
                <div class="mx-auto px-4">
                    <div class="flex justify-between items-center py-6">
                        <div class="flex justify-start">
                            <h1 class="font-extrabold">Hacker News</h1>
                        </div>
                        <ul class="items-center justify-end flex">
                            <li>
                                <a href="#/page/{{__prev_page__}}" class="text-gray-500">
                                    PREVIOUS
                                </a>
                            </li>
                            <li class="mx-4">
                                <span class="font-bold">{{__current_page__}}</span> /
                                <span>{{__total_page__}}</span>
                            </li>
                            <li>
                                <a href="#/page/{{__next_page__}}" class="text-gray-500">
                                    NEXT
                                </a>
                            </li>
                        </ul>
                    </div> 
                </div>
            </div>
            <div class="p-4 text-2xl text-gray-700">
                {{__news_feed__}}        
            </div>
        </div>
    `
    for(let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++){
        newsList.push(`
            <div class="p-6 ${newsFeed[i].read ? 'bg-red-500' : 'bg-white'} mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
                <ul class="flex">
                    <li class="flex-auto">
                        <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}</a>  
                    </li>
                    <li class="text-center text-sm">
                        <div class="w-10 text-white bg-green-600 rounded-lg px-0 py-2">${newsFeed[i].comments_count}</div>
                    </li>
                </ul>
                <div class="flex mt-3">
                    <ul class="grid grid-cols-3 text-sm text-gray-500">
                        <li><i class="fas fa-user mr-1"></i>${newsFeed[i].user}</li>
                        <li><i class="fas fa-heart mr-1"></i>${newsFeed[i].points}</li>
                        <li><i class="far fa-clock mr-1"></i>${newsFeed[i].time_ago}</li>
                    </ul>  
                </div>
            </div>    
        `)
    }

    template = template.replace('{{__news_feed__}}', newsList.join(''))
    template = template.replace('{{__prev_page__}}', store.currentPage > 1 ? store.currentPage - 1 : 1)
    template = template.replace('{{__next_page__}}', store.currentPage < (newsFeed.length / 10) ? store.currentPage + 1 : store.currentPage)
    template = template.replace('{{__current_page__}}', store.currentPage)
    template = template.replace('{{__total_page__}}', (newsFeed.length / 10))
    root.innerHTML = template
}

function newsDetail(){
    const id = location.hash.substr(7)
    const newsContent = getData(CONTENT_URL.replace('@id', id));

    let template = `
        <div class="bg-gray-600 min-h-screen pb-8">
            <div class="bg-white text-xl">
                <div class="mx-auto px-4">
                    <div class="flex justify-between items-center py-6">
                        <div class="flex justify-start">
                            <h1 class="font-extrabold">Hacker News</h1>
                        </div>
                        <div class="items-center justify-end">
                            <a href="#/page/${store.currentPage}" class="text-gray-500">
                                <i class="fa fa-times"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="h-full border rounded-xl bg-white m-6 p-4 ">
                <h2>${newsContent.title}</h2>
                <div class="text-gray-400 h-20">
                ${newsContent.content}
                </div>

                {{__comments__}}

            </div>
        </div>
    `

    root.innerHTML = template
    
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
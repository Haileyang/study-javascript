// 상태를 가져보자, 읽은 글 표시하기

//학습목표 
// 1. 읽은 상태 확인 후, 읽은 글 UI 표시
// 2. 첫번째 페이지가 아닌 페이지에서 게시글 클릭 후, 목록으로 돌아갈 때, 현코드의 문제점 : 전체 데이터 다시 호출 개선 
// --> 개선 방법 : 읽은 데이터의 페이지 기억 후, 해당 페이지의 게시글만 호출

const ajax = new XMLHttpRequest();  
const content = document.createElement('div')
const root = document.getElementById('root')
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json'
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json'

let store = {
    currentPage : 1,
    feeds : [] // read를 매번 호출하지 않으려면, 빈 배열에 데이터 정보를 보관하면 된다. 
}

function getData (url){
    ajax.open('GET', url, false)
    ajax.send(); 

    return JSON.parse(ajax.response);
}

//읽은 데이터의 여부는 데이터 호출 이외에 다양한 일을 처리하는 getData에 넣기보다는 따로 빼서 함수 작성
function makeFeeds(feeds){
    for (let i = 0; i < feeds.length; i++){
        feeds[i].read = false // 처음에 안읽을 피드에 false값 부여
    }
    return feeds
} // 이 함수는 어디서 호춣해서 작동하는 걸까요?

function newsFeed(){
    // const newsFeed = getData(NEWS_URL); // 현재는 getData를 통해서 지속적으로 데이터를 전체 불러오므로 store.feeds로 저장된 데이터 호출
    let newsFeed = store.feeds // 기존에는 변하지 않는 상수의 데이터였다면, 변수가 되므로 let 사용
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

    //최초에 newsFeed를 불러와야함 
    if(newsFeed.length === 0){
        newsFeed = store.feeds = getData(NEWS_URL)
    }



    for(let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++){
        newsList.push(`
            <div class="p-6 ${newsFeed[i].read ? 'bg-gray-100' : 'bg-white'} mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
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
                <h2>COMMENTS</h2>
                <hr>
                {{__comments__}}

            </div>
        </div>
    `
  
    //읽음 상태 변경 
    for(let i = 0; i < store.feeds.length; i++){
        if(store.feeds[i].id === Number(id)){
            store.feeds[i].read = true;
            break
        }
    }

    function makeComment(comments, called = 0){ 
        const commentString = [] 

        for (let i = 0; i < comments.length; i++){
            commentString.push(`
                <div style="padding-left: ${called * 40}px" class="mt-4">
                    <div class="text-gray-400">
                        <i class="fa fa-sort-up mr-2"></i>
                        <strong>${comments[i].user}</strong> ${comments[i].time_ago}
                    </div>
                    <p class="text-gray-700">${comments[i].content}</p>
                </div>  
            `)

            
            if(comments[i].comments.length > 0){
                commentString.push(makeComment(comments[i].comments, called + 1))
            }
        }
        
        return commentString.join('')
    }

    root.innerHTML = template.replace('{{__comments__}}', makeComment(newsContent.comments))  
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
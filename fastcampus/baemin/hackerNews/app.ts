const ajax : XMLHttpRequest = new XMLHttpRequest();
const content : HTMLDivElement | undefined = document.createElement('div')
const root : HTMLElement | null = document.getElementById('root')
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json'
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json'

//type naming convention = capitalize
type Store = {
    currentPage : number;
    feeds : NewsFeed[] //the array contains the types assigned on NewsFeed Type
}

type NewsFeed = {
    id : number;
    comments_count : number;
    url : string, 
    user : string, 
    time_ago : string;
    points: number,
    title : string; 
    read? : boolean; //? optional
}

const store : Store = {
    currentPage : 1,
    feeds : [] 
}

function getData (url){
    ajax.open('GET', url, false)
    ajax.send(); 

    return JSON.parse(ajax.response);
}


function makeFeeds(feeds){
    for (let i = 0; i < feeds.length; i++){
        feeds[i].read = false 
    }
    return feeds
} 

function newsFeed(){
    let newsFeed : NewsFeed[] = store.feeds 
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

    //최초에 newsFeed
    if(newsFeed.length === 0){
        newsFeed = store.feeds = getData(NEWS_URL)
    }

    for(let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++){
        newsList.push(`
            <div class="p-6 ${newsFeed[i].read ? 'bg-gray-300' : 'bg-white'} mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
                <ul class="flex">
                    <li class="flex-auto">
                        <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}</a>  
                    </li>
                    <li class="text-center text-sm ml-10">
                        <div class="w-10 text-white bg-green-600 rounded-lg px-0 py-2">${newsFeed[i].comments_count}</div>
                    </li>
                </ul>
                <div class="flex mt-3">
                    <ul class="text-sm text-gray-500 flex">
                        <li><i class="fas fa-user mr-1"></i>${newsFeed[i].user}</li>
                        <li class="mx-5"><i class="fas fa-heart mr-1"></i>${newsFeed[i].points}</li>
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

    //하기 코드의 경우, null 값이 들어갈 수 있다고 명시한 에러가 발생한다. HTMLElement | null
    // null 이 들어가면 innerHTML이 들어갈 경우, 오류가 발생하므로 null
    // 코드상으로 null이 들어가있지 않은 경우에만, html element 에 접근하게 하는 코드 추가 작성필요
   
    // root.innerHTML = template

    if(root != null){
        root.innerHTML = template;
    }else{
        console.error('최상위 컨테이너가 없어 UI를 진행하지 못합니다.')
    }
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

        // i의 타입은 명시한적이 없지만 에러로 뜨지 않는 이유는 타입스크립트가 추론을 해서 숫자형으로 인지해서 임의로 타입을 지정해줌
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

    // root.innerHTML = template.replace('{{__comments__}}', makeComment(newsContent.comments))  

    if(root){
        root.innerHTML = template.replace('{{__comments__}}', makeComment(newsContent.comments))  ;
    }else{
        console.error('최상위 컨테이너가 없어 UI를 진행하지 못합니다.')
    }
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
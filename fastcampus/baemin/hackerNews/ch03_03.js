//두개의 화면을 가진 웹앱

//학습목표 
// 1. anchor tag 를 li 태그 안에 삽입
// 2. event listener = hashchange 
// 3. content 공간 확보 후, title 출력

const ajax = new XMLHttpRequest();  
const content = document.createElement('div')
const root = document.getElementById('root')
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json'
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json'


ajax.open('GET', NEWS_URL, false)
ajax.send(); 

const newsFeed = JSON.parse(ajax.response);

const ul = document.createElement('ul')

window.addEventListener('hashchange', function(){
    // console.log('hash change')

    // location.hash 
    // console.log(location.hash) //해쉬태그까지 함께 반환 
    //해쉬태그 제거를 위해서는 substr을 사용 
    const id = location.hash.substr(1)
    console.log(id)
    
    ajax.open('GET', CONTENT_URL.replace('@id', id), false)
    ajax.send(); 

    const newsContent = JSON.parse(ajax.response);
    const title = document.createElement('hi')
    content.appendChild(title)
    title.innerHTML = newsContent.title
    
    console.log(newsContent)
})

for(let i=0; i<10; i++){
    const li = document.createElement('li')
    const a = document.createElement('a')
    a.innerHTML = `${newsFeed[i].title}(${newsFeed[i].comments_count})`
    // a.href = '#'
    a.href = `#${newsFeed[i].id}` 
    // a.addEventListener('click', function(){}) //앵커 태그가 여러개 있으므로 각 앵커태그에 부여해야되는 불편함이 있음.

    li.appendChild(a)
    ul.appendChild(li)
}


root.appendChild(ul)
root.appendChild(content)
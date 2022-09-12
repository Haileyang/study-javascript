//문자열을 활용한 HTML 다루기

//학습목표 
// 1. 중복되는 코드 함수를 활용해 코드 개선
// 2. DOM API를 활용해 발생하는 UI의 구조적인 문제를 문자열을 이용해 해결

const ajax = new XMLHttpRequest();  
const content = document.createElement('div')
const root = document.getElementById('root')
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json'
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json'

// 코드 리팩토링
// 데이터의 중복은 변수로 정리 가능 / 변수가 여러개일 때는 객체를 활용 / 코드가 중복될 때는 함수를 활용 
// 함수를 활용해서 중복되는 ajax 호출을 정리 
function getData (url){
    ajax.open('GET', url, false)
    ajax.send(); 

    return JSON.parse(ajax.response);
}

const newsFeed = getData(NEWS_URL);

const ul = document.createElement('ul')

window.addEventListener('hashchange', function(){
    
    const id = location.hash.substr(1)

    const newsContent = getData(CONTENT_URL.replace('@id', id));
    const title = document.createElement('hi')

    content.appendChild(title)
    title.innerHTML = newsContent.title
})

for(let i=0; i<10; i++){
    const div = document.createElement('div')
    div.innerHTML = `
        <ul>
            <li><a href="#${newsFeed[i].id}">${newsFeed[i].title}(${newsFeed[i].comments_count})</a></li>
        </ul>
    `

    // ul.appendChild(div.children[0])
    // ul.appendChild(div.firstElementChild)
    ul.appendChild(div.firstChild)


    //DOM API를 이용해서 태그를 만들어 사용하는 방식은 구조적인 UI문제를 불러와 
    //가독성을 떨어트리므로 최대한 사용하지 않고 문자열을 사용해 인스펙터와 비슷한 환경을 만들어 가독성을 올려준다.
}

root.appendChild(ul)
root.appendChild(content)
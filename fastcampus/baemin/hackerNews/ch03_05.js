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

const newsFeed = getData(NEWS_URL);
const ul = document.createElement('ul')

window.addEventListener('hashchange', function(){
    
    const id = location.hash.substr(1)
    const newsContent = getData(CONTENT_URL.replace('@id', id));

    root.innerHTML = `
        <span><a href="#">목록으로</a></span>
        <h1>${newsContent.title}</h1>
    `
})

// for(let i=0; i<10; i++){
//     const div = document.createElement('div')
//     div.innerHTML = `
//         <ul>
//             <li><a href="#${newsFeed[i].id}">${newsFeed[i].title}(${newsFeed[i].comments_count})</a></li>
//         </ul>
//     `

//     ul.appendChild(div.firstElementChild)

// }

// root.appendChild(ul)
// root.appendChild(content)

// 위의 코드는 appendChild를 사용하고있다. 이는 즉 DOM API를 사용해 태그를 컨트롤하므로 하위 코드처럼 제거작업이 필요
// 제거작업을 위해서는 위의 코드가 하나의 문자열이 될 수 있는지 확인이 필요한데, for문으로 li를 하나하나씩 만들어주므로 하나의 
// 문자열이 될 수 없고 이를 대체하기 위해서 빈배열과 push를 활용해 코드를 재정비 한다.

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
//newsList 배열이므로 문자열로 넣을 수 없기때문에 join('')을 이용해 문자열로 만들어준다.
root.innerHTML = newsList.join('') //join은 각 배열의 요소 즉 태크의 default 구분자로 comma를 가지게 되며, 해당 구분자는 join()안에 명시해 변경 가능하다.
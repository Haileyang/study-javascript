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
    ul.appendChild(div.firstChild)
}

root.appendChild(ul)
root.appendChild(content)
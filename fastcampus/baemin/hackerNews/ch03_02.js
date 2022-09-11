//12줄의 코드로 시작하기

//학습목표 
// 1. 해커뉴스 사이트에서 API를 이용해 데이터를 출력 
// 2. root를 찾아서 데이터를 출력
// 3. 반복문 및 appendChild를 활용하여 li를 만들어 각 줄마다 데이터의 타이틀을 출력 



const ajax = new XMLHttpRequest(); //XHR
// ajax.open 의 url중 1.json은 페이지의 단위이며, 페이지가 넘어갈 수도있는 변수도 있어서 밖으로 빼주는 것이 좋다.
// ajax.open('GET', 'https://api.hnpwa.com/v0/news/1.json', false); //동기적으로 처리
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json'
ajax.open('GET', NEWS_URL, false)
ajax.send(); //데이터를 가지고 옴

// ajax.response //데이터는 response 안에 들어있음 
// console.log(ajax.response)

//응답값을 객체로 변경 --> 모든 응답값을 변경할 수 있는 것은 아님/ JSON은 응답값을 객체로 변경가능한 데이터 타입 
const newsFeed = JSON.parse(ajax.response);
// console.log(newsFeed)

//문자열 만들기 
// document.getElementById('root').innerHTML = `<ul>
//     <li>${newsFeed[0].title}</li>
//     <li>${newsFeed[1].title}</li>
//     <li>${newsFeed[2].title}</li>
//     <li>${newsFeed[3].title}</li>
//     <li>${newsFeed[4].title}</li>
// </ul>
// `

//상기 코트처럼 하드코드로 배열의 각 [n]번째를 수동으로 출력시, 
//전체 데이터를 불러올 수 없고/ 원하는 만큼의 데이터를 불러올 수 없으며/ 없는 데이터에 접근해 문제 유발가능 

// for(let i=0; i<10; i++){
//     document.getElementById('root').innerHTML = `<ul>
//         <li>${newsFeed[i].title}</li>
//     </ul>
//     `
// }

//상기 코드의 경우, 반복문을 사용했지만, i에 overwrite 되서 9번째 데이터만 결과적으로 노출됨 


const ul = document.createElement('ul')
for(let i=0; i<10; i++){
    const li = document.createElement('li')
    li.innerHTML = newsFeed[i].title
    ul.appendChild(li)
}


document.getElementById('root').appendChild(ul)
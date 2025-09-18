const buttonStart = document.querySelector('#start');
const screens = document.querySelectorAll('.screen');
const buttonsTime = document.querySelector('#time-list');
const elementTime = document.querySelector('#time');
const boardGame = document.querySelector('#board')
let time = 0;
let score = 0;
buttonStart.addEventListener('click', (event) =>{
    event.preventDefault();
    screens[0].classList.add('up');

})
buttonsTime.addEventListener('click', (event) => {
    if(event.target.classList.contains('time-btn')){
        const time = parseInt(event.target.getAttribute('data-time'));
        console.log(`00:${time}`);
        screens[1].classList.add('up');
        startGame(time);
    }
})
boardGame.addEventListener('click', (event) => {
    if(event.target.classList.contains('circle')){
        score++;
        event.target.remove();
        createRandomCircle();
    }
});
function startGame(time){
    setInterval(() => {
        
        if(time === 0){
            finishGame();
        } else {
            let current = --time;
        if(current < 10){
            current = `0${current}`;
        }
        setTime(current);
        }
    }, 1000);
    createRandomCircle();
    setTime(time);
}
function setTime(value){
    elementTime.innerHTML = `00:${value}`;
}

function createRandomCircle(){
    const circle = document.createElement('div');
    circle.classList.add('circle');
    const size = getRandomNumber(10, 100);
    const cvet = getRandomNumber(100000, 999999);
    const {width, height} = board.getBoundingClientRect();
    const x = getRandomNumber(0, width - size);
    const y = getRandomNumber(0, height - size);
    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;
    circle.style.top = `${y}px`;
    circle.style.left = `${x}px`;
    circle.style.backgroundColor = `#${cvet}`;
    circle.style.boxShadow = `0 0 2px #${cvet}, 0 0 10px #${cvet}`;
    boardGame.append(circle);

}
function getRandomNumber(min, max){
    return Math.round(Math.random() * (max-min) + min);
}
function finishGame(){
    console.log(line);
    board.innerHTML = `<h1>Счет: <span class="primary">${score}</span></h1>`;
    
    elementTime.parentNode.classList.add('hide');
    return;
}
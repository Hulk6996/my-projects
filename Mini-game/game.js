const board = document.querySelector('#board');
const SQURES_NUMBER = 690;
for(let i = 0; i < SQURES_NUMBER; i++){
    const square = document.createElement('div');
    square.classList.add('square');
    board.append(square);
    square.addEventListener('mouseover', (event) => {
        function random(max, min){
            const number = Math.floor(Math.random() * (max - min) + min);
            return number;
        }
        const cvet = random(100000, 999999);
        event.target.style.backgroundColor = `#${cvet}`;
        event.target.style.boxShadow = `0 0 2px #${cvet}, 0 0 10px #${cvet}`;
    })
    square.addEventListener('mouseout', (event) => {
        setTimeout(() => {
            event.target.style.backgroundColor = `rgb(64, 69, 62)`;
            event.target.style.boxShadow = `0 0 2px rgb(64, 69, 62)`;
        }, 1000);

    })
};


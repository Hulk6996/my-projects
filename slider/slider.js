const upButton = document.querySelector('.up-button');
const downButton = document.querySelector('.down-button');
const sidebar = document.querySelector('.sidebar');
const slides = document.querySelector('.main-slide');
const container = document.querySelector('.container');
const slidesCol = document.querySelectorAll('.main-slide div').length;
let activeSlideIndex = 0;
sidebar.style.top = `-${(slidesCol - 1) * 100}vh`;
upButton.addEventListener('click', () => {
    changeSlide('up');
});
downButton.addEventListener('click', () => {
    changeSlide('down');
});
document.addEventListener('keydown', (event) => {
    if(event.key === 'ArrowUp'){
        changeSlide('up');
    } else if (event.key === 'ArrowDown'){
        changeSlide('down');
    }
})
function changeSlide(direction){
    if(direction === 'up'){
        activeSlideIndex++;
        if(activeSlideIndex == slidesCol){
            activeSlideIndex = 0;
        }
    } else if(direction === 'down'){
            activeSlideIndex--
            if(activeSlideIndex < 0){
                activeSlideIndex = slidesCol - 1
            }
        }
    const height = container.clientHeight;
    slides.style.transform = `translateY(-${activeSlideIndex * height}px)`;
    sidebar.style.transform = `translateY(${activeSlideIndex * height}px)`;
}
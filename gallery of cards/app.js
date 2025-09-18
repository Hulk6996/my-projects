const oneElement = document.querySelector('div.slide')[0];
const twoElement = document.querySelector('div.slide')[1];
const threeElement = document.querySelector('div.slide')[2];
const fourElement = document.querySelector('div.slide')[3];
const fiveElement = document.querySelector('div.slide')[4];

const slides = document.querySelectorAll('.slide');
for(const slide of slides){
    slide.addEventListener('click', () => {
        const slideActive = document.querySelector('.slide.active');
        if(slideActive){
            slideActive.classList.remove('active');
            slide.classList.add('active');
        } else {
            slide.classList.add('active');
        }
    });
}
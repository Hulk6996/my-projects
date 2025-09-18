// tollBar
let toggle = document.querySelector('.header__link-toggle');
let toolBar = document.querySelector('.header__toolbar');

toggle.addEventListener('click', () => {
  toolBar.classList.add('header__toolbar_active');
  toolBar.querySelector('.toolbar__close').addEventListener('click', function(event) {
    event.preventDefault();
    toolBar.classList.remove('header__toolbar_active');
  })
})

// burger
let burger = document.querySelector('.burger');
let menu = document.querySelector('.header__nav');
let menuItem = menu.querySelectorAll('.nav__link_black');
let closeBtn = document.querySelector('.nav__close');

burger.addEventListener('click', () => {
  burger.classList.toggle('burger_active');
  menu.classList.toggle('nav-active');
  document.body.classList.toggle('stop-scroll');
})

closeBtn.addEventListener('click', () => {
  burger.classList.remove('burger_active');
  menu.classList.remove('nav-active');
  document.body.classList.remove('stop-scroll');
})

menuItem.forEach(function(elem) {
  elem.addEventListener('click', () => {
    burger.classList.remove('burger_active');
    menu.classList.remove('nav-active');
    document.body.classList.remove('stop-scroll');
  })
})

// swiper
const swiper = new Swiper('.swiper', {
  // Optional parameters
  direction: 'horizontal',
  speed: 400,
  spaceBetween: 100,

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  }
});

// tabs
document.querySelectorAll('.how__switch').forEach(function(tabsBtn) {
  tabsBtn.addEventListener('click', function(e) {
    const path = e.currentTarget.dataset.path;

    document.querySelectorAll('.how__switch').forEach(function(btn) {
      btn.classList.remove('switch-active')});
      e.currentTarget.classList.add('switch-active');

      document.querySelectorAll('.how__content').forEach(function(tabsBtn) {
        tabsBtn.classList.remove('how-active')});

        document.querySelector(`[data-target="${path}"]`).classList.add('how-active');
  })
})

// accordion
new Accordion('.faq__list', {
  duration: 800,
  elementClass: 'faq__item',
  triggerClass: 'faq__item-top',
  panelClass: 'faq__accordion',
  activeClass: 'accordion_active',
  showMultiple: false,
  collapse: true
});

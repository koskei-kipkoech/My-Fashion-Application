let searchBar = document.querySelector('#search-bar');
let searchBox = document.querySelector('.search-box');
let saveBar = document.querySelector('#save-bar');
let shopCart = document.querySelector('.shopping-cart');
let menuBar = document.querySelector('#menu-bar');
let myNav = document.querySelector('.navbar');

searchBar.addEventListener('click', () => {
    console.log('here clickkeed')
    searchBox.classList.toggle('active');
})
saveBar.addEventListener('click', () => {
    shopCart.classList.toggle('active')
})
menuBar.addEventListener('click', () =>{
    myNav.classList.toggle('active')
})

//swiper code for the slide gallery
new Swiper('.card-wrapper', {
    loop: true,
    spaceBetween: 40,

    //autoplay setting
    autoplay:{
        delay:2000,
        disableOnInteraction: false,
    },

    // page bullets
    pagination: {
        el: '.swiper-pagination',
        clickable:true,
        dynamicBullets: true,
    },

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        0: {
            slidesPerView: 1
        },
        768: {
            slidesPerView: 2
        },
        1024: {
            slidesPerView: 3
        },
    }
});
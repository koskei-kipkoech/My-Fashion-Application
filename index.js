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
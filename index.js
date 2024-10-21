let searchBar = document.querySelector('#search-bar');
let searchBox = document.querySelector('.search-box');
let saveBar = document.querySelector('#save-bar');
let shopCart = document.querySelector('.shopping-cart');
let menuBar = document.querySelector('#menu-bar');
let myNav = document.querySelector('.navbar');
let body = document.querySelector('body')
let closeCart = document.querySelector('.close')
//const allFilterItems
let listProductHTML = document.querySelector('.main-product')
let listCartHTML = document.querySelector('.shopping-box')
let iconSpanTab = document.querySelector('#count')
let listProducts = []
let carts = []

document.addEventListener('DOMContentLoaded', () => {
    console.log('Dom fully loaded and parsed')
    atTheApp();
})

searchBar.addEventListener('click', () => {
    console.log('here clickkeed')
    searchBox.classList.toggle('active');
})
saveBar.addEventListener('click', () => {
    body.classList.toggle('showCart')
})
menuBar.addEventListener('click', () =>{
    myNav.classList.toggle('active')
})
closeCart.addEventListener('click',() =>{
    body.classList.toggle('showCart')
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

const addDataToHTML = () =>{
    listProductHTML.innerHTML = ''
    if(listProducts.length > 0){
        listProducts.forEach(product => {
            let newProduct = document.createElement('div')
            newProduct.classList.add('inner-product')
            //newProduct.dataset.id = product_id; 
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `
            <img src="${product.images}" alt="">
            <h2>${product.name}</h2>
            <div class="price">$${product.price}</div>
            <button class="viewMore"">View More</button>
            <button class="addCart">add favourite</button>
            `
            listProductHTML.appendChild(newProduct)

            const viewMoreButton = newProduct.querySelector('.viewMore')
            viewMoreButton.addEventListener('click', () =>{
                showExtraInfo(product.id)
            })
        });
    }
}
const showExtraInfo = (productID) => {
    const detailContainer = document.getElementById('product-details-container');
    if (!detailContainer) {
        console.error('Product details container not found');
        return;
    }
    const product = listProducts.find(item => item.id == productID);
    if (!product || !product.extraInfo) {
        console.error('Product or extra info not found');
        return;
    }

    detailContainer.innerHTML = `
    <div class="extra-info">
        <h2>${product.name} - Details</h2>
        <img src="${product.images}" alt="${product.name}" style="width: 100%; border-radius: 10px;">
        <p><strong>Rating:</strong> ${product.extraInfo.rating} ⭐</p>
        <p><strong>Materials:</strong> ${product.extraInfo.materials}</p>
        <p><strong>Description:</strong> ${product.extraInfo.description}</p>
        <p><strong>Styling Tips:</strong> ${product.extraInfo.stylingTips}</p>
        <form id="extra-info-form">
            <label for="comments">Leave a Comment:</label>
            <textarea id="comments" name="comments" rows="3" style="width: 100%;"></textarea>
            <button type="submit" class="submit-comment">Submit Comment</button>
        </form>
        <button class="closeExtraInfo" onclick="hideExtraInfo()">Close</button>
    </div>
    `;
    detailContainer.style.display = 'block';
}

const hideExtraInfo = () => {
    const detailsContainer = document.getElementById('product-details-container')
    detailsContainer.style.display = 'none'
    detailsContainer.innerHTML = '';
}
document.addEventListener('submit',(event) => {
    if(event.target.id === 'extra-info-form'){
        event.preventDefault();
        const comment  = document.getElementById('comments').value;
        alert(`Comme Submitted: ${comment}`)
        //didn't save my comments because it was part of my functionalities
        document.getElementById('comments').value = ''
    }
})
listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('addCart')){
        let product_id = positionClick.parentElement.dataset.id; 
        addToCart(product_id)
    }
})
const addToCart = (product_id) => {
    let positionInCart = carts.findIndex((value) => value.product_id == product_id);
    if(carts.length <= 0){
        carts = [{
            product_id:product_id,
            quantity:1
        }]
        alert("Product added to favourite")
    }else if(positionInCart < 0){
        carts.push({
            product_id:product_id,
            quantity:1
        })
    }else{
        carts[positionInCart].quantity = carts[positionInCart].quantity + 1

    }
    addCartToHTML()
    addCartToMemory()
}
const addCartToMemory = () => {
    localStorage.setItem('cart',JSON.stringify(carts))
}
listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    //console.log('positionclicked', positionClick)

    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
        let qualityDiv = positionClick.closest('.quantity')
        let product_id = qualityDiv.dataset.id;
       // console.log('product id', product_id)

        let type = 'minus'
        if(positionClick.classList.contains('plus')){
            type = 'plus'
        }
        changeQuantity(product_id,type);
    }
})

const changeQuantity = (product_id, type) => {
    let positionOnItemInCart = carts.findIndex((value) => value.product_id == product_id);
    console.log('current cart',carts)
    console.log('chabging quality', product_id, 'type',type)
    if(positionOnItemInCart >= 0){
        switch(type){
            case 'plus':
                carts[positionOnItemInCart].quantity = carts[positionOnItemInCart].quantity + 1;
                break

            default:
                let valueChange = carts[positionOnItemInCart].quantity - 1;
                if( valueChange > 0){
                    carts[positionOnItemInCart].quantity = valueChange;
                }else{
                    carts.splice(positionOnItemInCart,1)
                }
                break
        }
    }
    addCartToMemory()
    addCartToHTML()
}
const addCartToHTML = () => {
    listCartHTML.innerHTML = ''
    let totalQuantity = 0
    if(carts.length > 0){
        carts.forEach(cart => {
            totalQuantity = totalQuantity + cart.quantity
            let newcart = document.createElement('div');
            newcart.classList.add('item')
            let positionProduct = listProducts.findIndex((value) => value.id == cart.product_id)
            let info = listProducts[positionProduct];
            newcart.innerHTML = `
            <div class="image">
                <img src="${info.images}" alt="">
            </div>
            <div class="name">
                ${info.name}
            </div>
            <div class="totalPrice">
                ${info.price *cart.quantity}
            </div>
            <div class="quantity" data-id = "${info.id}">
                <span class="minus"><</span>
                <span>${cart.quantity}</span>
                <span class="plus">></span>
            </div>
            `;
            listCartHTML.appendChild(newcart)
        })
    }
    iconSpanTab.innerText = totalQuantity
}
const atTheApp = () => {
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        listProducts = data;
        addDataToHTML()

        //check the local storage for saved favourite 
        if (localStorage.getItem('cart')){
            carts =  JSON.parse(localStorage.getItem('cart'));
            addCartToHTML()
        }else{
            carts = []
        }
    })
    .catch(error =>{
        console.log('Error fetching',error)
        alert('Failed to load products. Try again later')
    })
}






//fetching code for items 

// fetch("https://fakestoreapi.com/products")
// .then((res) => res.json())
// .then((json) => console.log(json));
let searchBar = document.querySelector('#search-bar');
let searchBox = document.querySelector('.search-box');
let saveBar = document.querySelector('#save-bar');
let shopCart = document.querySelector('.shopping-cart');
let menuBar = document.querySelector('#menu-bar');
let myNav = document.querySelector('.navbar');
let body = document.querySelector('body')
let closeCart = document.querySelector('.close')
const allFilterItems = document.querySelector('.inner-product') //new
const allFilterBtns = document.querySelectorAll('.filter-btn')//new
let listProductHTML = document.querySelector('.main-product ')//new
let listCartHTML = document.querySelector('.shopping-box')
let iconSpanTab = document.querySelector('#count')

let listProducts = []
let carts = []
let currentPage = 1;
const productsPerPage = 9;
let currentProductlist = []

const atTheApp = () => {
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        listProducts = data;
        currentProductlist = listProducts;
        addDataToHTML(currentPage, currentProductlist)

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
document.addEventListener('DOMContentLoaded', () => {
    console.log('Dom fully loaded and parsed')
    atTheApp();

    const commentsSwiper = new Swiper('.comments-slider', {
        loop:true,
        pagination:{
            el: '.swiper-pagination',
            clickable:true,
        },
        navigation:{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },

    });
    const commentForm = document.getElementById('comment-form');
    const commentInput = document.getElementById('comment-input');
    const commentWrapper = document.getElementById('comments-wrapper');

    commentForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const commentText = commentInput.value.trim();
        if(commentText){
            const commentSlide = document.createElement('div');
            commentSlide.classList.add('swiper-slide');
            commentSlide.textContent = commentText;

            commentWrapper.appendChild(commentSlide)
            commentInput.value = ''
            commentsSwiper.update()
        }
    })
   // console.log('initial productrs', listProducts)
    const searchInput = document.getElementById('search-input')
   // console.log('listproduct', listProducts);

    searchInput.addEventListener('keydown', (event) => {
        console.log('keyprressed',event.key)
        if(event.key === 'Enter'){
            const searchTerm = event.target.value.toLowerCase().trim();
            console.log('search term ', searchTerm)
            const filteredProducts = listProducts.filter( product => {
                console.log('products', product)
                return(
                    product.name.toLowerCase().includes(searchTerm) ||
                    product.season.toLowerCase().includes(searchTerm) ||
                    product.gender.toLowerCase().includes(searchTerm)
                );
            });
            console.log('filtered products', filteredProducts)
            currentPage = 1;
            currentProductlist = filteredProducts
            addDataToHTML(currentPage,filteredProducts)
        }
    })
    applyFilter()
})

searchBar.addEventListener('click', () => {
    console.log('here clickkeed')
    searchBox.classList.toggle('active');
})
//event for search


//event for search end
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
document.querySelectorAll('.card-item').forEach(card => {
    const likeButton = card.querySelector('.button');
    const likeCountElement = card.querySelector('.likecount');
    const productId = card.dataset.id;

    let likeCount = parseInt(localStorage.getItem(`likeCount-${productId}`)) || 0;
    likeCountElement.textContent = `${likeCount} likes`;

    likeButton.addEventListener('click', (event) => {
        event.preventDefault(); //prevent refreshing
        likeCount++;
        likeCountElement.textContent = `${likeCount} likes`;

        localStorage.setItem(`likeCount-${productId}`,likeCount)
    })
})

const addDataToHTML = (page = 1 , productToDisplay = currentProductlist) => {
    //console.log('product to display', productToDisplay)
    listProductHTML.innerHTML = ''
    const startIndex = (page - 1) * productsPerPage;
    const endindex = page * productsPerPage;
    const paginatedProducts = productToDisplay.slice(startIndex,endindex);

    if(paginatedProducts.length > 0){
        paginatedProducts.forEach(product => {
            let newProduct = document.createElement('div')
            newProduct.classList.add('inner-product')
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `
            <img src="${product.images}" alt="">
            <h2>${product.name}</h2>
            <h2>${product.season}</h2>
            <h2>${product.gender}</h2>
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
    }else{
        listProductHTML.innerHTML = '<p>no product found<p>'
    }

    document.getElementById('currentPage').textContent = currentPage;
    updatePaginationButtons(productToDisplay.length);
}
const applyFilter = () => {
    allFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            showFilteredContent(btn);
        })
    })
}
const updatePaginationButtons = (totalProducts) =>{
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    document.getElementById('prevPage').disabled = currentPage ===1;
    document.getElementById('nextPage').disabled = currentPage === totalPages || totalProducts === 0
};
document.getElementById('nextPage').addEventListener('click', () => {
    currentPage++;
    addDataToHTML(currentPage, currentProductlist)
});
document.getElementById('prevPage').addEventListener('click', () => {
    currentPage--;
    addDataToHTML(currentPage, currentProductlist)
});

const popUp = document.getElementById('popup')
const closePopUpButton = document.getElementById('close-popup')
const contactForm = document.querySelector('.contact-form form')

contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    popUp.style.display = 'block'
    console.log('popup should be visible', popUp.style.display);
    contactForm.reset();
});
closePopUpButton.addEventListener('click', () => {
    popUp.style.display = 'none'
});
popUp.addEventListener('click', (event) =>{
    if (event.target ===popUp){
        popUp.style.display = 'none'
    }
})


const showExtraInfo = (productID) => {
    const detailContainer = document.getElementById('product-details-container');

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
        alert(`Comme Submitted:❤️❤️ ${comment} ❤️❤️`)
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
//filter button
allFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        showFilteredContent(btn);
    })
})
function showFilteredContent(btn){
    const filter = btn.id;
    //remove active class
    allFilterBtns.forEach(button => {
        button.classList.remove('active')
    });

    btn.classList.add('active')

    currentProductlist = listProducts.filter(product => {
        if(filter === 'all'){
            return true
        }else{
            return product.season === filter || product.gender === filter;
        }
    })
    currentPage = 1;
    addDataToHTML(currentPage,currentProductlist)
}

//filter end
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




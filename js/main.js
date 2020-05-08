"use strict"

const cartButton = document.querySelector("#cart-button"); // кошие
const modal = document.querySelector(".modal");// кошик вигляд з замовленнями
const close = document.querySelector(".close");//закриття корзини
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const loginInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestautants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');
const sectionShotInfo = document.querySelector('.section-shot-info');
const modalBody = document.querySelector('.modal-body');
const modalPrice = document.querySelector('.modal-pricetag');
const clearCart = document.querySelector('.clear-cart');
const inputSearch = document.querySelector('.input-search');

let login = localStorage.getItem('gloDelivery');

const cart =[];

 // масив для корзини
const loadCart = function(){
  if (localStorage.getItem(login)){
    JSON.parse(localStorage.getItem(login)).forEach(item=>cart.push(item));
  }
};

 // масив для корзини

const saveCart = function(){
  localStorage.setItem(login,JSON.stringify(cart));
};

// функція робить запит по url - адресу (файл або API site) та отримує дані
const getData = async function(url){
   
  const respons = await fetch(url);
 if (!respons.ok){
   throw new Error(`Error : ${url}, status :${respons.status}!`);
 } 

 return await respons.json();
};

getData('./db/partners.json');

//  перевірка логіну на правельність введення = валідація повертає true or false
const valid = function(str){
  const nameReg = /^[а-яА-ЯёЁa-zA-Z0-9]{1,20}$/;
  return nameReg.test(str);
}

function toggleModal() {
  modal.classList.toggle("is-open");
}

function toogleModelAuth(){
    loginInput.style.borderColor = '';
    modalAuth.classList.toggle('is-open');
    // toggle - додає клас якщо його нема або видаляє якщо він є
}

function returnMain(){
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
};


function autorized(login){
  // log out and return on the main page

  function logOut(){

    returnMain();
    
    cart.length = '';
    login = null;
    userName.textContent = '';
    localStorage.removeItem('gloDelivery');
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';   
    cartButton.style.display = '';
    buttonOut.removeEventListener('click',logOut);
    checkAuth(login);
  }

  console.log('Autorizite!!');

  userName.textContent = login;
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'flex';
  cartButton.style.display = 'flex';
  buttonOut.addEventListener('click',logOut);
  loadCart();
}
// maska  для обробки даних вводу
function maskInput(string){
  return !!string.trim();
}

function notAutorized(){
  console.log('NO Autorizite!!');
  function logIn(event){
    event.preventDefault();

    if (valid(loginInput.value)){
      // trim() видаляє пробіли зліва і справа
      login = loginInput.value;
      localStorage.setItem('gloDelivery',login);

      toogleModelAuth();
      buttonAuth.removeEventListener('click',toogleModelAuth);
      closeAuth.removeEventListener('click',toogleModelAuth);
      loginInForm.removeEventListener('submit',logIn);
      loginInForm.reset(); // reset очищиє поля форми
      checkAuth(login);
    } else {
      loginInput.style.borderColor = 'orange';
      loginInput.value = '';
    }
    
  }

  buttonAuth.addEventListener('click',toogleModelAuth);
  closeAuth.addEventListener('click',toogleModelAuth);
  loginInForm.addEventListener('submit',logIn);
}

function checkAuth(login){
   (login) ? autorized(login) : notAutorized();
}


function createCardRestaurant(restaurant){

        const { 
          image,
          kitchen,
          name,
          price,
          products,
          stars,
          time_of_delivery: timeOfdelivery
         } = restaurant;      


        const card = `
                      <a  class="card card-restaurant"  data-products = "${products}">
                      <img src="${image}" alt="image" class="card-image"/>
                      <div class="card-text">
                        <div class="card-heading">
                          <h3 class="card-title">${name}</h3>
                          <span class="card-tag tag">${timeOfdelivery} мин</span>
                        </div>
                        <!-- /.card-heading -->
                        <div class="card-info">
                          <div class="rating">
                            ${stars}
                          </div>
                          <div class="price">От ${price*0.1} &#8372</div>
                          <div class="category">${kitchen}</div>
                        </div>
                        <!-- /.card-info -->
                      </div>
                      <!-- /.card-text -->
                    </a>
              `;
             
              cardsRestautants.insertAdjacentHTML('beforeend',card);



};


function creatSectionHeading({ image,kitchen,name,price,products,stars,time_of_delivery }){
                const cardHeard = `
                <h2 class="section-title restaurant-title">${name}</h2>
                <div class="card-info">
                  <div class="rating">
                    ${stars}
                  </div>
                  <div class="price">От ${price*0.1} &#8372</div>
                  <div class="category">${kitchen}</div>
                </div>
                `;
                sectionShotInfo.insertAdjacentHTML('beforeend',cardHeard);

}




function createCardGood({ description,id,image,name,price }){

  const card = document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML('beforeend',`
                  <img src="${image}" alt="${name}" class="card-image"/>
                  <div class="card-text">
                    <div class="card-heading">
                      <h3 class="card-title card-title-reg">${name}</h3>
                    </div>
                    <div class="card-info">
                      <div class="ingredients">${description}
                      </div>
                    </div>
                    <div class="card-buttons">
                      <button class="button button-primary button-add-cart" id = "${id}">
                        <span class="button-card-text">В корзину</span>
                        <span class="button-cart-svg"></span>
                      </button>
                      <strong class="card-price">${price*0.1} &#8372</strong>
                    </div>
                  </div>
  `);
  cardsMenu.insertAdjacentElement('beforeend',card);
}

function openGoods(event){

  const target = event.target;

  // console.log('userName.textContent: ', userName.textContent);

  if (userName.textContent) {
    
          //  closest() - батьківський клас - перший елемент що співпадає з DOM
        const restaurant = target.closest('.card-restaurant');
        if (restaurant) {

          sectionShotInfo.textContent = '';
          cardsMenu.textContent = '';
          containerPromo.classList.add('hide');
          restaurants.classList.add('hide');
          menu.classList.remove('hide');

          getData(`./db/${restaurant.dataset.products}`).then(function(data){
            data.forEach(createCardGood);
           });
          getData(`./db/partners.json`).then(function(data){
            data.forEach(elem =>{
              if(elem.products == restaurant.dataset.products ) creatSectionHeading(elem); 
            });
           });

        }

        
   

  } else toogleModelAuth();

  

};


// обробники

function addToCart(event){
   const target = event.target;

   const buttonAddToCard = target.closest('.button-add-cart');

   if (buttonAddToCard){
     const card = target.closest('.card');
     const title = card.querySelector('.card-title-reg').textContent;
     const cost = card.querySelector('.card-price').textContent;
     const id = buttonAddToCard.id;

     const food = cart.find(elem => {
       return elem.id ===id;
     });

     if(food) food.count +=1; else{
       cart.push({
       id,
       title,
       cost,
       count : 1
     });
     };
   };
   saveCart();
};

function renderCart(){
    modalBody.textContent = "";

    cart.forEach(({id,title,cost,count})=>{

       const itemCart = `
              <div class="food-row">
              <span class="food-name">${title}</span>
              <strong class="food-price">${cost}</strong>
              <div class="food-counter">
                <button class="counter-button counter-minus" data-id =${id}>-</button>
                <span class="counter">${count}</span>
                <button class="counter-button counter-plus" data-id =${id}>+</button>
              </div>
            </div>
       `;
      modalBody.insertAdjacentHTML('afterbegin',itemCart);

    });

    const totalPrice = cart.reduce((result,item)=>{
     return result + parseFloat(item.cost)*item.count},0);
    modalPrice.innerHTML = `${totalPrice} &#8372`;

}

function changeCount(event){
     const target = event.target;

     if(target.classList.contains('counter-minus')){
        const food = cart.find(item=>item.id === target.dataset.id );
        food.count--;
        if (food.count === 0) {
          cart.splice(cart.indexOf(food),1);
        };
        renderCart();
     };

     if(target.classList.contains('counter-plus')){
      const food = cart.find(item=>item.id === target.dataset.id );
      food.count++;
      renderCart();
     };
    saveCart();
}

function init(){
          getData('./db/partners.json').then(function(data){
            data.forEach(createCardRestaurant);
           });
          
          inputSearch.addEventListener('keydown',(event)=>{
              if(event.keyCode === 13){
                const target = event.target;
                const value = target.value;
                
                const goods =[];

                getData('./db/partners.json')
                    .then(data=>{
                      const products = data.map(item=>item.products);
                      console.log(products);
                      products.forEach((product)=>{
                        getData(`./db/${product}`)
                          .then(data=>{
                                goods.push(...data);
                                console.log(goods);
                                const searchGoods = goods.filter(function(item){
                                  return item.name.toLowerCase().includes(value.toLowerCase());
                                });
                                console.log('searchGoods: ', searchGoods);
                                cardsMenu.textContent = '';
                                containerPromo.classList.add('hide');
                                restaurants.classList.add('hide');
                                menu.classList.remove('hide');
                                
                                return searchGoods;
                          })
                          .then(data=>{
                            data.forEach(createCardGood);
                          });
                      })
                    }) 
              }
          })

          cardsRestautants.addEventListener('click',openGoods);

          cardsMenu.addEventListener('click',addToCart);

          modalBody.addEventListener('click',changeCount);

          clearCart.addEventListener('click',()=>{
              cart.length = 0;
              renderCart();
          });

          logo.addEventListener('click',returnMain);

          cartButton.addEventListener("click", ()=>{
            renderCart();
            toggleModal();
          });

          close.addEventListener("click", toggleModal);

          checkAuth(login);

//  swiper - program for making  slider
          new Swiper('.swiper-container',{
              loop: true,
              speed: 500,
              autoplay: true,
              spaceBetween: 50,
          });
}

init();
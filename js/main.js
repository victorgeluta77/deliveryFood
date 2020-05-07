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
const sectionHeading = document.querySelector('.section-heading');

let login = localStorage.getItem('gloDelivery');

// функція робить запит по url - адресу (файл або API site) та отримує дані
const getData = async function(url){
   
  const respons = await fetch(url);
 if (!respons.ok){
   throw new Error(`Error : ${url}, status :${respons.status}!`);
 } 

 return await respons.json();
};

getData('./db/partners.json');

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

    login = null;
    userName.textContent = '';

    localStorage.removeItem('gloDelivery');

    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';   
    buttonOut.removeEventListener('click',logOut);

    checkAuth(login);

  }

  console.log('Autorizite!!');

  userName.textContent = login;
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';

  buttonOut.addEventListener('click',logOut);
}
// maska  для обробки даних вводу
function maskInput(string){
  return !!string.trim();
}

function notAutorized(){
  console.log('NO Autorizite!!');
  
  function logIn(event){
    event.preventDefault();

    if (maskInput(loginInput.value)){
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


function creatSectionHeading({ description,id,image,name,price }){

    sectionHeading.insertAdjacentHTML('beforeend',`
                <h2 class="section-title restaurant-title">Пицца Плюс</h2>
                <div class="card-info">
                  <div class="rating">
                    4.5
                  </div>
                  <div class="price">От 90 &#8372</div>
                  <div class="category">Пицца</div>
                </div>
                `);

}




function createCardGood({ description,id,image,name,price }){

  const card = document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML('beforeend',`
                  <img src="${image}" alt="image" class="card-image"/>
                  <div class="card-text">
                    <div class="card-heading">
                      <h3 class="card-title card-title-reg">${name}</h3>
                    </div>
                    <div class="card-info">
                      <div class="ingredients">${description}
                      </div>
                    </div>
                    <div class="card-buttons">
                      <button class="button button-primary button-add-cart">
                        <span class="button-card-text">В корзину</span>
                        <span class="button-cart-svg"></span>
                      </button>
                      <strong class="card-price-bold">${price*0.1} &#8372</strong>
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

          console.log(restaurant.dataset.products);

          cardsMenu.textContent = '';
          containerPromo.classList.add('hide');
          restaurants.classList.add('hide');
          menu.classList.remove('hide');

          getData(`./db/${restaurant.dataset.products}`).then(function(data){
            data.forEach(createCardGood);
           });
          getData(`./db/${restaurant.dataset.products}`).then(function(data){
            console.log(data);
           });

        }

        
   

  } else toogleModelAuth();

  

};


// обробники



function init(){
          getData('./db/partners.json').then(function(data){
            data.forEach(createCardRestaurant);
           });

          cardsRestautants.addEventListener('click',openGoods);

          logo.addEventListener('click',returnMain);

          cartButton.addEventListener("click", toggleModal);

          close.addEventListener("click", toggleModal);

          checkAuth(login);


          new Swiper('.swiper-container',{
              loop: true,
              slidePerView: 1,
          });
}

init();
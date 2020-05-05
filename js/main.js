const cartButton = document.querySelector("#cart-button"); // кошие
const modal = document.querySelector(".modal");// кошик вигляд з замовленнями
const close = document.querySelector(".close");//закриття корзини

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}

const  buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const loginInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');




let login = localStorage.getItem('gloDelivery');

function toogleModelAuth(){
    loginInput.style.borderColor = '';
    modalAuth.classList.toggle('is-open');
}




function autorized(login){

  function logOut(){
    login = null;
    localStorage.removeItem('gloDelivery');
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';   
    buttonOut.removeEventListener('click',logOut);

    checkAuth(login);

  }

  console.log('Autorizite!!');


  userName.textContent = login;
  console.log(login);
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

checkAuth(login);


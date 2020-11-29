'use strict';

const swiper = new Swiper('.swiper-container', {
  loop: true,
  autoplay: true,
});

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const logo = document.querySelector('.logo');
const buttonAuth = document.querySelector('.button-auth');
const buttonCloseAuth = document.querySelector('.close-auth');
const modalAuth = document.querySelector('.modal-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const passworsInput = document.querySelector('#password');
const buttonOut = document.querySelector('.button-out');
const userName = document.querySelector('.user-name');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const cardsMenu = document.querySelector('.cards-menu');
const restaurantTitle = document.querySelector('.restaurant-title');
const restaurantRating = document.querySelector('.rating');
const restaurantPrice = document.querySelector('.price');
const restaurantCategory = document.querySelector('.category');
const inputSearch = document.querySelector('.input-search');
const searchBlock = document.querySelector('.search');
const liveListSearch = document.querySelector('.live-search');
const modalBody = document.querySelector('.modal-body');
const modalPricetag = document.querySelector('.modal-pricetag');
const clearCart = document.querySelector('.clear-cart');

let login = localStorage.getItem('gloDelivery');
let password = localStorage.getItem('gloDeliveryPassword');

const cart = JSON.parse(localStorage.getItem(`gloDelivery_${login}`)) || [];

function saveCart() {
  localStorage.setItem(`gloDelivery_${login}`, JSON.stringify(cart));
}

function downloadCart() {
  if (JSON.parse(localStorage.getItem(`gloDelivery_${login}`))) {
    const data = JSON.parse(localStorage.getItem(`gloDelivery_${login}`));
    cart.push(...data);
  }
}

const getData = async function (url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url},
     статус ошибки ${response.status}`)
  }

  return await response.json();
};

//  Функция Валидации (регулярные выражения)
function validName(str) {
  const regName = /^[a-zA-Z][a-zA-Z0-9-_\.]{3,20}$/;
  return regName.test(str);
}

// Функция проверки авторизации
function checkAuth() {
  if (login) {
    authorized();
  }
  else {
    notAuthorized();
  }
}

// Функция логина пользователя
function logIn(event) {
  login = loginInput.value;
  password = passworsInput.value;
  event.preventDefault();

  if (validName(login)) {
    localStorage.setItem('gloDelivery', login);
    localStorage.setItem('gloDeliveryPassword', password);
    loginInput.classList.remove('red');
    console.log('Залогинен под ником ' + login);
    toggleModalAuth();
    downloadCart();
    // !Начало очистки событий
    buttonAuth.removeEventListener('click', toggleModalAuth);
    buttonCloseAuth.removeEventListener('click', toggleModalAuth);
    document.removeEventListener('keydown', keyDown);
    logInForm.removeEventListener('submit', logIn);
    modalAuth.removeEventListener('click', clickBehindForm);
    //! конец очистки событий
    logInForm.reset();
    checkAuth();
  }

  else {
    loginInput.classList.add('red');
    loginInput.value = '';
    alert("Введите пожалуйста коректный логин!");

  }
}

// Функция авторизации
function authorized() {
  function logOut() {
    login = null;
    cart.length = 0;
    buttonOut.style.display = '';
    userName.textContent = '';
    buttonAuth.style.display = '';
    cartButton.style.display = '';
    closeGoods();
    buttonOut.removeEventListener('click', logOut);
    localStorage.removeItem('gloDelivery');
    localStorage.removeItem('gloDeliveryPassword');
    checkAuth();
  }
  buttonAuth.style.display = 'none';
  userName.textContent = login;
  buttonOut.style.display = 'flex';
  userName.style.display = 'inline';
  cartButton.style.display = 'flex';

  buttonOut.addEventListener('click', logOut);
}

// Функция не авторизации
function notAuthorized() {
  console.log('Не авторизован');

  // При нажатии на кнопку Войти выполняем функцию toggleModalAuth
  buttonAuth.addEventListener('click', toggleModalAuth);

  // При нажатии на кнопку закрыть выполняем функцию toggleModalAuth
  buttonCloseAuth.addEventListener('click', toggleModalAuth);

  // При нажатии на кнопку esp выполняем функцию keyDown
  document.addEventListener('keydown', keyDown);

  // При нажатии за формой выполняем функцию clickBehindForm
  modalAuth.addEventListener('click', clickBehindForm)

  // При отправки формы выполняем функцию logIn
  logInForm.addEventListener('submit', logIn);
}

// Функция клика за формой
function clickBehindForm(event) {
  console.log(event.target);
  if (event.target.classList.contains('is-open') && event.target.classList.contains('modal-auth')) {
    toggleModalAuth();
  }
  if (event.target.classList.contains('is-open') && event.target.classList.contains('modal-cart')) {
    toggleModal();
  }
}

// Функция нажатия кнопки escape
function keyDown(event) {
  if (modalAuth.classList.contains('is-open') && event.code === 'Escape') {
    toggleModalAuth();
  }
  if (modal.classList.contains('is-open')) {
    toggleModal();
  }
}

// Функция добавления или удаления класа is-open к Модальному окну авторизации
function toggleModalAuth() {
  modalAuth.classList.toggle('is-open');
  loginInput.classList.remove('red');
  if (modalAuth.classList.contains('is-open')) {
    disabledScroll();
  }
  else {
    enableScroll();
  }
}

function toggleModal() {
  modal.classList.toggle("is-open");
  document.addEventListener('keydown', keyDown);
  modal.addEventListener('click', clickBehindForm)
  if (modal.classList.contains("is-open")) {
    disabledScroll();
  }
  else {
    enableScroll();
  }
}



function createCardRestaurant(restaurant) {

  const {
    image,
    kitchen,
    name,
    price,
    products,
    stars,
    time_of_delivery
  } = restaurant;

  const cardRestaurant = document.createElement('a');
  cardRestaurant.className = 'card card-restaurant';
  cardRestaurant.products = products;
  cardRestaurant.info = { kitchen, name, price, stars };

  const card = `
						<img src="${image}" alt="image" class="card-image" />
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title">${name}</h3>
								<span class="card-tag tag">${time_of_delivery}</span>
							</div>
							<div class="card-info">
								<div class="rating">
									${stars}
								</div>
								<div class="price">От ${price} ₽</div>
								<div class="category">${kitchen}</div>
							</div>
            </div>
          `;

  cardRestaurant.insertAdjacentHTML('beforeend', card);
  cardsRestaurants.insertAdjacentElement('beforeend', cardRestaurant);
}

function createCardGood(goods) {
  const {
    id,
    name,
    description,
    price,
    image,
  } = goods;



  const card = document.createElement('div');
  card.className = 'card';
  card.id = id;
  card.insertAdjacentHTML('beforeend', `
						<img src="${image}" alt="image" class="card-image" />
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title card-title-reg">${name}</h3>
							</div>
							<div class="card-info">
                <div class="ingredients">
                  ${description}
								</div>
							</div>
							<div class="card-buttons">
								<button class="button button-primary button-add-cart">
									<span class="button-card-text">В корзину</span>
									<span class="button-cart-svg"></span>
								</button>
								<strong class="card-price-bold card-price">${price} ₽</strong>
							</div>
						</div>
  `);
  cardsMenu.insertAdjacentElement('beforeend', card);
}

function openGoods(event) {
  const target = event.target;

  if (login) {
    const restaurant = target.closest('.card-restaurant');

    console.dir(restaurant);

    if (restaurant) {
      cardsMenu.textContent = '';
      restaurants.classList.add('hide');
      containerPromo.classList.add('hide');
      swiper.destroy(false);
      menu.classList.remove('hide');

      const { name, stars, price, kitchen } = restaurant.info;

      restaurantTitle.textContent = name;
      restaurantRating.textContent = stars;
      restaurantPrice.textContent = `От ${price} ₽`;
      restaurantCategory.textContent = kitchen;


      getData(`./db/${restaurant.products}`).then(function (data) {
        data.forEach(createCardGood);
      });

    }
  }
  else {
    toggleModalAuth();
  }

}

function closeGoods() {
  restaurants.classList.remove('hide');
  containerPromo.classList.remove('hide');
  swiper.init();
  menu.classList.add('hide');
  inputSearch.value = '';
  liveListSearch.textContent = '';
}

function addToCart(event) {
  const target = event.target;
  const buttonAddCart = target.closest('.button-add-cart');

  if (buttonAddCart) {
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    const price = card.querySelector('.card-price').textContent;
    const id = card.id;

    const food = cart.find(item => item.id === id);
    if (food) {
      food.count += 1;
      saveCart();
    }
    else {
      cart.push({
        id,
        title,
        price,
        count: 1
      });
      saveCart();
    }

    console.log(cart);
  }

}

function rendercart() {
  modalBody.textContent = '';
  cart.forEach(({ id, title, price, count }) => {
    const itemCard = `
    		<div class="food-row">
					<span class="food-name">${title}</span>
					<strong class="food-price">${price}</strong>
					<div class="food-counter">
						<button class="counter-button counter-minus" data-id="${id}">-</button>
						<span class="counter">${count}</span>
						<button class="counter-button counter-plus" data-id="${id}">+</button>
					</div>
				</div>
    `;

    modalBody.insertAdjacentHTML('beforeend', itemCard);

  });

  const totalPrice = cart.reduce((result, item) => {
    return result += parseFloat(item.price) * item.count;
  }, 0);

  modalPricetag.textContent = totalPrice + ' ₽';

  saveCart();
}

function changeCount(event) {
  const target = event.target;

  if (target.classList.contains('counter-button')) {
    const food = cart.find((item) => {
      return item.id === target.dataset.id;
    });

    if (target.classList.contains('counter-minus')) {

      food.count--;

      if (food.count === 0) {
        cart.forEach((item, index) => {
          if (item.id === food.id) {
            cart.splice(index, 1);
          }
        });

      }

    }
    if (target.classList.contains('counter-plus')) {
      food.count++;

    }


    rendercart();
  }

}

function init() {
  getData('./db/partners.json').then(function (data) {
    data.forEach(createCardRestaurant);
  });

  // Обработчики событий

  modalBody.addEventListener('click', changeCount);

  inputSearch.addEventListener('keydown', function (event) {

    if (event.code === 'Enter' || event.keyCode === 13) {
      if (login) {

        const searchValue = event.target.value.trim();

        if (!searchValue) {
          event.target.style.backgroundColor = 'red';
          event.target.value = '';
          setTimeout(() => {
            event.target.style.backgroundColor = '';
          }, 1500);
          return;
        }

        getData('./db/partners.json')
          .then(function (data) {

            return data.map((partners) => { return partners.products; });

          })
          .then((linkProducts) => {

            cardsMenu.textContent = '';

            linkProducts.forEach((link) => {

              getData(`./db/${link}`).then(function (data) {

                const resultSearch = data.filter((goods) => {
                  return goods.name.toLowerCase().includes(searchValue.toLowerCase());
                })
                console.log(resultSearch);


                restaurants.classList.add('hide');
                containerPromo.classList.add('hide');
                swiper.destroy(false);
                menu.classList.remove('hide');

                restaurantTitle.textContent = `Результат поиска \"${searchValue}\"`;
                restaurantRating.textContent = '';
                restaurantPrice.textContent = '';
                restaurantCategory.textContent = '';


                resultSearch.forEach(createCardGood);

              })

            })

          })

      }
      else {
        toggleModalAuth();
      }
    }

  })

  // Live search
  inputSearch.addEventListener('input', (event) => {

    const searchValue = event.target.value.trim();
    liveListSearch.textContent = '';

    if (searchValue.length > 2) {

      if (login) {
        liveListSearch.classList.remove('hide');
        getData('./db/partners.json')
          .then((data) => {

            return data.map((partners) => {
              return partners.products;
            })

          })
          .then((linkGoods) => {

            linkGoods.forEach((link) => {

              getData(`./db/${link}`)
                .then((data) => {

                  const searchResult = data.filter((good) => {
                    return good.name.toLowerCase().includes(searchValue.toLowerCase());
                  })

                  searchResult.forEach((item) => {
                    const li = document.createElement('li');
                    li.textContent = item.name;
                    liveListSearch.insertAdjacentElement('beforeend', li);
                    searchBlock.insertAdjacentElement('beforeend', liveListSearch);
                  })

                })

            })

          })

      }

      else {
        inputSearch.value = '';
        toggleModalAuth();
      }

    }

    else {
      liveListSearch.classList.add('hide');
    }

  })

  cartButton.addEventListener("click", () => {
    rendercart();
    toggleModal();
  });

  cardsMenu.addEventListener('click', addToCart);

  close.addEventListener("click", toggleModal);

  cardsRestaurants.addEventListener('click', openGoods);

  logo.addEventListener('click', closeGoods);

  clearCart.addEventListener('click', () => {
    localStorage.removeItem(`gloDelivery_${login}`);
    cart.length = 0;
    rendercart();
  })


  checkAuth();

}

init()
import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

refs.input.addEventListener(
  'input',
  debounce(onChangeInputValue, DEBOUNCE_DELAY)
);

function onChangeInputValue(e) {
  console.log(e.target.value);
  if (e.target.value.trim() === '') {
    onClearMarkup();
    return;
  }
  fetchCountries(e.target.value.trim())
    .then(countries => {
      console.log(countries);
      if (countries.length > 10) {
        onClearMarkup();
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      } else if (countries.length <= 10 && countries.length >= 2) {
        onClearMarkup();
        onCreateListMarkup(countries);
      } else if (countries.length === 1) {
        onClearMarkup();
        onCreateDetalinfo(countries);
      }
    })
    .catch(onError);
}
function onCreateListMarkup(countries) {
  const itemMarkup = countries
    .map(
      country => `<li class="country-item"> <button class="btnChoseCountry" type="button">
        <img class="country-flag" src="${country.flags.svg}" alt="flag ${country.name.official}" width="20%" />
        <p>${country.name.official}</p>
      </button></li>`
    )
    .join('');
  refs.list.insertAdjacentHTML('beforeend', itemMarkup);

  refs.list.addEventListener('click', onClickItemList);
}
function onClickItemList(e) {
  e.preventDefault();
  const chosenCountry = e.target.lastChild.textContent.trim();

  console.log(chosenCountry);
  fetchCountries(chosenCountry)
    .then(countries => {
      onClearMarkup();
      onCreateDetalinfo(countries);
      return;
    })
    .catch(onError);
  refs.input.value = chosenCountry;
}

function onCreateDetalinfo(countries) {
  const lang = Object.values(countries[0].languages).join(', ');
  const detalInfoMarkup = countries
    .map(
      country => `<div>
        <img src="${country.flags.svg}" alt="flag ${country.name.official}" width="100px"><h2 class="general-title">${country.name.official}</h2>
          <p><span class="info-title">Capital: </span>${country.capital}</p>
          <p><span class="info-title">Population: </span>${country.population}</p>
          <p><span class="info-title">Languages: </span>${lang}</p>
        </img>
      </div>`
    )
    .join('');

  refs.info.insertAdjacentHTML('beforeend', detalInfoMarkup);
}

function onError() {
  onClearMarkup();
  Notiflix.Notify.failure('Oops, there is no country with that name');
}
function onClearMarkup() {
  refs.list.innerHTML = ' ';
  refs.info.innerHTML = ' ';
}

const URL = 'https://restcountries.com/v3.1/name/';
const FILTER_RESPONSE = 'fields=name,capital,population,flags,languages';

export const fetchCountries = name => {
  return fetch(`${URL}${name}?${FILTER_RESPONSE}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
      onError();
    }
    return response.json();
  });
};

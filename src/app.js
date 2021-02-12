import { getWeather, getCity } from './forecast';

const cityForm = document.querySelector('form');
const card = document.querySelector('.card');
const details = document.querySelector('.details');
const time = document.querySelector('img.time');
const icon = document.querySelector('.icon img');

const updateUI = (data) => {
  // console.log(data);
  const { cityDetails, weatherDetails } = data;

  details.innerHTML = `
      <h5 class="my-3">City Name: ${cityDetails.EnglishName}</h5>
      <h2 class="my-3 zone">Time Zone: ${cityDetails.TimeZone.Code}</h2>
      <div class="my-3 text-info">Forecast: ${weatherDetails.WeatherText}</div>
      <div class="my-4 info">
          <span >Temperature: ${weatherDetails.Temperature.Metric.Value}</span>
          <span>&deg;F</span>
          /
          <span>${weatherDetails.Temperature.Imperial.Value}</span>
          <span>&deg;C</span>
      </div>
      `;

  const iconSrc = `img/icons/${weatherDetails.WeatherIcon}.svg`;
  icon.setAttribute('src', iconSrc);
  const timeSrc = weatherDetails.IsDayTime ? 'img/day.svg' : 'img/night.svg';
  time.setAttribute('src', timeSrc);

  if (card.classList.contains('d-none')) {
    card.classList.remove('d-none');
  }
};

const updateCity = async (city) => {
  const cityDetails = await getCity(city);
  const weatherDetails = await getWeather(cityDetails.Key);
  return {
    cityDetails,
    weatherDetails,
  };
};

cityForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const city = cityForm.city.value.trim();
  cityForm.reset();
  updateCity(city)
    .then((data) => updateUI(data))
    .catch((err) => console.log(err));
  localStorage.setItem('ultimaciudad', city);
});

if (localStorage.getItem('ultimaciudad')) {
  updateCity(localStorage.getItem('ultimaciudad'))
    .then((data) => updateUI(data))
    .catch((err) => console.log(err));
}

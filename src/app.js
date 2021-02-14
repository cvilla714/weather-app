/* eslint-disable eqeqeq */
import { getWeather, getCity } from "./forecast";

const cityForm = document.querySelector("form");
const card = document.querySelector(".card");
const details = document.querySelector(".details");
const time = document.querySelector("img.time");
const icon = document.querySelector(".icon img");
const unitToggle = document.querySelector("[data-unit-toggle]");
const metricRadio = document.getElementById("cel");
const imperialRadio = document.getElementById("fah");

const updateUI = (data) => {
  // console.log(data);
  const { cityDetails, weatherDetails } = data;
  const maintem = weatherDetails.Temperature.Imperial.Value;
  const thetime = new Date(weatherDetails.EpochTime).toLocaleTimeString("en-US");
  details.innerHTML = `
      <h5 class="my-3">City Name: ${cityDetails.EnglishName}</h5>
      <h2 class="my-3 zone">Time Zone: ${cityDetails.TimeZone.Code}</h2>
      <div class="my-3 text-info">Forecast: ${weatherDetails.WeatherText}</div>
      <div class="my-3 text-info">Time : ${thetime}</div>
      <div class="my-4 info">
      <span data-celcius-temp></span>
          &deg;<span data-temp-unit></span>
      </div>
      `;

  const iconSrc = `img/icons/${weatherDetails.WeatherIcon}.svg`;
  icon.setAttribute("src", iconSrc);
  const timeSrc = weatherDetails.IsDayTime ? "img/day.svg" : "img/night.svg";
  time.setAttribute("src", timeSrc);

  if (card.classList.contains("d-none")) {
    card.classList.remove("d-none");
  }

  function convertTemp() {
    const s = document.querySelector("[data-temp-unit]");
    const c = document.querySelector("[data-celcius-temp]");
    // console.log(s.innerHTML);
    // let returnTemp = maintem;

    const returnTemp = Math.round((maintem - 32) * (5 / 9));
    // console.log(returnTemp);

    c.innerHTML = s.innerHTML == "F" ? maintem : returnTemp;
    // console.log(maintem);
    return returnTemp;
  }
  convertTemp();

  unitToggle.addEventListener("click", () => {
    convertTemp();
  });
};

function isMetric() {
  return metricRadio.checked;
}

function updateUnits() {
  const tempUnits = document.querySelector("[data-temp-unit]");
  // console.log(tempUnits);
  tempUnits.innerHTML = isMetric() ? "C" : "F";
}
unitToggle.addEventListener("click", () => {
  // console.log(e);
  const metricUnits = !isMetric();
  // let metricUnits = !metricRadio.checked;
  metricRadio.checked = metricUnits;
  imperialRadio.checked = !metricUnits;

  updateUnits();
});

metricRadio.addEventListener("change", () => {
  updateUnits();
});

imperialRadio.addEventListener("change", () => {
  updateUnits();
});

const updateCity = async (city) => {
  const cityDetails = await getCity(city);
  const weatherDetails = await getWeather(cityDetails.Key);
  return {
    cityDetails,
    weatherDetails,
  };
};

cityForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const city = cityForm.city.value.trim();
  cityForm.reset();
  updateCity(city)
    .then((data) => updateUI(data))
    .catch((err) => console.log(err));
  localStorage.setItem("ultimaciudad", city);
});

if (localStorage.getItem("ultimaciudad")) {
  updateCity(localStorage.getItem("ultimaciudad"))
    .then((data) => updateUI(data))
    .catch((err) => console.log(err));
}

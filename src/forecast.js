const key = "Fa1tORczSKnflphuiPFCKU303Z04wWn9";

const getWeather = async (locationid) => {
  const baseWeather = "https://dataservice.accuweather.com/currentconditions/v1/";
  const queryWeather = `${locationid}?apikey=${key}`;
  const responseWeather = await fetch(baseWeather + queryWeather);
  const dataWeather = await responseWeather.json();
  return dataWeather[0];
};

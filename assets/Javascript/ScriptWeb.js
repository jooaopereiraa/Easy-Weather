const API_KEY = 'ef60a79c9c3ca99f2edfad01fd9badb3';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

let lastSearchedCity = 'Brasilia';

Document.prototype.getUniqueClass = function(className) {
    return this.getElementsByClassName(className)[0];
};

document.getUniqueClass('busca').addEventListener('submit', handleFormSubmit);

async function handleFormSubmit(event) {
    event.preventDefault();
    const input = document.getElementById('searchInput').value.trim();
    if (input) {
        lastSearchedCity = input;
        clearInfo();
        showWarning('Carregando...');
        await fetchWeather(input);
    } else {
        clearInfo();
    }
}

async function fetchWeather(city) {
    try {
        const response = await fetch(`${API_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pt_br`);
        const data = await response.json();

        if (data.cod === 200) {
            const tempKelvin = (data.main.temp + 273.15).toFixed(2);
            displayWeatherInfo({
                name: data.name,
                country: data.sys.country,
                temp: data.main.temp,
                tempKelvin,
                icon: data.weather[0].icon,
                windSpeed: data.wind.speed,
                description: data.weather[0].description,
            });
        } else {
            handleWeatherError();
        }
    } catch (error) {
        handleWeatherError();
    }
}

function displayWeatherInfo({ name, country, temp, tempKelvin, icon, windSpeed, description }) {
    showWarning('');
    const resultElement = document.getUniqueClass('resultado');
    resultElement.style.display = 'block';
    document.getUniqueClass('titulo').innerHTML = `${name}, ${country}`;
    document.getUniqueClass('temperatura').innerHTML = `${temp} ºC (${tempKelvin} K)`;
    document.getUniqueClass('ventoInfo').innerHTML = `${windSpeed} <span>km/h</span>`;
    document.getUniqueClass('tempInfo').innerHTML = description;
    document.querySelector('.informacoes img').setAttribute('src', `assets/Images/${icon}.gif`);
}

function handleWeatherError() {
    clearInfo();
    showWarning('Não encontramos essa localização');
}

function showWarning(message) {
    document.getUniqueClass('aviso').innerHTML = message;
}

function clearInfo() {
    showWarning('');
    document.getUniqueClass('resultado').style.display = 'none';
}

async function updateWeather() {
    if (lastSearchedCity) {
        await fetchWeather(lastSearchedCity);
    }
}

updateWeather();
setInterval(updateWeather, 300000);
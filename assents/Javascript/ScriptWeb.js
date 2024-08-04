let lastSearchedCity = 'Brasilia';

document.querySelector('.busca').addEventListener('submit', async (event) => {
    event.preventDefault();
    let input = document.querySelector('#searchInput').value;
    if (input !== '') {
        lastSearchedCity = input; // Armazena a cidade pesquisada
        clearInfo();
        showWarning('Carregando...');
        await fetchWeather(input);
    } else {
        clearInfo();
    }
});

async function fetchWeather(city) {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(city)}&appid=ef60a79c9c3ca99f2edfad01fd9badb3&units=metric&lang=pt_br`;

    let results = await fetch(url);
    let json = await results.json();

    if (json.cod === 200) {
        showInfo({
            name: json.name,
            country: json.sys.country,
            temp: json.main.temp,
            tempIcon: json.weather[0].icon,
            windSpeed: json.wind.speed,
            descri: json.weather[0].description,
        });
    } else {
        clearInfo();
        showWarning('Não encontramos essa localização');
    }
}

function showInfo(json) {
    showWarning('');
    document.querySelector('.resultado').style.display = 'block';
    document.querySelector('.titulo').innerHTML = `${json.name}, ${json.country}`;
    document.querySelector('.temperatura').innerHTML = `${json.temp} ºC`;
    document.querySelector('.ventoInfo').innerHTML = `${json.windSpeed} <span>km/h</span>`;
    document.querySelector('.tempInfo').innerHTML = `${json.descri}`;
    document.querySelector('.informacoes img').setAttribute('src', `assents/Images/${json.tempIcon}.gif`);
}

function showWarning(msg) {
    document.querySelector('.aviso').innerHTML = msg;
}

function clearInfo() {
    showWarning('');
    document.querySelector('.resultado').style.display = 'none';
}

async function updateWeather() {
    if (lastSearchedCity !== '') {
        await fetchWeather(lastSearchedCity);
    }
}

updateWeather();
setInterval(updateWeather, 5000);
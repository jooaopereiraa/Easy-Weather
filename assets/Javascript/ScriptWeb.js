let lastSearchedCity = 'Brasilia';

Document.prototype.getUniqueClass = function(className) {
    return this.getElementsByClassName(className)[0];
};


document.getUniqueClass('busca').addEventListener('submit', async (event) => {
    event.preventDefault();
    let input = document.getElementById('searchInput').value;
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
    document.getUniqueClass('resultado').style.display = 'block';
    document.getUniqueClass('titulo').innerHTML = `${json.name}, ${json.country}`;
    document.getUniqueClass('temperatura').innerHTML = `${json.temp} ºC`;
    document.getUniqueClass('ventoInfo').innerHTML = `${json.windSpeed} <span>km/h</span>`;
    document.getUniqueClass('tempInfo').innerHTML = `${json.descri}`;
    document.querySelector('.informacoes img').setAttribute('src', `assets/Images/${json.tempIcon}.gif`);
}

function showWarning(msg) {
    document.getUniqueClass('aviso').innerHTML = msg;
}

function clearInfo() {
    showWarning('');
    document.getUniqueClass('resultado').style.display = 'none';
}

async function updateWeather() {
    if (lastSearchedCity !== '') {
        await fetchWeather(lastSearchedCity);
    }
}

updateWeather();
setInterval(updateWeather, 300000);

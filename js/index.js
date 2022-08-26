const tempo = document.getElementById('tempo');
const input = document.getElementById('submit-button');
const previsao = document.getElementById('previsao');

let apiKey = "&appid=248d2ca65b95fa08cf3d4a566588b80a"
let coordEndpoint = "https://api.openweathermap.org/geo/1.0/direct?q="
let weatherEndpoint = "https://api.openweathermap.org/data/2.5/weather?"
let nextDaysEndpoint = "https://api.openweathermap.org/data/2.5/forecast?"

window.addEventListener('load', () => {
    fetchCoord("londres")
    getCity()
});

function getCity(){
    input.addEventListener("click", function(e){
        e.preventDefault();
        let city = document.getElementById('search').value

        fetchCoord(city)
        
    })
}

async function fetchCoord(city){
    const urlCoord = `${coordEndpoint}${city}${apiKey}`;

    const req = await fetch(urlCoord);
    const json = await req.json();

    let lat = json[0].lat
    let lon = json[0].lon
    let state = json[0].state

    fetchWeather(lat, lon, state)
    fetchNextDays(lat, lon)
}

async function fetchWeather(lat, lon, state){
    const urlWeather = `${weatherEndpoint}lat=${lat}&lon=${lon}${apiKey}`

    const req = await fetch(urlWeather);
    const weather = await req.json();

    let name = weather.name
    let temp = weather.main.temp;
    let description = weather.weather[0].description;
    let tempMax = weather.main.temp_max;
    let tempMin = weather.main.temp_min;
    let country = weather.sys.country
    let icon = weather.weather[0].icon;

    renderResults(name, temp, tempMax, tempMin, description, country, state, icon)
}

function renderResults(name, temp, tempMax, tempMin, description,  country, state, icon) {
    let HtmlResult = "";
    let estado = ""; 

    if(!state){
        estado = ``;
    }else{
        estado = `${state} - ${country}`;
    }
    
    let temperatura = convertTemp(temp) + "°C"
    let temperaturaMin = "Min.:" + convertTemp(tempMin) + "°C"
    let temperaturaMax= "Max.:" +convertTemp(tempMax) + "°C"
    let icone = getIcon(icon);
    
    const HtmlWeather = `
        
        <h2 class='cidade' id='cidade'>${name}</h2>
        <h3 class='estado' id='estado'>${estado}</h3>
        <div class='temperatura' id='temperatura'>${temperatura}</div>
        <div class='clima'> 
            <div class='descricao' id='descricao'>${description}</div>
            <div class='icone' id='icone'>${icone}</div>
        </div>
        
        <div class='minMax'>
            <div class='min' id='tMin'>${temperaturaMin}</div>
            <div class='max' id='tMax'>${temperaturaMax}</div>
        </div>
        
    `;

    HtmlResult += HtmlWeather;
  
    tempo.innerHTML = HtmlResult;
    document.body.style.backgroundImage = `url('https://source.unsplash.com/1920x1080/?${description}')`
  
}   

function convertTemp(temp){
    let celcius = Math.trunc(temp - 273.15)
    return celcius
}

function getIcon(icon){
    switch (icon) {
        case '01d':
            return `<img class='img-developer' src='img/clear-day.svg' alt='clear-day'></img>`
        break;

        case '01n':
            return `<img class='img-developer' src='img/clear-night.svg' alt='clear-night'></img>`
        break;

        case '02d':
            return `<img class='img-developer' src='img/partly-cloudy-day.svg' alt='partly-cloudy-day'></img>`
        break;

        case '02n':
            return `<img class='img-developer' src='img/partly-cloudy-night.svg' alt='partly-cloudy-night'></img>`
        break;

        case '03d':
            return `<img class='img-developer' src='img/cloudy.svg' alt='cloudy'></img>`
        break;

        case '03n':
            return `<img class='img-developer' src='img/cloudy.svg' alt='cloudy'></img>`
        break;

        case '04d':
            return `<img class='img-developer' src='img/overcast-day.svg' alt='overcast-day'></img>`
        break;

        case '04n':
            return `<img class='img-developer' src='img/overcast-night.svg' alt='overcast-night'></img>`
        break;

        case '09d':
            return `<img class='img-developer' src='img/rain.svg' alt='rain'></img>`
        break;

        case '09n':
            return `<img class='img-developer' src='img/rain.svg' alt='rain'></img>`
        break;

        case '10d':
            return `<img class='img-developer' src='img/partly-cloudy-day-rain.svg' alt='partly-cloudy-day-rain'></img>`
        break;

        case '10n':
            return `<img class='img-developer' src='img/partly-cloudy-night-rain.svg' alt='partly-cloudy-night-rain'></img>`
        break;

        case '11d':
            return `<img class='img-developer' src='img/thunderstorms-day.svg' alt='thunderstorms-day'></img>`
        break;

        case '11n':
            return `<img class='img-developer' src='img/thunderstorms-night.svg' alt='thunderstorms-night'></img>`
        break;
            
        case '13d':
            return `<img class='img-developer' src='img/snow.svg' alt='snow'></img>`
        break;

        case '13n':
            return `<img class='img-developer' src='img/snow.svg' alt='snow'></img>`
        break;

        case '50d':
            return `<img class='img-developer' src='img/mist.svg' alt='mist'></img>`
        break;
        
        case '50n':
            return `<img class='img-developer' src='img/mist.svg' alt='mist'></img>`
        break;

        default:
            return ''
        break;
    }
}

async function fetchNextDays(lat, lon){
    const urlNextDays = `${nextDaysEndpoint}lat=${lat}&lon=${lon}&lang=pt_br${apiKey}`

    const req = await fetch(urlNextDays);
    const json = await req.json();
    
    const nextDaysWeather = json.list.map(( devs ) => {
        const { dt_txt, main, weather} = devs;
        return {
            dt_txt,
            temp:main.temp,
            icon:weather[0].icon
        }
    });

    get5DaysWeather(nextDaysWeather);
}

function get5DaysWeather(nextDaysWeather){

    let next5Days = []
    let size = Object.keys(nextDaysWeather).length

    for( i=0; i<= size-1; i+=8){
        next5Days.push(nextDaysWeather[i])
    }
    
    render5Days(next5Days)
}

function render5Days(array){
    let HtmlResult = "";

    array.forEach(( e ) => {
        const { dt_txt, temp, icon } = e;
        
        const temperatura = convertTemp(temp);
        const day = getDayOfDate(dt_txt);
        const icone = getIcon(icon);

        const HtmlPrevisao = `
        <div class='dias'>
            <span class='dias'>${day}</span>
            <div class='icone' id='icone'>${icone}</div>
            <span>${temperatura}°C</span>
        </div>
        `;
        HtmlResult += HtmlPrevisao;
      })
  
    previsao.innerHTML = HtmlResult;
}

function getDayOfDate(date){
    let day = new Date(date).getDate();
    if(day == new Date().getDate()){
        return 'Today'
    }
    else {
        return day;
    }
}
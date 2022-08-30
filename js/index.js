const tempo = document.getElementById('climate');
const input = document.getElementById('submit-button');
const previsao = document.getElementById('wrap-forecast');
const info = document.getElementById('info');
const forecast = document.getElementById('forecast-time');

let apiKey = "&appid=248d2ca65b95fa08cf3d4a566588b80a"
let coordEndpoint = "https://api.openweathermap.org/geo/1.0/direct?q="
let weatherEndpoint = "https://api.openweathermap.org/data/2.5/weather?"
let nextDaysEndpoint = "https://api.openweathermap.org/data/2.5/forecast?"



window.addEventListener('load', () => {
    fetchCoord("mairinque")
    getCity()
});

function getCity(){
    input.addEventListener("click", function(e){
        e.preventDefault();
        let city = document.getElementById('search').value
        console.log(city)
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

    let icon = weather.weather[0].icon;
    let sunrise = unixtoTime(weather.sys.sunrise);
    let sunset = unixtoTime(weather.sys.sunset);
    let temp = weather.main.temp;
    let feels = weather.main.feels_like;
    let humidity = weather.main.humidity;
    let pressure = weather.main.pressure;
    let description = weather.weather[0].description;
    let tempMax = weather.main.temp_max;
    let tempMin = weather.main.temp_min;
    let country = weather.sys.country;
    let wind = weather.wind.speed;

    let name = weather.name

    info.innerHTML = `<p> Weather in <b>${name}</b> - ${country} </p> <div class="temp-scales"> <b>°C</b> | °F </div>`

    renderResults(wind, name, temp, tempMax, tempMin, description, country, state, icon, sunrise, sunset, feels, humidity, pressure)
}

function renderResults(wind, name, temp, tempMax, tempMin, description,  country, state, icon, sunrise, sunset, feels, humidity, pressure) {
    let HtmlResult = "";
    
    let date = getFullDate()
    
    let temperatura = convertTemp(temp) + "°C";
    let temperaturaMin = convertTemp(tempMin) + "°C";
    let temperaturaMax= convertTemp(tempMax) + "°C";
    let feels_like= convertTemp(feels) + "°C";
    let icone = getIcon(icon);
    
    const HtmlWeather = `

        <div class='sunset'>
            <div class='icon' id='icon'>${icone}</div>
            <div class='sunset-data'>
                <span>Sunrise: ${sunrise}</span>
                <span>Sunset: ${sunset}</span>
            </div>
        </div>

        <div class='weather'>
            <div class='date' id='date'><p>${date}</p></div>
            <div class='temp' id='temp'><h2>${temperatura}</h2></div>
            <div class='feels'><p>Feels like ${feels_like}</p></div>
            <div class='description'><p class='ex'>${description}</p></div>
        </div>

        <div class='more-details'>
            <h2>More Details: </h2>
            <div class="details-data">
                <span>Wind speed: <b>${wind} m/s</b></span><br>
                <span>Air Humidity: <b>${humidity}%</b></span><br>
                <span>Min: <b>${temperaturaMin}</b></span><br>
                <span>Max: <b>${temperaturaMax}</b></span><br>
            </div>
        </div>
        
    `;

    HtmlResult += HtmlWeather;
  
    tempo.innerHTML = HtmlResult;
    //document.body.style.backgroundImage = `url('https://source.unsplash.com/1920x1080/?${description}')`
  
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
    const urlNextDays = `${nextDaysEndpoint}lat=${lat}&lon=${lon}${apiKey}`

    const req = await fetch(urlNextDays);
    const json = await req.json();

   
    
    const nextDaysWeather = json.list.map(( devs ) => {
        const { dt_txt, main, weather, description} = devs;
        return {
            dt_txt,
            temp:main.temp,
            icon:weather[0].icon,
            min:main.temp_min,
            max:main.temp_max,
            description:weather[0].description
        }
    });
    
    get8Hours(nextDaysWeather);
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

    console.log(array)

    array.forEach(( e ) => {
        const { dt_txt,  icon, min, max, description} = e;
        
        const day = getDayOfDate(dt_txt);
        const week = getWeekDay(dt_txt);
        const mounth = getMounth(dt_txt);
        const icone = getIcon(icon);
        const tempMin = convertTemp(min);
        const tempMax = convertTemp(max);

        const HtmlPrevisao = `
        <div class='weather-forecast-data'>
            <div class='week-day'>
                <span>${week}</span>
            <span>${day} ${mounth}</span>
            </div>

                <div class='min-max'>
                    <span>min: <b>${tempMin}°C</b></span>
                    <span>max: <b>${tempMax}°C</b></span>
                </div>

                <div class='week-icon' id='week-icon'>${icone}</div>
                <span>${description}</span>
        </div>
        `;
        HtmlResult += HtmlPrevisao;
      })
  
    previsao.innerHTML = HtmlResult;
}

function getDayOfDate(date){

    
    let day = new Date(date).getDate();
    return day
}

function get8Hours(array){

    
    let forecast = [];

    for(i = 0; i<=7; i++){
        forecast.push (array[i])
    }
    render8Hours(forecast);
}

function render8Hours(array){

    let HtmlResult = "";

    array.forEach(( e ) => {
        const { dt_txt, temp, icon } = e;
        
        const temperatura = convertTemp(temp);
        const hour = toHour(new Date(dt_txt).getTime())
        const icone = getIcon(icon);
        let day = '';

        if(hour == '00:00'){
            day = 'Day '+ new Date(dt_txt).getDate();
        }

        const HtmlPrevisao = `
        <div class='forecast-data'>
        
            <span>${day}</span>
            ${icone}
            <span>${temperatura}°C</span>
            <span>${hour}</span>
        </div>
        `;
        HtmlResult += HtmlPrevisao;
        console.log(day)
    })

      
    
    forecast.innerHTML = HtmlResult;
}

function toHour(timestamp){
       
    let h = new Date(timestamp).getHours();
    let m = new Date(timestamp).getMinutes();
    
    h = (h<10) ? '0' + h : h;
    m = (m<10) ? '0' + m : m;
    
    return output = h + ':' + m;
}

function getFullDate(){
       
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const date = new Date();
    let day = days[date.getDay()];
    let month = months[date.getMonth()];
    let hour = toHour(date)
    let fullDate = `${day} ${date.getDate()} ${month} ${hour}`
    return fullDate
}

function getMounth(e){
       
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
   
    const date = new Date(e);
    let month = months[date.getMonth()];
    let mounthName = `${month}`
    return mounthName
}

function getWeekDay(e){
       
     const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const date = new Date(e);
    let day = days[date.getDay()];
    let weekdDay = `${day}`

    return weekdDay
}

function unixtoTime(time){

    let theDate = new Date(time * 1000);
    dateString = theDate.toUTCString()
    hour = toHour(dateString)

    return hour;
}
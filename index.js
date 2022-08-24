
const input = document.getElementById('submit-button');

let apiKey = "248d2ca65b95fa08cf3d4a566588b80a"
let urlCoord = `http://api.openweathermap.org/geo/1.0/direct?q=mairinque&appid=${apiKey}`

let city = [];

window.addEventListener('load', () => {
    fetchCoord()
});

async function fetchCoord(){

    const res = await fetch(urlCoord);
    const retornoCoordenadas = await res.json();

    const latitude = retornoCoordenadas[0].lat;
    const longitude = retornoCoordenadas[0].lon;
    
    let urlWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&lang=pt_br&appid=${apiKey}`

    const request = await fetch(urlWeather);
    const retornoData = await request.json();
   
    console.log(retornoData)

}


function getCity(){
    input.addEventListener("click", function(e){
        e.preventDefault();
        let city = document.getElementById('search').value
    })
}
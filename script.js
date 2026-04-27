function getWeather(lat, lon) {

const url =
`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;

fetch(url)
.then(res => res.json())
.then(data => {

document.getElementById("temp").innerText =
data.current_weather.temperature + "°C";

document.getElementById("wind").innerText =
"Wind: " + data.current_weather.windspeed + " km/h";

// Hourly
let hourly = "";
for(let i=0;i<8;i++){
hourly += `
<div class="card">
<p>${data.hourly.time[i].split("T")[1]}</p>
<h4>${data.hourly.temperature_2m[i]}°</h4>
</div>`;
}
document.getElementById("hourly").innerHTML = hourly;

// Daily
let daily = "";
for(let i=0;i<7;i++){
daily += `
<div class="card">
<p>${data.daily.time[i]}</p>
<h4>${data.daily.temperature_2m_max[i]}°</h4>
<p>${data.daily.temperature_2m_min[i]}°</p>
</div>`;
}
document.getElementById("daily").innerHTML = daily;

});
}

// Detect Location
if(navigator.geolocation){

navigator.geolocation.getCurrentPosition(

function(position){

const lat = position.coords.latitude;
const lon = position.coords.longitude;

document.getElementById("city").innerText =
"Your Local Weather";

getWeather(lat, lon);

},

function(){

document.getElementById("city").innerText =
"Location Blocked - Showing Bengaluru";

getWeather(12.97,77.59);

}

);

}else{

document.getElementById("city").innerText =
"Geolocation Not Supported";

getWeather(12.97,77.59);

}
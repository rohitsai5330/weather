let weatherChart;
let weatherData;

/* Weather text */
function weatherText(code){

if(code===0) return "Sunny";
if(code<=3) return "Cloudy";
if(code<=67) return "Rain";
if(code<=99) return "Storm";

return "Weather";
}

/* Weather icon */
function weatherIcon(code){

if(code===0) return "☀️";
if(code<=3) return "☁️";
if(code<=67) return "🌧️";
if(code<=99) return "⛈️";

return "☁️";
}

/* Build chart */
function buildChart(type){

const labels=[];
const values=[];

const nowHour=new Date().getHours();

for(let i=nowHour;i<nowHour+8;i++){

let hour=i % 24;

labels.push(hour + ":00");

if(type==="temp"){
values.push(weatherData.hourly.temperature_2m[i]);
}

if(type==="rain"){
values.push(weatherData.hourly.precipitation_probability[i]);
}

if(type==="wind"){
values.push(weatherData.hourly.windspeed_10m[i]);
}

}

if(weatherChart){
weatherChart.destroy();
}

let color="#f4b400";
let fill="rgba(244,180,0,.18)";

if(type==="rain"){
color="#4285f4";
fill="rgba(66,133,244,.18)";
}

if(type==="wind"){
color="#90a4ae";
fill="rgba(144,164,174,.18)";
}

weatherChart=new Chart(document.getElementById("chart"),{

type:"line",

data:{
labels:labels,
datasets:[{
data:values,
borderColor:color,
backgroundColor:fill,
fill:true,
pointRadius:0,
borderWidth:2,
tension:.35
}]
},

options:{
responsive:true,
maintainAspectRatio:false,

plugins:{
legend:{display:false}
},

scales:{
x:{grid:{display:false}},
y:{display:false,grid:{display:false}}
}
}

});

}

/* Tab click */
function switchTab(type,el){

document.querySelectorAll(".tab").forEach(tab=>{
tab.classList.remove("active");
});

el.classList.add("active");

buildChart(type);
}

/* Load weather */
function loadWeather(lat,lon){

fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,precipitation_probability,windspeed_10m,relativehumidity_2m&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`)

.then(r=>r.json())

.then(data=>{

weatherData=data;

let h=new Date().getHours();

/* top values */
document.getElementById("temp").innerText =
data.current_weather.temperature;

document.getElementById("mainIcon").innerText =
weatherIcon(data.current_weather.weathercode);

document.getElementById("summary").innerText =
weatherText(data.current_weather.weathercode);

document.getElementById("dayName").innerText =
new Date().toLocaleDateString("en-US",{weekday:"long"});

document.getElementById("rainVal").innerText =
"Precipitation: " +
data.hourly.precipitation_probability[h] + "%";

document.getElementById("humidVal").innerText =
"Humidity: " +
data.hourly.relativehumidity_2m[h] + "%";

document.getElementById("windVal").innerText =
"Wind: " +
data.current_weather.windspeed + " km/h";

/* default chart */
buildChart("temp");

/* forecast cards */
let html="";

for(let i=0;i<7;i++){

let d=new Date(data.daily.time[i]);

html += `
<div class="day">

<div class="dayname">
${d.toLocaleDateString("en-US",{weekday:"short"})}
</div>

<div class="dayicon">
${weatherIcon(data.daily.weathercode[i])}
</div>

<div class="daytemp">
${Math.round(data.daily.temperature_2m_max[i])}°
<span class="small">
${Math.round(data.daily.temperature_2m_min[i])}°
</span>
</div>

</div>
`;
}

document.getElementById("daysRow").innerHTML=html;

});

}

/* Reverse Geocode */
function loadPlaceName(lat,lon){

fetch(`https://geocode.maps.co/reverse?lat=${lat}&lon=${lon}`)

.then(r=>r.json())

.then(loc=>{

const city =
loc.address.city ||
loc.address.town ||
loc.address.village ||
loc.address.state ||
loc.address.country ||
"Your Location";

const country =
loc.address.country || "";

document.getElementById("topLocation").innerText =
city + (country ? ", " + country : "");

document.getElementById("cityName").innerText =
city;

})

.catch(()=>{

document.getElementById("topLocation").innerText =
"Your Location";

});

}

/* IP fallback */
function loadByIP(){

fetch("https://ipapi.co/json/")

.then(r=>r.json())

.then(data=>{

document.getElementById("topLocation").innerText =
data.city + ", " + data.country_name;

document.getElementById("cityName").innerText =
data.city;

loadWeather(data.latitude,data.longitude);

})

.catch(()=>{

document.getElementById("topLocation").innerText =
"Bengaluru, India";

document.getElementById("cityName").innerText =
"Bengaluru";

loadWeather(12.97,77.59);

});

}

/* Main location detect */
function refreshLocation(){

if(navigator.geolocation){

navigator.geolocation.getCurrentPosition(

(position)=>{

const lat=position.coords.latitude;
const lon=position.coords.longitude;

loadWeather(lat,lon);
loadPlaceName(lat,lon);

},

(error)=>{

loadByIP();

},

{
enableHighAccuracy:true,
timeout:5000,
maximumAge:0
}

);

}else{

loadByIP();

}

}

/* Start */
refreshLocation();

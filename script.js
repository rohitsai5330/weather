let weatherChart;
let weatherData;

function weatherText(code){
if(code==0) return "Sunny";
if(code<=3) return "Cloudy";
if(code<=67) return "Rain";
if(code<=99) return "Storm";
return "Weather";
}

function weatherIcon(code){
if(code==0) return "☀️";
if(code<=3) return "☁️";
if(code<=67) return "🌧️";
if(code<=99) return "⛈️";
return "☁️";
}

/* Chart builder */
function buildChart(type){

const labels=[];
const values=[];

const nowHour=new Date().getHours();

for(let i=nowHour;i<nowHour+8;i++){

let h=i % 24;
labels.push(h + ":00");

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

if(weatherChart) weatherChart.destroy();

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
tension:.35,
borderWidth:2
}]
},
options:{
responsive:true,
maintainAspectRatio:false,
plugins:{legend:{display:false}},
scales:{
x:{grid:{display:false}},
y:{display:false,grid:{display:false}}
}
}
});
}

/* Click tabs */
function switchTab(type,el){

document.querySelectorAll(".tab").forEach(t=>{
t.classList.remove("active");
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

const h=new Date().getHours();

document.getElementById("temp").innerText=data.current_weather.temperature;
document.getElementById("mainIcon").innerText=weatherIcon(data.current_weather.weathercode);

document.getElementById("summary").innerText=weatherText(data.current_weather.weathercode);

document.getElementById("dayName").innerText=
new Date().toLocaleDateString("en-US",{weekday:"long"});

document.getElementById("rainVal").innerText=
"Precipitation: "+data.hourly.precipitation_probability[h]+"%";

document.getElementById("humidVal").innerText=
"Humidity: "+data.hourly.relativehumidity_2m[h]+"%";

document.getElementById("windVal").innerText=
"Wind: "+data.current_weather.windspeed+" km/h";

/* default tab */
buildChart("temp");

/* forecast cards */
let html="";

for(let i=0;i<8;i++){

const d=new Date(data.daily.time[i]);

html+=`
<div class="day">
<div class="dayname">${d.toLocaleDateString("en-US",{weekday:"short"})}</div>
<div class="dayicon">${weatherIcon(data.daily.weathercode[i])}</div>
<div class="daytemp">
${Math.round(data.daily.temperature_2m_max[i])}°
<span class="small">${Math.round(data.daily.temperature_2m_min[i])}°</span>
</div>
</div>`;
}

document.getElementById("daysRow").innerHTML=html;

});
}

/* Auto detect location */
navigator.geolocation.getCurrentPosition(

(pos)=>{

loadWeather(
pos.coords.latitude,
pos.coords.longitude
);

fetch(`https://geocode.maps.co/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`)
.then(r=>r.json())
.then(loc=>{
document.getElementById("cityName").innerText=
loc.address.city ||
loc.address.town ||
loc.address.state ||
"Your Location";
});

},

()=>{

document.getElementById("cityName").innerText="Bengaluru";

loadWeather(12.97,77.59);

}

);

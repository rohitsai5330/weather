let fullData;
let weatherChart;

function textCode(code){

if(code==0) return "Clear Sky";
if(code<=3) return "Mostly Cloudy";
if(code<=67) return "Rain";
if(code<=99) return "Storm";

return "Weather";
}

function iconCode(code){

if(code==0) return "☀️";
if(code<=3) return "⛅";
if(code<=67) return "🌧️";
if(code<=99) return "⛈️";

return "☁️";
}

function makeChart(type){

const labels=[];
const values=[];

for(let i=0;i<8;i++){

labels.push(fullData.hourly.time[i].split("T")[1]);

if(type==="temp"){
values.push(fullData.hourly.temperature_2m[i]);
}

if(type==="rain"){
values.push(fullData.hourly.precipitation_probability[i]);
}

if(type==="wind"){
values.push(fullData.hourly.windspeed_10m[i]);
}
}

if(weatherChart){
weatherChart.destroy();
}

let color="#f4b400";

if(type==="rain") color="#4285f4";
if(type==="wind") color="#90a4ae";

weatherChart=new Chart(document.getElementById("chart"),{

type:"line",

data:{
labels:labels,
datasets:[{
data:values,
borderColor:color,
backgroundColor:"rgba(0,0,0,.03)",
fill:false,
pointRadius:0,
tension:.35,
borderWidth:3
}]
},

options:{
responsive:true,
maintainAspectRatio:false,

plugins:{
legend:{display:false}
},

scales:{
x:{
grid:{display:false}
},
y:{
display:false,
grid:{display:false}
}
}
}

});
}

function switchTab(type,el){

document.querySelectorAll(".tab").forEach(tab=>{
tab.classList.remove("active");
});

el.classList.add("active");

makeChart(type);
}

function loadWeather(lat,lon){

const api=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,precipitation_probability,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`;

fetch(api)
.then(response=>response.json())
.then(data=>{

fullData=data;

document.getElementById("temp").innerText=data.current_weather.temperature;

document.getElementById("extra").innerText=
"Wind: "+data.current_weather.windspeed+" km/h";

document.getElementById("summary").innerText=
textCode(data.current_weather.weathercode);

document.getElementById("dayName").innerText=
new Date().toLocaleDateString("en-US",{weekday:"long"});

makeChart("temp");

let html="";

for(let i=0;i<7;i++){

const d=new Date(data.daily.time[i]);

const day=d.toLocaleDateString("en-US",{weekday:"short"});

html+=`
<div class="day">
<div>${day}</div>
<div class="dayicon">${iconCode(data.daily.weathercode[i])}</div>
<div>
<b>${Math.round(data.daily.temperature_2m_max[i])}°</b>
<span class="small">${Math.round(data.daily.temperature_2m_min[i])}°</span>
</div>
</div>
`;
}

document.getElementById("days").innerHTML=html;

});
}

if(navigator.geolocation){

navigator.geolocation.getCurrentPosition(

(position)=>{

document.getElementById("city").innerText="Your Local Weather";

loadWeather(
position.coords.latitude,
position.coords.longitude
);

},

()=>{

document.getElementById("city").innerText="Bengaluru, Karnataka";

loadWeather(12.97,77.59);

}

);

}else{

document.getElementById("city").innerText="Bengaluru, Karnataka";

loadWeather(12.97,77.59);
}

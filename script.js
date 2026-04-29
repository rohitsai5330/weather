function icon(code){
if(code==0) return "☀️";
if(code<=3) return "☁️";
if(code<=67) return "🌧️";
if(code<=99) return "⛈️";
return "☁️";
}

function loadWeather(lat,lon){

fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=precipitation_probability,relativehumidity_2m&timezone=auto`)
.then(r=>r.json())
.then(data=>{

let h=new Date().getHours();

document.getElementById("temp").innerText =
Math.round(data.current_weather.temperature);

document.getElementById("icon").innerText =
icon(data.current_weather.weathercode);

document.getElementById("rain").innerText =
"Precipitation: " +
data.hourly.precipitation_probability[h] + "%";

document.getElementById("hum").innerText =
"Humidity: " +
data.hourly.relativehumidity_2m[h] + "%";

document.getElementById("wind").innerText =
"Wind: " +
Math.round(data.current_weather.windspeed) + " km/h";

});

}

function setPlace(lat,lon){

fetch(`https://geocode.maps.co/reverse?lat=${lat}&lon=${lon}`)
.then(r=>r.json())
.then(d=>{

let city =
d.address.city ||
d.address.town ||
d.address.village ||
d.address.state ||
d.address.country;

document.getElementById("loc").innerText = city;

})
.catch(()=>{
document.getElementById("loc").innerText = "Your Location";
});

}

function gps(){

navigator.geolocation.getCurrentPosition(

(pos)=>{

let lat=pos.coords.latitude;
let lon=pos.coords.longitude;

setPlace(lat,lon);
loadWeather(lat,lon);

},

()=>{

ip();

},

{
enableHighAccuracy:true,
timeout:5000
}

);

}

function ip(){

fetch("https://ipapi.co/json/")
.then(r=>r.json())
.then(d=>{

document.getElementById("loc").innerText =
d.city + ", " + d.region;

loadWeather(d.latitude,d.longitude);

})
.catch(()=>{
document.getElementById("loc").innerText = "Location unavailable";
});

}

if(navigator.geolocation){
gps();
}else{
ip();
}

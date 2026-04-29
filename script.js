function icon(code){
if(code==0) return "☀️";
if(code<=3) return "☁️";
if(code<=67) return "🌧️";
if(code<=99) return "⛈️";
return "☁️";
}

/* Load weather */
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

})
.catch(()=>{

document.getElementById("temp").innerText="--";

});

}

/* Reverse geocode */
function setPlace(lat,lon){

fetch(`https://geocode.maps.co/reverse?lat=${lat}&lon=${lon}`)
.then(r=>r.json())
.then(d=>{

let city =
d.address.city ||
d.address.town ||
d.address.village ||
d.address.state ||
d.address.country ||
"Your Location";

document.getElementById("loc").innerText = city;

})
.catch(()=>{

useIP();

});

}

/* GPS */
function useGPS(){

document.getElementById("loc").innerText =
"Finding your location...";

navigator.geolocation.getCurrentPosition(

(pos)=>{

let lat=pos.coords.latitude;
let lon=pos.coords.longitude;

document.getElementById("loc").innerText =
"Loading weather...";

loadWeather(lat,lon);
setPlace(lat,lon);

},

()=>{

useIP();

},

{
enableHighAccuracy:true,
timeout:5000
}

);

}

/* Reliable IP fallback */
function useIP(){

fetch("https://ipwho.is/")
.then(r=>r.json())
.then(d=>{

if(!d.success){

useDefault();
return;
}

document.getElementById("loc").innerText =
d.city + ", " + d.region;

loadWeather(d.latitude,d.longitude);

})
.catch(()=>{

useDefault();

});

}

/* Final backup */
function useDefault(){

document.getElementById("loc").innerText =
"Bengaluru, Karnataka";

loadWeather(12.97,77.59);

}

/* Start */
if(navigator.geolocation){

useGPS();

}else{

useIP();

}

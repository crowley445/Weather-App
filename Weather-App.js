$('document').ready( function(){
  RefreshWeatherData();
});

var forecast = {
  location : "",
  temperature : { 
    fahrenheit: "0",
    celsius: "0",
    display: "0"
  },
  windSpeed: {
    mph: "",
    kph: "",
    display: ""
  },
  chanceOfRain: '',
  icon: "default",
  summary: "",
};
var locationData;

function RefreshWeatherData(){
  GetLocationData();
}
function GetLocationData() {
  
  var baseURL = 'https://www.googleapis.com/geolocation/v1/geolocate?key=';
  var key = 'AIzaSyAuG2tNyh_3MpZi-k-TuF_4S5_QSTdYFzg';
  
  $.ajax({
    url: baseURL + key, 
    type: 'POST', 
    datatype: 'json',
    success: function(data) {SetLocationData(data.location) },
    error: function(err) { console.log("getCoordinates fail"); },
  });
  
  function SetLocationData(coordinates){
  var baseURL = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='
  var APIKey = 'AIzaSyCrvf7HHPPOw-5nZJTex3FpBJYb7SCBYY0';
  var URL = baseURL + coordinates.lat + ',' + coordinates.lng + '&key=' + APIKey;

  $.ajax({
    url: URL,
    dataType: "json",
    success: function (data) { locationData = data.results[0]; GetWeatherData() },
    error: function(err) {console.log("getLocationData fail");},
  });
  
}
}
function GetWeatherData(){
  var coordinates = locationData.geometry.location;
  var baseURL = 'https://api.forecast.io/forecast/';
  var APIKey = '3a40442bffca22418cd8e706b536161e';
  var URL = baseURL + APIKey + "/" + coordinates.lat + "," + coordinates.lng;

  $.ajax({
    url: URL,
    dataType: "jsonp",
    success: function (data) {SetWeatherData(data)},
    error: function(err) { console.log("getForecast fail"); },
  });
  
}
function SetWeatherData(data){
  var currently = data.currently; 
  var address_components = locationData.address_components.slice(locationData.address_components.length - 2); ;
  forecast.location = address_components[0].long_name + ", " + address_components[1].short_name;
  forecast.temperature.fahrenheit = Math.floor(currently.temperature) + "&#176;F";
  forecast.temperature.celsius = Math.floor((currently.temperature -  32)  *  5/9) + "&#176;C";
  forecast.temperature.display = forecast.temperature.fahrenheit;
  forecast.icon = currently.icon;
  forecast.summary = currently.summary;

  forecast.chanceOfRain = Math.floor(currently.precipProbability * 100) + "%";
  forecast.windSpeed.mph = Math.floor(currently.windSpeed) + "mp/h";
  forecast.windSpeed.kph = Math.floor(currently.windSpeed * 1.609344) + "km/h";
  forecast.windSpeed.display = forecast.windSpeed.mph;

  UpdatePage();
}

function GetImageSource(icon) {
  
  var _icon = "default";
  switch(icon) {
    case "clear-day":
    case "clear-night":
    case "rain":
    case "snow":
    case "sleet":
    case "wind":
    case "fog":
    case "cloudy":
    case "partly-cloudy-day":
    case "partly-cloudy-night":
      _icon = icon;
      break;
    default:
      break;
    }
  
  return "https://res.cloudinary.com/dzcadzgap/image/upload/v1468069384/" + _icon + ".png";
}
function SetBackgroundColor(icon){
  
  var _color="#";

  switch(icon) {
    case "clear-day":
      _color += "FF8E00";
      break;
    case "clear-night":
      _color += "414582";
      break;      
    case "rain":
      _color += "4881C3";
      break;       
    case "snow":
      _color += "87B2E5";
      break;        
    case "sleet":
      _color += "8461B7";
      break;        
    case "wind":
      _color += "AE3635";
      break;        
    case "fog":
      _color += "7D7299";
      break;        
    case "cloudy":
      _color += "784542";
      break;        
    case "partly-cloudy-day":
      _color += "77BD6A";
      break;         
    case "partly-cloudy-night":
      _color += "2D2E44";
      break;
    default:
      _color += "E34E4C";
      break;
    }
  
  return _color;
}

function SwitchFormat(){
  
  if(forecast.temperature.display === forecast.temperature.fahrenheit) {
    forecast.temperature.display = forecast.temperature.celsius;
    forecast.windSpeed.display = forecast.windSpeed.kph;
  }
  else {
    forecast.temperature.display = forecast.temperature.fahrenheit;
    forecast.windSpeed.display = forecast.windSpeed.mph;
  }
  
  $("#temp-text").html(forecast.temperature.display);
  $("#wind-text").html(forecast.windSpeed.display);
}
function UpdatePage(){
  $('#outer-div').animate({'opacity': 0},500);

  $("#location-text").html(forecast.location);
  $("#icon-img").attr("src",GetImageSource(forecast.icon));  
  $("#summary-text").html(forecast.summary);
  
  $("#temp-text").html(forecast.temperature.display);
  $("#rain-text").html(forecast.chanceOfRain);
  $("#wind-text").html(forecast.windSpeed.display);

  var _color = SetBackgroundColor(forecast.icon);
  $("body").css("background-color", _color);
  $("#main-div").css("background-color", _color);
  $('#outer-div').animate({'opacity': 1},500);
}



// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

//fetch weather apis
const apiKey = "a1c9f847304441af05d3fd7a41c5f939";
const searchForm = document.querySelector("#search");
const cityDisplay = document.querySelector("#city-name");
const dateDisplay = document.querySelector("#date");
const iconDisplay = document.querySelector("#icon");
const tempDisplay = document.querySelector("#temperature");
const windDisplay = document.querySelector("#wind-speed");
const humDisplay = document.querySelector("#humidity");
const fiveDayList = document.querySelector(".card");


// const displayFive = document.querySelector("#five-day-forecast");

function getCurrent(city) {
    const query = `https://api.openweathermap.org/data/2.5/weather?q=${city}&date&units=imperial&appid=${apiKey}`;
    const append = document.createElement('p');
    saveSearch(city);
    renderedCities();
    fiveDayList.innerHTML="";
    fetch(query)
        .then((info) => {
            return info.json();
        })
        .then((info) => {
            console.log(info);
            dateDisplay.textContent=moment().format('L');
            cityDisplay.textContent=info.name;
            tempDisplay.textContent=info.main.temp;
            windDisplay.textContent=info.wind.speed;
            humDisplay.textContent=info.main.humidity;

            fiveDay(info.coord.lat, info.coord.lon);
        })
        .catch((error) => {
            console.error("Fetch Error:", error);
        })
    };



function fiveDay(lat, lon) {
    const query2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&date&units=imperial&exclude=hourly,minutely&appid=${apiKey}`;
    fetch(query2)
        .then((forecast) => {
            return forecast.json();
        })
        .then((data) => {
            console.log(data);
            for (let i = 1; i < 6; i++) {
                var listItem= document.createElement("li");
                var imgSrc = `https://openweathermap.org/img/wn/10d@2x.png`;
                fiveDayList.appendChild(listItem);
                var details=`<h3>${moment().add(1, 'days').format('L')}</h3>
                <img>${imgSrc}</img>
                <h3>Temp:   ${data.daily[i].temp.day}°F</h3>
                <h3>Humidity:   ${data.daily[i].humidity}%</h3>
                <h3>Wind Speed:   ${data.daily[i].wind_speed} MPH</h3>`;
                listItem.innerHTML=details;
            }
        });
}

searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    getCurrent(document.querySelector("#input").value);
});

function saveSearch(newCity) {
    var cities=JSON.parse(localStorage.getItem("cities"));
    if (!cities) {
       cities=[]
    }
    cities.push(newCity)
    localStorage.setItem("cities", JSON.stringify(cities))
};

//render search history list
var lastSearch = "";

var renderedCities = () => {
    var cities=JSON.parse(localStorage.getItem("cities"));
    var currentCity = document.querySelector("#input").value;
    $('#recent-searches').empty();
    if (!cities) {
            $('#input').attr("value", "Sacramento");
    } else {
        // $('#input').attr("value", "");
        for (let i = 0; i < cities.length; i++) {
            let city = cities[i];
            let cityE1;
            if(currentCity===""){
                currentCity=lastSearch;
            }
            // if(city === currentCity) {
                // cityE1 = `<button type="button" class="active-display">${city}</button></li>`;
            // }else {
                cityE1 = `<button type="button" class="inactive-display recent-search">${city}</button></li>`;
            // }
            $('#recent-searches').prepend(cityE1);
            document.querySelector(".recent-search").addEventListener("click", function() {
                getCurrent(this.textContent);
            })
        }
    }
};

$('#recent-searches').html(renderedCities);
//saved search button event listener
$("#list-group").on("click", (event) => {
    event.preventDefault();
    $("#search").val();
    getCurrent(event);
});


//clear local storage
$("#clear-history").on("click", (event) => {
    localStorage.clear();
    event.preventDefault();
    renderedCities();
});

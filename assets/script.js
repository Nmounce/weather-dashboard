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

// const displayFive = document.querySelector("#five-day-forecast");

function getCurrent(city) {
    const query = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const append = document.createElement('p');
    saveSearch(city);
    fetch(query)
        .then((data) => {
            return data.json();
        })
        .then((info) => {
            console.log(info);
            fiveDay(info.coord.lat, info.coord.lon);
        })
        .catch((error) => {
            console.error("Fetch Error:", error);
        })
    };



function fiveDay(lat, lon) {
    const query2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${apiKey}`;

    fetch(query2)
        .then((forecast) => {
            return forecast.json();
        })
        .then((data) => {
            console.log(data);
        });
}

searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    getCurrent(document.querySelector("#input").value);
    return getCurrent();
    return fiveDay();
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
            if(city === currentCity) {
                cityE1 = `<button type="button" class="active-display">${city}</button></li>`;
            }else {
                cityE1 = `<button type="button" class="inactive-display">${city}</button></li>`;
            }
            $('#recent-searches').prepend(cityE1);
        }
    }
};

$('#recent-searches').html(renderedCities);
// //saved search button event listener
// $("#list-group").on("click", (event) => {
//     event.preventDefault();
//     $("#search").val();
//     getCurrent(event);
// });


//clear local storage
$("#clear-history").on("click", (event) => {
    localStorage.clear();
    renderedCities();
});

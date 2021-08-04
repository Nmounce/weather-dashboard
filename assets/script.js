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

fetchForecast = function () {
	var endpoint =
		"https://api.openweathermap.org/data/2.5/onecall?lat=38.7267&lon=-9.1403&exclude=current,hourly,minutely,alerts&units=metric&appid={API key}";
	var forecastEl = document.getElementsByClassName("forecast");

	fetch(endpoint)
	.then(function (response) {
		if (200 !== response.status) {
			console.log(
				"Looks like there was a problem. Status Code: " + response.status
			);
			return;
		}

		forecastEl[0].classList.add('loaded');

		response.json().then(function (data) {
			var fday = "";
			data.daily.forEach((value, index) => {
				if (index > 0) {
					var dayname = new Date(value.dt * 1000).toLocaleDateString("en", {
						weekday: "long",
					});
					var icon = value.weather[0].icon;
					var temp = value.temp.day.toFixed(0);
					fday = `<div class="forecast-day">
						<p>${dayname}</p>
						<p><span class="ico-${icon}" title="${icon}"></span></p>
						<div class="forecast-day--temp">${temp}<sup>°C</sup></div>
					</div>`;
					forecastEl[0].insertAdjacentHTML('afterbegin', fday);
				}
			});
		});
	})
	.catch(function (err) {
		console.log("Fetch Error :-S", err);
	});
};
var dayname = new Date(value.dt * 1000).toLocaleDateString(“en”, { weekday: “long”, });

document.addEventListener( 'DOMContentLoaded', function() {
	var weather;

	if ( 'IntersectionObserver' in window ) {
		weather = document.querySelectorAll('.weather');

		var weatherObserver = new IntersectionObserver( function( entries, observer ) {
			entries.forEach( function( entry ) {
				if ( entry.isIntersecting ) {
					if (entry.target.classList.contains('weather')) {
						fetchForecast();
					}
				}
			});
		}, {
			rootMargin: '0px 0px -120px 0px'
		});

		weather.forEach(function (s) {
			weatherObserver.observe(s);
		});
	}
});
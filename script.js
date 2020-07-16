var searchArea = $("#searchArea");
var searchBar = $("#searchBar");
var SearchBarButton = $("#searchBarButton");
var previousSearchesArea = $("#previousSearchesArea");
var currentCityHeader = $("#currentCityHeader");
var weatherDetailsArea = $("#weatherDetailsArea");
var fiveDayForecastArea = $("#fiveDayForecastArea");
var weatherAPIKey = config.MY_KEY;

//Function to round to first decimal place - for temperature.
function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
  }
  
function weatherData(query) {
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + weatherAPIKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var currentCity = response.name;
        var weatherDiv = $("<div class='weather'>");
        var date = new Date(response.dt * 1000).toLocaleDateString("en-US");
        // var iconIs = response.weather.icon;
        // var iconURL = "http://openweathermap.org/img/w/" + iconIs + ".png";
        // console.log(iconURL);
        // var iconImg = $("<img class='weatherIcon'>");
        // iconImg.attr('src', iconURL);
        // var temperature = response.main.temp;
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        tempF = round(tempF, 1);
        var tempSection = $("<p> Temperature: " + tempF + "&#8457;</p>");
        var humidity = response.main.humidity;
        var humiditySection = $("<p> Humidity: " + humidity + "% </p>");
        var windSpeed = response.wind.speed;
        var windSpeedSection = $("<p> Wind Speed: " + windSpeed + "MPH </p>");
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var uvIndexDiv = $("<div id='uvIndex'>");

        // function uvAPICall() {
        //     var uvQueryURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + weatherAPIKey + "&lat=" + lat + "&lon=" + lon;
        //     $.ajax({
        //         url: uvQueryURL,
        //         method: "GET"
        //     }).then(function (uvresponse) {
        //         var uvIndex = uvresponse.value;
        //         uvIndexDiv.text("UV Index: " + uvIndex);
        //         console.log("UV Index: " + uvIndex);
        //     });
        // }
        // uvAPICall();
        currentCityHeader.text(currentCity + " (" + date + ") ");
        weatherDetailsArea.append(weatherDiv);
        weatherDiv.append(tempSection);
        weatherDiv.append(humiditySection);
        weatherDiv.append(windSpeedSection);
        weatherDiv.append(uvIndexDiv);

    });
}

function fiveDayData(query) {
    var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + query + "&appid=" + weatherAPIKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        // Create 5 cards, fill with data
    });
}

SearchBarButton.on("click", function (event) {
    event.preventDefault();
    var thisSearch = searchBar.val().trim();
    weatherDetailsArea.empty();
    fiveDayForecastArea.empty();
    console.log(thisSearch);
    weatherData(thisSearch);
    // fiveDayData(thisSearch);
})

/* PSEUDOCODE:
-weatherData api call function
-5day forecast api call function
-search bar event listener (
    takes userInput and runs both api calls.
    Adds userInput to localStorage.
)

Need coordinates for the UVData(lat, lng). Get coordinates from the first weatherData(query). So calling the UVData function needs to happen inside of the .then part of weatherData.

-previous searches function (getItem from localStorage) (listItem needs the click function bound when each item is created.)
-localStorage setItem array of previous searches
-onPageLoad if there are previous searches in localStorage, use the most recent one to run both api calls

*BONUS* onPageLoad if there are no previous searches in localStorage, use the users current localtion to run both api calls.

*/
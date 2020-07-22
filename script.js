var searchArea = $("#searchArea");
var searchBar = $("#searchBar");
var SearchBarButton = $("#button-addon2");
var previousSearchesArea = $("#previousSearchesArea");
var currentCityHeader = $("#currentCityHeader");
var weatherDetailsArea = $("#weatherDetailsArea");
var fiveDayHeader = $("#fiveDayHeader");
var fiveDayForecastArea = $("#fiveDayForecastArea");
var weatherAPIKey = config.MY_KEY;
var savedSearches = [];

//Function to round to first decimal place - for temperature. - From Jack Moore ("https://www.jacklmoore.com/notes/rounding-in-javascript/")
function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

// $(window).on("load, resize", (function dropdownToggle() {
//     var viewportWidth = $(window).width();
//     if (viewportWidth > 992) {
//         $(".dropdown-menu").addClass("show");
//     }
//     else {
//         $(".dropdown-menu").removeClass("show"); 
//     }
// }));

function weatherData(query) {
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + weatherAPIKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        $("#error").text("");
        var currentCity = response.name;
        var weatherDiv = $("<div class='weather'>");
        var date = new Date((response.dt + response.timezone) * 1000).toLocaleDateString("en-US");
        console.log(date);
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        tempF = round(tempF, 1);
        var tempSection = $("<p> Temperature: " + tempF + "&#8457;</p>");
        var humidity = response.main.humidity;
        var humiditySection = $("<p> Humidity: " + humidity + "% </p>");
        var windSpeed = response.wind.speed;
        var windSpeedSection = $("<p> Wind Speed: " + windSpeed + "MPH </p>");
        var iconIs = response.weather[0].icon;
        var iconURL = "http://openweathermap.org/img/w/" + iconIs + ".png";
        console.log(iconURL);
        var iconImg = $("<img class='weatherIcon'>");
        iconImg.attr('src', iconURL);
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var uvIndexDiv = $("<div id='uvIndex'>");

        function uvAPICall() {
            var uvQueryURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + weatherAPIKey + "&lat=" + lat + "&lon=" + lon;
            $.ajax({
                url: uvQueryURL,
                method: "GET"
            }).then(function (uvresponse) {
                var uvIndex = uvresponse.value;
                uvIndexDiv.text("UV Index: " + uvIndex);
                console.log("UV Index: " + uvIndex);
            });
        }
        uvAPICall();

        currentCityHeader.text(currentCity + " (" + date + ") ");
        currentCityHeader.append(iconImg);
        weatherDetailsArea.append(weatherDiv);
        weatherDiv.append(tempSection);
        weatherDiv.append(humiditySection);
        weatherDiv.append(windSpeedSection);
        weatherDiv.append(uvIndexDiv);
        $("#weatherDetailsArea").css("display", "inline-block");

        saveSearch(currentCity);
    })
        .catch(e => {
            var errorMessage = e.responseJSON.message;
            errorMessage = errorMessage.substr(0, 1).toUpperCase() + errorMessage.substr(1);
            $("#error").text(errorMessage + ".");
        });
}

function fiveDayData(query) {
    var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + query + "&appid=" + weatherAPIKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        fiveDayHeader.text("5 Day Forecast:");
        var cardGroupDiv = $("<div class='card-deck'>");
        fiveDayForecastArea.append(cardGroupDiv);

        for (j = 0; j < response.list.length; j += 8) {
            var card = $("<div class='card text-white bg-primary mb-3' style='min-width: 106px; max-width: 18rem;'>");
            card.attr("data-cardNumber", j);

            var date = new Date((response.list[j].dt + response.city.timezone) * 1000).toLocaleDateString("en-US");
            var cardHeader = $("<div class='card-header forecast-day-header'>").text(date);
            var cardBody = $("<div class='card-body forecast-day'>");
            var dayIcon = response.list[j].weather[0].icon;
            var iconURL = "http://openweathermap.org/img/w/" + dayIcon + ".png";
            var cardIcon = $("<img>").attr("src", iconURL);
            var tempF = (response.list[j].main.temp - 273.15) * 1.80 + 32;
            tempF = round(tempF, 1);
            var cardTemp = $("<p class='card-text'>Temp: " + tempF + "&#8457;</p>");
            var cardHumidity = $("<p class='card-text'>").text("Humidity: " + response.list[j].main.humidity + "%");

            cardGroupDiv.append(card);
            card.append(cardHeader);
            card.append(cardBody);
            cardBody.append(cardIcon);
            cardBody.append(cardTemp);
            cardBody.append(cardHumidity);
        }
    })
}

function pullSearches() {
    if (JSON.parse(localStorage.getItem("savedSearches")) !== null) {
        savedSearches = JSON.parse(localStorage.getItem("savedSearches"));
        previousSearchesArea.empty();
        var searchList = $("<div class='list-group search-list'>");
        // var searchList = $("<div class='dropdown-menu search-list'>");
        // var previousTitle = $("<h3 class='dropdown-header dropdown-toggle' data-toggle='dropdown'> Previous Searches </h3>");
        // searchList.append(previousTitle);
        for (i = 0; i < savedSearches.length; i++) {
            var searchItem = $("<a class='list-group-item list-group-item-action search-list-item'>");
            // var searchItem = $("<a class='dropdown-item search-list-item'>");
            var searchText = savedSearches[i];
            // var searchDivider = $("<div class='dropdown-divider'>");
            searchItem.text(searchText);
            searchItem.on("click", function () {
                runSearch($(this).text());
                $('.active').removeClass('active');
                $(this).addClass("active");
            })
            searchList.append(searchItem);
            // searchList.append(searchDivider);
        }
        var removeButton = $("<a class='list-group-item list-group-item-action search-list-item'>");
        // var removeButton = $("<a class='dropdown-item search-list-item'>");
        removeButton.text("Delete List");
        removeButton.on("click", function () {
            localStorage.removeItem("savedSearches");
            savedSearches = [];
            previousSearchesArea.empty();
        })
        searchList.append(removeButton);
        previousSearchesArea.append(searchList);
    }
}


SearchBarButton.on("click", function (event) {
    event.preventDefault();
    if (searchBar.val().trim() !== "") {
        var thisSearch = searchBar.val().trim();
        console.log(thisSearch);
        runSearch(thisSearch);
        pullSearches();
    }

    else {
        alert("Please enter a valid search.");
    }
    searchBar.val("");
})

//call savesearch from inside of one of the API calls.
function saveSearch(searchValue) {

    if (!savedSearches.includes(searchValue)) {
        savedSearches.unshift(searchValue);
        console.log(savedSearches);
    }
    localStorage.setItem("savedSearches", JSON.stringify(savedSearches));
    pullSearches();
}

function runSearch(thisSearch) {
    weatherDetailsArea.empty();
    fiveDayForecastArea.empty();
    console.log(thisSearch);
    weatherData(thisSearch);
    fiveDayData(thisSearch);
}

function init() {
    pullSearches();
    var initSearch = savedSearches[0];
    if (initSearch) { runSearch(initSearch); }
}

init();

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
var searchArea = $("#searchArea");
var searchBar = $("#searchBar");
var previousSearchesArea = $("#previousSearchesArea");
var currentCityHeader = $("currentCityHeader");
var weatherDetailsArea = $("weatherDetailsArea");
var fiveDayForecastArea = $("fiveDayForecastArea");
var weatherAPIKey = config.MY_KEY;
var thisSearch = searchBar.val().trim();

function weatherData() {
    var queryURL = "api.openweathermap.org/data/2.5/weather?q=" + thisSearch + "&appid=" + weatherAPIKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

    });
}

function fiveDayData(){
    var queryURL = "api.openweathermap.org/data/2.5/forecast?q=" + thisSearch + "&appid=" + weatherAPIKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

    });
}

/* PSEUDOCODE:
-weatherData api call function
-5day forecast api call function
-search bar event listener (
    takes userInput and runs both api calls. 
    Adds userInput to localStorage.
)
-previous searches function (getItem from localStorage)
-localStorage setItem array of previous searches
-onPageLoad if there are previous searches in localStorage, use the most recent one to run both api calls

*BONUS* onPageLoad if there are no previous searches in localStorage, use the users current localtion to run both api calls.

*/
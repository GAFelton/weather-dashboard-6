var searchArea = $("#searchArea");
var searchBar = $("#searchBar");
var previousSearchesArea = $("#previousSearchesArea");
var currentCityHeader = $("#currentCityHeader");
var weatherDetailsArea = $("#weatherDetailsArea");
var fiveDayForecastArea = $("#fiveDayForecastArea");
var weatherAPIKey = config.MY_KEY;


function weatherData(query) {
    var queryURL = "api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + weatherAPIKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

    });
}

function fiveDayData(query){
    var queryURL = "api.openweathermap.org/data/2.5/forecast?q=" + query + "&appid=" + weatherAPIKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
 // Create 5 cards, fill with data
    });
}

searchBar.on("submit", function(event){
    event.preventDefault();
    var thisSearch = searchBar.val().trim();
    weatherData(thisSearch);
    fiveDayData(thisSearch);
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
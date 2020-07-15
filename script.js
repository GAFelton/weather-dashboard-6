var searchArea = $("#searchArea");
var searchBar = $("#searchBar");
var previousSearchesArea = $("#previousSearchesArea");
var currentCityHeader = $("currentCityHeader");
var weatherDetailsArea = $("weatherDetailsArea");
var fiveDayForecastArea = $("fiveDayForecastArea");

function weatherData() {
    var thisSearch = searchBar.val().trim();
    var queryURL = "api.openweathermap.org/data/2.5/weather?q=" + thisSearch + "&appid=" + config.MY_KEY;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

    });
}
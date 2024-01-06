import { api_key } from "../config.js"; 
import { todayWeather, todayForecast, weekForecast } from "../mockdata.js"; 

const Days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

let pair; 
let today;
let measure = "imperial"; 

// sets up the icon representing the weather 
const setIcon = (iconElement, weather) => { 
    switch (weather) {
        case "clear sky": 
            iconElement.className   = "wi wi-day-sunny";
            iconElement.style.color = "yellow";  
            break; 
        case "sky is clear":
            iconElement.className   = "wi wi-day-sunny"; 
            iconElement.style.color = "yellow"; 
            break; 
        case "few clouds": 
            iconElement.className   = "wi wi-day-cloudy"; 
            iconElement.style.color = "#c7c4bf"; 
            break; 
        case "scattered clouds": 
            iconElement.className   = "wi wi-cloud"; 
            iconElement.style.color = "#c7c4bf"; 
            break; 
        case "broken clouds": 
            iconElement.className   = "wi wi-cloudy"; 
            iconElement.style.color = "#c7c4bf"; 
            break; 
        case "overcast clouds": 
            iconElement.className   = "wi wi-cloudy"; 
            iconElement.style.color = "#c7c4bf"; 
            break; 
        case "shower rain":
            iconElement.className = "wi wi-day-rain"; 
            break; 
        case "rain":
            iconElement.className = "wi wi-day-thunderstorm"; 
            break; 
        case "moderate rain": 
            iconElement.className = "wi wi-rain"; 
            break; 
        case "light rain":
            iconElement.className = "wi wi-raindrops"; 
            break; 
        case "heavy intensity rain": 
            iconElement.className = "wi wi-showers"; 
            break; 
        case "rain and snow": 
            iconElement.className = "wi wi-rain-mix"; 
            break; 
        case "thunderstorm": 
            iconElement.className = "wi wi-thunderstorm"; 
            break; 
        case "snow": 
            iconElement.className = "wi wi-snow";
            break; 
        case "mist": 
            iconElement.className = "wi wi-fog"; 
    };
};

// sets up time and location of the weather 
const setInfo = (city) => {
    const date = new Date(Date.now()); 
    const locElement  = document.querySelector('.currentGeo h1'); 
    const dateElement = document.querySelector('.currentGeo h3'); 

    locElement.textContent  = `${city}`; 
    dateElement.textContent = (date.toLocaleTimeString().length % 2 === 0) ? 
    (`${Days[date.getDay()]} ${date.toLocaleTimeString().substring(0, 4)} 
    ${date.toLocaleTimeString().substring(8, date.toLocaleTimeString().length)}`) : 
    (`${Days[date.getDay()]} ${date.toLocaleTimeString().substring(0, 5)} 
    ${date.toLocaleTimeString().substring(9, date.toLocaleTimeString().length)}`);
}; 

// sets up main stats regarding today's weather 
const setTemp = (metric, temp, maxTemp, minTemp) => {
    const tempElement   = document.querySelector('.tempNum h1'); 
    const minMaxElement = document.querySelector('.tempNum h6'); 

    (metric === "imperial") ? 
    tempElement.textContent = Math.round(temp) + "\u00b0" + "F": 
    tempElement.textContent = Math.round(temp) + "\u00b0" + "C";
    
    (metric === "imperial") ? 
    minMaxElement.textContent = `${Math.round(maxTemp)}` + "\u00b0" + ` / ` + 
    `${Math.round(minTemp)}`+ "\u00b0" : 
    minMaxElement.textContent = `${Math.round(maxTemp)}` + "\u00b0" + ` / ` + 
    `${Math.round(minTemp)}` + "\u00b0";  
}; 
 
// sets up additional climate statistics for the current day 
const setStats = (type, windSpeed, data, humidity, cloudiness) => {  
    const windElement     = document.querySelector(".windSpeed"); 
    const rainElement     = document.querySelector('.rainVolume'); 
    const humidityElement = document.querySelector(".humidity");
    const precipitation   = (data.rain ? data.rain : (data.snow ? data.snow : null)); 
    const cloudyElement   = document.querySelector(".cloudiness"); 

    windElement.textContent     = `${Math.round(windSpeed)} mph`; 
    humidityElement.textContent = `${humidity}%`; 
    rainElement.textContent     = ((type === "daily" && precipitation) ? `${precipitation["1h"]}mm` : 
                                   ((type === "week" && precipitation) ? `${data.rain} mm` : `0 mm`));
    cloudyElement.textContent   = `${cloudiness}%`; 
}; 

// sets up climate highlights 
const setHighlights = (feelsLike, visibility, sunriseTime, sunsetTime) => {
    const sunrise = new Date(sunriseTime * 1000).toLocaleTimeString(); 
    const sunset  = new Date(sunsetTime * 1000).toLocaleTimeString(); 

    const feelsElement   = document.querySelector(".feelslike h4"); 
    const visibleElement = document.querySelector(".visible h4");  
    const sunriseElement = document.querySelector(".sunrise h4"); 
    const sunsetElement  = document.querySelector(".sunset h4"); 

    feelsElement.textContent    = `${Math.round(feelsLike)}` + "\u00b0"; 
    (visibility === "???") ? 
    (visibleElement.textContent = "???") : 
    (visibleElement.textContent = `${((visibility / 1000) / 1.609).toFixed(1)} mi`); 
    sunriseElement.textContent  = (sunrise.length % 2 === 0) ? 
    (`${sunrise.substring(0, 4)} ${sunrise.substring(8, sunrise.length)}`) : 
    (`${sunrise.substring(0, 5)} ${sunrise.substring(9, sunrise.length)}`);
    sunsetElement.textContent   = (sunset.length % 2 === 0) ? 
    (`${sunset.substring(0, 4)} ${sunset.substring(8, sunset.length)}`) : 
    (`${sunset.substring(0, 5)} ${sunset.substring(9, sunset.length)}`); 
}; 

// sets up the daily forecast 
const setDaily = (dailyInfo) => {
    const forecastElement = document.querySelector('.dailyForecast'); 

    dailyInfo.forEach((info, i) => {
        const hourlyForecast = document.createElement('div'); 
        const iconElement    = document.createElement('i'); 
        const timeElement    = document.createElement('h4'); 
        const tempElement    = document.createElement('h4'); 

        const time        = new Date(info.dt * 1000); 
        const description = info.weather[0].description; 

        setIcon(iconElement, description); 
        hourlyForecast.className = "hourlyForecast"; 

        if (i === 0) {
            timeElement.textContent = "Now"; 
        } else {
            timeElement.textContent  = (time.toLocaleTimeString().length % 2 === 0) ? 
            (`${time.toLocaleTimeString().substring(0, 4)} 
            ${time.toLocaleTimeString().substring(8, time.toLocaleTimeString().length)}`) : 
            (`${time.toLocaleTimeString().substring(0, 5)} 
            ${time.toLocaleTimeString().substring(9, time.toLocaleTimeString().length)}`); 
        } 
        
        tempElement.textContent = Math.round(info.main.temp) + "\u00b0"; 

        hourlyForecast.appendChild(timeElement); 
        hourlyForecast.appendChild(iconElement); 
        hourlyForecast.appendChild(tempElement);
        forecastElement.appendChild(hourlyForecast); 
    }); 
}; 

// sets up the weekly forecast weather 
const setWeekly = (weekInfo) => {
    const forecastElement = document.querySelector(".forecastWeather"); 

    weekInfo.forEach((daily, idx) => {
        const container   = document.createElement("div");
        const icon        = document.createElement("i"); 
        const day         = document.createElement("h4"); 
        const temp        = document.createElement("h4");
        const description = daily.weather[0].description; 

        container.className = "forecastDay"; 
        temp.className      = "forecastTemp"; 

        setIcon(icon, description); 
        (idx === 0) ? day.textContent = "Today" :  
        (day.textContent = `${Days[new Date(daily.dt * 1000).getDay()]}`);
        temp.textContent = `${Math.round(daily.temp.max) + "\u00b0"} / ${Math.round(daily.temp.min) + "\u00b0"}`;

        container.appendChild(day);
        container.appendChild(icon);
        container.appendChild(temp);
        forecastElement.appendChild(container); 
    }); 
}; 

// to allow the UI display the projected weather for the hour within the day 
const showHourlyForecast = (metric) => {
    const dailyContainer = document.querySelector(".dailyForecast");

    dailyContainer.addEventListener("click", () => {
        dailyContainer.childNodes.forEach((forecast) => {
            forecast.addEventListener("click", () => {
                const date           = new Date(Date.now()); 
                const tempElement    = document.querySelector(".tempNum h1"); 
                const dateElement    = document.querySelector(".currentGeo h3");
                const labelElement   = document.querySelector(".otherStats h4"); 
                const iconElement    = document.querySelector(".currentTempInfo i");
                const newTempElement = forecast.childNodes[2].textContent; 

                iconElement.className   = `${forecast.childNodes[1].className} weather-icon`;
                iconElement.style.color = forecast.childNodes[1].style.color; 

                (metric === "imperial") ? 
                tempElement.textContent = newTempElement + "F" : 
                tempElement.textContent = newTempElement + "C"; 
                
                dateElement.textContent = (forecast.childNodes[0].textContent !== "Now") ? 
                `${Days[date.getDay()]} ${forecast.childNodes[0].textContent}` :
                ((date.toLocaleTimeString().length % 2 === 0) ? 
                (`${Days[date.getDay()]} ${date.toLocaleTimeString().substring(0, 4)} 
                ${date.toLocaleTimeString().substring(8, date.toLocaleTimeString().length)}`) : 
                (`${Days[date.getDay()]} ${date.toLocaleTimeString().substring(0, 5)} 
                ${date.toLocaleTimeString().substring(9, date.toLocaleTimeString().length)}`));

                if (labelElement.textContent !== "Today's Highlights") {
                    const flag          = "daily"; 
                    const minMaxElement = document.querySelector(".tempNum h6");  
                    
                    labelElement.textContent  = "Today's Highlights"; 
                    minMaxElement.textContent = `${Math.round(today.main.temp_max)}` + "\u00b0" + " / " + `${Math.round(today.main.temp_min)}` + "\u00b0";   
                    setStats(flag, today.wind.speed, today, today.main.humidity, today.clouds.all);
                    setHighlights(today.main.feels_like, today.visibility, today.sys.sunrise, today.sys.sunset);
                }
            });
        }); 
    }); 
}; 

const weeklyForecastTodayHelper = (date, flag, Days, today, labelElement, dayElement) => {
    labelElement.textContent  = "Today's Highlights"; 
    dayElement.textContent    = (date.toLocaleTimeString().length % 2 === 0) ? 
    (`${Days[date.getDay()]} ${date.toLocaleTimeString().substring(0, 4)} 
    ${date.toLocaleTimeString().substring(8, date.toLocaleTimeString().length)}`) : 
    (`${Days[date.getDay()]} ${date.toLocaleTimeString().substring(0, 5)} 
    ${date.toLocaleTimeString().substring(9, date.toLocaleTimeString().length)}`);
    setTemp(measure, today.main.temp, today.main.temp_max, today.main.temp_min); 
    setStats(flag, today.wind.speed, today, today.main.humidity, today.clouds.all);
    setHighlights(today.main.feels_like, today.visibility, today.sys.sunrise, today.sys.sunset);
}; 

const weeklyForecastOtherHelper = (forecast, i, flag, data, min, max, dayTitle, labelElement, dayElement) => {
    labelElement.textContent  = `${dayTitle}'s Highlights`; 
    dayElement.textContent    = forecast.childNodes[0].textContent; 
    setTemp(measure, parseInt(max), parseInt(max), parseInt(min));  
    setStats(flag, data[i-1].speed, data[i-1], data[i-1].humidity, data[i-1].clouds); 
    setHighlights(Math.round((data[i-1].feels_like["day"] + 
    data[i-1].feels_like["night"] + data[i-1].feels_like["eve"] + 
    data[i-1].feels_like["morn"]) / 4), "???", data[i-1].sunrise, data[i-1].sunset);
}; 

// to allow the UI display the projected weather for the day within the week 
const showWeeklyForecast = (data) => {
    const forecastElement = document.querySelector(".forecastWeather"); 

    forecastElement.addEventListener("click", () => {
        const dayElement   = document.querySelector(".currentGeo h3"); 
        const iconElement  = document.querySelector(".currentTempInfo i");  
        const labelElement = document.querySelector(".otherStats h4");
        
        forecastElement.childNodes.forEach((forecast, i) => {
            forecast.addEventListener("click", () => {
                const max = forecast.childNodes[2].textContent.split("/")[0];
                const min = forecast.childNodes[2].textContent.split("/")[1];  

                if (forecast.childNodes[0].textContent === "Today") {
                    const flag = "daily";
                    const date = new Date(Date.now());                                                                                       

                    weeklyForecastTodayHelper(date, flag, Days, today, labelElement, dayElement);

                } else {
                    const flag = "week"; 

                    weeklyForecastOtherHelper(forecast, i, flag, data, min, max, 
                    forecast.childNodes[0].textContent, labelElement, dayElement); 
                }

                iconElement.className     = `${forecast.childNodes[1].className} weather-icon`;   
                iconElement.style.color   = forecast.childNodes[1].style.color; 
            }); 
        }); 
    }); 
}; 

// requests data from openweatherAPI for current day's weather and climate 
const currentWeather = (key, proxy, lat, lon, city) => {
    const weatherEndpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=${measure}&cnt=7`;

    fetch(proxy + weatherEndpoint, {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => {
        return res.json(); 

    }).then(data => { 
        const flag        = "daily";  
        const description = data.weather[0].description; 
        const iconElement = document.querySelector(".currentTempInfo i"); 

        setInfo(city); 
        setIcon(iconElement, description); 
        setTemp(measure, data.main.temp, data.main.temp_max, data.main.temp_min); 
        setStats(flag, data.wind.speed, data, data.main.humidity, data.clouds.all); 
        setHighlights(data.main.feels_like, data.visibility, data.sys.sunrise, data.sys.sunset); 

        iconElement.className = `${iconElement.className} weather-icon`; 
        today = data; 

        console.log(data); 

    }).catch(error => console.log(error)); 
};

// requests data from openweatherAPI for forecast of today's weather for each hour 
const dailyForecast = (key, proxy, lat, lon) => {
    const forecastEndpoint = `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${lat}&lon=${lon}&appid=${key}&cnt=7&units=${measure}`; 
    
    fetch(proxy + forecastEndpoint, {
        method: "GET", 
        headers: {
            "Content-Type": "application/json", 
        }
    }).then(res => {
        return res.json(); 
    }).then(data => {
        const dailyInfo = data.list;

        setDaily(dailyInfo); 
        showHourlyForecast(measure); 
        
    }).catch(error => console.log(error));  
};

// requests data from openweatherAPI for forecast of this week's weather 
const weeklyForecastWeather = (key, proxy, lat, lon) => {
    const forecastEndpoint = `api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=7&appid=${key}&units=${measure}`;
    
    fetch(proxy + forecastEndpoint, {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json', 
            }
        }).then(res => {
            return res.json(); 
    }).then(data => {
        const weekInfo = data.list; 

        setWeekly(weekInfo); 
        showWeeklyForecast(weekInfo); 

    }).catch(error => console.log(error)); 
}; 

// initializes data call for weather board and loads it onto the UI of the specific town requested 
const callWeatherData = (city, state) => {
    const key = api_key; 
    const proxy = "https://cors-anywhere.herokuapp.com/";
    const locEndpoint = `http://api.openweathermap.org/geo/1.0/direct?q=${city}, ${state},US&appid=${key}`;

    fetch(proxy + locEndpoint, {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json', 
        }
    }).then(res => {
        return res.json(); 
    }).then(data => {
        const lat = data[0].lat; 
        const lon = data[0].lon; 

        // request data for specific statistics 
        currentWeather(key, proxy, lat, lon, city); 
        dailyForecast(key, proxy, lat, lon); 
        weeklyForecastWeather(key, proxy, lat, lon); 

    }).catch(error => console.log(error)); 
}; 

// searching option for data of weather for a specific inputted with regards to the format "City, State"
const searchLocation = () => {
    const formElement = document.querySelector('.inputWrapper'); 

    formElement.addEventListener('submit', (e) => {
        const locationValue = document.querySelector(".addLocation").value; 
        pair = {"city": locationValue.split(",")[0], "state": locationValue.split(",")[1].trim()}; 

        e.preventDefault(); 

        clear(); 
        callWeatherData(pair["city"], pair["state"]); 
        document.querySelector(".addLocation").value = ""; 
    }); 
}; 

// must clear data before if there was any so the UI does not get conflicted for DOM nodes that are appended
const clear = () => {
    const dailyForecast  = document.querySelector(".dailyForecast"); 
    const weeklyForecast = document.querySelector(".forecastWeather"); 

    while (dailyForecast.firstChild || weeklyForecast.firstChild) {
        if (dailyForecast.firstChild) dailyForecast.firstChild.remove(); 
        
        if (weeklyForecast.firstChild) weeklyForecast.firstChild.remove(); 
    }
}; 

const switchMetrics = () => {
    const fahrenheitElement = document.querySelector(".wi-fahrenheit");
    const celsiusElement    = document.querySelector(".wi-celsius"); 

    fahrenheitElement.addEventListener("click", () => {
        if (measure === "metric") {
            measure = "imperial";

            clear(); 
            callWeatherData(pair["city"], pair["state"]); 
        }
    }); 

    celsiusElement.addEventListener("click", () => {
        if (measure === "imperial") {
            measure = "metric"; 

            clear(); 
            callWeatherData(pair["city"], pair["state"]);  
        }
    }); 
}; 

const mock = () => {
    const flag        = "daily"; 
    const description = todayWeather.weather[0].description; 
    const iconElement = document.querySelector(".currentTempInfo i"); 
    today = todayWeather; 

    setIcon(iconElement, description); iconElement.className = `${iconElement.className} weather-icon`;
    setInfo(todayWeather.name); 
    setTemp(measure, todayWeather.main.temp, todayWeather.main.temp_max, todayWeather.main.temp_min); 
    setStats(flag, todayWeather.wind.speed, todayWeather, todayWeather.main.humidity, todayWeather.clouds.all); 
    setHighlights(todayWeather.main.feels_like, todayWeather.visibility, todayWeather.sys.sunrise, todayWeather.sys.sunset);
    setDaily(todayForecast); 
    setWeekly(weekForecast);
    showHourlyForecast(measure); 
    showWeeklyForecast(weekForecast); 
    switchMetrics(); 
}; 

mock(); 
searchLocation(); 



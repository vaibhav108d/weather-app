document.addEventListener("DOMContentLoaded", () => {

    const cityInput = document.getElementById("input-city");
    const getWeatherBtn = document.getElementById("get-weather-btn");
    const weatherInfo = document.getElementById("weather-info");
    const cityNameDisplay = document.getElementById("city-name");
    const temperatureDisplay = document.getElementById("temperature");
    const descriptionDisplay = document.getElementById("description");
    const errorMessage = document.getElementById("error-message");

    const API_KEY = "8c697070f5e1007c026bb3061185e109"; //env variables(it should be hidden,like password)
    getWeatherBtn.addEventListener("click", async () => {
        const city = cityInput.value.trim();
        if (!city) return;

        try {
            const weatherData = await fetchWeatherData(city); //fetchWeatherData is a function that fetches weather data from an API,asynchronously
            await displayWeatherData(weatherData);
        }
        catch (error) {
            showError();
        }

    });

    async function fetchWeatherData(city) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
        
        const response= await fetch(url);
        console.log(typeof response);
        console.log("Response",response);

        if(!response.ok){
            throw new Error("City not found");
        }

        const data = await response.json(); //convert the response to JSON,takes time
        return data;
    }

    async function getCountryInfo(code) {
        try {
            const url = `https://restcountries.com/v3.1/alpha/${code}`;
            const response = await fetch(url);
            const data = await response.json();
            console.log("Country Data", data);
    
            return {
                name: data[0]?.name?.common || "Unknown Country",
                flag: data[0]?.flags?.svg || "" // Use SVG flag URL
            };
        } catch (error) {
            return { name: "Unknown Country", flag: "" };
        }
    }

    async function displayWeatherData(data) {
        console.log(data);
        const {name,main,weather,sys}=data;// distructuring the data
        try {
            const Cinfo = await getCountryInfo(sys.country);
            cityNameDisplay.innerHTML = `${name}, ${Cinfo.name} `; // Display city name and country name
            cityNameDisplay.innerHTML += `
            <img src="${Cinfo.flag}" alt="${Cinfo.name} Flag" width="30" height="20" style="vertical-align: middle;">`;
        } catch (error) {
            cityNameDisplay.textContent = `${name}, Unknown Country`; 
        }
        temperatureDisplay.textContent = `🌡️ Temperature: ${main.temp} °C`;
        descriptionDisplay.textContent=`${getWeatherEmoji(weather[0].description)} Weather: ${weather[0].description}`; 

        weatherInfo.classList.remove("hidden"); //unlock the display
        errorMessage.classList.add("hidden"); //hide the error message

    }
    function showError() {
        weatherInfo.classList.add("hidden");
        errorMessage.classList.remove("hidden");
    }

    function getWeatherEmoji(description) {
        const weatherIcons = {
            "clear sky": "☀️",
            "few clouds": "🌤️",
            "scattered clouds": "⛅",
            "broken clouds": "☁️",
            "overcast clouds": "☁️",
            "shower rain": "🌦️",
            "rain": "🌧️",
            "thunderstorm": "⛈️",
            "snow": "❄️",
            "mist": "🌫️"
        };
        
        return weatherIcons[description.toLowerCase()] || "🌍"; // Default icon
    }
});
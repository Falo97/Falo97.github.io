const API_KEY = "fedb8b6ae6307c0052e102f69852bb77";

const getWeatherBtn = document.getElementById("getWeatherBtn");
const cityInput = document.getElementById("cityInput");
const resultsArea = document.getElementById("resultsArea");
const currentWeatherBox = document.getElementById("currentWeatherBox");
const forecastBox = document.getElementById("forecastBox");

getWeatherBtn.addEventListener("click", () => {
  const cityName = cityInput.value.trim();
  if (!cityName) {
    alert("Proszę wpisać nazwę miejscowości!");
    return;
  }

  currentWeatherBox.innerHTML = "";
  forecastBox.innerHTML = "";

  resultsArea.classList.remove("hidden");

  fetchCurrentWeatherXHR(cityName);
  fetchForecastFetchAPI(cityName);
});

function fetchCurrentWeatherXHR(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pl`;

  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);

  xhr.onload = function () {
    if (xhr.status === 200) {
      const responseData = JSON.parse(xhr.responseText);
      console.log("XHR Current Weather Response:", responseData);
      renderCurrentWeather(responseData);
    } else {
      console.error("Błąd XHR:", xhr.statusText);
      currentWeatherBox.innerHTML = `<p>Nie znaleziono danych dla miasta ${city}.</p>`;
    }
  };

  xhr.onerror = function () {
    console.error("Błąd połączenia XHR");
  };

  xhr.send();
}

function fetchForecastFetchAPI(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pl`;

  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error("Błąd sieci w Fetch API");
      return res.json();
    })
    .then((responseData) => {
      console.log("Fetch Forecast Response:", responseData);
      renderForecast(responseData);
    })
    .catch((err) => {
      console.error("Błąd Fetch:", err);
      forecastBox.innerHTML = `<p>Błąd podczas pobierania prognozy.</p>`;
    });
}

function renderCurrentWeather(data) {
  const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  currentWeatherBox.innerHTML = `
        <div class="current-card">
            <img src="${icon}" alt="${data.weather[0].description}">
            <div>
                <div class="current-temp">${Math.round(data.main.temp)}°C</div>
                <p><strong>Odczuwalna:</strong> ${Math.round(data.main.feels_like)}°C</p>
                <p><strong>Opis:</strong> ${data.weather[0].description}</p>
                <p><strong>Ciśnienie:</strong> ${data.main.pressure} hPa | <strong>Wilgotność:</strong> ${data.main.humidity}%</p>
            </div>
        </div>
    `;
}

function renderForecast(data) {
  forecastBox.innerHTML = "";
  const dailyList = data.list.filter((_, index) => index % 8 === 0);

  dailyList.forEach((item) => {
    const dateStr = new Date(item.dt_txt).toLocaleDateString("pl-PL", {
      weekday: "short",
      day: "numeric",
      month: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;

    const card = document.createElement("div");
    card.className = "forecast-card";
    card.innerHTML = `
            <p><strong>${dateStr}</strong></p>
            <img src="${icon}" alt="${item.weather[0].description}">
            <div class="forecast-temp">${Math.round(item.main.temp)}°C</div>
            <p style="font-size: 0.85rem; color: #475569;">${item.weather[0].description}</p>
        `;
    forecastBox.appendChild(card);
  });
}

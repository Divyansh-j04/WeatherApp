const apiKey = '786340dc6e59016a0c8f09195524f6a3';
        let currentUnit = 'metric';

        document.getElementById('search-btn').addEventListener('click', getWeather);
        document.getElementById('location-btn').addEventListener('click', getCurrentLocation);

        function getCurrentLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    const { latitude, longitude } = position.coords;
                    fetchWeatherByCoordinates(latitude, longitude);
                }, () => {
                    showError("Unable to retrieve your location.");
                });
            } else {
                showError("Geolocation is not supported by this browser.");
            }
        }

        function fetchWeatherByCoordinates(lat, lon) {
            showSpinner(); // Show spinner
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${currentUnit}&appid=${apiKey}`)
                .then(response => {
                    if (!response.ok) throw new Error('Unable to retrieve weather data');
                    return response.json();
                })
                .then(data => {
                    updateWeatherInfo(data);
                    hideSpinner(); // Hide spinner
                })
                .catch(error => {
                    showError(error.message);
                    hideSpinner(); // Hide spinner
                });
        }

        function getWeather() {
            const city = document.getElementById('city-input').value;
            if (!city) {
                showError("Please enter a city name.");
                return;
            }

            showSpinner(); // Show spinner
            clearError();

            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${currentUnit}&appid=${apiKey}`)
                .then(response => {
                    if (!response.ok) throw new Error('City not found');
                    return response.json();
                })
                .then(data => {
                    updateWeatherInfo(data);
                    getUVIndex(data.coord.lat, data.coord.lon);
                    hideSpinner(); // Hide spinner
                })
                .catch(error => {
                    showError(error.message);
                    hideSpinner(); // Hide spinner
                });
        }

        function updateWeatherInfo(data) {
            const temperature = Math.round(data.main.temp);
            document.getElementById('location').innerText = `${data.name}, ${data.sys.country}`;
            document.getElementById('temperature').innerText = `${temperature}°`;
            document.getElementById('weather-icon').src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
            document.getElementById('conditions').innerText = data.weather[0].description;
            document.getElementById('wind-speed').innerText = data.wind.speed;
            document.getElementById('pressure').innerText = data.main.pressure;
            document.getElementById('humidity').innerText = data.main.humidity;
            document.getElementById('air-quality').innerText = "Good"; // Placeholder, update as needed
            document.getElementById('visibility').innerText = (data.visibility / 1000).toFixed(1);
            document.getElementById('feels-like').innerText = Math.round(data.main.feels_like);
            document.getElementById('cloudiness').innerText = data.clouds.all;
            document.getElementById('sunrise').innerText = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
            document.getElementById('sunset').innerText = new Date(data.sys.sunset * 1000).toLocaleTimeString();
            document.getElementById('last-updated-time').innerText = new Date().toLocaleTimeString();

            // Change background based on temperature
            changeBackground(temperature);
        }

        function changeBackground(temperature) {
            let backgroundImage = '';

            if (temperature < 0) {
                backgroundImage = "url('snow.jpg')";
            } else if (temperature < 15) {
                backgroundImage = "url('snow.jpg')";
            } else if (temperature < 25) {
                backgroundImage = "url('clouds.jpg')";
            } else if (temperature < 35) {
                backgroundImage = "url('clouds.jpg')";
            } else {
                backgroundImage = "url('clouds.jpg')";
            }

            document.body.style.backgroundImage = backgroundImage;
        }

        function getUVIndex(lat, lon) {
            fetch(`https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`)
                .then(response => response.json())
                .then(data => {
                    document.getElementById('uv-index').innerText = data.value;
                });
        }

        function showError(message) {
            const errorMessage = document.getElementById('error-message');
            errorMessage.innerText = message;
            errorMessage.style.display = 'block';
        }

        function clearError() {
            document.getElementById('error-message').style.display = 'none';
        }

        function showSpinner() {
            document.getElementById('spinner').style.display = 'block';
            document.getElementById('loading').style.display = 'none'; // Hide loading text
        }

        function hideSpinner() {
            document.getElementById('spinner').style.display = 'none';
            document.getElementById('loading').style.display = 'none'; // Hide loading text
        }

        // Fetch weather for current location on load
        getCurrentLocation();
const weatherApp = (() => {

    const api = (() => {
        const url = 'https://api.openweathermap.org/data/2.5/weather?';
        const key = '&appid=f678ae60b86c68b4d4cacf324164f592';

        return { url, key };
    })();

    document.querySelector('button').addEventListener('click', (event) => {
        let userData, dataStr;

        userData = collectUserData();
        if (userData.zip || userData.city) {
            dataStr = processUserData(userData);

            if (dataStr) {
                fetchWeatherData(dataStr, displayWeatherData);
            }
        } else {
            alert('Enter a city or a zip code.');
        }
        
        event.preventDefault();
        document.querySelector('form').reset();
    })

    function collectUserData() {
        const city = document.querySelector('#city').value,
              zip = document.querySelector('#zip').value;

        return { city, zip };
    }

    function processUserData(obj) {
        let locationStr;

        if (obj.zip) {
            locationStr = 'zip=' + obj.zip;
        } else if (obj.city) {
            locationStr = 'q=' + obj.city + ',us';
        }

        return locationStr;
    }

    function fetchWeatherData(location, func = (data) => {alert(data)}) {
        fetch(api.url + location + api.key)
        .then((data) => {
            return data.json();
        })
        .then((json) => {
            func(json);
        })
        .catch((err) => {
            func(null);
        });
    }

    function displayWeatherData(obj) {
        const container = document.querySelector('#results');

        removeSearchResults(container);

        if (obj) {
            const city = document.createElement('h2'),
                  weather = document.createElement('h3'),
                  temp = document.createElement('h3'),
                  feelsLike = document.createElement('h3'),
                  returnBtn = document.createElement('button');
            let bool1, bool2;

            city.innerHTML = "Today's weather in " + obj.name;
            weather.innerHTML = obj.weather[0].main;
            temp.innerHTML = 'Temperature: ' + toFahrenheit(obj.main.temp) + 'F';
            feelsLike.innerHTML = 'Feels like: ' + toFahrenheit(obj.main.feels_like) + 'F';
            returnBtn.innerHTML = 'Return to search';

            temp.addEventListener('click', () => {
                temp.innerHTML = bool1 ?
                    'Temperature: ' + toFahrenheit(obj.main.temp) + 'F' :
                    'Temperature: ' + toCelsius(obj.main.temp) + 'C'

                bool1 = !bool1;
            });

            feelsLike.addEventListener('click', () => {
                feelsLike.innerHTML = bool2 ?
                    'Feels like: ' + toFahrenheit(obj.main.feels_like) + 'F' :
                    'Feels like: ' + toCelsius(obj.main.feels_like) + 'C'

                bool2 = !bool2;
            });

            returnBtn.addEventListener('click', () => {
                toggleForm();
                removeSearchResults(container);
            });

            toggleForm();
            container.append(city, weather, temp, feelsLike, returnBtn);
        } else {
            alert('Location was not found. Please try again.');
        }
        
    }

    function toFahrenheit(val) {
        return Math.floor((val - 273.15) * 9 / 5 + 32);
    }

    function toCelsius(val) {
        return Math.floor(val - 273.15);
    }

    function toggleForm() {
        document.querySelector('form').classList.toggle('hide');
    }

    function removeSearchResults(node) {
        if (node.childNodes.length) {
            Array.from(node.childNodes).forEach((child) => {
                child.remove();
            });
        }
    }
})();
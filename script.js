(function weatherApp() {
    const url = 'https://api.openweathermap.org/data/2.5/weather?';
    const apiKey = '&appid=f678ae60b86c68b4d4cacf324164f592';

    document.querySelector('button').addEventListener('click', (event) => {
        let userData, dataStr, weatherData;

        userData = collectUserData();
        if (userData.zip || userData.city) {
            dataStr = processUserData(userData);

            if (dataStr) {
                fetchWeatherData(dataStr);
            }
        } else {
            alert('Enter a city or a zip code.');
        }
        
        event.preventDefault();
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

    function fetchWeatherData(location, func = (data) => {console.log(data)}) {
        fetch(url + location + apiKey)
        .then((data) => {
            return data.json();
        })
        .then((json) => {
           func(json);
        })
        .catch((err) => {
            throw err;
        });
    }
})();
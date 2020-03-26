var map = null;

window.addEventListener('load', (event) => {
    map = L.map('mapid');
    if ("geolocation" in navigator) {
        console.log('geolocation available.');
    
        navigator.geolocation.getCurrentPosition(position => {
            updateMap(position.coords);
        });
    
    
    } else {
        console.log('geolocation is not available.');
    }
  });

async function updateMap(coords) {
    map.setView([coords.latitude, coords.longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var myIcon = L.icon({
        iconUrl: 'icon_faces.png',
        iconSize: [50, 50],
        iconAnchor: [25, 25],
    });

    const marker = L.marker([0, 0], { icon: myIcon }).addTo(map)
        .bindPopup('Jij bent hier.')
        .openPopup();

    const lat = coords.latitude;
    const lon = coords.longitude;

    marker.setLatLng([lat, lon]);
    map.setView([lat, lon], 13);
}


async function checkin() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const data = { lat, lon };
            const options = {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            }
            const response = await fetch('/checkin', options);
            const jsonData = await response.json();
            console.log(jsonData);
            const summary = jsonData.weather;
            const temperature = jsonData.temperature;
            temperatureC = (temperature - 32) * 5 / 9;
            document.getElementById("lat").textContent = lat.toFixed(2);
            document.getElementById("lon").textContent = lon.toFixed(2);
            document.getElementById("summary").textContent = summary;
            document.getElementById("temperature").textContent = temperatureC.toFixed(0);
        });
    } else {
        console.log('geolocation is not available.');
    }
}

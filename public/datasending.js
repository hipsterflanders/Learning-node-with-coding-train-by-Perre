var video = undefined;

function setup() {
    geoSetup();
    noCanvas();
    video = createCapture(VIDEO);
    video.parent(document.getElementById('cameraview'));
    video.size(160, 120);
    //document.getElementById('cameraview').append(document.getElementsByTagName('video'));
}

function geoSetup() {
    if ("geolocation" in navigator) {
        console.log('geolocation available.');
    } else {
        console.log('geolocation is not available.');
    }
}

async function getData() {
    const response = await fetch('/api');
    const data = await response.json();
    for (const item of data) {
        const root = document.createElement('div');
        const message = document.createElement('div');
        const geo = document.createElement('div');
        const date = document.createElement('div');
        const image = document.createElement('img');

        message.textContent = 'message: ' + item.message;
        geo.textContent = item.lat + '°, ' + item.lon + '°';
        const dateString = new Date(item.timestamp).toLocaleDateString();
        date.textContent = dateString;
        image.src = item.imageLink;
        image.alt = "Webcam picture taken with the message "+item.message;

        root.setAttribute('class', 'list_item');
        message.setAttribute('class', 'message');
        root.append(message, geo, image, date);
        document.getElementById('messageHolder').append(root);
    }
}

async function sendMessage(name, message) {

    video.loadPixels();
    const image64 = await video.canvas.toDataURL();

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const data = { name, message, lat, lon, image64 };
            const options = {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            }
            const response = await fetch('/api', options);
            const jsonData = await response.json();
            console.log(jsonData);
            console.log("Message send");
        });
    } else {
        console.log('geolocation is not available.');
    }
}

async function validateForm() {
    const name = document.forms["Message"]["fname"].value;
    const message = document.forms["Message"]["fmessage"].value;
    console.log("Sending Message...");
    sendMessage(name, message);
}
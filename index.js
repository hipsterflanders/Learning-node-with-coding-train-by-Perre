const express = require('express');
const fs = require('fs');
const app = express();
const Datastore = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Starting server at ${port}`));
app.use(express.static('public'));
app.use(express.json({ limit: '1Gb' }));

var database = new Datastore('database.db');
database.loadDatabase();

app.get('/api', (request, response) => {
    database.find({}, (err, data) => {
        if (err) {
            response.end();
            return;
        }
        response.json(data);
    });
});

app.post('/api', (request, response) => {
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    data.imageLink = createImageFile(data.name + '_' + data.timestamp, data.image64);
    data.image64 = 0;
    database.insert(data);
    response.json(data);
});

app.post('/checkin', async (request, response) => {
    const data = request.body;
    const lat = data.lat.toFixed(2);
    const lon = data.lon.toFixed(2);
    const api_key = process.env.API_KEY;
    const weather_url = `https://api.darksky.net/forecast/${api_key}/${lat},${lon}`;
    const weather_response = await fetch(weather_url);
    const weather_json = await weather_response.json();

    const timestamp = Date.now();
    data.timestamp = timestamp;

    try {
        data.weather = await weather_json.currently.summary.toLocaleLowerCase();
        data.temperature = await weather_json.currently.temperature;
        database.insert({ data });
        console.log("data updated");
    } catch (err) {
        console.log("Database error:" + err + ", weather:"+weather_json);
        //console.log(weather_json);
    }
    response.json(data);
});

/*
async function updateFile(data) {
    fs.appendFile('file.csv', data+'\n', (err) => {
        if (err) throw err;
    });


    fs.readFile('file.csv', (err, data) => {
        if (err) throw err;
        console.log(data.toString());
    });

}
*/

function createImageFile(fileName, base64String) {
    const filepath = "selfies/" + fileName + ".png"

    let base64Image = base64String.split(';base64,').pop();
    fs.writeFile("public/" + filepath, base64Image, { encoding: 'base64' }, function (err) {
        console.log("Error: " + err);
    });

    return filepath;
}


async function getData(){
    const response = await fetch('/api');
    const data = await response.json();

    for(item of data){
        const markerText = `The weather here is ${item.data.weather} with a temperature of ${item.data.temperature}&deg`;
        const marker = L.marker([item.data.lat,item.data.lon]).addTo(map);
        marker.bindPopup(markerText);
    }
}
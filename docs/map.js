
const map = L.map('map').setView([39.8283, -98.5795], 4);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18
}).addTo(map);

const classificationColors = {'Critical': 'red', 'Severe Risk': 'orangered', 'Fragile': 'darkorange', 'Concern': 'gold', 'Watchlist': 'yellowgreen', 'Stable': 'teal', 'Strong': 'blue', 'Elite': 'navy'};

fetch("data.json")
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    data.forEach(function(school) {
      const popup = `
        <strong>${school.University}</strong><br>
        Rank: ${school.Rank}<br>
        Classification: ${school.Classification}<br>
        CSI Percentile: ${school.CSI}%<br>
        Academic Efficiency: <span class='locked' onclick='alert("Upgrade to Tier 2 to unlock this data.")'>${school.AcademicEfficiency}%</span><br>
        Market Saturation: <span class='locked' onclick='alert("Upgrade to Tier 2 to unlock this data.")'>${school.MarketSaturation}%</span><br>
        aCFI: <span class='locked' onclick='alert("Upgrade to Tier 2 to unlock this data.")'>${school.aCFI}%</span><br>
        <div class="popup-note">CSI is calculated using:<br>
        Financial Health (40.02%), Market Saturation (39.99%), Academic Efficiency (19.99%)<br>
        Data compiled April 2025.</div>
      `;
      const markerColor = classificationColors[school.Classification] || "gray";
      const icon = new L.Icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${markerColor}.png`,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      L.marker([school.Latitude, school.Longitude], { icon: icon })
        .addTo(map)
        .bindPopup(popup);
    });
  })
  .catch(function(error) {
    console.error("Error loading map data:", error);
    alert("Failed to load map data. Please try again later.");
  });



const legend = L.control({ position: "bottomright" });

legend.onAdd = function(map) {
  const div = L.DomUtil.create("div", "info legend");
  div.innerHTML += "<h4>CSI Classification</h4>";
  div.innerHTML += '<i style="background: red"></i> Critical<br>';
  div.innerHTML += '<i style="background: orangered"></i> Severe Risk<br>';
  div.innerHTML += '<i style="background: darkorange"></i> Fragile<br>';
  div.innerHTML += '<i style="background: gold"></i> Concern<br>';
  div.innerHTML += '<i style="background: yellowgreen"></i> Watchlist<br>';
  div.innerHTML += '<i style="background: teal"></i> Stable<br>';
  div.innerHTML += '<i style="background: blue"></i> Strong<br>';
  div.innerHTML += '<i style="background: navy"></i> Elite<br>';
  return div;
};

legend.addTo(map);

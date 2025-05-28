
const map = L.map('map').setView([39.8283, -98.5795], 4);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18
}).addTo(map);

const classificationColors = {
  "Critical": "red",
  "Severe Risk": "orangered",
  "Fragile": "darkorange",
  "Concern": "gold",
  "Watchlist": "yellowgreen",
  "Stable": "teal",
  "Strong": "blue",
  "Elite": "navy"
};

fetch("data.json")
  .then(response => response.json())
  .then(data => {
    data.forEach(school => {
      const popup = `
        <strong>${school.University}</strong><br>
        Rank: ${school.Rank}<br>
        Classification: ${school.Classification}<br>
        CSI Percentile: ${(school.CSI * 100).toFixed(2)}%<br>
        Academic Efficiency: ${(school.AcademicEfficiency * 100).toFixed(2)}%<br>
        Market Saturation: ${(school.MarketSaturation * 100).toFixed(2)}%<br>
        aCFI: ${(school.aCFI * 100).toFixed(2)}%<br>
        <div class="popup-note">
          CSI is calculated using:<br>
          Financial Health (40.02%), Market Saturation (39.99%), Academic Efficiency (19.99%)<br>
          Data compiled April 2025.
        </div>
      `;
      const color = classificationColors[school.Classification] || "gray";
      const icon = new L.Icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
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
  .catch(error => {
    console.error("Error loading map data:", error);
    alert("Failed to load map data. Please try again later.");
  });

// Legend
const legend = L.control({ position: "bottomleft" });

legend.onAdd = function(map) {
  const div = L.DomUtil.create("div", "info legend");
  div.innerHTML += "<h4>CSI Classification</h4>";
  const grades = Object.keys(classificationColors);
  grades.forEach(key => {
    const color = classificationColors[key];
    div.innerHTML += `<i style="background:${color};width:16px;height:16px;display:inline-block;margin-right:6px;"></i>${key}<br>`;
  });
  return div;
};

legend.addTo(map);

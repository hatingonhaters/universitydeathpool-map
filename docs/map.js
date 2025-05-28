
const map = L.map('map').setView([39.8283, -98.5795], 4);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {{
    maxZoom: 18
}}).addTo(map);

fetch("data.json")
  .then(response => response.json())
  .then(data => {{
    data.forEach(school => {{
      const popup = `
        <strong>${{school.University}}</strong><br>
        CSI Percentile: ${{school.CSI}}%<br>
        Academic Efficiency: <span class='locked' onclick='alert("Upgrade to Tier 2 to unlock this data.")'>${{school.AcademicEfficiency}}%</span><br>
        Market Saturation: <span class='locked' onclick='alert("Upgrade to Tier 2 to unlock this data.")'>${{school.MarketSaturation}}%</span><br>
        aCFI: <span class='locked' onclick='alert("Upgrade to Tier 2 to unlock this data.")'>${{school.aCFI}}%</span><br>
        <div class="popup-note">CSI is calculated using:<br>
        Financial Health (40.02%), Market Saturation (39.99%), Academic Efficiency (19.99%)<br>
        Data compiled April 2025.</div>
      `;
      L.marker([school.Latitude, school.Longitude])
        .addTo(map)
        .bindPopup(popup);
    }});
  }});

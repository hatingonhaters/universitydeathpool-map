
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const map = L.map('map').setView([39.8283, -98.5795], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap'
    }).addTo(map);

    function getColor(classification) {
      switch (classification) {
        case "Critical": return "#b30000";
        case "Severe Risk": return "#e34a33";
        case "Fragile": return "#fc8d59";
        case "Concern": return "#fdbb84";
        case "Watchlist": return "#fdd49e";
        case "Stable": return "#d9f0a3";
        case "Strong": return "#a6d96a";
        case "Elite": return "#1a9641";
        default: return "#cccccc";
      }
    }

    function getLegendColor(classification) {
      return '<i style="background:' + getColor(classification) + ';width:18px;height:18px;display:inline-block;margin-right:8px;"></i>' + classification;
    }

    data.forEach(school => {
      const marker = L.circleMarker([school.Latitude, school.Longitude], {
        radius: 6,
        fillColor: getColor(school.Classification),
        color: "#000",
        weight: 0.5,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(map);

      const popup = `
        <strong>${school.University}</strong><br>
        Rank: ${school.Rank}<br>
        Classification: ${school.Classification}<br><br>
        CSI Percentile: ${(school.CSI * 100).toFixed(2)}%<br>
        Academic Efficiency: <a href="#" onclick="alert('Upgrade your subscription to view full academic efficiency details.'); return false;">${(school.AcademicEfficiency * 100).toFixed(2)}%</a><br>
        Market Saturation: <a href="#" onclick="alert('Upgrade your subscription to view full market saturation details.'); return false;">${(school.MarketSaturation * 100).toFixed(2)}%</a><br>
        aCFI: <a href="#" onclick="alert('Upgrade your subscription to view full financial data (aCFI).'); return false;">${(school.aCFI * 100).toFixed(2)}%</a><br><br>
        CSI is calculated using:<br>
        Financial Health (40.02%)<br>
        Market Saturation (39.99%)<br>
        Academic Efficiency (19.99%)<br><br>
        <em>Data compiled April 2025.</em>
      `;

      marker.bindPopup(popup);
    });

    const legend = L.control({ position: 'bottomleft' });
    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'legend');
      const grades = ["Critical", "Severe Risk", "Fragile", "Concern", "Watchlist", "Stable", "Strong", "Elite"];
      div.innerHTML += '<strong>CSI Classification</strong><br>';
      grades.forEach(g => {
        div.innerHTML += getLegendColor(g) + '<br>';
      });
      return div;
    };
    legend.addTo(map);
  });

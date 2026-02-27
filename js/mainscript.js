// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
// createMap();
var seasons = {
    spring: "cmlvfujhd004301rifhlaevct",
    summer: "cmlvfxxnv003y01so5wg5es4w",
    autumn: "cmlu7hylm002g01ri5jwxg6nj",
    winter: "cmlvg8b6q004001sodra8bs9p"
};
document.addEventListener('DOMContentLoaded', function(){
    createMap()
    getZones()
    runSeason(seasons.spring)
});

    function createMap(){
        // creates the editable map bits, sets a center and a zoom
        map = L.map('map', {
            center: [44.54, -123.33],
            zoom: 10,    
            maxZoom: 22,
            minZoom: 9

        })
}

let currentLayer;
function runSeason(seasonID) {
    if (currentLayer) {
        map.removeLayer(currentLayer);
    }
    currentLayer = L.tileLayer(
        `https://api.mapbox.com/styles/v1/shrimpshrimpton/${seasonID}/tiles/512/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2hyaW1wc2hyaW1wdG9uIiwiYSI6ImNtbGZpNzE4NzAyZGYzZ29jeTZyZWY1Z2gifQ.1jXEf6jbqvJxhLmelrgi2g`,
        {
            minZoom: 9,
            maxZoom: 22,
            attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
        }
    ).addTo(map);
    legend.addTo(map);
}

function getZones(){
    fetch("data/fish.geojson")
        .then(function(response){
            return response.json()
        })
        .then(function(json){
            createBoundaries(json)
        })
}
var geojson;
function createBoundaries(data){
    geojson = L.geoJSON(data, {
        style: function(feature) {
            return {
         fillColor: getColor(feature.properties.zone_name),
          weight: 3,
         opacity: 1,
         color: getColor(feature.properties.zone_name),
         dashArray: '2',
         fillOpacity: 0.1
        }
    },
        onEachFeature: function(feature, layer) {
            if (feature.properties && feature.properties.zone_name){
            layer.bindPopup( '<h2>' + feature.properties.zone_name + ' Zone </h2>' + '<h3>' + feature.properties.section_name + ' Section </h3>')}
        }
    }).addTo(map)
}


function getColor(zone) {
    const colors = {
        'Northwest': '#CD001A',
        'Willamette': '#EF6A00',
        'Central': '#F2CD00',
        'Southwest': '#79C300',
        'Southeast': '#1961AE',
        'Northeast': '#61007D'
    };
    return colors[zone] || 'black';
}

//  function getCities(){
//     fetch("data/oregoncities.geojson")
//         .then(function(response){
//             return response.json()
//         })
//         .then(function(json){
//             createPoints(json);
//         })
//  }

// function createPoints(data){
//     L.geoJSON(data, {
//         pointToLayer: pointToLayer
//     }).addTo(map);
// }

// function pointToLayer(feature, latlng){
//     var PointOptions = {
//         radius: 4,
//         fillColor: "#590d22",
//         color: "black",
//         weight: 1,
//         opacity:  1,
//         fillOpacity: 0.4    
//     };
//     var label = String(feature.properties.CITY);
//     return new L.CircleMarker(latlng, PointOptions)
//     };

var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = ['Northwest', 'Willamette', 'Central', 'Southwest', 'Southeast', 'Northeast'],
        labels = [];
        div.innerHTML = "<h2> Fishing Zones </h2>"
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i]) + '"></i> ' +
            grades[i] +' Zone' + '<br>';
    }
    return div;
};

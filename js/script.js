
// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><  //
// GLOBAL PARAMETERS
var map;
var miniMap;
var mainline;
var rivers;
var lakes;
var  miniMainline;
var sidebar;
var fishChoice = "none"
// CREATE THE MAP WHEN THE DOM STARTS
document.addEventListener('DOMContentLoaded', createMap)

// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><  //

// CREATE THE MAP
    function createMap(){
        map = L.map('map', {
            center: [44, -119.9],
            zoom: 7,    
            maxZoom: 16,
            minZoom: 7,
            maxBounds: [
                [48, -127],
                [41, -110] 
         ]})
        sidebar = L.control.sidebar({
        container: 'sidebar',
        position: 'right'}).addTo(map)
        map.createPane('mainlinePane');
        map.getPane('mainlinePane').style.zIndex = 450;
        map.createPane('riverPane');
        map.getPane('riverPane').style.zIndex = 400;
        map.createPane('lakePane');
        map.getPane('lakePane').style.zIndex = 500;
// CREATE BASEMAP
       Basemap = L.tileLayer('https://api.mapbox.com/styles/v1/shrimpshrimpton/cmlvfujhd004301rifhlaevct/tiles/512/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2hyaW1wc2hyaW1wdG9uIiwiYSI6ImNtbGZpNzE4NzAyZGYzZ29jeTZyZWY1Z2gifQ.1jXEf6jbqvJxhLmelrgi2g',
        {attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
        }).addTo(map)
// RUN THE ATTACHED FUNCTIONS
        buttonCorner();
        getStates();
        getRivers();
        getMainlines();
        getLakes();
        startingSidebar();
// MINIMAP BASEMAP + SPECIFICATIONS
    miniBasemap = new L.tileLayer('https://api.mapbox.com/styles/v1/shrimpshrimpton/cmlvfujhd004301rifhlaevct/tiles/512/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2hyaW1wc2hyaW1wdG9uIiwiYSI6ImNtbGZpNzE4NzAyZGYzZ29jeTZyZWY1Z2gifQ.1jXEf6jbqvJxhLmelrgi2g',
        {attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
});
        miniMap = new L.Control.MiniMap(miniBasemap, {
            zoomLevelFixed: 4,
            centerFixed: [44, -119.9],
            position: 'bottomleft'

        }).addTo(map);
        // DISABLE ALL MINIMAP CONTROLS.
        miniMap._miniMap.dragging.disable();
        miniMap._miniMap.scrollWheelZoom.disable();
        miniMap._miniMap.doubleClickZoom.disable();
        miniMap._miniMap.boxZoom.disable();
        miniMap._miniMap.touchZoom.disable()
    };
// PULLING THE DATA
        function getStates(){
        fetch("data/stateData.geojson")
            .then(function(response){return  response.json()})
            .then(function(json){createStatesBorders(json)})
        }
// CREATING THE BORDERS
  function createStatesBorders(data){
        geojson = L.geoJSON(data, {
            style: style,
        }).addTo(map)
        L.geoJSON(data, {
            style: miniStyle,
        }).addTo(miniMap._miniMap)
        }
// STYLE FOR MAIN MAP
    function style(feature) {
        return {
            weight: 2,
            opacity: 1, 
            color: 'black',
            fillOpacity: 0,
            opacity: 0.4
    }
    }
// STYLE FOR MINIMAP
    function miniStyle(feature){
        return {
        weight: 0.75,
        opacity: 1,
        color: 'black',
        fillOpacity: 0.0
    }}
// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><  //
// CREATE THE BUTTON CONTROL AND PUT THE BUTTONS IN IT

function buttonCorner(){
var ButtonCorner = L.Control.extend({
    options: {
        position: 'topright' // Position on the map
    },

    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'button-container');
        
        var button1 = L.DomUtil.create('button', 'shd', container);
        button1.innerHTML = 'Steelhead';

        var button2 = L.DomUtil.create('button', 'tr', container);
        button2.innerHTML = 'Trout';

        var button3 = L.DomUtil.create('button', 'slm', container);
        button3.innerHTML = 'Salmon';

        var button4 = L.DomUtil.create('button', 'bs', container);
        button4.innerHTML = 'Bass';

        var button5 = L.DomUtil.create('button', 'str', container);
        button5.innerHTML = 'Sturgeon';

        var button6 = L.DomUtil.create('button', 'oth', container);
        button6.innerHTML = 'Other';

        var button7 = L.DomUtil.create('button', 'reset', container);
        button7.innerHTML = 'Reset';

            L.DomEvent.on(button1, 'click', function() {
            search("steelhead")});
            L.DomEvent.on(button2, 'click', function() {
            search("trout")});
            L.DomEvent.on(button3, 'click', function() {
            search("salmon")});
            L.DomEvent.on(button4, 'click', function() {
            search("bass")});
            L.DomEvent.on(button5, 'click', function() {
            search("sturgeon")});
            L.DomEvent.on(button6, 'click', function() {
            search("other")});
            L.DomEvent.on(button7, 'click', function() {
            search("none")});

        return container;
    }
})
map.addControl(new ButtonCorner());
}
// CREATE THE BASE EXISTING LAYERS
// global layers that are erased each button switch.
function getMainlines(){
    fetch("data/MainlineTesting.geojson")
    .then(function(response){return response.json()})
    .then(function(json){createMainlines(json)})
}

function createMainlines(data){
    mainline = L.geoJSON(data, {
        pane: 'mainlinePane',
        style: mainlineStyle,
        filter: function(feature){
            if(fishChoice === "none"){return true}
            return feature.properties[fishChoice] === 1
        },
        onEachFeature: filterRivers
    }).addTo(map)
    miniMainline = L.geoJSON(data, {
        style: mainMiniStyle,
    }).addTo(miniMap._miniMap)
    }

function mainlineStyle(){
    return {
        weight: 3,
        opacity: 1,
        color: 'blue'
    }
}
function mainMiniStyle(){
    return {
        weight: 0.50,
        opacity: 1,
        color: 'blue'
    }
}
function getRivers(){
    fetch("data/RiversTesting.geojson")
    .then(function(response){return response.json()})
    .then(function(json){createRivers(json)})
}

function createRivers(data){
    rivers = L.geoJSON(data, {
        pane: 'riverPane',
        style: riverStyle,
        filter: function(feature){
            if(fishChoice === "none"){return true}
            return feature.properties[fishChoice] === 1
        },
        onEachFeature: filterRivers
    }).addTo(map)
}

function riverStyle(){
    return {
        weight: 1,
        opacity: 0.5,
        color: 'blue'
    }}

function getLakes(){
    fetch("data/lakestesting.geojson")
    .then(function(response){return response.json()})
    .then(function(json){createLakes(json)})
}

function createLakes(data){
    lakes = L.geoJSON(data, {
        pane: 'lakePane',
        pointToLayer: function(feature, latlng){
            return L.circleMarker(latlng, lakeStyle());
        },
        onEachFeature: function(feature, layer){
            layer.on('click', function(){
                console.log("lake clicked:", feature.properties.name);
                sideBar(feature);
            })},
        filter: function(feature){
            if(fishChoice === "none"){return true}
            return feature.properties[fishChoice] === 1
        },
    }).addTo(map);
}
function lakeStyle(){
    return {
        radius: 5,
    fillColor: 'blue',
    weight: 2, 
    opacity: 1,
    color: 'black',
    fillOpacity: 1
    }
}



function search(fish){
    // reset the layers so we're not loading so many at once.
    if(mainline){map.removeLayer(mainline)}
    if(rivers){map.removeLayer(rivers)}
    if(lakes){map.removeLayer(lakes)}

    fishChoice = fish

    getMainlines()
    getRivers()
    getLakes()
    if(fish === "none"){startingSidebar()}
}


function startingSidebar(){
    const sidebarContainer = document.getElementById('sidebar')
    sidebarContainer.innerHTML =
    '<h3> Oregon Fishing Spots </h3><hr>'+
    'Oregon is home to hundreds of lakes and dozens of rivers that are stocked and  fished for several different fish species.' +
    " Whether it's salmon, trout, bass, or something else, we probably has a place for you!" +
    "<br><hr>" + "<b> How to Use the Map </b> <br><br>" +
    "<li> Click on any river or point to see information about it. </li><br>" +
    "<li> The buttons on the top are for specific fish species. It will only show where that fish is present. </li>"+
    "<br><hr>" + "<b> Fishing Laws and Regulations </b> <br><br>" +
    "<i> Information about the rules and regulations for fishing will be put here-- </i>" 
}
function filterRivers(feature, layer){
    layer.on('click', function(){
        sideBar(feature);
    })
}
function sideBar(feature) {
    const titleName = feature.properties.name || feature.properties.MAIN || "missing data";
        popUpOrganizer(titleName)
}

function popUpOrganizer(name){
    if (name = "Nahalem River"){callNehalem()}
}

function callNehalem(){
    const sidebarContainer = document.getElementById('sidebar');
    sidebarContainer.innerHTML = 
    `<h3> Nahelem River </h3> <hr>
    <i> Known for large salmon,  steelhead, and cutthroat trout runs.</i> <br><hr>
    <img src = "img/nehalem.jpg" style = "width: 100%; margin-bottom: 10px; border-radius:4px"> <hr>
    <b> Species Present: </b> <br>
    <li> Steelhead </li>
    <li> Salmon (Chinook and Coho) </li> 
    <li> Cutthroat Trout </li>
    <li> Sturgeon </li>
    <li> Also good for crabbing and clamming </li>
    <hr>`
}
    
    
    
    
//     sidebarContainer.innerHTML = `
//       <h3>${titleName}</h3>
//       <ul>
//         <li>Steelhead: ${feature.properties.steelhead === 1 ? 'Yes' : 'No'}</li>
//         <li>Trout: ${feature.properties.trout === 1 ? 'Yes' : 'No'}</li>
//         <li>Salmon: ${feature.properties.salmon === 1 ? 'Yes' : 'No'}</li>
//         <li>Bass: ${feature.properties.bass === 1 ? 'Yes' : 'No'}</li>
//         <li>Sturgeon: ${feature.properties.sturgeon === 1 ? 'Yes' : 'No'}</li>
//         <li>Other: ${feature.properties.other === 1 ? 'Yes' : 'No'}</li>
//       </ul>
//     `;

//     // Show sidebar (assuming your sidebar control has a .show() method)
// }
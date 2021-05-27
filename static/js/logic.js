//Step-1: Create a tile layer for grey backgraound 
var greyMap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/light-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY,
});

//CREATE A MAP OBJECT 
var myMap = L.map("mapid", {
    center: [40, -94.5],
    zoom: 4,
});

//add the tile layer to map object
greyMap.addTo(myMap);




function getColor(depth) {
    color = "";
    if (depth > 90) {
        color = "red"
    }
    else if (depth > 70) {
        color = "orange";
    }
    else if (depth > 50) {
        color = "gold";
    }
    else if (depth > 30) {
        color = "yellow";
    }
    else if (depth > 10) {
        color = "lime";
    }
    else color = "green";
    return color;
}

// create a loop acces the url for earthquake
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
d3.json(url).then(data => {


    //show the data in console
    console.log(data);

    // acces the json
    L.geoJSON(data, {

        //change default marker with circle
        pointToLayer: function (_geoJsonPoint, latlng) {
            return L.circleMarker(latlng);
        },

        style: function (features) {
            return {
                radius: features.properties.mag * 5,
                fillColor: getColor(features.geometry.coordinates[2]),
                color: "blue",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "Magnitude: "
                + feature.properties.mag *
                +"<br>Depth: "
                + feature.geometry.coordinates[2]
                + "<br>Location: "
                + feature.properties.place

            );








        }
        // }).bindPopup(function (layer) {
        //     return layer.features.properties.description;
    }).addTo(myMap);

    //LEGEND 
    var legend = L.control({
        position: "bottomright"
    });
    ///legend details
    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");
        var grades = [-10, 10, 30, 50, 70, 90];
        var colors = ["green",
            "lime",
            "yellow",
            "gold",
            "orange",
            "red"];
        //looping through our intervals to generate a  label with colored square 
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                "<i style='background:" + colors[i] + "'></i>" +
                grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");

        }
        return div;



    };

    legend.addTo(myMap);
});






var apiKey = "pk.eyJ1Ijoiam9zZWNkb21pbmd1ZXoiLCJhIjoiY2swb200aW82MDMzNTNkcmhiMXJmN2piaCJ9.D4qzbA_Iue-FBoQWrXxBLQ";

var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: apiKey
});

var map = L.map("mapid", {
  center: [
    0, 0
  ],
  zoom: 3
});

darkmap.addTo(map);


d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson", function(data) {

  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  function getColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "#610304";
    case magnitude > 4:
      return "#e64f30";
    case magnitude > 3:
      return "#eb9354";
    case magnitude > 2:
      return "#fcb453";
    case magnitude > 1:
      return "#f5ee8e";
    default:
      return "#c4ffa0";
    }
  }


  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 3;
  }


  L.geoJson(data, {

    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },

    style: styleInfo,
    
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(map);


  var legend = L.control({
    position: "bottomright"
  });


  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "#c4ffa0",
      "#f5ee8e",
      "#fcb453",
      "#eb9354",
      "#e64f30",
      "#610304"
    ];


    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };


  legend.addTo(map);
});
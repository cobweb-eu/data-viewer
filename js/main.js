
/** globals       */
/** *************** */
/* map object */
map = null;

// /////////////////////////////////////////////////////////////////////////////////////////////////////////////

function init_map() {
	// create a map in the "map" div, set the view to a given place and zoom
	map = new L.map('map', {
		minZoom : 3,
		maxZoom : 18,
		center : new L.LatLng(52.40, -4.09),
		zoom : 8
	});
	map.attributionControl.setPrefix("");

	// add an OpenStreetMap tile layer
	L
			.tileLayer(
					'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
					{
						attribution : '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
					}).addTo(map);

	/* Add scale bar */
	L.control.scale({
		position : 'topright'
	}).addTo(map);

}

$(document).ready(function() {
	init_map(); // backdrop

	var markers = new L.MarkerClusterGroup({
		showCoverageOnHover : false
	});

	// Add sensor data for weather underground, the salt marsh, the peat bog, and Shoothill
	addGeoJSONData("/wug", markers, "Weather Underground");
	addGeoJSONData("/saltmarsh", markers, "Salt Marsh");
	addGeoJSONData("/peatbog", markers, "Peat Bog");
	addGeoJSONData("/shoothill", markers, "Shoothill",1);

});

// Displays sensor data on a Fancy Box popup using a Google chart
function displayData(endpoint, desc) {
	
	$
			.getJSON(
					endpoint,
					function(datajson) {
						var data = google.visualization
								.arrayToDataTable(datajson);
						var dv = 2;
						var dv2=2;
						var wd="45%";
						var ht="50%";
						if(window.mobileAndTabletcheck()){
						    dv=1;
						    dv2=5;
						    wd="30%";
						    ht="35%";
						} 

						

						var options = {
							title : desc + ' Sensor Data',
							'width' : screen.width - (screen.width / dv),
							'height' : screen.height - (screen.height / dv2),
							chartArea : {
								width : wd,
								height : ht
							}
						};
						var chart = new google.visualization.LineChart(document
								.getElementById('chart_div'));

						clearAll();

						view = new google.visualization.DataView(data);
						var container = document.getElementById('checkboxes');
						chart.draw(view, options);

						var rmv = [];

						// If there is more than one time series, enable the
						// user to select which series are displayed

						var len = datajson[0].length;
						if (len > 2) {
							for (var i = 1; i < datajson[0].length; i++) {

								var checkbox = document.createElement('input');
								checkbox.type = "checkbox";
								checkbox.name = "name";
								checkbox.value = "value";
								checkbox.id = "cbid" + i;
								checkbox.checked = true;
								checkbox.indx = i;

								checkbox.onclick = function(e) {

									var cb = e.target;

									if (cb.checked) {
										for (var i = rmv.length - 1; i >= 0; i--) {
											if (rmv[i] === cb.indx) {
												rmv.splice(i, 1);
												break;
											}
										}

										// Must always be at least one time
										// series displayed
									} else {
										if (rmv.length === datajson[0].length - 2) {
											cb.checked = true;
											alert("Must select at least one series to display");

										} else {
											rmv.push(cb.indx);
										}
									}

									v2 = new google.visualization.DataView(data);
									v2.hideColumns(rmv);

									chart.draw(v2, options);

								}

								var label = document.createElement('label')
								label.htmlFor = "cbid" + i;

								label.appendChild(document
										.createTextNode(datajson[0][i]));

								if (i === 6) {
									container = document
											.getElementById('checkboxes2');
								}

								container.appendChild(checkbox);
								container.appendChild(label);
								checkbox.label = label;
							}

						}
						
					

						

						// Dispaly Fancy Box and Google chart when user clicks
						// on an icon
						$.fancybox({
							
							title : 'Sensor Data',
							href : '#selection_div',
							minWidth : options.width,
							width : options.width,
							minHeight : options.height,
							height : options.height,
							padding : 0,
							'autoScale' : false,

							beforeShow : function() {
								
								$('.fancybox-skin').css({
									'background' : '#ffffff'
								});
								
							},
							'autoDimensions' : false,
							'scrolling' : 'no',
							'transitionIn' : 'none',
							'transitionOut' : 'none',
							
						});

					});

}

// Removes all check boxes
function clearAll() {
	var container = document.getElementById('checkboxes');

	while (container.hasChildNodes()) {
		container.removeChild(container.lastChild);
	}

}

// Adds sensor locations obtained from the specified endpoint, which returns
// GeoJSON
function addGeoJSONData(baseValEndpoint, markers, desc, fitMarkers) {

	// Specifies icon for the endpoint data
	var iconOb = L.icon({
		iconUrl : baseValEndpoint.substring(1) + '.png'
	});

	$.getJSON(baseValEndpoint + "Disc", function(geojson) {

		// Add each point specified in the GeoJSON
		for ( var idx in geojson.features) {
			feature = geojson.features[idx];

			// geojson standard is in lon/lat but marker is lat/lon
			var m = L.marker([ feature.geometry.coordinates[1],
					feature.geometry.coordinates[0] ], {
				icon : iconOb
			});

			$.each(feature.properties, function(k, v) {
				m.on('click', function() {
					displayData(baseValEndpoint + "Info?" + v, desc);
				});
			});

			m.addTo(markers);

		}

		if (fitMarkers) {
			// Scale the map to fit the markers
			map.addLayer(markers);

			map.fitBounds(L.featureGroup([ markers ]).getBounds());
		}

	});
}

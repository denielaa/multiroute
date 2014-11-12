var multiRoute={
	mapObject: null,
	trafficLayer: null,
	directionsDisplay: null,
	lineColor: null,
	j: null,
	marker : null,
	myOptions : null,
	
	initialize:function(none){
		
		$('#map').attr('traffic','off');
		
		myOptions = {
			zoom: 12,
			center: new google.maps.LatLng(-6.205855, 106.839131),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		// Draw the map
		mapObject = new google.maps.Map(document.getElementById("map"), myOptions);
		trafficLayer =  new google.maps.TrafficLayer();
		
	},trafficActive:function(){
		var trafficState = $('#map').attr('traffic');
		
		if(trafficState == 'off'){
			
			trafficLayer.setMap(mapObject);
			
			$('#map').attr('traffic','on');
		}else{
			
			trafficLayer.setMap(null);
			$('#map').attr('traffic','off');
		}
		

	},getPosition:function(){
		if(navigator.geolocation){
			function getLocation(position){
				multiRoute.geocode({"lat":position.coords.latitude,"lng":position.coords.longitude});
			}
			navigator.geolocation.getCurrentPosition(getLocation,multiRoute.showerror);
		}else{
			if(typeof google=='object'){
				if(google.loader.ClientLocation){
					multiRoute.geocode({"lat":google.loader.ClientLocation.latitude,"lng":google.loader.ClientLocation.longitude});
				}
			}
		}
	},geocode:function(l){
		latLng=new google.maps.LatLng(l.lat,l.lng);
		multiRoute.geocoder.geocode({'latLng':latLng},function(results,status){
			if(status==google.maps.GeocoderStatus.OK){
				console.log(results[0].formatted_address);
				document.getElementById('from').value=results[0].formatted_address;
			}else{
				alert("Geocode not success because: "+status);
			}
		});
	},showMultiRoute:function(l){
		mapObject = new google.maps.Map(document.getElementById("map"), myOptions);
		var directionsService = new google.maps.DirectionsService();
		var directionsRequest;
		
		lineColor = new Array("#B334B2","#2E63B4","#45F01A","#C94E4E","#4D4444","#4B25D6","#138C2B","#F8F52A","#2AF8EA","#B334B2","#2E63B4","#45F01A","#C94E4E","#4D4444","#4B25D6","#138C2B","#F8F52A","#2AF8EA","#B334B2","#2E63B4","#45F01A","#C94E4E","#4D4444","#4B25D6","#138C2B","#F8F52A","#2AF8EA");
		var from = $('#from').val();
		var to = $('#to').val();
		var toWayArray = [];
		var inFrom = "";
		var inTo = "";
		var kone = 0;
		var countWaypoints = 0;
		var icons_start = "";
		var icons_end = "";
		var sim = 1;
		
		$('#route').html("");
		$('#route').append('<div><button onClick="window.print();">Print</button></div>');
		$('input[name="toWaypoints[]"]').each(function()
		{
			toWayArray.push($(this).val());
		});
		
		countWaypoints = toWayArray.length + 1;
		
		if(countWaypoints <= 1){
			directionsRequest = {
					origin: from,
					destination: to,
					provideRouteAlternatives: true,
					travelMode: google.maps.DirectionsTravelMode.DRIVING,
					unitSystem: google.maps.UnitSystem.METRIC
				};
				
				directionsService.route(
				directionsRequest,

				function (response, status) {
					if (status == google.maps.DirectionsStatus.OK) {
						var leg = response.routes[0].legs[0];
						
						icons_start = "https://chart.googleapis.com/chart?chst=d_map_xpin_icon&chld=pin_star|car-dealer|00FFFF|FF0000";
						icons_end = "https://chart.googleapis.com/chart?chst=d_map_pin_icon&chld=flag|ADDE63";
						
						multiRoute.makeMarker( leg.start_location ,mapObject, icons_start, leg.start_address);
						multiRoute.makeMarker( leg.end_location, mapObject, icons_end, leg.end_address );
						 
						for (var i = 0, len = response.routes.length; i < len; i++) {
							sim++;
							
							directionsDisplay = new google.maps.DirectionsRenderer({
								map: mapObject,
								suppressMarkers : true,
								polylineOptions: {
								  strokeColor: lineColor[sim],
								  strokeOpacity: 0.7,
								  strokeWeight: 7
								},
								directions: response,
								routeIndex: i
								
							});
							directionsDisplay.setPanel(document.getElementById('route'));
							j = i + 1;
							//$('#route').append('<div class="circle" onClick="multiRoute.showPanel('+ sim +')" style="background:'+lineColor[sim]+'; border-radius: 50%/50%; width: 20px; height: 20px; cursor : pointer; float : left; margin-right : 5px;	margin-bottom : 10px;"></div>');
							
						}
					} else {
						alert('Unable to retrieve your route');
					}
				});
		}else{
			for(var k = 0; k < countWaypoints; k++){
				
				if (k==0){
					inFrom = from;
					inTo = toWayArray[k];
				}else if(k == countWaypoints - 1){
					inFrom = inTo;
					inTo = to;
				}else{
					inFrom = inTo;
					inTo = toWayArray[k];
				}
				
				kone = k + 1;
				directionsRequest = {
					origin: inFrom,
					destination: inTo,
					provideRouteAlternatives: true,
					travelMode: google.maps.DirectionsTravelMode.DRIVING,
					unitSystem: google.maps.UnitSystem.METRIC
				};
				
				directionsService.route(
				directionsRequest,

				function (response, status) {
					if (status == google.maps.DirectionsStatus.OK) {
						var leg = response.routes[0].legs[0];
						//$('#route').append('<div class="text-center" style="font-size:14px;font-weight:bold;clear : both">'+leg.start_address+ ' - ' + leg.end_address + '</div><!--<br><div class="text-center">Click on the color</div>-->');
						
						icons_start = "https://chart.googleapis.com/chart?chst=d_map_xpin_icon&chld=pin_star|car-dealer|00FFFF|FF0000";
						icons_end = "https://chart.googleapis.com/chart?chst=d_map_pin_icon&chld=flag|ADDE63";
						
						multiRoute.makeMarker( leg.start_location ,mapObject, icons_start, leg.start_address);
						multiRoute.makeMarker( leg.end_location, mapObject, icons_end, leg.end_address );
						 
						for (var i = 0, len = response.routes.length; i < len; i++) {
							directionsDisplay = new google.maps.DirectionsRenderer({
								map: mapObject,
								suppressMarkers : true,
								polylineOptions: {
								  strokeColor: lineColor[sim],
								  strokeOpacity: 0.7,
								  strokeWeight: 7
								},
								directions: response,
								routeIndex: i
								
							});
							//if(i==0){
								directionsDisplay.setPanel(document.getElementById('route'));
							//}
							j = i + 1;
							//$('#route').append('<div class="circle" onClick="multiRoute.showPanel('+ sim +')" style="background:'+lineColor[sim]+'; border-radius: 50%/50%; width: 20px; height: 20px; cursor : pointer; float : left; margin-right : 5px;	margin-bottom : 10px;"></div>');
							sim++;
						}
					} else {
						alert('Unable to retrieve your route');
					}
				});
			}
		}
	},makeMarker:function(locations, mapObject, icon, title){
		marker = new google.maps.Marker({
			position: locations, 
			map: mapObject,
			icon: icon,
			title: title
		});
	},addWaypoints:function(){
		
		var htmlWaypoints = '<div class="waypointsAdded"><label for="from" class="col-sm-2 control-label">From</label>';
		htmlWaypoints += '<div class="col-sm-10">';
		htmlWaypoints +=  '<input type="text" name="toWaypoints[]" class="form-control" id="from" placeholder="Type an Address">';
		htmlWaypoints +=  '<a href="#" onclick="multiRoute.addWaypoints()">Add Waypoints</a> &nbsp;';
		htmlWaypoints +=  '<a href="#" onclick="multiRoute.deleteWaypoints(this)">Remove</a>';
		htmlWaypoints +=  '</div></div>';
		$('#waypoints').append(htmlWaypoints);
		
	},deleteWaypoints:function(re){
		
		$(re).parent().parent().remove();
		return false;
		
	},showPanel:function(i){
		$('.adp-list:eq('+i+')').slideDown();
		$('.adp:eq('+i+')').slideDown();
		
		$('.adp-list').not(':eq('+i+')').slideUp();
		$('.adp').not(':eq('+i+')').slideUp();
		
	},showerror:function(e){
		switch(e.code){
			case e.TIMEOUT:
			alert('Timeout');
			break;
			
			case e.POSITION_UNAVAILABLE:
			alert('Position unavailable');
			break;
			
			case e.PERMISSION_DENIED:
			alert('Permission denied.');
			break;
			
			case e.UNKNOWN_ERROR:
			alert('Unknown error');
			break;
		}
	}
};
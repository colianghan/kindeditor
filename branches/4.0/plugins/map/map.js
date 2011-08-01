
// Google Maps: http://code.google.com/apis/maps/index.html

var kindeditor_plugin_map, kindeditor_plugin_map_geocoder;

function kindeditor_plugin_map_initialize() {
	var latlng = new google.maps.LatLng(31.225394428808663, 121.47675279999999);
	kindeditor_plugin_map = new google.maps.Map(KindEditor('#kindeditor_plugin_map_canvas')[0], {
		zoom: 11,
		center: latlng,
		disableDefaultUI: true,
		panControl: true,
		zoomControl: true,
		mapTypeControl: true,
		scaleControl: true,
		streetViewControl: false,
		overviewMapControl: true,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});
	kindeditor_plugin_map_geocoder = new google.maps.Geocoder();
	kindeditor_plugin_map_geocoder.geocode({'latLng': latlng}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			if (results[4]) {
				KindEditor('#kindeditor_plugin_map_address').val(results[4].formatted_address);
			}
		}
	});
}

KindEditor.plugin('map', function(K) {
	var self = this, name = 'map', lang = self.lang(name + '.');
	self.clickToolbar(name, function() {
		var html = ['<div style="padding:10px 20px;">',
				'<div class="ke-dialog-row">',
				lang.address + ' <input id="kindeditor_plugin_map_address" class="ke-input-text" value="" style="width:200px;" /> ',
				'<span class="ke-button-common ke-button-outer">',
				'<input type="button" class="ke-button-common ke-button" value="' + lang.search + '" />',
				'</span>',
				'</div>',
				'<div id="kindeditor_plugin_map_canvas" style="border:1px solid #A0A0A0;width:558px;height:360px;"></div>',
				'</div>'].join(''),
			dialog = self.createDialog({
				name : name,
				width : 600,
				title : self.lang(name),
				body : html,
				yesBtn : {
					name : self.lang('yes'),
					click : function(e) {
						var geocoder = kindeditor_plugin_map_geocoder,
							map = kindeditor_plugin_map,
							center = map.getCenter().lat() + ',' + map.getCenter().lng(),
							zoom = map.getZoom(),
							maptype = map.getMapTypeId(),
							url = 'http://maps.googleapis.com/maps/api/staticmap';
							url += '?center=' + encodeURIComponent(center);
							url += '&zoom=' + encodeURIComponent(zoom);
							url += '&size=558x360';
							url += '&maptype=' + encodeURIComponent(maptype);
							url += '&markers=' + encodeURIComponent(center);
							url += '&language=' + self.langType;
							url += '&sensor=false';
						self.exec('insertimage', url).hideDialog().focus();
					}
				}
			}),
			div = dialog.div,
			addressBox = K('.ke-input-text', div),
			searchBtn = K('.ke-button', div),
			iframe = K('.ke-textarea', div);
		// Asynchronously Loading the Javascript API
		K.getScript('http://maps.googleapis.com/maps/api/js?sensor=false&language=' + self.langType + '&callback=kindeditor_plugin_map_initialize');
		// search map
		searchBtn.click(function(e) {
			var geocoder = kindeditor_plugin_map_geocoder,
				map = kindeditor_plugin_map;
			geocoder.geocode({"address" : addressBox.val()}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					map.setZoom(11);
					map.setCenter(results[0].geometry.location);
					var marker = new google.maps.Marker({
						map: map,
						position: results[0].geometry.location
					});
					kindeditor_plugin_map_latlng = results[0].geometry.location;
				}
			});
		});
	});
});

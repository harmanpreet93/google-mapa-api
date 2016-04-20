jQuery(document).ready(function() {

    google.maps.event.addDomListener(window, 'load', initializeMap());
    var markers = [];

    function initializeMap() {
        console.log('Inside initializeMap');
        var infowindow = new google.maps.InfoWindow();
        var bounds = new google.maps.LatLngBounds();
        var geocoder = new google.maps.Geocoder;
        var mapDiv = document.getElementById('map-canvas');
        
        var mapOptions = {
            center: {
                lat: 17.4126272,
                lng: 78.267614
            },
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoom: 10,
            zoomControl: true,
            mapTypeControl: true,
            scaleControl: true,
            streetViewControl: true,
            fullscreenControl: true
        };

        // create google maps object
        var map = new google.maps.Map(mapDiv, mapOptions);

        initializeSearchBox(map, infowindow);

        // setMarkersUsingGeocoder(map, geocoder, infowindow, bounds);
    }

    function initializeSearchBox(map, infowindow) {
        // Create the search box and link it to the UI element.
        var input = document.getElementById('search-box');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
            searchBox.setBounds(map.getBounds());
        });
        markers = [];
        // [START region_getplaces]
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
            var places = searchBox.getPlaces();
            if (places.length == 0) {
                return;
            }
            // Clear out the old markers.
            markers.forEach(function(marker) {
                marker.setMap(null);
            });
            markers = [];
            var marker;
            // For each place, get the icon, name and location.
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function(place) {
                // Create a marker for each place
                marker = new google.maps.Marker({
                    map: map,
                    title: place.name,
                    position: place.geometry.location,
                    animation: google.maps.Animation.DROP
                });
                markers.push(marker);
                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
                marker.addListener('click', function() {
                    infowindow.setContent(marker.getTitle());
                    infowindow.open(marker.get('map'), marker);
                });
            });
            map.fitBounds(bounds);
        });
    }

    function setMarkersUsingGeocoder(map, geocoder, infowindow, bounds) {
        console.log('Inside setMarkersUsingGeocoder');
        
        // test locations
        var locations = new Array();
        var address = {};
        address['lat'] = 17.413742;
        address['long'] = 78.2662389;
        locations.push(address);
        address = {};
        address['lat'] = 12.9545163;
        address['long'] = 77.35005;
        locations.push(address);

        for (var i = locations.length - 1; i >= 0; i--) {
            reverseGeoCode(map, geocoder, locations[i], infowindow, bounds);
        }
    }

    function reverseGeoCode(map, geocoder, address, infowindow, bounds) {
        console.log('Inside reverseGeoCode');
        var latlng = {
            lat: address['lat'],
            lng: address['long']
        };
        geocoder.geocode({
            'location': latlng
        }, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    var position = new google.maps.LatLng(address['lat'], address['long']);
                    bounds.extend(position);
                    var marker = new google.maps.Marker({
                        position: latlng,
                        map: map
                    });
                    markers.push(marker);
                    marker.addListener('click', function() {
                        infowindow.setContent(results[1].formatted_address);
                        console.log(results[1].formatted_address);
                        infowindow.open(marker.get('map'), marker);
                    });
                    // Automatically center the map fitting all markers on the screen
                    map.fitBounds(bounds);
                    // infowindow.setContent(results[1].formatted_address);
                    // infowindow.open(map, marker);
                } else {
                    window.alert('No results found');
                }
            } else {
                window.alert('Geocoder failed due to: ' + status);
            }
        });
    }

    function clearMarkers() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers.length = 0;
    }

    // function initMap() {
    //     console.log('Inside initMap');
    //     var bounds = new google.maps.LatLngBounds();
    //     var mapDiv = document.getElementById('map-canvas');
    //     var mapOptions = {
    //         center: {
    //             lat: 17.4126272,
    //             lng: 78.267614
    //         },
    //         mapTypeId: google.maps.MapTypeId.ROADMAP,
    //         zoom: 10,
    //         zoomControl: true,
    //         mapTypeControl: true,
    //         scaleControl: true,
    //         streetViewControl: true,
    //         fullscreenControl: true
    //     };
    //     // create google maps object
    //     var map = new google.maps.Map(mapDiv, mapOptions);
    //     // Create the search box and link it to the UI element.
    //     var input = document.getElementById('search-box');
    //     var searchBox = new google.maps.places.SearchBox(input);
    //     map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
    //     // Bias the SearchBox results towards current map's viewport.
    //     map.addListener('bounds_changed', function() {
    //         searchBox.setBounds(map.getBounds());
    //     });
    //     var infowindow = new google.maps.InfoWindow();
    //     var markers = [];
    //     // [START region_getplaces]
    //     // Listen for the event fired when the user selects a prediction and retrieve
    //     // more details for that place.
    //     searchBox.addListener('places_changed', function() {
    //         var places = searchBox.getPlaces();
    //         if (places.length == 0) {
    //             return;
    //         }
    //         // Clear out the old markers.
    //         markers.forEach(function(marker) {
    //             marker.setMap(null);
    //         });
    //         markers = [];
    //         var marker;
    //         // For each place, get the icon, name and location.
    //         var bounds = new google.maps.LatLngBounds();
    //         places.forEach(function(place) {
    //             // Create a marker for each place
    //             marker = new google.maps.Marker({
    //                 map: map,
    //                 title: place.name,
    //                 position: place.geometry.location,
    //                 animation: google.maps.Animation.DROP
    //             });
    //             markers.push(marker);
    //             if (place.geometry.viewport) {
    //                 // Only geocodes have viewport.
    //                 bounds.union(place.geometry.viewport);
    //             } else {
    //                 bounds.extend(place.geometry.location);
    //             }
    //             marker.addListener('click', function() {
    //                 infowindow.setContent(marker.getTitle());
    //                 infowindow.open(marker.get('map'), marker);
    //             });
    //         });
    //         var address = {};
    //         address['lat'] = 17.4126272;
    //         address['long'] = 78.267614;
    //         var geocoder = new google.maps.Geocoder;
    //         reverseGeoCode(map, geocoder, address, infowindow);
    //         // google.maps.event.addListener(markers, 'click', (function(marker) {
    //         //         return function() {
    //         //             infowindow.setContent(place.name);
    //         //             infowindow.open(map, marker);
    //         //         }
    //         //     })(markers[0]));
    //         map.fitBounds(bounds);
    //     });
    // }
});
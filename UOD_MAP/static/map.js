
//Initialize popup
var infoWindow;

//Initialize/display map service
    function initMap() {
      //initialize  Directionservices
      var directionsService = new google.maps.DirectionsService();
      var directionsRenderer = new google.maps.DirectionsRenderer();

      //RENDER THE MAP ON PAGE
      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: {lat: 41.85, lng: -87.65}
      });

      // Set the map's style to the default value of selector. Credit: googledevelopers platform
      var styleSelector = document.getElementById('style-selector');
      map.setOptions({styles: styles[styleSelector.value]});
      // Apply new JSON when the user selects a different style.
      styleSelector.addEventListener('change', function() {
        map.setOptions({styles: styles[styleSelector.value]});
      });

      //description popup
      infoWindow = new google.maps.InfoWindow;

      // GET geolocation i.e the current location of the device(the user has to agree).
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          //Get device lat and long
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          //set a marker as the user's location based on the LatLong pc
          var marker = new google.maps.Marker({
          position: pos,
          map: map,
          title: 'My Location'
          });

          //get user(marker) location and sent it to value of select options as ::My Location::
          document.getElementById("poss").value = (marker.position.lat()+","+marker.position.lng()); 

          //set popup on marker as ::My Location::
          infoWindow.setPosition(marker);
          infoWindow.setContent('My Location');
          infoWindow.open(map);
          map.setCenter(pos);

        },
        function() {
          handleLocationError(true, infoWindow, map.getCenter());
        });
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
      }
      //displays on map
      directionsRenderer.setMap(map);

      //set directions according to the selected destinations value
      var onChangeHandler = function() {
        calculateAndDisplayRoute(directionsService, directionsRenderer);
      };
      document.getElementById('start').addEventListener('change', onChangeHandler);
      document.getElementById('end').addEventListener('change', onChangeHandler);
      document.getElementById('mode').addEventListener('change', onChangeHandler);
    }

    //MAP STYLES 
    var styles = {
        default: null,
        //Credit: goodledevelopers platform
        night: [
          {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
          {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
          {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
          {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{color: '#d59563'}]
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{color: '#d59563'}]
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{color: '#263c3f'}]
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{color: '#6b9a76'}]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{color: '#38414e'}]
          },
          {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{color: '#212a37'}]
          },
          {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{color: '#9ca5b3'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{color: '#746855'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{color: '#1f2835'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{color: '#f3d19c'}]
          },
          {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{color: '#2f3948'}]
          },
          {
            featureType: 'transit.station',
            elementType: 'labels.text.fill',
            stylers: [{color: '#d59563'}]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{color: '#17263c'}]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{color: '#515c6d'}]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{color: '#17263c'}]
          }
        ]};

        //Calculate and Display the route
    function calculateAndDisplayRoute(directionsService, directionsRenderer) {
      //Get travel mode from travelMode select option
        var selectedMode = document.getElementById('mode').value;
      directionsService.route(
          {
            origin: {query: document.getElementById('start').value}, //Get origin from value of select option ::From::
            destination: {query: document.getElementById('end').value}, //Get destination from value of select option ::To::
            travelMode: google.maps.TravelMode[selectedMode] //set travelmode from value of select option
          },
          function(response, status) {
            if (status === 'OK') {
              directionsRenderer.setDirections(response);
            } /*else {
              window.alert('Directions request failed due to ' + status); //display error response
            }*/
          });
    }
    //handle error in case of
    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(browserHasGeolocation ?
                            'Error: The Geolocation service failed.' :
                            'Error: Your browser doesn\'t support geolocation.');
      infoWindow.open(map);
    }

var origins;
origins = [];
var destinations;
destinations = [];
var anzahlOrigins;
anzahlOrigins = 1;
var anzahlDestinations;
anzahlDestinations= 1;
var idOrte = [];

// hier wird der String eingelese und einen Array von 3 er Paaren umgewandelt, das sind die Zeilen und in sets wurden subArrays mit 3,



function calculateBestPosition() {

    // Origins werden aus Text gelesen und in Array mit nach Lines gewandelt

    var neueOrigins = addOrigins("startpositionen");
    // die alte Position wird eingefügt und als String ausgelesen
    var alterPos = addOrigins("alterStartpunkt");
    console.log(alterPos);
	console.log(neueOrigins);
	neueOrigins.unshift(alterPos[0]);
    //Alpha ermöglicht den Übergang zu einem vollständigen Array der Origins
	console.log(neueOrigins);
    origins = alpha(neueOrigins);
    //hier werden die Sationsnamen getrennt erfasst um sie im Anschluss, also nach der Distance Matrixberechnung wieder auszugeben
    idOrte = beta(neueOrigins);
    anzahlOrigins = origins.length;
    //hier wird ein Array mit den Destinationen erstellt und im anschluss durch alpha verfeinert
    var neueDestinations = addOrigins("ziel");
    destinations = alpha(neueDestinations);
    
    console.log(origins);
    anzahlDestinations = destinations.length;
    initMap(origins,destinations,idOrte);
    }

// hier wird die Eingabe für den aktuellen Startpunkt eingegeben
function addOldpoint(eingabe) {
    var eintrag = document.getElementById(eingabe).value;
    return eintrag;
    }




// hier werden die ganzen möglichen Start punkte angegebe




    function addOrigins(eingabe) {
    var eintrag = document.getElementById(eingabe).value;
	eintrag = eintrag.replace(/\t/g, ';');
    zeilen = eintrag.split("\n");
    var sets = [];

    for (var i = 0; zeilen.length > i; i++) {
        var b = zeilen[i].split(";");
        sets.push(b);

    }
    return sets;
}
function addOrigins2(eingabe) {
    var eintrag = document.getElementById(eingabe).value;
    eintrag = eintrag.replace(/\t/g, ',');
    zeilen = eintrag.split("\n");
    var sets = [];

    for (var i = 0; zeilen.length > i; i++) {
        var b = zeilen[i].split(",");
        sets.push(b);

    }
    return sets;
}
function alpha(setter) {
        var startpunkte = [];
        var sets2 = setter;
        for (var i = 0; i < sets2.length; i++) {
            var b = setter[i];

            if (b[1] == "undefinded") {
                console.log("Fehler");
            }
            else {
                startpunkte.push({lat: parseFloat(b[1]), lng: parseFloat(b[2])})
            }
        }
        return startpunkte;


}
function beta(setter) {
    var iDnamen = [];
    var sets2 = setter;
    for (var i = 0; i < sets2.length; i++) {
        var b = setter[i];

        if (b[1] == "undefinded") {
            console.log("Fehler");
        }
        else {
            iDnamen.push(b[0]);
        };
    }
    return iDnamen;


}
function initMap(ori, desti,idi) {
        var bounds = new google.maps.LatLngBounds;
        var markersArray = [];

        var origin1 = {lat: 55.930, lng: -3.118};
        var origin2 = {lat: 55.930, lng: -3.118};
        var destinationA = ori;
        var destinationB = desti;
        var ortsAuszeichnung = idi;
        /*    console.log(destinationA);
         console.log(destinationA[1]);
         console.log(destinationA[3].lat);
         console.log(destinationB);
         console.log(destinationB[1]);
         console.log(destinationB[1].lat);
         */

        var destinationIcon = 'https://chart.googleapis.com/chart?' +
            'chst=d_map_pin_letter&chld=D|FF0000|000000';
        var originIcon = 'https://chart.googleapis.com/chart?' +
            'chst=d_map_pin_letter&chld=O|FFFF00|000000';
        var map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 51.234, lng: 13.2323},
            zoom: 10
        });
        var geocoder = new google.maps.Geocoder;

        var service = new google.maps.DistanceMatrixService;
        service.getDistanceMatrix({
                origins: destinationA,
                destinations: destinationB,
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC,
                avoidHighways: false,
                avoidTolls: false
            },
            function (response, status) {
                if (status !== google.maps.DistanceMatrixStatus.OK) {
                    alert('Error was: ' + status);
                } else {
                    var originList = response.originAddresses;
                    var destinationList = response.destinationAddresses;
                    var outputDiv = document.getElementById('output');
                    outputDiv.innerHTML = '';
                    deleteMarkers(markersArray);

                   /* var showGeocodedAddressOnMap = function (asDestination) {
                        var icon = asDestination ? destinationIcon : originIcon;
                        return function (results, status) {
                            if (status === google.maps.GeocoderStatus.OK) {
                                map.fitBounds(bounds.extend(results[0].geometry.location));
                                markersArray.push(new google.maps.Marker({
                                    map: map,
                                    position: results[0].geometry.location,
                                    icon: icon
                                }));
                            } else {
                                alert('Geocode was not successful due to: ' + status);
                            }
                       };
                    };*/ 
                    var distanzKummuliert = 0;
                    var zeitKummuliert = 0;
                    var distanzArray = [];
                    var distanzAlt = 0;
                    var zeitAlt= 0;
                    //Ermittlung der durchschnittlichen Distanz für den Originalstandort
                    var resultAlt = response.rows[0].elements;
                    for(var k=0 ; k < resultAlt.length; k++){
                       // geocoder.geocode({'address': destinationList[k]},
                         //   showGeocodedAddressOnMap(false));
                        //
                       distanzAlt += parseInt(resultAlt[k].distance.value);
                       zeitAlt += parseInt(resultAlt[k].duration.value);
                    }
                    var mittZeitAlt = (zeitAlt/anzahlDestinations)/60;
                    var gesamtZeitMinAlt = parseInt(zeitAlt/60);
                    console.log(mittZeitAlt);
                    var gesamtDistKMAlt = parseInt(distanzAlt/1000);
                    var mittDistanzAlt = (distanzAlt/anzahlDestinations)/1000;
                    console.log(mittDistanzAlt);



                        //Ermittlung der Orign und Destination Werte
                    for (var i = 0; i < originList.length; i++) {
                        var results = response.rows[i].elements;
                        //geocoder.geocode({'address': originList[i]},
                           // showGeocodedAddressOnMap(true));
                        //console.log(results[3].distance.text)
                        for (var j = 0; j < results.length; j++) {
                           // geocoder.geocode({'address': destinationList[j]},
                             //   showGeocodedAddressOnMap(true));
                           //
                            distanzKummuliert += parseInt(results[j].distance.value);
                            zeitKummuliert += parseInt(results[j].duration.value);

                        }
                        var minutenGes = parseInt(zeitKummuliert / 60);
                        var kilomGes = parseInt(distanzKummuliert / 1000);
                        var avgKM = parseInt(kilomGes / anzahlDestinations);
                        var avgTime = parseInt(minutenGes / anzahlDestinations)
                        distanzArray.push({"Durchschnittsdistanz":avgKM,"Durchschnittszeit":avgTime,"Positionsbezeichnung":ortsAuszeichnung[i-1],"Ort":originList[i],"GesamtStrecke":kilomGes,"GesamtZeit":minutenGes});
                        outputDiv.innerHTML += "In "+originList[i]+" liegt die Durchschnittsdistanz bei: "+avgKM + "km und die Durchschnittszeit="+ avgTime+" Minuten zum Ziel"+'<br>'+"<br>";
                        distanzKummuliert = 0;
                        zeitKummuliert = 0;

                    }


                    var minDist = distanzArray.slice(0);
                    minDist.sort(function(a,b) {
                        return a.Durchschnittsdistanz - b.Durchschnittsdistanz;
                    });
                    var minTime = distanzArray.slice(0);
                    minTime.sort(function(a,b) {
                        return a.Durchschnittszeit - b.Durchschnittszeit;
                    });


                    console.log(minDist);
                    console.log(minDist[0]);
                    var zeitErsparnisDistmin = parseInt(mittZeitAlt - minDist[0].Durchschnittszeit);
                    var zeitErsparnisZeitmin = parseInt(mittZeitAlt - minTime[0].Durchschnittszeit);
                    var distanzErsparnisZeitmin = parseInt(mittDistanzAlt - minTime[0].Durchschnittsdistanz);
                    var distanzErsparnisDistmin = parseInt(mittDistanzAlt - minDist[0].Durchschnittsdistanz);
                    var zeitGesErsparnisZeitMin= parseInt(gesamtZeitMinAlt - minTime[0].GesamtZeit);
                    var distanzGesErsparnisZeitMin = parseInt(gesamtDistKMAlt - minTime[0].GesamtStrecke);
                    var zeitGesErsparnisDistMin= parseInt(gesamtZeitMinAlt - minDist[0].GesamtZeit);
                    var distanzGesErsparnisDistMin= parseInt(gesamtDistKMAlt - minDist[0].GesamtStrecke);
                    outputDiv.innerHTML += "Die kürzeste Durchschnittsdistanz beträgt: "+ minDist[0].Durchschnittsdistanz+" km und das liegt in "+ minDist[0].Positionsbezeichnung+" und der Ort heißt:  " + minDist[0].Ort+"."  + "<br>"+ "Dort hat man eine durchschnittliche Zeitersparnis von ca. "+ zeitErsparnisDistmin +" Minuten und eine durchschnittliche Distanzverrinngerung von "+ distanzErsparnisDistmin+ " km." + "<hr>";
                    outputDiv.innerHTML += "Die kürzeste durchschnittliche Fahrtzeit beträgt: "+ minTime[0].Durchschnittszeit + " Minuten und der ideale Ort dafür ist die Nummer "+ minTime[0].Positionsbezeichnung+" : "+minTime[0].Ort+"." + "<br>"+"Dort hat man eine durchschnittliche Zeitersparnis von ca. "+ zeitErsparnisZeitmin +" Minuten und eine durchschnittliche Distanzverrinngerung von "+ distanzErsparnisZeitmin+ " km." + "<hr>";
                    outputDiv.innerHTML += "<p>"+"Alte Gesamtdistanz: "+ gesamtDistKMAlt+ " km.    Alte Gesamtzeit: "+ gesamtZeitMinAlt+" Minuten"+"</p>"+"<hr>";
                    outputDiv.innerHTML += "Neue Gesamtdistanz bei der kürzesten Strecke: "+ minDist[0].GesamtStrecke +" km.    Neue Gesamtzeit bei der kürzesten Strecke: "+ minDist[0].GesamtZeit+"<br>"+ "Die Zeitersparnis beträgt: "+zeitGesErsparnisDistMin+" Minuten und die Streckenersparnis beträgt: "+ distanzGesErsparnisDistMin+" km."+"<hr>";
                    outputDiv.innerHTML += "Neue Gesamtdistanz bei der schnellsten Strecke: "+ minTime[0].GesamtStrecke +" km.    Neue Gesamtzeit bei der schnellsten Strecke: "+ minTime[0].GesamtZeit+"<br>"+ "Die Zeitersparnis beträgt: "+zeitGesErsparnisZeitMin+" Minuten und die Streckenersparnis beträgt: "+ distanzGesErsparnisZeitMin+" km."+"<hr>";"<hr>" ;
                }

            });
    }

function deleteMarkers(markersArray) {
        for (var i = 0; i < markersArray.length; i++) {
            markersArray[i].setMap(null);
        }
        markersArray = [];


}

/*function initmap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 51.234, lng: 13.2323},
        zoom: 5
});
}
*/

var express = require('express');
var router = express.Router();
var http = require('http');

var activityBeacons =
    [{
        title: "B",
        lat: "-35.304758",
        lon: "149.122853"
    }, {
        title: "C",
        lat: "-35.292708",
        lon: "149.14113"
    }, {
        title: "D",
        lat: "-35.340516",
        lon: "149.02371"
    }
    , {
        title: "E",
        lat: "-35.349983",
        lon: "149.022679"
    }
    , {
        title: "F",
        lat: "-35.398483",
        lon: "149.013281"
    }
    , {
        title: "G",
        lat: "-35.138331",
        lon: "149.14803"
    }
];

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('get an animal!');
});

router.get('/:lat/:long', function(req, res, next) {
  getSpecies(req.params.lat, req.params.long)
  .then(data => data.occurrences)
  .then(data => {
    return data.filter(item => {
      return item.speciesGroups.indexOf('Animals') > -1;
    })
  })
  .then(data => data.map(item => item.vernacularName))
  .then(data => data[randomIntFromInterval(0,data.length -1)])
  .then(data => res.send({data}));
});

router.get('/activity/:lat/:long', function(req, res, next) {

  var position = newPosition(req.params.lat, req.params.long);
  var closeLocations = activityBeacons.filter(beacon => arePointsNear(position, newPosition(beacon.lat, beacon.lon)));

  if(closeLocations.length === 0){
    res.send({data: 'Not in range'})
  }

  var newP = newPosition(closeLocations[0].lat, closeLocations[0].lon);

  getSpecies(newP.lat, newP.lng)
  .then(data => data.occurrences)
  .then(data => {
    return data.filter(item => {
      return item.speciesGroups.indexOf('Animals') > -1;
    })
  })
  .then(data => data.map(item => item.vernacularName))
  .then(data => data[randomIntFromInterval(0,data.length -1)])
  .then(data => res.send({data}));
});

router.get('/all/:lat/:long', function(req, res, next) {
  getSpecies(req.params.lat, req.params.long)
  .then(data => data.occurrences)
  .then(data => {
    return data.filter(item => {
      return item.speciesGroups.indexOf('Animals') > -1;
    })
  })
  .then(data => data.map(item => item.vernacularName))
  .then(data => getUnique(data))
  .then(data => res.send({data}));
});

 function getSpecies(lat, long){

   return new Promise(function(resolve, reject){
     var url  = 'http://biocache.ala.org.au/ws/occurrences/search?lat=' + lat + '&lon=' + long + '&radius=1';
     var req = http.get(url, (res) => {
         let jsonResponse = '';
         res.setEncoding('utf8');
         res.on('data', (chunk) => {
           jsonResponse += chunk
         });
         res.on('end', () => {
           var response = JSON.parse(jsonResponse);
           resolve(response);
         });
       });

       req.on('error', (e) => {
         reject(`problem with request: ${e.message}`);
       });

       req.end();
   });

 }

function newPosition(lat, lng){
  return { lat: lat, lng: lng };
}

 function randomIntFromInterval(min,max) {
     return Math.floor(Math.random()*(max-min+1)+min);
 }

 function getUnique(arr){
 	var n = [];
 	for(var i = 0; i < arr.length; i++)
 	{
 		if (n.indexOf(arr[i]) == -1) n.push(arr[i]);
 	}
 	return n;
 }

 function arePointsNear(checkPoint, centerPoint, km) {
   var ky = 40000 / 360;
   var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
   var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
   var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
   return Math.sqrt(dx * dx + dy * dy) === 0 ? true : Math.sqrt(dx * dx + dy * dy)  <= km;
 }

module.exports = router;

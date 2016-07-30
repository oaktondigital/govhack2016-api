var express = require('express');
var router = express.Router();
var http = require('http');

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

 function randomIntFromInterval(min,max) {
     return Math.floor(Math.random()*(max-min+1)+min);
 }

 function getUnique(arr)
 {
 	var n = [];
 	for(var i = 0; i < arr.length; i++)
 	{
 		if (n.indexOf(arr[i]) == -1) n.push(arr[i]);
 	}
 	return n;
 }

module.exports = router;

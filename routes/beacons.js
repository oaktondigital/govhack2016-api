var express = require('express');
var router = express.Router();
var http = require('http');

var activityBeacons = [{
        title: "A",
        lat: "-35.304758000",
        lon: "149.122853000"
    },
    {
        title: "B",
        lat: "-35.304797000",
        lon: "149.122887000"
    }, {
        title: "C",
        lat: "-35.304806000",
        lon: "149.122895000"
    }, {
        title: "D",
        lat: "-35.305006000",
        lon: "149.122897000"
    }
]

router.get('/', function(req, res, next) {
    res.send('get all beacons!');
});
router.get('/?id', function(req, res, next) {
    res.send('get beacon!' + req.params.id);
});

router.get('/activities/', function(req, res, next) {
    res.send(activityBeacons);
});
router.get('/activities/?id', function(req, res, next) {
    res.send('get beacon by id!' + req.params.id);
});


module.exports = router;

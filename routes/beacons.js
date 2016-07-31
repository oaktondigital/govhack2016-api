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

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var db = require('./db-store');

var SUBMISSIONS_COLLECTION_NAME = "submissions";

function route() {
  var router = new express.Router();
  router.use(cors());
  router.use(bodyParser.json());

  router.get('/', function(req, res) {
    var id = req.query.id;
    console.log('id ' + id);
    if (typeof id === 'undefined' || id === '') {
      res.status(404).json([]);
      return;
    }
    /**
     * Finding an registrant by registrantId
     */
    db.read(SUBMISSIONS_COLLECTION_NAME, id, function (err, data) {
      if (err) {
        res.status(500).json({result:'ERROR', msg: err})
      } else {
        res.status(200).json(data);
      }
    });
  });

  router.get('/:formName', function(req, res) {
    var formName = req.params.formName;
    console.log('formName', formName);
    if (typeof formName === 'undefined' || formName === '') {
      res.status(400).json([]);
      return;
    }

    var filter = {
      "like": {
        "formName": formName
      }
    };
    console.log('formName', formName, 'filter', filter);
    db.list(SUBMISSIONS_COLLECTION_NAME, filter, function (err, data) {
      if (err) {
        res.status(500).json({result:'ERROR', msg: err})
      } else {
        res.status(200).json(data);
      }
    });
  });

  router.post('/', function(req, res) {
    var incident = req.body;
    console.log('incident: ' + incident);
    if (typeof incident === 'undefined') {
      res.status(404).json([]);
      return;
    }
    db.update(SUBMISSIONS_COLLECTION_NAME, incident, function (err, data) {
      if (err) {
        res.status(500).json({result:'ERROR', msg: err})
      } else {
        res.status(200).json(data);
      }
    });
  });

  return router;
}

module.exports = route;

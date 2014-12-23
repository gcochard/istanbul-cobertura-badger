'use strict';

// For generating the coverage badge
var path = require('path');
var fs = require("fs");
var XMLSplitter = require('xml-splitter');
var request = require('request');

// Download function that downloads the image
var download = function(uri, filename, callback) {
  request.head(uri, function() {
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

var PLUGIN_NAME = "istanbul-cobertura-badger";

// plugin level function (dealing with files)
function gulpIstanbulBadger(coberturaFile, destinationDir, downloadCallback) {
  if (!coberturaFile) {
    return downloadCallback(new Error(PLUGIN_NAME, 'Missing cobertura file path text!'));
  } else
  if (!destinationDir) {
    return downloadCallback(new Error(PLUGIN_NAME, 'Missing destination where to place the badge!'));
  }

  fs.readFile(coberturaFile,function(err,coberturaXmlReport){
    if(err){
      return downloadCallback(err);
    }
    var xs = new XMLSplitter('/coverage');
    xs.on('data', function(data) {
      var overallPercentage = ((parseFloat(data["line-rate"]) + parseFloat(data["branch-rate"])) / 2 * 100).toFixed(0);
      var color = overallPercentage >= 80 ? "brightgreen" : (overallPercentage >= 75 ? "yellow" : "red");
      var url = 'http://img.shields.io/badge/coverage-' + overallPercentage + '%-' + color + '.svg';
      var badgeFileName = path.join(destinationDir, "coverage.svg");

      download(url, badgeFileName, downloadCallback);
    }).parseString(coberturaXmlReport);
  });
}

// exporting the plugin main function
module.exports = gulpIstanbulBadger;

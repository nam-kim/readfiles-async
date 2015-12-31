var path = require('path');
var fs = require('fs');
var _ = require('lodash');

module.exports = wrapper.readfiles = wrapper.readFiles = wrapper;

function wrapper(pth, filecb, finalcb) {
  if (!pth) { return; }

  var m;  // final callback function
  var n;  // file callback function
  var o = function(){};  // user-input file callback
  var fa = []; // files array that will be returned
  var tr = { dirs: 1 };  // tracker object for readFiles function

  m = function(err, filesArray) {
    if(err) {
      return err;
    }
    return filesArray;
  }

  if(typeof finalcb === 'function') {
    m = finalcb;
  }

  if(typeof filecb === 'function') {
    o = filecb;
  }

  n = function(tracker, filesArray, fileName, filePath, stat) {
    if(tracker.halt === true) { return; }
    o(fileName, filePath, stat);
  };

  pth = path.resolve(pth);

  readFiles(pth, m, n, fa, tr);

}

function checkRemaining(tracker, finalcb, filesArray) {
  tracker.dirs--;
  if(tracker.dirs === 0) {
    finalcb(null, filesArray);
  }
}

function readFiles(dir, finalcb, filecb, filesArray, tracker) {
  if(tracker.halt === true) { return; }

  fs.readdir(dir, function(err, files) {
    var i;

    if(err) {
      tracker.halt = true;
      finalcb(err);
      return;
    }

    if(files.length < 1) {
      checkRemaining(tracker, finalcb, filesArray);
    }

    i = 1;

    _.forEach(files, function(file) {

      var filePath = path.join(dir, file);

      fs.stat(filePath, function(_err, stat) {
        if(_err) {
          tracker.halt = true;
          finalcb(_err);
          return;
        }

        if(stat.isDirectory()) {
          tracker.dirs++;
          readFiles(filePath, finalcb, filecb, filesArray, tracker);
        } else if (stat.isFile()) {
          filesArray.push({
            name: file,
            path: filePath,
            stat: stat
          });
          filecb(tracker, filesArray, file, filePath, stat);
        }

        if(i === files.length) {
          checkRemaining(tracker, finalcb, filesArray);
        }
        i++;
      });
    });
  });
};

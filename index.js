var path = require('path');
var fs = require('fs');

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

  n = function(tracker, fileName, filePath, stat) {
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

function loop(i, files, dir, finalcb, filecb, filesArray, tracker) {
  var filePath = path.join(dir, files[i]);

  fs.stat(filePath, function(err, stat) {
    if(err) {
      tracker.halt = true;
      finalcb(err);
      return;
    }

    if(stat.isDirectory()) {
      tracker.dirs++;
      readFiles(filePath, finalcb, filecb, filesArray, tracker);
    } else if (stat.isFile()) {
      filesArray.push({
        name: files[i],
        path: filePath,
        stat: stat
      });
      filecb(tracker, files[i], filePath, stat);
    }

    if(i === (files.length - 1)) {
      checkRemaining(tracker, finalcb, filesArray);
    } else {
      i++;
      loop(i, files, dir, finalcb, filecb, filesArray, tracker);
    }
  });
}

function readFiles(dir, finalcb, filecb, filesArray, tracker) {
  if(tracker.halt === true) { return; }

  fs.readdir(dir, function(err, files) {
    if(err) {
      tracker.halt = true;
      finalcb(err);
      return;
    }

    if(files.length < 1) {
      checkRemaining(tracker, finalcb, filesArray);
      return;
    }

    loop(0, files, dir, finalcb, filecb, filesArray, tracker);
  });
}

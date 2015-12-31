## readfiles(path, filecb, cb)

Walks a given path and its subdirectories, collecting file information along the way.

`filecb(fileName, filePath, stat)`  
Callback function for individual files.  
filePath is the full path to the file, including the filename.  
stat is a [fs.Stats object](https://nodejs.org/api/fs.html#fs_class_fs_stats).

`cb(err, files)`  
Used for error handling or when all files have been read.  
files is an array of objects with properties 'name', 'path', and 'stat'.

# usage
```js
var readfiles = require('readfiles-async');

readfiles('/some/path/to/files', function(name, path, stat) {
  console.log('Do something with file', name);
}, function(err, files) {
  if(err) { console.error(err); }
});
```

# license

MIT

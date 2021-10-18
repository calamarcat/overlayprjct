const express = require('express')
const app = express()
const port = 3000
var path = require('path');

app.use(express.static('overlays'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
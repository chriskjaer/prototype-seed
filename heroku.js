var express = require('express'),
        app = express(),
       path = require('path');

// Config
app.use(express.static(path.resolve('./build')));


//Heroku
var port = process.env.PORT || 3000;

app.listen(port, function() {
        console.log("Listening on " + port);
});
const helmet = require('helmet'),
    compression = require('compression'),
    cors = require('cors'),
    express = require('express'),
    expressSanitizer = require('express-sanitizer'),
    path = require('path'),
    accuweather = require('node-accuweather')()('dqxWjSitjpLHtbPmPrktipvE8RaLvnUQ'),
    app = express();


const staticFiles = express.static(path.join(__dirname, '../client/build'))
app.use(staticFiles)
// middleware
app.use(express.json({type: 'application/json'}));
app.use(expressSanitizer());
app.use(express.urlencoded({extended: true}));
app.use(compression());
app.use(helmet());
app.use(cors());



// CORS middleware
const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
}

app.use(allowCrossDomain)
  

app.post('/forecast/:city', (req, res) => { 
    accuweather.getCurrentConditions(req.params.city)
      .then((result) => {
        if(result) {
          res.json({ success: true, data: result} )
        } else {
          res.json({success: false, err: 'No Result for that query, Please Try Spelling the Full City Name' })
        }
      })
      .catch(error => {
        res.json({success: false, err: 'No Result for that query, Please Try Spelling the Full City Name' })
      });
});

// any routes not picked up by the server api will be handled by the react router
app.use('/*', staticFiles)

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Listening on ${port}`)
})
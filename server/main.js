const helmet = require('helmet'),
    compression = require('compression'),
    cors = require('cors'),
    express = require('express'),
    expressSanitizer = require('express-sanitizer'),
    opencage = require('opencage-api-client');
    path = require('path'),
    accuweather = require('node-accuweather')()('dqxWjSitjpLHtbPmPrktipvE8RaLvnUQ'),
    app = express();

    // middleware
app.use(express.json({type: 'application/json'}));
app.use(expressSanitizer());
app.use(express.urlencoded({extended: true}));
app.use(compression());
app.use(helmet());
app.use(cors());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

// CORS middleware
const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
}

app.use(allowCrossDomain)

// routes
app.get('/', (req, res) => {
    return res.sendStatus(202).send('Okay');
});

app.post('/weather/:loc', (req, res) => { 
  //console.log(req.params)
  opencage
    .geocode({q: req.params.loc})
      .then(data => {
        //console.log(data)
        /*
        accuweather.getCurrentConditions(city)
          .then((result) => {
            res.json({result})
          });   
          */
    })
    .catch(error => {
      console.log('error', error.message);
    });
});

const PORT = 8081 || process.env.PORT;
app.listen(PORT, () => console.log(`API listening on port ${PORT}!\n`));
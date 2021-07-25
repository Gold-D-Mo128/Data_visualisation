const { constants } = require("buffer");
const { log } = require("node:console");
const { PRIORITY_LOW } = require("node:constants");

function CovidRecovery2021() {


  this.name = 'Global covid-19 recovery rate 2021';
  this.id = 'CovidRecovery2021';
  this.loaded = false;


  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/Covid-recovery/covid-recovery.csv', 'csv', 'header',

      function(table) {
        self.loaded = true;
      });


  };
  
  this.setup = function() {

    this.mapimg = loadImage('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/0,0,1,0/1024x576@2x?access_token=pk.eyJ1IjoibWFzdGVyLW1vMTIzIiwiYSI6ImNrcWpjaThmOTAwbGYyd3IweXNkbWQ2NDYifQ._kWrf0B2s4px97F3tAkPAA')    
    this.colCountry = this.data.getColumn('Country')
    this.collon = this.data.getColumn('Lat')
    this.collat = this.data.getColumn('Long')
    this.colj21 = this.data.getColumn('j21')

    
  };

  this.destroy = function() {
    // this.select.remove();
  };

  this.clat = 0;
  this.clon = 0;

  this.lat =  24.4539;
  this.lon = 54.3773;

  var zoom = 1;

  

  this.draw = function() {
    var i;
    
    translate(width/2,height/2)
    imageMode(CENTER)
    image(this.mapimg,0,0,width,height);
    
    
    
    
    for(i=0;i < this.colCountry.length ; i++)
    {
      var max;
      
      function convX(lon)
      {
        lon = radians(lon)
        var a = (256 / PI) * pow(2, zoom);
        var b = (lon + PI);
        return (a * b);
      }
      function convY(lat)
      {
        lat = radians(lat)
        var a = (256 / PI) * pow(2, zoom);
        var c = PI - Math.log((tan(PI/4 + lat/2)));
        return (a * c)
      }
      var cx = convX(this.clon);
      var cy = convY(this.clat);
    
      max = Math.sqrt(pow(10,10))
      let Circlewidth = map(this.colj21[i], 10, 10000000 , 5, 25,true)
      

      this.x = convX(this.collat[i]) - cx;
      this.y = convY(this.collon[i]) - cy;
      noStroke()
      fill(159, 226, 191 ,200);
      ellipse(this.x, this.y, Circlewidth)
      
    }
    
  };
}

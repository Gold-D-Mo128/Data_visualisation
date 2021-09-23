// const { rejects } = require("node:assert");
// const { create } = require("node:domain");

function Stocks() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Stock Prices of tech companies';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'Stock_prices';

  // Title to display above the plot.
  this.title = 'Gender Pay Gap: Average difference between male and female pay.';

    // Names for each axis.
  this.xAxisLabel = 'year';
  this.yAxisLabel = '%';

  var marginSize = 25;

  // Layout object to store all common plot layout parameters and
  // methods.
  this.layout = {
    marginSize: marginSize,

    // Locations of margin positions. Left and bottom have double margin
    // size due to axis and tick labels.
    leftMargin: marginSize * 2,
    rightMargin: width - marginSize,
    topMargin: marginSize,
    bottomMargin: height - marginSize * 2,
    pad: 5,

    plotWidth: function() {
      return this.rightMargin - this.leftMargin;
    },
    
    plotHeight: function() {
      return this.bottomMargin - this.topMargin;
    },

    // Boolean to enable/disable background grid.
    grid: true,

    // Number of axis tick labels to draw so that they are not drawn on
    // top of one another.
    numXTickLabels: 10,
    numYTickLabels: 50,
  };

  // Property to represent whether data has been loaded.
  this.loaded = false;

  this.preload = function() {
    var self = this;
    this.aapl = loadTable(
      './data/stock_data/AAPL.csv', 'csv', 'header',
      function(table) {
        self.loaded = true;
      });

    this.amzn = loadTable(
      './data/stock_data/AMZN.csv', 'csv', 'header',
      function(table) {
        self.loaded = true;
      });

    this.fb = loadTable(
      './data/stock_data/FB.csv', 'csv', 'header',
      function(table) {
        self.loaded = true;
      });
      
    this.goog = loadTable(
      './data/stock_data/GOOG.csv', 'csv', 'header',
      function(table) {
        self.loaded = true;
      });

    this.nflx = loadTable(
      './data/stock_data/NFLX.csv', 'csv', 'header',
      function(table) {
        self.loaded = true;
      });

  };

  this.setup = function() {
    // Font defaults.
    textSize(16);
    var prices = this.aapl.getColumn('closing_prices');
    // Set min and max years: assumes data is sorted by date.
    this.aaplRow = this.data.getColumn('year');
    this.endYear = this.data.getNum(this.data.getRowCount() - 1, 'year');

    // Find min and max pay gap for mapping to canvas height.
    this.minPayGap = this.data.getNum(0, 'year');  
           // Pay equality (zero pay gap).
    this.maxPayGap = max(this.data.getColumn('closing_prices'));
  };

  this.destroy = function() {
  };

  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    // Draw the title above the plot.
    this.drawTitle();

    // Draw all y-axis labels.
    drawYAxisTickLabels(this.minPayGap,
                        this.maxPayGap,
                        this.layout,
                        this.mapPayGapToHeight.bind(this),
                        0);

    // Draw x and y axis.
    drawAxis(this.layout);

    // Draw x and y axis labels.
    drawAxisLabels(this.xAxisLabel,
                   this.yAxisLabel,
                   this.layout);

    // Plot all pay gaps between aapl and endYear using the width
    // of the canvas minus margins.
    var previous;
    var numYears = this.endYear - this.aapl;

    // Loop over all rows and draw a line from the previous value to
    // the current.
    for (var i = 0; i < this.data.getRowCount(); i++) {

      // Create an object to store data for the current year.
      var current = {
        // Convert strings to numbers.
        'years': this.data.getNum(i, 'years'),
        'closing_price': this.data.getNum(i, 'closing_price')
      };

      if (previous != null) {
        // Draw line segment connecting previous year to current
        // year pay gap.
  

        
        let istruee = false;
        noStroke()
        

            
        // The number of x-axis labels to skip so that only
        // numXTickLabels are drawn.
        var xLabelSkip = ceil(numYears / this.layout.numXTickLabels);
        
        // Draw the tick label marking the start of the previous year.
        if (i % xLabelSkip == 0) {
          for(var x = 1; x < prices.length; x++)
          {
            drawXAxisTickLabel(previous.year, this.layout, this.mapYearToWidth.bind(this));
          }
          
        }
       
        fill(0,191,255)
        if(mouseX > this.mapYearToWidth(previous.year) && mouseX < this.mapYearToWidth(previous.year) + 10 
        && mouseY > this.mapPayGapToHeight(current.payGap) && mouseY < this.mapPayGapToHeight(current.payGap) + 10)
        {
          console.log(this.data.getNum(i, 'closing_price').toFixed(2) + "%")
          istruee = true;
          fill(123,104,238)
        }

        rect(this.mapYearToWidth(previous.year),this.mapPayGapToHeight(current.payGap),10,10)
        if(istruee){
          fill(0,0,139)
          rect(mouseX-22,mouseY+20,42,20)
          push()

          fill(255)
          noStroke()
          textSize(10)
          text(this.data.getNum(i, 'closing_price').toFixed(2) + "%", mouseX , mouseY +30)
          pop()
     
        }
        
      }
      textSize(16);
      // Assign current year to previous year so that it is available
      // during the next iteration of this loop to give us the start
      // position of the next line segment.
      previous = current;
    }
  };

  this.drawTitle = function() {
    fill(0);
    noStroke();
    textAlign('center', 'center');

    text(this.title,
         (this.layout.plotWidth() / 2) + this.layout.leftMargin,
         this.layout.topMargin - (this.layout.marginSize / 2));
  };

  this.mapYearToWidth = function(value) {
    for (var x = 1; x < this.aapl.getColumn('year');x++)
    {
      var years = map(value,
                      x,
                      x+1,
                      this.layout.leftMargin,   // Draw left-to-right from margin.
                      this.layout.rightMargin);
      
    }
  };

  this.mapPayGapToHeight = function(value) {
    return map(value,
               this.minPayGap,
               this.maxPayGap,
               this.layout.bottomMargin, // Smaller pay gap at bottom.
               this.layout.topMargin);   // Bigger pay gap at top.
  };
}

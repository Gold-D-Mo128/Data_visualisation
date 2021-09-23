// const { rejects } = require("node:assert");

function Stocks() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Stocks of tech companies';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'Stocks';

  // Title to display above the plot.
  this.title = 'FAANG yearly closing prices';

  // Names for each axis.
  this.xAxisLabel = 'YEARS';
  this.yAxisLabel = 'PRICES';

  var marginSize = 30;

  // Layout object to store all common plot layout parameters and
  // methods.
  this.layout = {
    marginSize: marginSize,

    // Locations of margin positions. Left and bottom have double margin
    // size due to axis and tick labels.
    leftMargin: marginSize * 2,
    rightMargin: width - marginSize - 300,
    topMargin: marginSize + 15,
    bottomMargin: height - marginSize * 2 - 30,
    pad: 20,

    plotWidth: function () {
      return this.rightMargin - this.leftMargin - 5;
    },

    plotHeight: function () {
      return this.bottomMargin - this.topMargin;
    },

    // Boolean to enable/disable background grid.
    grid: true,

    // Number of axis tick labels to draw so that they are not drawn on
    // top of one another.
    numXTickLabels: 11,
    numYTickLabels: 15,
  };

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function () {
    var self = this;

    this.ADBEData = loadTable(
      './data/stock_data/ADBE.csv', 'csv', 'header',
      // Callback function to set the value
      // this loaded to true.
      function (table) {
        self.loaded = true;
      });

    this.nflxdata = loadTable(
      './data/stock_data/NFLX.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function (table) {
        self.loaded = true;
      });

    this.msftdata = loadTable(
      './data/stock_data/MSFT.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function (table) {
        self.loaded = true;
      });

    this.aapldata = loadTable(
      './data/stock_data/AAPL.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function (table) {
        self.loaded = true;
      });
    this.fbdata = loadTable(
      './data/stock_data/FB.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function (table) {
        self.loaded = true;
      });

  };
  this.setup = function () {
    // Font defaults.
    textSize(20);

    // Set min and max years: assumes data is sorted by date.
    this.startYear = this.ADBEData.getNum(0, 'year');
    this.endYear = this.ADBEData.getNum(this.ADBEData.getRowCount() - 1, 'year');

    // Find min and max pay gap for mapping to canvas height.
    this.MinPrice = 0;         // Pay equality (zero pay gap).
    this.MaxPrice = 600;
  };

  this.destroy = function () {
  };
  this.draw = function () {

    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    // Draw the title above the plot.
    this.drawTitle();

    // Draw x and y axis.
    drawAxis(this.layout);

    // Draw x and y axis labels.
    drawAxisLabels(this.xAxisLabel,
      this.yAxisLabel , this.layout);

    // Plot all pay gaps between startYear and endYear using the width
    // of the canvas minus margins.
    var previous;
    var numYears = this.endYear - this.startYear;

    // Loop over all rows and draw a line from the previous value to
    // the current.

    // this function to show the percentage, later will be used in the pop up box.

    drawYAxisTickLabels(this.MinPrice,
      this.MaxPrice,
      this.layout,
      this.mapPriceToHeight.bind(this),
      0);
    drawYAxisTickLabels(this.MinPrice,
      this.MaxPrice,
      this.layout,
      this.mapPriceToHeight.bind(this),
      0);

    this.Data = [
      {
        "Name": "Netflix",
        "Color": color("#DE0913"),
        "Stock": this.nflxdata
      },
      {
        "Name": "Adobe",
        "Color": color("#961459"),
        "Stock": this.ADBEData
      },
      {
        "Name": "Apple Co.",
        "Color": color(200),
        "Stock": this.aapldata
      },
      {
        "Name": "Microsoft",
        "Color": color("#F7B400"),
        "Stock": this.msftdata
      },
      {
        "Name": "Facebook",
        "Color": color("#00A4EF"),
        "Stock": this.fbdata
      },
    ]
   

    let prev
    
    for (let i = 0; i < this.Data.length; i++) {
      let bool = (mouseX > this.layout.topMargin + 1200 && mouseX < this.layout.topMargin + 1200 + 20
        && mouseY > this.layout.leftMargin + i * 50 && mouseY < 90 + i * 50)

      noStroke()
      fill(this.Data[i].Color)
      rect(this.layout.topMargin + 1200, this.layout.leftMargin + i * 50, 20, 20)
      push()
      textSize(20);
      textAlign(LEFT);
      fill(255)
      text(this.Data[i].Name, this.layout.topMargin + 1230,this.layout.leftMargin+10 + i * 50)
      pop()

      for (let j = 0; j < this.Data[i].Stock.getRowCount(); j++) {
        var curr = {
          "years": this.Data[i].Stock.getNum(j, 'year'),
          "prices": this.Data[i].Stock.getNum(j, 'closing_price'),
        }

        if (prev != null) {
          strokeWeight(2.5)
          stroke(this.Data[i].Color)
          line(this.mapYearToWidth(prev.years), this.mapPriceToHeight(prev.prices)
               ,this.mapYearToWidth(curr.years), this.mapPriceToHeight(curr.prices));
          strokeWeight(1)
            if (bool ) {
              fill(this.Data[i].Color)
              rect(this.layout.topMargin + 1197.5, this.layout.leftMargin - 2.5 + i * 50, 25, 25)
              push()
              strokeWeight(5)
              // graph lines, line 1 
              line(this.mapYearToWidth(prev.years),
              this.mapPriceToHeight(prev.prices),
              this.mapYearToWidth(curr.years),
              this.mapPriceToHeight(curr.prices));
              pop()
            }
            
      
          push()
          strokeWeight(3)

          //indicating line
          pop()
          //y
          stroke(210)
          line(constrain(mouseX, this.layout.leftMargin, this.layout.rightMargin)
            , 46
            , constrain(mouseX, this.layout.leftMargin, this.layout.rightMargin)
            , this.layout.bottomMargin)
          //x
          line(this.layout.leftMargin
            , constrain(mouseY, this.layout.topMargin, this.layout.bottomMargin)
            , this.layout.rightMargin
            , constrain(mouseY, this.layout.topMargin, this.layout.bottomMargin))
            push()
            strokeWeight(10)
            point(constrain(mouseX, this.layout.leftMargin, this.layout.rightMargin),constrain(mouseY, this.layout.topMargin, this.layout.bottomMargin))
          pop()
          // The number of x-axis labels to skip so tha
          var xLabelSkip = ceil(numYears / this.layout.numXTickLabels);

          //     // Draw the tick label marking the start of the previous year.
          if (i % xLabelSkip == 0) {
            drawXAxisTickLabel(curr.years, this.layout,
              this.mapYearToWidth.bind(this));
          }
        }
        
        if (i != this.Data.length && j != this.Data[i].Stock.getRowCount() - 1) {
          prev = curr
        }
        else {
          prev = undefined
        }
      }
    }
  };
  
  
    
  

  this.drawTitle = function () {
    fill(255);
    noStroke();
    textAlign('center', 'center');
    
    text(this.title,
      (this.layout.plotWidth() / 2) + this.layout.leftMargin,
      this.layout.topMargin - (this.layout.marginSize / 2) -10);
  };

  this.mapYearToWidth = function (value) {
    return map(value,
      this.startYear,
      this.endYear,
      this.layout.leftMargin,   // Draw left-to-right from margin.
      this.layout.rightMargin);
  };

  this.mapPriceToHeight = function (value) {
    return map(value,
      this.MinPrice,
      this.MaxPrice,
      this.layout.bottomMargin, // Smaller pay gap at bottom.
      this.layout.topMargin);   // Bigger pay gap at top.
  };

}
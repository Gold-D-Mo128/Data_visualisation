// const { rejects } = require("node:assert");
// const { create } = require("node:domain");

function PayGapTimeSeries() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Pay gap: 1997-2017';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'pay-gap-timeseries';

  // Title to display above the plot.
  this.title = 'Gender Pay Gap: Average difference between male and female pay.';

    // Names for each axis.
  this.xAxisLabel = 'year';
  this.yAxisLabel = '%';

  var marginSize = 35;

  // Layout object to store all common plot layout parameters and
  // methods.
  this.layout = {
    marginSize: marginSize,

    // Locations of margin positions. Left and bottom have double margin
    // size due to axis and tick labels.
    leftMargin: marginSize * 2,
    rightMargin: width - marginSize,
    topMargin: marginSize + 30,
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
    numXTickLabels: 21,
    numYTickLabels: 10,
  };

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/pay-gap/all-employees-hourly-pay-by-gender-1997-2017.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });

  };

  this.setup = function() {
    // Font defaults.
    textSize(16);

    // Set min and max years: assumes data is sorted by date.
    this.startYear = this.data.getNum(0, 'year');
    this.endYear = this.data.getNum(this.data.getRowCount() - 1, 'year');

    // Find min and max pay gap for mapping to canvas height.
    this.minPayGap = 0;         // Pay equality (zero pay gap).
    this.maxPayGap = max(this.data.getColumn('pay_gap'));
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

    // Plot all pay gaps between startYear and endYear using the width
    // of the canvas minus margins.
    var previous;
    var numYears = this.endYear - this.startYear;

    // Loop over all rows and draw a line from the previous value to
    // the current.
    for (var i = 0; i < this.data.getRowCount(); i++) {

      // Create an object to store data for the current year.
      var current = {
        // Convert strings to numbers.
        'year': this.data.getNum(i, 'year'),
        'payGap': this.data.getNum(i, 'pay_gap')
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
          drawXAxisTickLabel(previous.year, this.layout,
                              this.mapYearToWidth.bind(this));
        }
        fill(0,191,255)

        if(mouseX > this.mapYearToWidth(previous.year) -20 && mouseX < this.mapYearToWidth(previous.year) + 40
        && mouseY > this.mapPayGapToHeight(current.payGap)-20 && mouseY < this.mapPayGapToHeight(current.payGap) + 40)
        {
          console.log(this.data.getNum(i, 'pay_gap').toFixed(2) + "%")
          istruee = true;
          fill(123,104,238)
        }
        if(previous.year == "1997"){
          rect(this.mapYearToWidth(previous.year),this.mapPayGapToHeight(current.payGap),25,25)
        }
        else{

          rect(this.mapYearToWidth(previous.year) - 12.5,this.mapPayGapToHeight(current.payGap)-12.5,25,25)
        }


        if(istruee){
          fill(0, 213, 249)
          rect(this.mapYearToWidth(previous.year) - 40,this.mapPayGapToHeight(current.payGap) -40,90,90)
          push()
          fill(0)
          noStroke()
          textStyle(BOLD);
          textSize(17)
          text( "Pay gap \n" +previous.payGap.toFixed(2) + "%",  this.mapYearToWidth(previous.year) + 7, this.mapPayGapToHeight(current.payGap)-15)
          text( "year \n" + previous.year,  this.mapYearToWidth(previous.year) + 5, this.mapPayGapToHeight(current.payGap)+30)
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
    fill(220);
    noStroke();
    textAlign('center', 'center');
    textSize(22)
    text(this.title,
         (this.layout.plotWidth() / 2) + this.layout.leftMargin ,
         this.layout.topMargin - (this.layout.marginSize / 2) -10);
  };

  this.mapYearToWidth = function(value) {
    return map(value,
               this.startYear,
               this.endYear,
               this.layout.leftMargin,   // Draw left-to-right from margin.
               this.layout.rightMargin);
  };

  this.mapPayGapToHeight = function(value) {
    return map(value,
               this.minPayGap,
               this.maxPayGap,
               this.layout.bottomMargin, // Smaller pay gap at bottom.
               this.layout.topMargin);   // Bigger pay gap at top.
  };
}

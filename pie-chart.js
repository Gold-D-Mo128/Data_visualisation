function PieChart(x, y, diameter) {

  this.x = x;
  this.y = y;
  this.diameter = diameter;
  this.labelSpace = 30;

  this.get_radians = function(data) {
    var total = sum(data);
    var radians = [];

    for (let i = 0; i < data.length; i++) {
      radians.push((data[i] / total) * TWO_PI);
    }

    return radians;
  };
  this.setup = function(){
    arc.mouseOver(console.log(true))
  }

  this.draw = function(data, labels, colours, title) {

    // Test that data is not empty and that each input array is the
    // same length.
    if (data.length == 0) {
      alert('Data has length zero!');
    } else if (![labels, colours].every((array) => {
      return array.length == data.length;
    })) {
      alert(`Data (length: ${data.length})
Labels (length: ${labels.length})
Colours (length: ${colours.length})
Arrays must be the same length!`);
    }

    // https://p5js.org/examples/form-pie-chart.html

    var angles = this.get_radians(data);
    var lastAngle = 0;
    var colour;
    var start;
    var stop;
    let percentage;
    for (var i = 0; i < data.length; i++) {
      if (colours) {
        colour = colours[i];
      } else {
        colour = map(i, 0, data.length, 0, 100);
      }

      fill(colour);
      stroke(0);
      strokeWeight(1);
      
      // Hack for 0!
        
          let distance = dist(this.x,this.y, mouseX, mouseY);
          let angle = acos((mouseX - this.x) / (distance));
          let ang;
          if(distance < diameter/2){
            if(mouseY < this.y){
              angle = TWO_PI - angle;
            }
            if(angle >= lastAngle && angle <= lastAngle + angles[i] + 0.001){
              ang = angles[i];
              arc(this.x, this.y,
                this.diameter, this.diameter,
                lastAngle, lastAngle + angles[i] + 0.001);
              fill(255)
              ellipse(width/2,height/2,200,200)
              fill(0)
              textSize(30)
              let x = angles[i] * 100
              textAlign(CENTER)
              text(Math.round(x) +  "%",(width/2) + 10,height/2)
              console.log(ang+"\n")
              
              fill(123,104,238)
            }
          }
          else{
            arc(this.x, this.y,
              this.diameter, this.diameter,
              lastAngle, lastAngle + angles[i] + 0.001);
              fill(200)
              ellipse(width/2,height/2,200,200)
            
          }
            
            
       
      if (labels) {
        this.makeLegendItem(labels[i], i, colour);
      }
      
      lastAngle += angles[i];
    }
    if (title) {
      noStroke();
      textAlign('center', 'center');
      fill(255)
      textSize(24);
      text(title, this.x, this.y - this.diameter * 0.6);
    }
  };

  this.makeLegendItem = function(label, i, colour) {
    var x = this.x + 50 + this.diameter / 2;
    var y = this.y + (this.labelSpace * 1.5 * i ) - this.diameter / 3;
    var boxWidth = this.labelSpace  / 2;
    var boxHeight = this.labelSpace / 2;
    fill(colour);



    
    rect(x, y, boxWidth + 20, boxHeight +20);

    fill(255);
    noStroke();
    textAlign('left', 'center');
    textSize(20);
    text(label, x + boxWidth + 30, y + boxWidth +10 / 2);
  };
}

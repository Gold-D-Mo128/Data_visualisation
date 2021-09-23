
// Global variable to store the gallery object. The gallery object is
// a container for all the visualisations.
var gallery;

function setup() {
  // Create a canvas to fill the content div from index.html.
  canvasContainer = select('#app');
  var c = createCanvas(1504, 846);
  c.parent('app');

  // Create a new gallery object.
  gallery = new Gallery();

  // Add the visualisation objects here.
  gallery.addVisual(new TechDiversityRace());
  gallery.addVisual(new CovidRecovery2021());
  gallery.addVisual(new TechDiversityGender());
  gallery.addVisual(new Stocks());
  gallery.addVisual(new PayGapTimeSeries());
}

function draw() {
  background("#171717");
  
  if (gallery.selectedVisual != null) {
    gallery.selectedVisual.draw();
  }
}

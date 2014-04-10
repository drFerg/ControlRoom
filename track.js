var scaler = 40;
var halfTrackWidth = 0.445774;
var scaleTrackWidth = halfTrackWidth * 2 * scaler;
var railWidth = 2;
function TrackPiece(name, parts){
  this.name = name;
  this.parts = parts;
}

function End(originX, originY, angle){
  var xpoint = Math.cos((angle) * (Math.PI / 180)).toFixed(2) * halfTrackWidth;
  var ypoint = Math.sin((angle) * (Math.PI / 180)).toFixed(2) * halfTrackWidth;
  this.x1 = scaler * (Math.abs(originX) - xpoint);
  if (originY < 0){
    this.y1 = scaler * (Math.abs(originY) - ypoint);
    this.y2 = scaler * (Math.abs(originY) + ypoint);
  }
  else {
    this.y1 = scaler * (originY-originY*2 - ypoint);
    this.y2 = scaler * (originY-originY*2 + ypoint);
  }
  
  this.angle = (angle) * (Math.PI / 180);
  this.x2 = scaler * (originX + xpoint);
  
  this.width = scaler * 0.1;
}

function Line(colour, width, x1, y1, x2, y2){
  this.colour = colour;
  this.width = scaler * width;
  this.y1 = scaler * (y1 - y1*2);
  this.y2 = scaler * (y2 - y2*2);
  this.x1 = scaler * x1;
  this.x2 = scaler * x2;
  
}

function Straight(colour, width, x1, y1, x2, y2){
  console.log("Straight: " + "c: "+ colour + " w: " + width + " " + x1 + " " + y1 + " " + x2+ " " + y2);
  this.colour = colour;
  this.lineWidth = width;
  this.y1 = scaler * (y1 - y1*2);
  this.y2 = scaler * (y2 - y2*2);
  this.x1 = scaler * x1;
  this.x2 = scaler * x2;
  this.x = x1 * scaler;
  this.y = (y1 -(2*y1) - halfTrackWidth) * scaler;
  this.width = (x2 - x1) * scaler;
  console.log(y2 + "- " + y1 + "+" + (2 * halfTrackWidth));
  this.height = (y2 - y1 + (2 * halfTrackWidth)) * scaler;
}

function Curve(colour, width, radius, x, y, angle, swing){
  this.colour = colour;
  this.width = width * scaler;
  this.radius = Math.abs(radius) * scaler;
  this.x = (x) * scaler;
  if (y < 0){
    this.y = (y + 2 * Math.abs(y)) * scaler;
  }
  else{
    this.y = (y - 2 * y) * scaler;
  }
  this.angle = (angle - 90) * (Math.PI / 180);
  this.endAngle = (angle + swing - 90) * (Math.PI / 180);
  this.ccw = (y < 0 ? false : false);
}

function Arc(colour, width, radius, x, y, angle, swing){
  this.colour = colour;
  this.width = width * scaler;
  this.radius = Math.abs(radius) * scaler;
  this.x = (x) * scaler;
  if (y < 0){
    this.y = (y + 2 * Math.abs(y)) * scaler;
  }
  else{
    this.y = (y - 2 * y) * scaler;
  }
  this.angle = (angle - 90) * (Math.PI / 180);
  this.endAngle = (angle + swing - 90) * (Math.PI / 180);
  this.ccw = (y < 0 ? false : false);
}

function Path(text){
  this.text = text;
}

function TextComment(text){
  this.comment = text;
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function State(group, drawn){
  this.group = group;
  this.drawn = drawn;
}


function drawPart(state, part, i){
  var width = 0;
  var height = 0;
  if (part instanceof Line){
    width = part.x2 - part.x1;
    height = part.y2 - part.y1;
    console.log("Got Line: " + part.x1 + " " + part.y1 + " " + part.x2 + " " + part.y2);
    state.drawn[i] = new Kinetic.Line({
      points: [part.x1, part.y1, part.x2, part.y2],
      stroke: 'black',
      strokeWidth: part.width,
      lineCap: 'square',
      lineJoin: 'miter'
    });
    state.group.add(state.drawn[i]);
  }
  else if (part instanceof End){
    console.log("Got End: " + part.x1 + " " + part.y1 + " " + part.x2 + " " + part.y2);
    state.drawn[i] = new Kinetic.Line({
      points: [part.x1, part.y1, part.x2, part.y2],
      stroke: 'red',
      strokeWidth: part.width,
      lineCap: 'square',
      lineJoin: 'miter'
    });
    state.group.add(state.drawn[i]);
  }
  else if (part instanceof Straight){
    width = part.x2 - part.x1;
    height = part.y2 - part.y1;
    var component = 0;
    state.drawn[i] =  new Array();
    console.log("Got Straight: " + part.x + " " + part.y + " "+ part.width + " " + part.height);
    /* Draw visible track underneath */
    state.drawn[i][component] = new Kinetic.Line({
      points: [part.x1+10, part.y1, part.x2-10, part.y2],
      stroke:'grey',
      opacity: 0.2,
      strokeWidth: scaleTrackWidth,
      lineCap: 'square',
      lineJoin: 'miter'
    });
    state.group.add(state.drawn[i][component++]);
    /* Draw lines */
    for (var j = 1; j < part.width/5; j++){
      state.drawn[i][component] = new Kinetic.Line({
        points: [part.x1 + (j*5), part.y1 - (halfTrackWidth*scaler) +5, part.x2 - (part.width - j*5), part.y2 + (halfTrackWidth*scaler) - 5],
        stroke: 'brown',
        strokeWidth: 3,
        lineCap: 'square',
        lineJoin: 'miter'
      });
      state.group.add(state.drawn[i][component++]);
    } 
    /* Draw top rail */
    state.drawn[i][component] = new Kinetic.Line({
        points: [part.x1, part.y1 + (halfTrackWidth/2*scaler), part.x2 , part.y2 + (halfTrackWidth/2*scaler)],
        stroke: 'silver',
        strokeWidth: railWidth,
        lineCap: 'square',
        lineJoin: 'miter'
      });
    state.group.add(state.drawn[i][component++]);
    /* Draw bottom rail */
    state.drawn[i][component] = new Kinetic.Line({
        points: [part.x1, part.y1 - (halfTrackWidth/2*scaler), part.x2, part.y2 - (halfTrackWidth/2*scaler)],
        stroke: 'silver',
        strokeWidth: railWidth,
        lineCap: 'square',
        lineJoin: 'miter'
      });
    state.group.add(state.drawn[i][component++]);
    /* Draw invisible track to grab */
    state.drawn[i][component] = new Kinetic.Line({
      points: [part.x1+10, part.y1, part.x2-10, part.y2],
      stroke:'rgba(1, 1, 1, 0)',
      strokeWidth: scaleTrackWidth,
      lineCap: 'square',
      lineJoin: 'miter'
    });
    state.group.add(state.drawn[i][component++]);
  }
  else if (part instanceof Curve){
    console.log("Got Curve: " + part.radius + " " + part.x + " " + part.y + " " + part.angle + " " + part.endAngle);
    var component = 0;
    state.drawn[i] =  new Array();
    state.drawn[i][component] = new Kinetic.Shape({
      strokeWidth:scaleTrackWidth,
      stroke:'grey',
      opacity: 0.2,
      sceneFunc: function(context) {
        context.beginPath();
        context.arc(part.x, part.y, part.radius, part.angle, part.endAngle, part.ccw);
        context.strokeShape(this);
      },
    });
    state.group.add(state.drawn[i][component++]);

    state.drawn[i][component] = new Kinetic.Shape({
      strokeWidth:railWidth,
      stroke:'silver',
      sceneFunc: function(context) {
        context.beginPath();
        context.arc(part.x, part.y, part.radius - (halfTrackWidth/2*scaler), part.angle, part.endAngle, part.ccw);
        context.strokeShape(this);
      },
    });
    state.group.add(state.drawn[i][component++]);

    state.drawn[i][component] = new Kinetic.Shape({
      strokeWidth:railWidth,
      stroke:'silver',
      sceneFunc: function(context) {
        context.beginPath();
        context.arc(part.x, part.y, part.radius + (halfTrackWidth/2*scaler), part.angle, part.endAngle, part.ccw);
        context.strokeShape(this);
      },
    });
    state.group.add(state.drawn[i][component++]);

  }
  else if (part instanceof Arc){
    console.log("Got Arc: " + part.radius + " " + part.x + " " + part.y + " " + part.angle + " " + part.endAngle);
    state.drawn[i] = new Kinetic.Shape({
      strokeWidth:part.width,
      stroke:'grey',
      sceneFunc: function(context) {
        context.beginPath();
        context.arc(part.x, part.y, part.radius, part.angle, part.endAngle, part.ccw);
        context.strokeShape(this);
      },
    });
    state.group.add(state.drawn[i]);
  }
  if (state.group.width() < width){
    state.group.width(width);
    state.group.offsetX(width/2);
  }
  if (state.group.height() < height){
    state.group.height(height);
    state.group.offsetY(height/2);
  }
}

function processPiece(trackPiece){
  var parts = trackPiece.parts;
  console.log("there are " + parts.length + " parts");
  var group = new Kinetic.Group({
    x:200,
    y:200,
    rotation:0,
    draggable:true
  });

  var state = new State(group, new Array());
  for(var i = 0; i <= parts.length; i++){
    drawPart(state, parts[i], i);
  }
  state.group.on('mouseover', function() {
        document.body.style.cursor = 'pointer';
      });
  state.group.on('mouseout', function() {
    document.body.style.cursor = 'default';
  });
  state.group.on('dblclick', function(){
    var tween = new Kinetic.Tween({
        node: this, 
        duration: 1,
        rotation: this.rotation() + 45,
        opacity: 1,
      });
    tween.play();
    //this.rotation(this.rotation()+ 45);
    });
  layer.add(state.group);
  stage.add(layer);
  return state;
}


var stage = new Kinetic.Stage({
  container: 'container',
  width: 1920,
  height: 1080
});

var layer = new Kinetic.Layer();


// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
  // Great success! All the File APIs are supported.
} else {
  alert('The File APIs are not fully supported in this browser.');
}

var pieces = new Array();

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
      if (!endsWith(f.name,'.xtp')) {
        alert("Not a valid track file, must end in .xtp");
        continue;
      }

      console.log(f.name)

      var reader = new FileReader();
      reader.onload = (function(theFile) {
        return function(e) {
          // Render thumbnail.
          alert(e.target.result);
          res = trackParser.parse(e.target.result);
          for (var i = 0; i < res.length; i++){
            if (res[i] instanceof TrackPiece){
              console.log(res[i].name + ": " + res[i].parts.length);
              pieces[i] = processPiece(res[i]);
            }
            else console.log(res[i].comment);
            
          }
        };
      })(f);
      reader.readAsText(f);

    }
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
  }

  document.getElementById('files').addEventListener('change', handleFileSelect, false);
  /*'rgba(1, 1, 1, 0)'*/
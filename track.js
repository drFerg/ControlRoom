var scaler = 20;
var halfTrackWidth = 0.445774;
function TrackPiece(name, parts){
  this.name = name;
  this.parts = parts;
}

function End(originX, originY, angle){
  console.log(angle);
  var xpoint = Math.cos(angle * (Math.PI / 180)).toFixed(2) * halfTrackWidth;
  var ypoint = Math.sin(angle * (Math.PI / 180)).toFixed(2) * halfTrackWidth;
  this.x1 = scaler * (originX - xpoint);
  this.y1 = scaler * (originY - ypoint);
  this.angle = angle * (Math.PI / 180);
  this.x2 = scaler * (originX + xpoint);
  this.y2 = scaler * (originY + ypoint);
  this.width = scaler * 0.1;
}

function Line(colour, width, x1, y1, x2, y2){
  this.colour = colour;
  this.width = scaler * width;
  this.x1 = scaler * x1;
  this.y1 = scaler * y1;
  this.x2 = scaler * x2;
  this.y2 = scaler * y2;
}

function Straight(colour, width, x1, y1, x2, y2){
  console.log("Straight: " + "c: "+ colour + " w: " + width + " " + x1 + " " + y1 + " " + x2+ " " + y2);
  this.colour = colour;
  this.lineWidth = width;
  this.x = x1 * scaler;
  this.y = y1- halfTrackWidth * scaler;
  this.width = (x2 - x1) * scaler;
  console.log(y2 + "- " + y1 + "+" + (2* halfTrackWidth));
  this.height = (y2 - y1 + 2 * halfTrackWidth) * scaler;
}

function Curve(colour, width, radius, x, y, angle, swing){
  this.colour = colour;
  this.width = width * scaler;
  this.radius = radius * scaler;
  this.x = x * scaler;
  this.y = Math.abs(y) * scaler;
  this.angle = angle * (Math.PI / 180);
  this.swing = swing * (Math.PI / 180);
  this.ccw = (y < 0 ? true : false);
}

function Arc(colour, width, radius, x, y, angle, swing){
  this.colour = colour;
  this.width = width * scaler;
  this.radius = Math.abs(radius) * scaler;
  this.x = x * scaler;
  this.y = Math.abs(y) * scaler;
  this.angle = -angle + 90 * (Math.PI / 180);
  this.swing = -swing * (Math.PI / 180);
  this.ccw = (y < 0 ? true : false);
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
    if (parts[i] instanceof Line){
      console.log("Got Line: " + parts[i].x1 + " " + parts[i].y1 + " " + parts[i].x2 + " " + parts[i].y2);
      state.drawn[i] = new Kinetic.Line({
        points: [parts[i].x1, parts[i].y1, parts[i].x2, parts[i].y2],
        stroke: 'grey',
        strokeWidth: parts[i].width,
        lineCap: 'square',
        lineJoin: 'miter'
      });
      state.group.add(state.drawn[i]);
    }
    else if (parts[i] instanceof End){
      console.log("Got End: " + parts[i].x1 + " " + parts[i].y1 + " " + parts[i].x2 + " " + parts[i].y2);
      state.drawn[i] = new Kinetic.Line({
        points: [parts[i].x1, parts[i].y1, parts[i].x2, parts[i].y2],
        stroke: 'red',
        strokeWidth: parts[i].width,
        lineCap: 'square',
        lineJoin: 'miter'
      });
      state.group.add(state.drawn[i]);
    }
    else if (parts[i] instanceof Straight){
      console.log("Got Straight: " + parts[i].x + " " + parts[i].y);
      state.drawn[i] = new Kinetic.Rect({
        x: parts[i].x,
        y: parts[i].y,
        width: parts[i].width,
        height: parts[i].height,
      });
      state.group.add(state.drawn[i]);
    }
    else if (parts[i] instanceof Curve){
      console.log("Got Curve: " + parts[i].radius + " " + parts[i].x + " " + parts[i].y + " " + parts[i].angle + " " + parts[i].swing);
      var x = parts[i].x;
      var y = parts[i].y;
      var radius = parts[i].radius;
      var angle = parts[i].angle;
      var swing = parts[i].swing;
      var width = parts[i].width;
      var ccw = parts[i].ccw;
      state.drawn[i] = new Kinetic.Shape({
        sceneFunc: function(context) {
          context.beginPath();
          context.arc(x, y, radius, angle, swing, ccw);
          context.lineWidth = width;
          context.strokeStyle = 'grey';
          context.stroke();
          //context.closePath();
        },
      });
      state.group.add(state.drawn[i]);
      layer.add(state.group);
      stage.add(layer);
    }
    else if (parts[i] instanceof Arc){
      console.log("Got Arc: " + parts[i].radius + " " + parts[i].x + " " + parts[i].y + " " + parts[i].angle + " " + parts[i].swing);
      var x = parts[i].x;
      var y = parts[i].y;
      var radius = parts[i].radius;
      var angle = parts[i].angle;
      var swing = parts[i].swing;
      var width = parts[i].width;
      var ccw = parts[i].ccw;
      state.drawn[i] = new Kinetic.Shape({
        sceneFunc: function(context) {
          context.beginPath();
          context.arc(x, y, radius, angle, swing, ccw);
          context.lineWidth = width;
          this.stroke(context);
          context.stroke();
          //context.closePath();
        },
        stroke:"red"
      });
      state.group.add(state.drawn[i]);
      layer.add(state.group);
      stage.add(layer);
    }
  }
  state.group.on('mouseover', function() {
        document.body.style.cursor = 'pointer';
      });
  state.group.on('mouseout', function() {
    document.body.style.cursor = 'default';
  });
  layer.add(state.group);
  stage.add(layer);
  return state;
}


var stage = new Kinetic.Stage({
  container: 'container',
  width: 1024,
  height: 900
});

var layer = new Kinetic.Layer();

var customShape = new Kinetic.Shape({
      x:200,
    y:200,
sceneFunc: function(context) {
    context.beginPath();
    context.arc(178.99422, 0, 170.07874, 1.5707963267948966, -0.7853981633974483, false);
    context.stroke();
    context.closePath();
    //context.fillStrokeShape(this);
  }
});
layer.add(customShape);
stage.add(layer);
customShape = new Kinetic.Shape({
      x:200,
    y:200,
sceneFunc: function(context) {
    context.beginPath();
    context.arc(161.16326, 0, 170.07874, 1.5707963267948966, -0.7853981633974483, false);
    context.stroke();
    context.closePath();
    //context.fillStrokeShape(this);
  }
});
layer.add(customShape);
stage.add(layer);

customShape = new Kinetic.Shape({
      x:200,
    y:200,
sceneFunc: function(context) {
    context.beginPath();
    context.arc(41.16326, 0 - 169.16326, 170.07874 + 169.16326, 0, 6.283185307179586, false);
    context.stroke();
    context.closePath();
    //context.fillStrokeShape(this);
  }
});
layer.add(customShape);
stage.add(layer);

var ustomShape = new Kinetic.Shape({
  x: 5,
  y: 10,
  fill: 'red',
  // a Kinetic.Canvas renderer is passed into the drawFunc function
  drawFunc: function(context) {
    context.beginPath();
    context.moveTo(100, 50);
    context.lineTo(420, 80);
    context.quadraticCurveTo(300, 100, 260, 170);
    context.stroke();
    context.closePath();
    //context.fillStrokeShape(this);
  }
});
layer.add(ustomShape);
stage.add(layer);
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
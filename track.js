var scaler = 20;
var halfTrackWidth = 0.445774;

function Edge(originX, originY, angle){
var xpoint = Math.cos(angle * (Math.PI / 180)).toFixed(2) * halfTrackWidth;
var ypoint = Math.sin(angle * (Math.PI / 180)).toFixed(2) * halfTrackWidth;
this.x1 = scaler * (originX - xpoint);
this.y1 = scaler * (originY - ypoint);
this.angle = angle;
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
  this.colour = colour;
  this.lineWidth = width;
  this.x = x1 * scaler;
  this.y = y1- halfTrackWidth * scaler;
  this.width = (x2 - x1) * scaler;
  this.height = (y2 - y1 + 2*halfTrackWidth) * scaler;
}

var commands = new Array();
commands[0] = new Line(11579568, 0.053333, 0.000000, 0.445774, 9.763779, 0.445774);
commands[1] = new Line(11579568, 0.053333, 0.000000, -0.445774, 9.763779, -0.445774);
commands[2] = new Edge(0.000000, 0.000000, 270.000000);
commands[3] = new Edge(9.763779, 0.000000, 90.000000);
commands[4] = new Straight(0, 0, 0.000000, 0.000000, 9.763779, 0.000000);

var stage = new Kinetic.Stage({
  container: 'container',
  width: 1024,
  height: 900
});
var layer = new Kinetic.Layer();


var toDraw = new Array();
var group = new Kinetic.Group({
  x:200,
  y:200,
  rotation:0,
  draggable:true
});

for(var i = 0; i < commands.length;i++){
  if (commands[i] instanceof Line){
    toDraw[i] = new Kinetic.Line({
      points: [commands[i].x1, commands[i].y1, commands[i].x2, commands[i].y2],
      stroke: 'red',
      strokeWidth: commands[i].width,
      lineCap: 'round',
      lineJoin: 'bevel'
    });
    group.add(toDraw[i]);
  }
  else if (commands[i] instanceof Edge){
    toDraw[i] = new Kinetic.Line({
      points: [commands[i].x1, commands[i].y1, commands[i].x2, commands[i].y2],
      stroke: 'red',
      strokeWidth: commands[i].width,
      lineCap: 'round',
      lineJoin: 'bevel'
    });
    group.add(toDraw[i]);
  }
  else if (commands[i] instanceof Straight){
    toDraw[i] = new Kinetic.Rect({
      x: commands[i].x,
      y: commands[i].y,
      width: commands[i].width,
      height: commands[i].height,
    });
    group.add(toDraw[i]);
  }
}
group.on('mouseover', function() {
      document.body.style.cursor = 'pointer';
    });
group.on('mouseout', function() {
  document.body.style.cursor = 'default';
});
layer.add(group);
//layer.add(track);
stage.add(layer);


var res = trackParser.parse('TURNOUT N "Kato Unitrack  Straight 9.75 248mm 20-000"\n\
\tP "Normal" 1\n\
\tE 0.000000 0.000000 270.000000\n\
\tE 9.763779 0.000000 90.000000\n\
\tS 0 0 0.000000 0.000000 9.763779 0.000000\n\
\tL 11579568 0.053333 0.000000 0.445774 9.763779 0.445774\n\
\tL 11579568 0.053333 0.000000 -0.445774 9.763779 -0.445774\n\
\tEND');

console.log(res[1][1][3]);
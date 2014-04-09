start = block*

block = tab* name:turnout newline cs:components+ tab* end newline* {return new TrackPiece(name, cs);}
      / comments:comment+ {return new TextComment(comments.join(""))}

components = tab* c:component newline+{return c;}

component = paths
     / trackend
     / straight
     / line
     / curve
     / arc

turnout = "TURNOUT N" space+ name:string {return name;} 

paths = text:('P "Normal" 1') {return new Path(text);} 

trackend = type:"E" space x:decimal space y:decimal space angle:decimal {return new End(x, y, angle);}

straight = type:"S" space colour:integer space width:decimal space x1:decimal space y1:decimal space x2:decimal space y2:decimal {return new Straight(colour, width, x1, y1, x2, y2);}
/ type:"S" space colour:integer space width:integer space x1:decimal space y1:decimal space x2:decimal space y2:decimal {return new Straight(colour, width, x1, y1, x2, y2);}

curve = type:"C" space colour:integer space width:decimal space radius:decimal space x:decimal space y:decimal space angle:decimal space swing:decimal {return new Curve(colour, width, radius, x, y, angle, swing);}
/ type:"C" space colour:integer space width:integer space radius:decimal space x:decimal space y:decimal space angle:decimal space swing:decimal {return new Curve(colour, width, radius, x, y, angle, swing);}

line = type:"L" space colour:integer space width:decimal space x1:decimal space y1:decimal space x2:decimal space y2:decimal {return new Line(colour, width, x1, y1, x2, y2);}

arc = type:"A" space colour:integer space width:decimal space radius:decimal space x:decimal space y:decimal space angle:decimal space swing:decimal {return new Arc(colour, width, radius, x, y, angle, swing);}


end = "END"
decimal = negative:"-"? ldigits:[0-9]+ dot:(".") rdigits:[0-9]+ {var i = parseFloat(ldigits.join("") + dot + rdigits.join(""), 10); return (negative? -i: i);}

integer = digits:[0-9]+ {return parseInt(digits.join(""),20);}

string = '"' name:([^'"']*) '"' {return name.join("");} 
newline = "\n"
tab = "\t"
space = " "
comment = tab* "#" text:[^\n]* newline+ {return text.join("");}
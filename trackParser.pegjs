start = c:contents newline comment+ s:subcontents* {
    var words = c.split(" ");
    for (var i = 0; i < s.length; i++){
        s[i].name = s[i].name.replace(c,"").trim();
        for (var j = 0; j < s[i].blocks.length; j++){
            if (s[i].blocks[j] instanceof TrackPiece){
                for (var str = 0; str < words.length; str++){
                    console.log(s[i].blocks[j].name + ":" + words[str]);
                    s[i].blocks[j].name = s[i].blocks[j].name.replace(words[str], "").trim();
                }
            }
            else {
                s[i].count -= 1;
                console.log(s[i].count);
            }
        }
    }
    return {"name":c, "packs":s};
}
contents = type:"CONTENTS" name:[^'\n']* {return name.join("");}
subcontents = name:subcontent newline blocks:block* {return {"name":name, "url":name.replace(/ /g,'_'), "count":blocks.length, "blocks":blocks}}

subcontent = type:"SUBCONTENTS" name:[^'\n']* {return name.join("");}

block = tab* space* name:turnout newline cs:components+ tab* space* end newline* {return new TrackPiece(name, cs);}
      / tab* space* name:structure newline cs:components+ tab* space* end newline* {return new TrackPiece(name, cs);}
      / comments:comment+ {return new TextComment(comments.join(""))}

components = tab* space* c:component newline+{return c;}

component = paths
     / trackend
     / straight
     / line
     / curve
     / arc
     / x

turnout = "TURNOUT N" space+ name:string {return name;} 
structure = "STRUCTURE N" space+ name:string {return name;}

paths = type:"P" text:[^'\n']* {return new Path(text.join(""));} 

trackend = type:"E" space x:decimal space y:decimal space angle:decimal {return new End(x, y, angle);}

straight = type:"S" space colour:integer space width:decimal space x1:decimal space y1:decimal space x2:decimal space y2:decimal {return new Straight(colour, width, x1, y1, x2, y2);}
/ type:"S" space colour:integer space width:integer space x1:decimal space y1:decimal space x2:decimal space y2:decimal {return new Straight(colour, width, x1, y1, x2, y2);}

curve = type:"C" space colour:integer space width:decimal space radius:decimal space x:decimal space y:decimal space angle:decimal space swing:decimal {return new Curve(colour, width, radius, x, y, angle, swing);}
/ type:"C" space colour:integer space width:integer space radius:decimal space x:decimal space y:decimal space angle:decimal space swing:decimal {return new Curve(colour, width, radius, x, y, angle, swing);}

line = type:"L" space colour:integer space width:decimal space x1:decimal space y1:decimal space x2:decimal space y2:decimal {return new Line(colour, width, x1, y1, x2, y2);}

arc = type:"A" space colour:integer space width:decimal space radius:decimal space x:decimal space y:decimal space angle:decimal space swing:decimal {return new Arc(colour, width, radius, x, y, angle, swing);}
x = type:"X" space text:[^'\n']*

end = "END"
decimal = negative:"-"? ldigits:[0-9]+ dot:(".") rdigits:[0-9]+ {var i = parseFloat(ldigits.join("") + dot + rdigits.join(""), 10); return (negative? -i: i);}

integer = digits:[0-9]+ {return parseInt(digits.join(""),20);}

string = '"' name:([^'"']*) '"' {return name.join("");} 
newline = "\n"
tab = "\t"
space = " "
comment = tab* "#" text:[^\n]* newline+ {return text.join("");}
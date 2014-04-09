      var rect = new Kinetic.Rect({
        x: 50,
        y: 200,
        width: 300,
        height: 70,
        fill: 'blue',
        stroke: 'black',
        strokeWidth: 4
      });

      var circle = new Kinetic.Circle({
        x: stage.getWidth() / 2,
        y: stage.getHeight() / 2,
        radius: 70,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 4,
        draggable: true
      });

      var redLine = new Kinetic.Line({
        points: [73, 70, 340, 23, 450, 60, 500, 20],
        stroke: 'red',
        strokeWidth: 15,
        lineCap: 'round',
        lineJoin: 'round'
      });
      redLine.move({x:0,y:5});
      // add the shape to the layer
      //layer.add(redLine);
      //layer.add(circle);
      //layer.add(rect);

      var simpleText = new Kinetic.Text({
        x: stage.width() / 2,
        y: 15,
        text: 'Simple Text',
        fontSize: 30,
        fontFamily: 'Calibri',
        fill: 'green'
      });
      var complexText = new Kinetic.Text({
        x: 100,
        y: 60,
        text: 'COMPLEX TEXT\n\nAll the world\'s a stage, and all the men and women merely players. They have their exits and their entrances.',
        fontSize: 18,
        fontFamily: 'Calibri',
        fill: '#555',
        width: 380,
        padding: 20,
        align: 'center'
      });
      var rect = new Kinetic.Rect({
        x: 100,
        y: 60,
        stroke: '#555',
        strokeWidth: 5,
        fill: '#ddd',
        width: 380,
        height: complexText.height(),
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffset: {x:10,y:10},
        shadowOpacity: 0.2,
        cornerRadius: 10,
        draggable: true
      });
      layer.add(simpleText);
      //layer.add(rect);
      //layer.add(complexText);
      // add cursor styling
      circle.on('mouseover', function() {
        document.body.style.cursor = 'pointer';
      });
      circle.on('mouseout', function() {
        document.body.style.cursor = 'default';
      });

// All the code in canvas can be seperated into it's own class's easier down the line including undo and redo history
var canvasDemo = (function()
{
    var canvasSize = document.getElementById('canvas');

    // Need to fix some these things
    // Better off writing some resize code for this
    canvasSize.setAttribute('width', window.innerWidth - 250);
    canvasSize.setAttribute('height', window.innerHeight - 150);
    var grid =  25;
    var canvasWidth =  window.innerWidth - 220;
    var canvasHeight =  window.innerWidth - 220;
    
    var canvas = new fabric.Canvas('canvas');

    var _config = 
    {

      canvasState             : [],
      currentStateIndex       : 0,
      undoStatus              : false,
      redoStatus              : false,
      undoFinishedStatus      : 1,
      redoFinishedStatus      : 1,
      count                   : 0,
      undoButton              : document.getElementById('undo'),
      redoButton              : document.getElementById('redo'),
      addRectangleButton      : document.getElementById('addRectangleButton'),
      addCircleButton         : document.getElementById('addCircleButton'),
      addTextBoxButton        : document.getElementById('addTextBoxButton'),
      addActorButton          : document.getElementById('addActorButton'),
      addEllipseButton		: document.getElementById('addEllipseButton'),
      addLabelButton			: document.getElementById('addLabelButton'),
      addGenArrowButton		: document.getElementById('addGenArrowButton'),
      addDashedArrowButton	: document.getElementById('addDashedArrowButton'),
      addComLineButton		: document.getElementById('addComLineButton'),
      // Waiting for Pauls updated code before adding it
      addLineButton           : document.getElementById('addLineButton'),

    };
    // Any Object selected get sent to the front of the canvas
    canvas.on('object:selected', function(event) 
    {
      var object = event.target;
      canvas.bringToFront(object);
    });
    // These two canvas.on functions record for the UNDO and REDO features
    canvas.on('object:modified', function()
    {
        updateCanvasState();
    });
  
    canvas.on('object:added', function()
    {
      updateCanvasState();
    });
    /* Canvas Out of Bounds Code */
    canvas.on('object:moving', function (e) 
    {
      var obj = e.target;
      // if object is too big ignore
      if (obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width) 
      {
        return;
      }
      obj.setCoords();
      // top-left  corner
      if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) 
      {
        obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top);
        obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left);
      }
      // bot-right corner
      if (obj.getBoundingRect().top + obj.getBoundingRect().height > obj.canvas.height || obj.getBoundingRect().left + obj.getBoundingRect().width > obj.canvas.width) 
      {
        obj.top = Math.min(obj.top, obj.canvas.height - obj.getBoundingRect().height + obj.top - obj.getBoundingRect().top);
        obj.left = Math.min(obj.left, obj.canvas.width - obj.getBoundingRect().width + obj.left - obj.getBoundingRect().left);
      }
    });

    // snap to grid
    canvas.on('object:moving', function (options) 
    {
      options.target.set({
        left: Math.round(options.target.left / grid) * grid,
        top: Math.round(options.target.top / grid) * grid
	    });

    });
    // Object scale code
    canvas.on('object:scaling', function(e) {
      if (e.target != null) {
        console.log(e.target);
        var obj = e.target;
            var height = obj.height * obj.scaleY;
            var width = obj.width * obj.scaleX;
            obj.height = height;
            obj.width = width;
            obj.scaleX = 1;
            obj.scaleY = 1;
      }
    });

    /* Code to prevent shapes from touching */
    var left1 = 0;
    var top1 = 0;
    var scale1x = 0;
    var scale1y = 0;
    var width1 = 0;
    var height1 = 0;
    canvas.on('object:scaling', function (e) 
    {
      var obj = e.target;
      obj.setCoords();
      var brNew = obj.getBoundingRect();

      if (((brNew.width + brNew.left) >= obj.canvas.width) || ((brNew.height + brNew.top) >= obj.canvas.height) || ((brNew.left < 0) || (brNew.top < 0))) 
      {
        obj.left = left1;
        obj.top = top1;
        obj.scaleX = scale1x;
        obj.scaleY = scale1y;
        obj.width = width1;
        obj.height = height1;
      } 
      else 
      {
        left1 = obj.left;
        top1 = obj.top;
        scale1x = obj.scaleX;
        scale1y = obj.scaleY;
        width1 = obj.width;
        height1 = obj.height;
      }
    });
    /* Code to prevent shapes from touching */

    // Add all the differnt objects here
    var addRectangle = function()
    {
       var rect = new fabric.Rect({
              left   : 100,
              top    : 100,
              fill   : 'red',
              width  : 50,
              height : 50,
              originX: 'left',
              originY: 'top',
              type: 'rect',
              centeredRotation: true,
              shadow: 'rgba(0,0,0,0.4) 5px 5px 7px'
      });
            canvas.add(rect);
            canvas.setActiveObject(rect);
            canvas.renderAll();
    }
    var addCircle = function()
    {
       var circle = new fabric.Circle({
              left   : 300,
              top    : 300,
              radius : 50,
              fill   : 'red',
              originX: 'left',
              originY: 'top',
              type: 'circle',
              centeredRotation: true,
              shadow: 'rgba(0,0,0,0.4) 5px 5px 7px'
      });
            canvas.add(circle);
            canvas.setActiveObject(circle);
            canvas.renderAll();
    }
    // Go in and find out how to make textboxes work together
    var addTextBox = function(text)
    {
        var originalRender = fabric.Textbox.prototype._render;
    fabric.Textbox.prototype._render = function(ctx) {
      originalRender.call(this, ctx);
      //Don't draw border if it is active(selected/ editing mode)
      // These if statements make it go away
      //if (this.active) return;
      //if(this.showTextBoxBorder)
      //{
        var w = this.width,
          h = this.height,
          x = -this.width / 2,
          y = -this.height / 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + w, y);
        ctx.lineTo(x + w, y + h);
        ctx.lineTo(x, y + h);
        ctx.lineTo(x, y);
        ctx.closePath();
        var stroke = ctx.strokeStyle;
        ctx.strokeStyle = this.textboxBorderColor;
        ctx.stroke();
        ctx.strokeStyle = stroke;
    
        
      //}
    }
    fabric.Textbox.prototype.cacheProperties = fabric.Textbox.prototype.cacheProperties.concat('active');

    // Add a function to add    \n_______________\n So users do not have to manualy add it
    // But also leave in the ablity for the user to use underscores if they are to lazy to learn where the button is? 
      var textbox = new fabric.Textbox("TITLE\n_______________\n - method()1\n - method()2", {
        left: 50,
        top: 50,
        width: 100,
        fontSize: 12,
        fontFamily: 'Arial',
        backgroundColor: 'white',
        borderColor: 'red',
        editingBorderColor: 'blue',
        padding: 2,
        textboxBorderColor: 'black',
        showTextBoxBorder: true,
      });
    
    canvas.add(textbox);

    
    }
    //
    // Add Line Function
	function addLine(){
    isDown = true;
      canvas.on('mouse:down', function (o) {
          //if (isAngleDrawing == "1") {
              canvas.selection = false;
              isDownAngle = true;
              var pointer = canvas.getPointer(o.e);
              var points = [pointer.x, pointer.y, pointer.x, pointer.y];
   
              line = new fabric.Line(points, {
                  strokeWidth: 2,
                  fill: 'black',
                  stroke: 'black',
                  originX: 'center',
                  originY: 'center'
  
              });
              line.line1 = line;
              canvas.add(line);
          //}
      });
   
      canvas.on('mouse:move', function (o) {
          if (!isDownAngle)
              return;
          //if (isAngleDrawing == "1") {
              var pointer = canvas.getPointer(o.e);
              line.set({x2: pointer.x, y2: pointer.y});
              canvas.renderAll();
          //}
      });
   
      canvas.on('mouse:up', function (o) {
         
              isDownAngle = false;
             
    });
    }
    
    
    
    // Class Diagram Objects End
    
    // Use Case Objects 
    
    // Actor Start
    var addActor = function(){
    fabric.Image.fromURL('images/ActorCanvas.png', function(img) {
      img.scale(0.5).set({
      left: 150,
      top: 150,
      angle: 0,
    shadow: 'rgba(0,0,0,0.4) 5px 5px 7px'
    });
    img.setControlsVisibility({
      bl: true, // bottom left enable
    tm: false, // top middle disable
    ml: false,  // middle left disable
    mr: false, // middle right disable
      br: true, // bottom right disable
      tl: true, // top left disable
      tr: true, // top right disable
      mt: false, // middle top Disable
      mb: false, // middle top Disable
  });
    canvas.add(img).setActiveObject(img);
    });
    }
    // Actor Ends
    
    // Ellipse Starts
    
    var addEllipse = function()  {
    var ellipse = new fabric.Ellipse({
    left: 150,
    top: 20,
    rx: 125,
    ry: 50,
    stroke: 'black',
    strokeWidth: 1,
    fill: 'rgba(0,0,0,0)',
    shadow: 'rgba(0,0,0,0.4) 5px 5px 7px'
    });
    
    canvas.add(ellipse);
    }
    // Ellipse Ends 
    
    // Label Starts 
    
    var addLabel = function() {
      
    var t1 = new fabric.Textbox('LABEL', {
      width: 150,
      top: 5,
      left: 5,
      fontSize: 20,
      textAlign: 'center',
      fixedWidth: 150,
    });
  
    canvas.on('text:changed', function(opt) {
    var t1 = opt.target;
    if (t1.width > t1.fixedWidth) {
      t1.fontSize *= t1.fixedWidth / (t1.width + 1);
      t1.width = t1.fixedWidth;
    }
    });
  
    canvas.add(t1);
      
    }
    // Label Ends 
    
    // Generalization arrow 
    var addGenArrow = function() {
    fabric.Image.fromURL('images/ArrowCanvas.png', function(img) {
      img.scale(0.5).set({
      left: 150,
      top: 150,
      angle: 0
    });
    
    canvas.add(img).setActiveObject(img);
    });
          
    }
    // Generalization arrow ends
    
    // Dash Arrow Start (Include and Extends Arrows)
    var addDashedArrow = function(){
      
    fabric.Image.fromURL('images/DashArrowCanvas.png', function(img) {
      img.scale(0.5).set({
      left: 150,
      top: 150,
      angle: 0
    });
    
    canvas.add(img).setActiveObject(img);
    });
        
    }
    
    // Dash Arrow Ends (Include and Extends Arrows)
    
    // Communication Link Line Starts (Include and Extends Arrows)
    var addComLine = function(){
      
    fabric.Image.fromURL('images/CommCanvas.png', function(img) {
      img.scale(0.5).set({
      left: 150,
      top: 150,
      angle: 0
    });
    canvas.add(img).setActiveObject(img);
    });
        
    }
    //


    // CanvasGird should be fixed to allow resizing
    var  CanvasGrid = function() 
    {
                   
      for (var i = 0; i < (canvasWidth / grid); i++) 
      {
        canvas.add(new fabric.Line([i * grid, 0, i * grid, canvasHeight], 
        {
          stroke: '#ccc',
          selectable: false,
          evented: false,
          saved: true

        }));
        canvas.add(new fabric.Line([0, i * grid, canvasWidth, i * grid], 
        {
          stroke: '#ccc',
          selectable: false,
          evented: false,
          saved: true

        }));
      }
    }

    /* Name (Type) of objects to delete so we can use the "new" feature */
    var deleteList = function(listItems) 
    {
      if (listItems !== undefined) 
      {
        var len = listItems.length;
        var list = []
        for (var i = 0; i < len; i += 1) 
        {
          var item = listItems[i];
          if (item.type === "rect") 
          {
            list.push(item);
          }
          if (item.type === "circle") 
          {
            list.push(item);
          }
          if (item.type === "text") 
          {
            list.push(item);
          }
          if (item.type === "line") 
          {
            list.push(item);
          }
        }
        len = list.length;
        for (var i = 0; i < len; i += 1)
        {
          canvas.remove(list[i]);
        }
      }
    }

    /*Delete Object Method*/
    $("#deleteObj").on('click', function (e) {
      canvas.getActiveObjects().forEach((obj) => {
        canvas.remove(obj)
        updateCanvasState();
      });
      canvas.discardActiveObject().renderAll()
    });


  
    var updateCanvasState = function() 
    {
      if((_config.undoStatus == false && _config.redoStatus == false))
      {
        var jsonData        = canvas.toJSON();   
        // Make sure other lines do not use stroke "#ccc" for other lines
        if(jsonData.objects[jsonData.objects.length-1].saved == true )
        {
          //This makes sure to start allowing undo to work only after these gridelines are made
          _config.count = jsonData.objects.length-1;
          _config.currentStateIndex = jsonData.objects.length-1;
          _config.canvasState.length = jsonData.objects.length-1;
        }

        var canvasAsJson        = JSON.stringify(jsonData);

          // Need to block _config.currentStateIndex from increasing when new file or load file is called    
          if(_config.currentStateIndex < _config.canvasState.length-1)
          {
            var indexToBeInserted                  = _config.currentStateIndex+1;
            _config.canvasState[indexToBeInserted] = canvasAsJson;
            var numberOfElementsToRetain           = indexToBeInserted+1;
            _config.canvasState                    = _config.canvasState.splice(0,numberOfElementsToRetain);
          }
          else
          {
            _config.canvasState.push(canvasAsJson);
          }
            
        _config.currentStateIndex = _config.canvasState.length-1;
        if((_config.currentStateIndex == _config.canvasState.length-1) && _config.currentStateIndex != -1)
        {
        _config.redoButton.disabled= "disabled";
        }
      }
    }

   
    var undo = function() 
    {
        if(_config.undoFinishedStatus)
        {
            if(_config.currentStateIndex == _config.count)
            {
              _config.undoStatus = false;
            }
            else
            {
              if (_config.canvasState.length >= 1) 
              {
                _config.undoFinishedStatus = 0;
              if(_config.currentStateIndex != _config.count)
              {
                _config.undoStatus = true;
                canvas.loadFromJSON(_config.canvasState[_config.currentStateIndex-1],function()
                {
                  var jsonData = JSON.parse(_config.canvasState[_config.currentStateIndex-1]);
                  canvas.renderAll();
                  _config.undoStatus = false;
                  _config.currentStateIndex -= 1;
                  _config.undoButton.removeAttribute("disabled");
                    if(_config.currentStateIndex !== _config.canvasState.length-1)
                    {
                      _config.redoButton.removeAttribute('disabled');
                    }
                  _config.undoFinishedStatus = 1;
                });
              }
                else if(_config.currentStateIndex == _config.count)
                {
                  canvas.clear();
                  _config.undoFinishedStatus = 1;
                  _config.undoButton.disabled= "disabled";
                  _config.redoButton.removeAttribute('disabled');
                  _config.currentStateIndex -= 1;
                }
              }
            }
        }
    }
    
    var redo = function() 
    {
      if(_config.redoFinishedStatus)
      {
        if((_config.currentStateIndex == _config.canvasState.length-1) && _config.currentStateIndex != -1)
        {
          _config.redoButton.disabled= "disabled";
        }
        else
        {
          if (_config.canvasState.length > _config.currentStateIndex && _config.canvasState.length != 0)
          {
            _config.redoFinishedStatus = 0;
            _config.redoStatus = true;
            canvas.loadFromJSON(_config.canvasState[_config.currentStateIndex+1],function()
            {
              var jsonData = JSON.parse(_config.canvasState[_config.currentStateIndex+1]);
              canvas.renderAll();
              _config.redoStatus = false;
              _config.currentStateIndex += 1;

              if(_config.currentStateIndex != _config.count)
              {
                  _config.undoButton.removeAttribute('disabled');
              }
              _config.redoFinishedStatus = 1;

              if((_config.currentStateIndex == _config.canvasState.length-1) && _config.currentStateIndex != -1)
              {
                _config.redoButton.disabled= "disabled";
              }
            });
          }
        }
      }
    }
      // Change these all to variables?
       /*Save File Method*/
    $("#saveFile").click(function (event) 
    {
      var jsonData = canvas.toJSON(["selectable", "evented"]);
      /* Act on the event */
      // Figure out how to save objects and then
      // Save must have Always ask you where to save files to change name of file
      //for( i = _config.count; i < _config.canvasState.length; i++)
      //{
      //  jsonData.objects[i].saved = true;
      //}
      var data = JSON.stringify(jsonData );
      
      SaveAsFile(data, "UML_EDITOR_SET_FILE.json", "text/plain;charset=utf-8");
    
    });
    
    /* Load File Method */
    $("#loadFile").on('click', function (e) 
    {
      e.preventDefault();
      $("#loadFileInput:hidden").trigger('click');
      var fileInput = document.getElementById('loadFileInput');

      fileInput.addEventListener('change', function (e) 
      {
      var file = fileInput.files[0];

      var reader = new FileReader();
    reader.onload = function (e) 
    {
      // Clears all infromation
      canvas.clear();
      canvas.loadFromJSON(reader.result);
    }
        reader.readAsText(file);
      });
    });

      /*New File Method*/
      $("#newFile").click(function (event) 
      {
        // Here we can replace with basic template or leave as it is.
        canvas.loadFromJSON('{}');
        CanvasGrid();
      });
    
      
       return {
          addRectangle  : addRectangle,
          addCircle     : addCircle,
          addLine       : addLine,
          addTextBox    : addTextBox,
          addActor		: addActor,
          addEllipse	: addEllipse,
          addLabel		: addLabel,
          addGenArrow   : addGenArrow,
          addDashedArrow : addDashedArrow,
          addComLine	: addComLine,
          CanvasGrid    : CanvasGrid,
          deleteList    : deleteList,
          undoButton : _config.undoButton,
          redoButton : _config.redoButton,
          addRectangleButton : _config.addRectangleButton,
          addCircleButton   : _config.addCircleButton,
          addTextBoxButton  : _config.addTextBoxButton,
          addActorButton    : _config.addActorButton,
          addEllipseButton	: _config.addEllipseButton,
          addLabelButton 	: _config.addLabelButton,
          addGenArrowButton : _config.addGenArrowButton,
          addDashedArrowButton : _config.addDashedArrowButton,
          addComLineButton	: _config.addComLineButton,
          addLineButton     : _config.addLineButton,
          //classActiveHideRestButtons : classActiveHideRestButtons,
          undo       : undo,
          redo       : redo,
              }
    })();
  
    canvasDemo.undoButton.addEventListener('click',function(){
      canvasDemo.undo();
});

canvasDemo.redoButton.addEventListener('click',function(){
      canvasDemo.redo();
});
canvasDemo.addRectangleButton.addEventListener('click',function(){
      canvasDemo.addRectangle()
});
canvasDemo.addCircleButton.addEventListener('click',function(){
    canvasDemo.addCircle()
});
canvasDemo.addTextBoxButton.addEventListener('click',function(){
    canvasDemo.addTextBox()
});
canvasDemo.addActorButton.addEventListener('click',function(){
    canvasDemo.addActor()
});
canvasDemo.addEllipseButton.addEventListener('click',function(){
    canvasDemo.addEllipse()
});
canvasDemo.addLabelButton.addEventListener('click',function(){
    canvasDemo.addLabel()
});
canvasDemo.addGenArrowButton.addEventListener('click',function(){
    canvasDemo.addGenArrow()
});
canvasDemo.addDashedArrowButton.addEventListener('click',function(){
    canvasDemo.addDashedArrow()
});
canvasDemo.addComLineButton.addEventListener('click',function(){
    canvasDemo.addComLine()
});
canvasDemo.addLineButton.addEventListener('click',function(){
    canvasDemo.addLine()
});
// For now this does not have a function
canvasDemo.addCircleButton.addEventListener('click',function(){
    canvasDemo.addTextBoxButton
});
    canvasDemo.CanvasGrid();
    
      // Can be used for setting up basic template
    //canvasDemo.addTextBox();

// Save Function is here need to change so saving can write over file
function SaveAsFile(t, f, m) 
{
	try {
		var b = new Blob([t], {
			type: m
		});
		saveAs(b, f);
	} catch (e) {
		window.open("data:" + m + "," + encodeURIComponent(t), '_blank', '');
	}
}
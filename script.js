// All the code in canvas can be seperated into it's own class's easier down the line including undo and redo history
var canvasDemo = (function()
{
    var canvasSize = document.getElementById('canvas');

    // Need to fix some these things
    // Better off writing some resize code for this
	
	var el=document.getElementById('leftPanel');

// alert('Width in pixels: ' +el.clientWidth+'px\n'+
      // 'Height in pixels: '+el.clientHeight+'px');
    canvasSize.setAttribute('width', window.innerWidth - el.clientWidth);
    canvasSize.setAttribute('height', window.innerHeight - 150);
    var grid =  25;
    // Check if this is the correct size
    var canvasWidth =  window.innerWidth - el.clientWidth;
    var canvasHeight =  window.innerHeight - 150;
    
    var canvas = new fabric.Canvas('canvas');
    
    // This is used for the custom loading for textbox's might create a cache function
    var originalRender = fabric.Textbox.prototype._render;
    fabric.Textbox.prototype._render = function(ctx) {
      originalRender.call(this, ctx);
     
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
    
        fabric.Textbox.prototype.cacheProperties = fabric.Textbox.prototype.cacheProperties.concat('active');
    }
    // End of cache system

    var _config = 
    {

      canvasState             : [],
      currentStateIndex       : 0,
      undoStatus              : false,
      redoStatus              : false,
      undoFinishedStatus      : 1,
      redoFinishedStatus      : 1,
      loadFile                : false,
      undoButton              : document.getElementById('undo'),
      redoButton              : document.getElementById('redo'),
      addRectangleButton      : document.getElementById('addRectangleButton'),
      addTextBoxButton        : document.getElementById('addTextBoxButton'),
      addActorButton          : document.getElementById('addActorButton'),
      addEllipseButton		    : document.getElementById('addEllipseButton'),
      addLabelButton			    : document.getElementById('addLabelButton'),
      addGenArrowButton		    : document.getElementById('addGenArrowButton'),
      addDashedArrowButton	  : document.getElementById('addDashedArrowButton'),
      addComLineButton		    : document.getElementById('addComLineButton'),
      addLineButton           : document.getElementById('addLineButton'),
			addAggregationButton    : document.getElementById('addAggregationButton'),
      addArrowButton          : document.getElementById('addArrowButton'),
			addCompositionButton    : document.getElementById('addCompositionButton'),
      addDependencyButton          : document.getElementById('addDependencyButton'),

    };
    // Makes sure if you mult-select as your first action on a loaded file to set to false
    canvas.on('selection:created',function()
    {
      //
      if(_config.loadFile == true)
      {
      _config.loadFile = false;
      updateCanvasState();

      }
    });
    // Any Object selected get sent to the front of the canvas
    canvas.on('object:selected', function(event) 
    {
      var object = event.target;
      canvas.bringToFront(object);
      if(_config.loadFile == true)
      {
        _config.loadFile = false;
        updateCanvasState();
      }
      
      
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
    canvas.on('object:removed',function()
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
              left   : 600,
              top    : 100,
              width  : 350,
              height : 600,
              originX: 'left',
              originY: 'top',
              stroke: 'black',
			  strokeWidth: 1,
			  fill: 'rgba(0,0,0,0)',
			  shadow: 'rgba(0,0,0,0.4) 5px 5px 7px',
              centeredRotation: true
             
      });
            canvas.add(rect);
            canvas.setActiveObject(rect);
            canvas.renderAll();
    }
  
    // Go in and find out how to make textboxes work together
    var addTextBox = function(text)
    {
    // Add a function to add    \n_______________\n So users do not have to manualy add it
    // But also leave in the ablity for the user to use underscores if they are to lazy to learn where the button is? 
      var textbox = new fabric.Textbox("TITLE\n_______________\n - method()1\n - method()2", {
        left: 38,
        top: 50,
        width: 100,
		textAlign: 'center',
        fontSize: 16,
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
    // FIX FIX
    // Add Line Function
    // Look into using PAPER.js for lines?
// Add Line Functions
function addLine(){
	fabric.Image.fromURL('images/CommCanvas.png', function(img) {
      img.scale(0.5).set({
      left: 122,
      top: 50,
	  centeredRotation: true,
      angle: 0
    });
    canvas.add(img).setActiveObject(img);
    });
	}
	
	
function addAggregation(){
	fabric.Image.fromURL('images/ClassOpenDiamond.png', function(img) {
      img.scale(0.5).set({
      left: 122,
      top: 50,
	  centeredRotation: true,
      angle: 0
    });
    
    canvas.add(img).setActiveObject(img);
    });

}



function addArrow(){
	fabric.Image.fromURL('images/ArrowCanvas.png', function(img) {
      img.scale(0.5).set({
      left: 122,
      top: 50,
	  centeredRotation: true,
      angle: 0
    });
    
    canvas.add(img).setActiveObject(img);
    });

}



function addComposition(){
	fabric.Image.fromURL('images/ClassClosedDiamond.png', function(img) {
      img.scale(0.5).set({
      left: 122,
      top: 50,
	  centeredRotation: true,
      angle: 0
    });
    
    canvas.add(img).setActiveObject(img);
    });

}

	

function addDependency(){
	fabric.Image.fromURL('images/DashArrowCanvas.png', function(img) {
      img.scale(0.5).set({
      left: 122,
      top: 50,
	  centeredRotation: true,
      angle: 0
    });
    
    canvas.add(img).setActiveObject(img);
    });

}
    // Class Diagram Objects End
    
    // Use Case Objects 
    
    // Actor Start
    var addActor = function(){
    fabric.Image.fromURL('images/ActorCanvas.png', function(img) {
      img.scale(0.5).set({
      left: 122,
      top: 50,
	  centeredRotation: true,
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
    left: 122,
    top: 50,
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
      width: 122,
      top: 50,
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
      left: 122,
      top: 50,
	  centeredRotation: true,
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
      left: 122,
      top: 50,
	  centeredRotation: true,
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
      left: 122,
      top: 50,
      angle: 0
    });
    canvas.add(img).setActiveObject(img);
    });
        
    }
    

	// Not needed anymore....
    // CanvasGird should be fixed to allow resizing
    // var  CanvasGrid = function() 
    // {
                   
      // for (var i = 0; i < (canvasWidth / grid); i++) 
      // {
        // canvas.add(new fabric.Line([i * grid, 0, i * grid, canvasHeight], 
        // {
          // selectable: false,
          // evented: false,
          // saved: true
        // }));
        // canvas.add(new fabric.Line([0, i * grid, canvasWidth, i * grid], 
        // {
         
          // selectable: false,
          // evented: false,
          // saved: true
        // }));
      // }
    // }

       return {
          addRectangle  : addRectangle,
          addLine       : addLine,
          addTextBox    : addTextBox,
          addActor		: addActor,
          addEllipse	: addEllipse,
          addLabel		: addLabel,
          addGenArrow   : addGenArrow,
          addDashedArrow : addDashedArrow,
          addComLine	: addComLine,
          // CanvasGrid    : CanvasGrid,
          canvas      : canvas,
          _config:    _config,
          undoButton : _config.undoButton,
          redoButton : _config.redoButton,
          addRectangleButton : _config.addRectangleButton,
          addTextBoxButton  : _config.addTextBoxButton,
          addActorButton    : _config.addActorButton,
          addEllipseButton	: _config.addEllipseButton,
          addLabelButton 	: _config.addLabelButton,
          addGenArrowButton : _config.addGenArrowButton,
          addDashedArrowButton : _config.addDashedArrowButton,
          addComLineButton	: _config.addComLineButton,
          addLineButton     : _config.addLineButton,
          addAggregation: addAggregation,
		      addComposition: addComposition,
		      addArrow      : addArrow,
		      addDependency : addDependency,
		      addAggregationButton    :  _config.addAggregationButton,
		      addCompositionButton    :  _config.addCompositionButton,
		      addArrowButton          :  _config.addArrowButton,
		      addDependencyButton     :  _config.addDependencyButton,
              }
    })();

    /*
		  addAggregation: addAggregation,
		  addComposition: addComposition,
		  addArrow      : addArrow,
		  addDependency : addDependency,
		  addAggregationButton    :  _config.addAggregationButton,
		  addCompositionButton    :  _config.addCompositionButton,
		  addArrowButton          :  _config.addArrowButton,
		  addDependencyButton     :  _config.addDependencyButton,
    */


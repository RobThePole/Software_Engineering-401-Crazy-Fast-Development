
// All the code in canvas can be seperated into it's own class's easier down the line including undo and redo history
var canvasDemo = (function()
{
    // Need to fix some these things
    // Better off writing some resize code for this
    // Add these to CONFIG FILE
    var canvasSize = document.getElementById('canvas');

    canvasSize.setAttribute('width', window.innerWidth - 250);
    canvasSize.setAttribute('height', window.innerHeight - 150);
    var grid =  25;
    // Creat Grid Start 
    var c = window.innerWidth - 220;
    var ct = window.innerHeight;
    
    var canvasWidth = c;
    var canvasHeight = ct;

    var canvas = new fabric.Canvas('canvas');
    
    
      var _config = {


            canvasState             : [],
            currentStateIndex       : -1,
            undoStatus              : false,
            redoStatus              : false,
            undoFinishedStatus      : 1,
            redoFinishedStatus      : 1,
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
      // Should clean up this code later
      canvas.on(
          'object:modified', function(){
                updateCanvasState();
          }
      );
    
    canvas.on(
          'object:added', function(){
                updateCanvasState();
          }
      );
    /* Canvas Out of Bounds Code */
    canvas.on('object:moving', function (e) {
	var obj = e.target;
	// if object is too big ignore
	if (obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width) {
		return;
	}
	obj.setCoords();
	// top-left  corner
	if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
		obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top);
		obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left);
	}
	// bot-right corner
	if (obj.getBoundingRect().top + obj.getBoundingRect().height > obj.canvas.height || obj.getBoundingRect().left + obj.getBoundingRect().width > obj.canvas.width) {
		obj.top = Math.min(obj.top, obj.canvas.height - obj.getBoundingRect().height + obj.top - obj.getBoundingRect().top);
		obj.left = Math.min(obj.left, obj.canvas.width - obj.getBoundingRect().width + obj.left - obj.getBoundingRect().left);
	}
});

    // snap to grid
canvas.on('object:moving', function (options) {
	options.target.set({
		left: Math.round(options.target.left / grid) * grid,
		top: Math.round(options.target.top / grid) * grid
	});

});

    
var left1 = 0;
var top1 = 0;
var scale1x = 0;
var scale1y = 0;
var width1 = 0;
var height1 = 0;
canvas.on('object:scaling', function (e) {
	var obj = e.target;
	obj.setCoords();
	var brNew = obj.getBoundingRect();

	if (((brNew.width + brNew.left) >= obj.canvas.width) || ((brNew.height + brNew.top) >= obj.canvas.height) || ((brNew.left < 0) || (brNew.top < 0))) {
		obj.left = left1;
		obj.top = top1;
		obj.scaleX = scale1x;
		obj.scaleY = scale1y;
		obj.width = width1;
		obj.height = height1;
	} else {
		left1 = obj.left;
		top1 = obj.top;
		scale1x = obj.scaleX;
		scale1y = obj.scaleY;
		width1 = obj.width;
		height1 = obj.height;
	}
});
/* Code to prevent shapes from touching */
    /*Save File Method*/
    $("#saveFile").click(function (event) {
	/* Act on the event */
	// Save must have Always ask you where to save files to change name of file
	// var canvas = new fabric.Canvas('c', { selection: false });
	var data = JSON.stringify(canvas);
	console.log(data);
	//localStorage['Test_data'] = data;
	SaveAsFile(data, "UML_EDITOR_SET_FILE.json", "text/plain;charset=utf-8");

    });

    /* Load File Method */
    $("#loadFile").on('click', function (e) {
	e.preventDefault();
	$("#loadFileInput:hidden").trigger('click');
	var fileInput = document.getElementById('loadFileInput');

	fileInput.addEventListener('change', function (e) {
		var file = fileInput.files[0];

		var reader = new FileReader();


		reader.onload = function (e) {
			canvas.loadFromJSON(reader.result);
		}

		reader.readAsText(file);

	    });

    });

	/*New File Method*/
	$("#newFile").click(function (event) {
		// Now just need to add settings and default file name here and new project should be all set
		// Current default when no objects are on the canvas
		canvas.loadFromJSON('{}');
		// Need to add when you click new file it creates a save

		var objects = canvas.getObjects();
		deleteList(objects);
		
        canvas.discardActiveObject().renderAll()
		// Here is how we make it so we dont overload the Canvas
        CanvasGrid();
	});
    //
    //
    // Add all the differnt objects here
	// CLASS DIAGRAM OBJECTS
    var addRectangle = function()
    {
       var rect = new fabric.Rect({
              left   : 300,
              top    : 100,
              fill   : 'red',
              width  : 350,
              height : 550,
              originX: 'left',
              originY: 'top',
              type: 'rect',
              centeredRotation: true,
			  stroke: 'black',
			  strokeWidth: 1,
	          fill: 'rgba(0,0,0,0)',
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
    var addTextBox = function()
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
    
    var text = new fabric.Textbox("Sample Text\n_______________\n- method()1\n - method()2", {
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
      showTextBoxBorder: true
    
    });
    canvas.add(text);
    }
	
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
	
	// Communication Line Ends (Include and Extends Arrows)
	
    var  CanvasGrid = function() 
    {
        for (var i = 0; i < (canvasWidth / grid); i++) {
            canvas.add(new fabric.Line([i * grid, 0, i * grid, canvasWidth], {
                stroke: '#ccc',
                selectable: false
            }));
            canvas.add(new fabric.Line([0, i * grid, canvasWidth, i * grid], {
                stroke: '#ccc',
                selectable: false
            }));
        }
    }

    /* Name (Type) of objects to delete so we can use the "new" feature */
    var deleteList = function(listItems) {
	if (listItems !== undefined) {
		var len = listItems.length;
		var list = []
		for (var i = 0; i < len; i += 1) {
			var item = listItems[i];
			if (item.type === "rect") {
				list.push(item);
			}
			if (item.type === "circle") {
				list.push(item);
			}
			if (item.type === "text") {
				list.push(item);
			}
			if (item.type === "line") {
				list.push(item);
			}
		}
		len = list.length;
		for (var i = 0; i < len; i += 1) {
			canvas.remove(list[i]);
		}
	}
}

    // <!-- This is how we accomplis the 'Polymorphic' menu --> 
// <!--Hide Rest buttons-->
    var classActiveHideRestButtons = function() 
    {
	$("#Objectaccordion").addClass("d-none");
	$("#Objectaccordion").removeClass("d-block");
	$("#usecaseaccordion").addClass("d-none");
	$("#usecaseaccordion").removeClass("d-block");
	$("#activityaccordion").addClass("d-none");
	$("#activityaccordion").removeClass("d-block");
	$("#sequenceaccordion").addClass("d-none");
	$("#sequenceaccordion").removeClass("d-block");
	$("#btnObject").removeClass("active");
	$("#btnUseCase").removeClass("active");
	$("#btnActivity").removeClass("active");
	$("#btnSequence").removeClass("active");
	objectBtnState = true;
	usecaseBtnState = true;
	activityBtnState = true;
	sequenceBtnState = true;
    }

    // <!--Hide Rest buttons-->
    var objectActiveHideRestButtons = function() {
	$("#classaccordion").addClass("d-none");
	$("#classaccordion").removeClass("d-block");
	$("#usecaseaccordion").addClass("d-none");
	$("#usecaseaccordion").removeClass("d-block");
	$("#activityaccordion").addClass("d-none");
	$("#activityaccordion").removeClass("d-block");
	$("#sequenceaccordion").addClass("d-none");
	$("#sequenceaccordion").removeClass("d-block");
	$("#btnClass").removeClass("active");
	$("#btnUseCase").removeClass("active");
	$("#btnActivity").removeClass("active");
	$("#btnSequence").removeClass("active");
	classBtnState = true;
	usecaseBtnState = true;
	activityBtnState = true;
	sequenceBtnState = true;
}
    
// <!--Hide Rest buttons-->
var useCaseActiveHideRestButtons = function() {
	$("#Objectaccordion").addClass("d-none");
	$("#Objectaccordion").removeClass("d-block");
	$("#classaccordion").addClass("d-none");
	$("#classaccordion").removeClass("d-block");
	$("#activityaccordion").addClass("d-none");
	$("#activityaccordion").removeClass("d-block");
	$("#sequenceaccordion").addClass("d-none");
	$("#sequenceaccordion").removeClass("d-block");
	$("#btnClass").removeClass("active");
	$("#btnObject").removeClass("active");
	$("#btnActivity").removeClass("active");
	$("#btnSequence").removeClass("active");
}
// <!--Hide Rest buttons-->
var activityActiveHideRestButtons = function() {
	$("#Objectaccordion").addClass("d-none");
	$("#Objectaccordion").removeClass("d-block");
	$("#usecaseaccordion").addClass("d-none");
	$("#usecaseaccordion").removeClass("d-block");
	$("#sequenceaccordion").addClass("d-none");
	$("#sequenceaccordion").removeClass("d-block");
	$("#classaccordion").addClass("d-none");
	$("#classaccordion").removeClass("d-block");
	$("#btnClass").removeClass("active");
	$("#btnUseCase").removeClass("active");
	$("#btnSequence").removeClass("active");
	$("#btnObject").removeClass("active");
}
// <!--Hide Rest buttons-->
var sequenceActiveHideRestButtons = function() {
	$("#Objectaccordion").addClass("d-none");
	$("#Objectaccordion").removeClass("d-block");
	$("#usecaseaccordion").addClass("d-none");
	$("#usecaseaccordion").removeClass("d-block");
	$("#activityaccordion").addClass("d-none");
	$("#activityaccordion").removeClass("d-block");
	$("#classaccordion").addClass("d-none");
	$("#classaccordion").removeClass("d-block");
	$("#btnClass").removeClass("active");
	$("#btnUseCase").removeClass("active");
	$("#btnActivity").removeClass("active");
	$("#btnObject").removeClass("active");
}

/*Image append slide show function*/
/* Here we can edit the width and height of the specific image array */
function appendImageSlideShow(str) {
	var body = '',
		bodyIndicators = '';
	for (var i = 0; i < str.length; i++) {
		if (i == 0) {
			bodyIndicators += "<li data-target='#demo' data-slide-to='" + i + "' class='active'></li>";
			body += "<div class='carousel-item active'><img src='images/" + str[i] + "' " +
				"alt='Los Angeles' width='600' height='350' class ='text-center' style='margin-left: 80px;'></div>";
		} else {
			bodyIndicators += "<li data-target='#demo' data-slide-to='" + i + "' class=''></li>";
			body += "<div class='carousel-item'><img src='images/" + str[i] + "' " +
				"alt='Los Angeles' width='600' height='350' class ='text-center' style='margin-left: 80px;'></div>";
		}
	}
	$('.carousel-indicators').html(bodyIndicators); /*Add body in slide Show*/
	$('.carousel-inner').html(body); /*Add body in slide Show*/
}

// Not sure what this code does please add Comments on what it does
$("#myModal").modal();
	$("#btn_getStarted").click(function () {
		$("#myModal").modal();
	})

	/*Btn Class*/
	var classBtnState = true;
	$("#btnClass").click(function () {
		$("#classaccordion").removeClass("d-none");
		$("#classaccordion").addClass("d-block");
		$("#btnClass").addClass("active");
		classBtnState = false;
		classActiveHideRestButtons();

		/*Dynamic Slide Show*/
		$('.carousel-inner').empty();
		var str = ['ClassPH.png', 'ClassPH.png', 'ClassPH.png'] /*Mention all images in here*/
		appendImageSlideShow(str);

	})


	/*Btn Object*/
	var objectBtnState = true;
	$("#btnObject").click(function () {
		$("#Objectaccordion").removeClass("d-none");
		$("#Objectaccordion").addClass("d-block");
		$("#btnObject").addClass("active");
		objectBtnState = false;
		objectActiveHideRestButtons();
		/*Dynamic Slide Show*/
		$('.carousel-inner').empty();
		var str = ['ObjectPH.png', 'ObjectPH.png', 'ObjectPH.png'] /*Mention all images in here*/
		appendImageSlideShow(str);
	})

	/*Btn Use Case*/
	var useCaseBtnState = true;
	$("#btnUseCase").click(function () {

		$("#usecaseaccordion").removeClass("d-none");
		$("#usecaseaccordion").addClass("d-block");
		$("#btnUseCase").addClass("active");
		useCaseBtnState = false;
		useCaseActiveHideRestButtons();
		/*Dynamic Slide Show*/
		$('.carousel-inner').empty();
		var str = ['UsePH.png', 'UsePH.png', 'UsePH.png'] /*Mention all images in here*/
		appendImageSlideShow(str);
	})

	/*Btn Activity*/
	var activityBtnState = true;
	$("#btnActivity").click(function () {
		$("#activityaccordion").removeClass("d-none");
		$("#activityaccordion").addClass("d-block");
		$("#btnActivity").addClass("active");
		activityBtnState = false;
		activityActiveHideRestButtons();
		/*Dynamic Slide Show*/
		$('.carousel-inner').empty();
		var str = ['ActivityPH.png', 'ActivityPH.png', 'ActivityPH.png'] /*Mention all images in here*/
		appendImageSlideShow(str);

	})

	/*Btn State Machine*/
	var sequenceBtnState = true;
	$("#btnSequence").click(function () {
		$("#sequenceaccordion").removeClass("d-none");
		$("#sequenceaccordion").addClass("d-block");
		$("#btnSequence").addClass("active");
		sequenceBtnState = false;
		sequenceActiveHideRestButtons();

		/*Dynamic Slide Show*/
		$('.carousel-indicators').empty();
		$('.carousel-inner').empty();
		var str = ['StatePH.png', 'StatePH.png', 'StatePH.png'] /*Mention all images in here*/
		appendImageSlideShow(str);
	})


	/*Clear Canvas method without making new file*/
	$("#reset").click(function (event) {
		// Clears all objects from canvas
		canvas.loadFromJSON('{}');

		// Here is how we make it so we dont overload the Canvas
        CanvasGrid();
	});
	/*Delete Object Method*/
	$("#deleteObj").on('click', function (e) {
		canvas.getActiveObjects().forEach((obj) => {
			canvas.remove(obj)
		});
		canvas.discardActiveObject().renderAll()
	});


  
      var updateCanvasState = function() {
          if((_config.undoStatus == false && _config.redoStatus == false)){
              var jsonData        = canvas.toJSON();
              var canvasAsJson        = JSON.stringify(jsonData);
              if(_config.currentStateIndex < _config.canvasState.length-1){
                  var indexToBeInserted                  = _config.currentStateIndex+1;
                  _config.canvasState[indexToBeInserted] = canvasAsJson;
                  var numberOfElementsToRetain           = indexToBeInserted+1;
                  _config.canvasState                    = _config.canvasState.splice(0,numberOfElementsToRetain);
              }else{
              _config.canvasState.push(canvasAsJson);
              }
          _config.currentStateIndex = _config.canvasState.length-1;
        if((_config.currentStateIndex == _config.canvasState.length-1) && _config.currentStateIndex != -1){
          _config.redoButton.disabled= "disabled";
        }
          }
      }
  
   
      var undo = function() {
          if(_config.undoFinishedStatus){
              if(_config.currentStateIndex == -1){
              _config.undoStatus = false;
              }
              else{
              if (_config.canvasState.length >= 1) {
              _config.undoFinishedStatus = 0;
                if(_config.currentStateIndex != 0){
                      _config.undoStatus = true;
                    canvas.loadFromJSON(_config.canvasState[_config.currentStateIndex-1],function(){
                                  var jsonData = JSON.parse(_config.canvasState[_config.currentStateIndex-1]);
                              canvas.renderAll();
                            _config.undoStatus = false;
                            _config.currentStateIndex -= 1;
                                  _config.undoButton.removeAttribute("disabled");
                                  if(_config.currentStateIndex !== _config.canvasState.length-1){
                                      _config.redoButton.removeAttribute('disabled');
                                  }
                              _config.undoFinishedStatus = 1;
                    });
                }
                else if(_config.currentStateIndex == 0){
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
              }else
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

                    if(_config.currentStateIndex != -1)
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
    
      
       return {
          addRectangle  : addRectangle,
          addCircle     : addCircle,
		  addLine		: addLine,
          addTextBox    : addTextBox,
          CanvasGrid    : CanvasGrid,
		  addActor		: addActor,
		  addEllipse	: addEllipse,
		  addLabel		: addLabel,
		  addGenArrow   : addGenArrow,
		  addDashedArrow : addDashedArrow,
		  addComLine	: addComLine,
          deleteList    : deleteList,
          classActiveHideRestButtons : classActiveHideRestButtons,
          undoButton : _config.undoButton,
          redoButton : _config.redoButton,
          addRectangleButton : _config.addRectangleButton,
          addCircleButton   : _config.addCircleButton,
		  addActorButton    : _config.addActorButton,
		  addEllipseButton	: _config.addEllipseButton,
		  addLabelButton 	: _config.addLabelButton,
		  addGenArrowButton : _config.addGenArrowButton,
		  addDashedArrowButton : _config.addDashedArrowButton,
		  addComLineButton	: _config.addComLineButton,
          addTextBoxButton  : _config.addTextBoxButton,
          addLineButton     : _config.addLineButton,
          undo       : undo,
          redo       : redo,
    }
  
    })();
  
  
    // Add listeners and functions to those buttons
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
    // Add some example of adding here
    canvasDemo.CanvasGrid();
    //canvasDemo.addRectangle();
    //canvasDemo.addTextBox();
    //canvasDemo.addCircle();
	



  // Save Function is here need to change so saving can write over file
function SaveAsFile(t, f, m) {
	try {
		var b = new Blob([t], {
			type: m
		});
		saveAs(b, f);
	} catch (e) {
		window.open("data:" + m + "," + encodeURIComponent(t), '_blank', '');
	}
}

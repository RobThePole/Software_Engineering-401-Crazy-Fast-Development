/*
 * As of now the script is used for the 'Polymorphic' buttons, to have different 
 * pictorials we are using a list of string names (picture names) for each individual
 * button state, and using a loop to pass it to our 'Pictorial'. 
 */

$(document).ready(function () {
	<!--On page load-->
	$("#myModal").modal();
	<!--Get Started Button-->
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

	/*New File Method*/
	$("#newFile").click(function (event) {
		// Now just need to add settings and default file name here and new project should be all set
		// Current default when no objects are on the canvas
		canvas.loadFromJSON('{}');
		// console.log("New project " + JSON.stringify(canvas))

		var objects = canvas.getObjects();
		deleteList(objects);
		
        canvas.discardActiveObject().renderAll()
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

});
/* Name (Type) of objects to delete so we can use the "new" feature */
function deleteList(listItems) {
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
function classActiveHideRestButtons() {
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
function objectActiveHideRestButtons() {
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
function useCaseActiveHideRestButtons() {
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
function activityActiveHideRestButtons() {
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
function sequenceActiveHideRestButtons() {
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

/* Canvas Snap to Grid code */
var canvas = new fabric.Canvas('c', {
	selection: false
});
var grid = 50;

// Creat Grid Start 
var c = window.innerWidth - 220;
var ct = window.innerHeight;

var canvasWidth = c;
var canvasHeight = ct;

for (var i = 0; i < (canvasWidth / grid); i++) {
	canvas.add(new fabric.Line([i * grid, 0, i * grid, canvasHeight], {
		stroke: '#ccc',
		type: 'line',
		selectable: false

	}));
	canvas.add(new fabric.Line([0, i * grid, canvasWidth, i * grid], {
		stroke: '#ccc',
		type: 'line',
		selectable: false
	}))
}

// Add Grid to Load more Items
function CanvasGrid() {
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

// Grid ends 

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

//Add Objects
// This code adds the line drawing function
var line = new fabric.Line();
function addline(){
isDown = true;
    canvas.on('mouse:down', function (o) {
        //if (isAngleDrawing == "1") {
            canvas.selection = false;
            isDownAngle = true;
            var pointer = canvas.getPointer(o.e);
            var points = [pointer.x, pointer.y, pointer.x, pointer.y];
 
            line = new fabric.Line(points, {
                strokeWidth: 2,
                fill: 'red',
                stroke: 'red',
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
        //if (isAngleDrawing == "1") {
            y11 = line.get('y1');
            y12 = line.get('y2');
            x11 = line.get('x1');
            x12 = line.get('x2');
			//
            var dy = y12 - y11;
            var dx = x12 - x11;
            var theta = Math.atan2(dy, dx); // range (-PI, PI]
			//
            theta *= 180 / Math.PI;
            line.startAngle = theta;
			//
            var angle = countAngle(theta);
            var angl = parseInt(angle).toString() +'°';
            var top = line.top
            var left = line.left;
			anglexy = theta;
			
            var text1 = new fabric.Text(angl, {
                fontSize: 25,
                fontFamily: 'Georgia', top: top, left:left,
                fill: 'red'
            });
			
			tri = new fabric.Triangle({
			top: y12,
			left: x12,
			width: 20, 
			height: 10,
			fill: 'white',
			stroke: 'black',
			strokeWidth: 1,
			centeredRotation: true,
			angle: anglexy + 90,
			originX: 'center',
			originY: 'center',
			evented:false,
			});

			//var rect = new fabric.Rect({ 
			//left: x12, 
			//top: y12, 
			//fill: 'white', 
			//stroke: 'black',
			//strokeWidth: 1,
			//width: 20,
			//height: 20,
			//angle: theta + 45,
			//originX: 'center',
			//originY: 'center',
			//}); 
 
			canvas.add(tri);
			//canvas.add(rect);
			line.lineText = text1;
            canvas.add(text1);
            isDownAngle = false;
            rotateText(line);
			
        //}
	});
	
	//canvas.on('mouse:dblclick',function(o) {
		//canvas.add(tri);
	//});
	
    canvas.on('object:rotating', function (e) {
        if(typeof e.target.lineText != "undefined"){
            var newAngle = getCurrentAngle(e);
            var theta = countAngle(newAngle);
            theta = parseInt(theta).toString() +'°';
            e.target.lineText.setText(theta);
            rotateText(e.target);
        }
    });
}
 
function countAngle(theta){
    if (theta < 0.0) {
        theta += 360.0;
    }
    return theta;
};

//Line function end

// Add Rectangle 
function addRectangle() {
	canvas.add(new fabric.Rect({
		left: 100,
		top: 100,
		width: 50,
		height: 50,
		fill: '#faa',
		originX: 'left',
		originY: 'top',
		type: 'rect',
		centeredRotation: true,
		shadow: 'rgba(0,0,0,0.4) 5px 5px 7px'
	}));
}
// Add Circle Option 
function addCircle() {
	canvas.add(new fabric.Circle({
		left: 300,
		top: 300,
		radius: 50,
		fill: '#9f9',
		originX: 'left',
		originY: 'top',
		type: 'circle',
		centeredRotation: true,
		shadow: 'rgba(0,0,0,0.4) 5px 5px 7px'
	}));
}
// Add TextBox 
function addTextBox() {
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

var text = new fabric.Textbox("Sample Text\n - method()1\n - method()2", {
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


// snap to grid
canvas.on('object:moving', function (options) {
	options.target.set({
		left: Math.round(options.target.left / grid) * grid,
		top: Math.round(options.target.top / grid) * grid
	});

});

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


/**
 * Constructs a configuration object for storing formatting data.
 * @constructor
 * @param {!Canvas} canvas The HTML canvas used for output.
 * @classdesc Contains configuration data for umlical output to an HTML canvas.
 */
function UmlConfiguration(canvas){
	this.context = canvas.getContext("2d");
	this.lineWidth = 2;
	this.highlightWidth = 10;
	this.selectWidth = 14;
	this.color = 'black';
	this.vertexRadius = 5;
	this.edgeDelta = 5;
	this.testCanvas = document.createElement("canvas");
	this.testCanvas.width = canvas.width;
	this.testCanvas.height = canvas.height;
	this.testContext= this.testCanvas.getContext("2d");
	this.context.font = "bold 16px Arial";
	
	this.selectPattern = UmlConfiguration.selectPattern;
};

/**
 * Builds the pattern used for selected objects.
 * @method createSelectPattern
 * @memberof UmlConfiguration
 * @static
 * @param {!Canvas} canvas
 */
UmlConfiguration.createSelectPattern = function (canvas) {
    var ctxt, tempCanvas, tempContext, tempData, selectData, i, j, k;

	tempCanvas = document.createElement('canvas');
	tempContext = tempCanvas.getContext('2d');
	tempData = tempContext.getImageData(0, 0, 8, 8);
	selectData = [ [1,0,0,0,1,0,1,1], [1,0,0,0,1,1,0,0], [0,1,1,1,0,1,0,0], [1,1,0,0,0,1,0,0],
                       [0,0,1,0,0,0,1,1], [0,0,1,0,1,1,1,0], [0,0,1,1,0,0,0,1], [1,1,0,1,0,0,0,1] ];

	tempCanvas.height = 8;
	tempCanvas.width = 8;

	k = 0;
	for (i = 0; i < 8; i += 1) {
		for (j = 0; j < 8; j += 1) {
			if ( selectData[i][j] === 1 ) {
				tempData.data[k++] = 0xb0;
				tempData.data[k++] = 0xb0;
				tempData.data[k++] = 0xb0;
				tempData.data[k++] = 0xff;
			}
			else{
				tempData.data[k++] = 0;
				tempData.data[k++] = 0;
				tempData.data[k++] = 0;
				tempData.data[k++] = 0x0;
			}
		}
	}

	tempContext.putImageData(tempData,0,0);
	
	/**
	 * The patten used for selected objects in the uml.
	 * @name selectPattern
	 * @memberof UmlConfiguration
	 * @type {Pattern}
	 * @static
	 */
	
	UmlConfiguration.selectPattern = canvas.getContext('2d').createPattern(tempCanvas, "repeat");
	
	$(tempCanvas).remove();
};

/**
 * Constructs an empty uml object.
 * @constructor
 * @param {!Canvas} canvas
 * @classdesc Defines a uml, including its vertices, edges, loops, labels, and control points.
 */
function Uml(canvas) {
	this.engine='UML EDITOR';
	this.version='0.0.1';
	this.canvasWidth = canvas.width;
	this.canvasHeight = canvas.height;

    this.labels = [];
    
	this.controlPoints = [];
	
	this.config = new UmlConfiguration(canvas);
	
    //this.selectPattern = null;
};


/******************************************
Name: uml.constructFromJSON
Description: Copies a uml object or initializes using uml fields.
Parameters:
	auml: uml to copy.
*******************************************/


uml.constructFromJSON = function(uml, canvas){
	// reference to the uml object
    var me = this;

	
	this.controlPoints = [];
	
	this.config = new UmlConfiguration(canvas);
	
    this.labels = uml.labels.map( 
			function(label) { 
				return new Label.constructFromJSON(me, label); 
			} 
	);
	
    this.vertices = uml.vertices.map( 
			function(vertex) { 
				return new Vertex.constructFromJSON(me, vertex); 
			} 
	);
	
	
}

uml.constructFromJSON.prototype = uml.prototype;




/**
 * Creates a data structure that can convert to JSON.
 * @method toJSON
 * @memberof uml.prototype
 * @return {object} A data structure suitable for JSON
 */
uml.prototype.toJSON = function(){
	return { 
		labels : this.labels,
		vertices : this.vertices,
		edges : this.edges,
		loops : this.loops
		// this.controlPoints;
	};
}


// create functions

/**
 * Create a Label in this uml.
 * @method createLabel
 * @memberof uml.prototype
 * @param {String} text
 * @param {int} x
 * @param {int} y
 * @param {umlObject} owner
 * @return {Label}
 */
uml.prototype.createLabel = function (text, x, y, owner) { 
	var label = new Label(this, text, x, y, owner);
    this.labels.push(label);
	return label;
};

/**
 * Create a Vertex in this uml.
 * @method createVertex
 * @memberof uml.prototype
 * @param {int} x
 * @param {int} y
 * @return {Vertex}
 */
uml.prototype.createVertex = function (x, y) {
	var vertex = new Vertex(this, x, y);
    this.vertices.push(vertex);
	return vertex;
};
/**
 * Create a ControlPoint in this uml.
 * @method createControlPoint
 * @memberof uml.prototype
 * @param {(Edge|Loop)} owner
 * @param {int} x
 * @param {int} y
 * @return {ControlPoint}
 */
uml.prototype.createControlPoint = function (owner, x, y) {
	var controlPoint = new ControlPoint(this, owner, x, y);
    this.controlPoints.push(controlPoint);
	return controlPoint;
};

// remove functions

/**
 * Remove a Vertex from this uml.
 * @method removeVertexFromuml
 * @memberof uml.prototype
 * @param {!Vertex} vertex
 */
uml.prototype.removeVertexFromuml = function(vertex){
    var i = this.vertices.indexOf(vertex);

    if (i >= 0) {
        this.vertices.splice(i, 1);
    }
	
};
	
/**
 * Remove a Label from this uml.
 * @method removeLabelFromuml
 * @memberof uml.prototype
 * @param {!Label} label
 */
uml.prototype.removeLabelFromuml = function(label){
    var i = this.labels.indexOf(label);

    if (i >= 0) {
        this.labels.splice(i, 1);
    }
};
	
/**
 * Remove a Vertex from this uml.
 * @method removeControlPointFromuml
 * @memberof uml.prototype
 * @param {!ControlPoint} cp
 */
uml.prototype.removeControlPointFromuml = function(cp){
    var i = this.controlPoints.indexOf(cp);

    if (i >= 0) {
        this.controlPoints.splice(i, 1);
    }
};	

// get by index functions

/**
 * Get a Label by its index in this uml.  Used when processing JSON.
 * @method getLabelByIndex
 * @memberof uml.prototype
 * @param {int} index
 * @return {Label}
 */
uml.prototype.getLabelByIndex = function (index) {
    return this.labels[index];
};

/**
 * Get a Vertex by its index in this uml.  Used when processing JSON.
 * @method getVertexByIndex
 * @memberof uml.prototype
 * @param {int} index
 * @return {Vertex}
 */
uml.prototype.getVertexByIndex = function (index) {
    return this.vertices[index];
};

/**
 * Get a ControlPoint by its index in this uml.  Used when processing JSON.
 * @method getControlPointByIndex
 * @memberof uml.prototype
 * @param {int} index
 * @return {ControlPoint}
 */
uml.prototype.getControlPointByIndex = function (index) {
    return this.controlPoints[index];
};

/**
 * Get the index of a Vertex in this uml.  Used when creating JSON data.
 * @method getVertexIndex
 * @memberof uml.prototype
 * @param {!Vertex} vertex
 * @return {int}
 */
uml.prototype.getVertexIndex = function(vertex) {
	return this.vertices.indexOf(vertex);
}

/**
 * Get the index of a Vertex in this uml.  Used when creating JSON data.
 * @method getLabelIndex
 * @memberof uml.prototype
 * @param {!Label} label
 * @return {int}
 */
uml.prototype.getLabelIndex = function(label) {
	return this.labels.indexOf(label);
}

/**
 * Get the index of a ControlPoint in this uml.  Used when creating JSON data.
 * @method getControlPointIndex
 * @memberof uml.prototype
 * @param {!ControlPoint} controlPoint
 * @return {int}
 */
uml.prototype.getControlPointIndex = function(controlPoint) {
	return this.controlPoints.indexOf(controlPoint);
}

/**
 * Get the number of Vertex objects in this uml.
 * @method getVertexSetSize
 * @memberof uml.prototype
 * @return {int}
 */
uml.prototype.getVertexSetSize = function () {
    return this.vertices.length;
};

/**
 * Get the number of Label objects in this uml.
 * @method getLabelSetSize
 * @memberof uml.prototype
 * @return {int}
 */
uml.prototype.getLabelSetSize = function () {
    return this.labels.length;
};


/**
 * Get the number of ControlPoint objects in this uml.
 * @method getControlPointSetSize
 * @memberof uml.prototype
 * @return {int}
 */
uml.prototype.getControlPointSetSize = function () {
    return this.controlPoints.length;
};

/**
 * Factory function to get a Vertex Iterator for this uml.
 * @method getVertexIterator
 * @memberof uml.prototype
 * @return {Iterator}
 */
uml.prototype.getVertexIterator = function(){
	/** @property {Iterator} result
	  * @memberof uml#getVertexIterator
	  */
	var result = 
		(function(vList){
			var list=vList, i=0, n = vList.length;
			return {
				/*
				 * Determines if there are more objects in the iteration.
				 * @method more
				 * @implements Iterator#more
				 * @return {Boolean}
				 */
				more : function(){ return i < n ;},
				/*
				 * Returns the next object in the iteration.
				 * @method next
				 * @return MemberExpression
				 */
				next : function(){ return list[i++]; }
			};
	
		}(this.vertices));
	return result;
}


/**
 * Draw this uml.
 * @method newDraw
 * @memberof uml.prototype
 * @param {CanvasContext} context
 * @param {umlObject} selection
 */
uml.prototype.newDraw = function (context, selection, showCP) {
	var i, n;
	
	
	n = this.vertices.length;
	for (i=0; i<n; i++){
		this.vertices[i].drawHighlight(context);
	}

	n = this.labels.length;
	for (i=0; i<n; i++){
		this.labels[i].drawHighlight(context);
	}
	
	if ( selection != null ){
		//console.log('draw selection');
		selection.drawSelect(context);
	}
	
	
	n = this.vertices.length;
	for (i=0; i<n; i++){
		this.vertices[i].draw(context);
	}
	
	if ( showCP ){
		n = this.controlPoints.length;
		for (i=0; i<n; i++){
			this.controlPoints[i].draw(context);
		}
	}
	
	n = this.labels.length;
	for (i=0; i<n; i++){
		this.labels[i].draw(context);
	}
};


/**
 * Test for a hit on a vertex.
 * @method hitVertex
 * @memberof uml.prototype
 * @param {int} x
 * @param {int} y
 * @return {Vertex}
 */
uml.prototype.hitVertex = function (x, y) {
	var i;
	
	for (i=0; i< this.vertices.length; i++){
		if (this.vertices[i].hit(x, y)) {
			return this.vertices[i];
		}
	}
	
	return null;
};

/**
 * Test for a hit on a ControlPoint.
 * @method hitControlPoint
 * @memberof uml.prototype
 * @param {int} x
 * @param {int} y
 * @return {ControlPoint}
 */
uml.prototype.hitControlPoint = function (x, y) {
	var i;
	
	for (i=0; i< this.controlPoints.length; i++){
		if (this.controlPoints[i].hit(x, y)) {
			return this.controlPoints[i];
		}
	}
	
	return null;
};

/**
 * Test for a hit on a Label.
 * @method hitLabel
 * @memberof uml.prototype
 * @param {int} x
 * @param {int} y
 * @return {Label}
 */
uml.prototype.hitLabel = function (x, y, ctxt) {
	var i;
	
	for (i=0; i< this.labels.length; i++){
		if (this.labels[i].hit(x, y)) {
			return this.labels[i];
		}
	}
	
	return false;
};

/**
 * Test for a hit on any umlObject.
 * @method hit
 * @memberof uml.prototype
 * @param {int} x
 * @param {int} y
 * @param {?boolean} testCP Should Control Points be tested
 * @return {umlObject}
 */
uml.prototype.hit = function(){
	var x = arguments[0];
	var y = arguments[1];
	
	if ( arguments.length <= 2 || arguments[2] ){
		return 	  this.hitLabel(x,y) 
				||this.hitControlPoint(x,y) 
				||this.hitVertex(x,y) 
	}
	
	return 	  this.hitLabel(x,y) 
			||this.hitVertex(x,y) 
	;
};

/**
 * Test for a hit on any umlObject except for a ControlPoint.
 * @method hitNoCP
 * @memberof uml.prototype
 * @param {int} x
 * @param {int} y
 * @return {umlObject}
 */
uml.prototype.hitNoCP = function(x, y){
	return 	  this.hitLabel(x,y) 
			// ||this.hitControlPoint(x,y) 
			||this.hitVertex(x,y) 
			||this.hitEdge(x,y) 
			||this.hitLoop(x,y)
	;
};

/**
 * Get the Configuration object forthis uml.
 * @method getConfig
 * @memberof uml.prototype
 * @return {UmlConfiguration}
 */
uml.prototype.getConfig = function(){
	return this.config;
}


uml.prototype.getPngImageData = function(){
	
	this.config.testContext.save();
	//this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	this.config.testContext.fillStyle='white';
	this.config.testContext.fillRect(0, 0, this.config.testCanvas.width, this.config.testCanvas.height);
	this.config.testContext.restore();
		
	this.newDraw(this.config.testContext, null, false);
	return this.config.testCanvas.toDataURL("image/png");
}

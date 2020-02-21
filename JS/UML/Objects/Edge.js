/**
 * Construct an Edge object from its two vertices.
 * @constructor
 
 * @implements GraphObject
 * @implements Drawable
 * @implements LabelOwner
 * @implements Highlightable
 * @implements Selectable
 * @implements Trackable
 
 * @param {!Uml} uml The Uml that contains this Edge.
 * @param {!Vertex} v1 Vertex for Edge.  Source Vertex in directed graphs.
 * @param {!Vertex} v2 Vertex for Edge.  Destination Vertex in directed graphs.
 *
 * @classdesc Edge defines a uml edge, its adjacent vertices, and its characteristics.
 * The Edge is implemented as a Bezier spline with 4 control points.
 */
function Edge(uml, v1, v2) {
	/** @member {Uml} 
	  * @description The uml that contains this Edge.
	  */
	this.uml = uml;
	
	/** @member {Vertex} 
	  * @description Edge Vertex.  Source Vertex in directed graphs. Used as Bezier spline endpoint p0.
	  */
    this.p0 = v1;
	
	/** @member {Vertex} 
	  * @description Edge Vertex.  Destination Vertex in directed graphs. Used as Bezier spline endpoint p3.
	  */
    this.p3 = v2;
	
	/** @member {ControlPoint} 
	  * @description Control point on spline at t=1/3. Draggable to configure the spline.
	  */
	this.c1 = uml.createControlPoint(this, this.p0.x + (this.p3.x - this.p0.x)/3,
											this.p0.y + (this.p3.y - this.p0.y)/3);
							   
	/** @member {ControlPoint} 
	  * @description Control Point on spline at t=2/3. Draggable to configure the spline.
	  */
	this.c2 = uml.createControlPoint(this, this.p0.x + 2*(this.p3.x - this.p0.x)/3,
											this.p0.y + 2*(this.p3.y - this.p0.y)/3);
	
	/** @member {Label} 
	  * @description Label for this Edge.
	  * @default null
	  */
    this.label = null;
	
	/** @member {!ColorData} 
	  * @description The color data for this Edge.
	  * @default ColorData['colorBlack']
	  */
	this.colorData = ColorData.getColorByName('colorBlack');;
	
	/** @member {string} 
	  * @description The color for this Edge.
	  * @default 'black'
	  */
    this.color = this.colorData.getColor();
	
	/** @member {boolean} 
	  * @description True if this Edge is currently highlighted.
	  * @default false
	  */
    this.highlighted = false;  
	
	/** @member {!ColorData} 
	  * @description The highlight color data for this Edge.
	  * @default ColorData['highlightClear']
	  */
	this.highlightData = ColorData.getColorByName('highlightClear');
	  
	/** @member {string} 
	  * @description The highlight color data for this Edge.
	  * @default null
	  */
    this.highlightColor = null;
	
	
	/** @member {boolean} 
	  * @description True if this Edge is currently selected.
	  * @default false
	  */
    this.selected = false;
	
	
	// computed properties
	
	/** @member {Coordinate} 
	  * @description Tangent point p1 for spline.
	  */
	this.p1 = {x:0, y:0};
	
	/** @member {Coordinate} 
	  * @description Tangent point p2 for spline.
	  */
	this.p2 = {x:0, y:0};
	
	/** @member {!Object} 
	  * @description data used to track this Edge
	  */
	this.track = { }; // used to track 
	
    this.p0.addIncidentEdge(this);
    this.p3.addIncidentEdge(this);
	
	//this.eSet.addCP(this.c1);
	//this.eSet.addCP(this.c2);
	
	this.computePoints();
	
	//console.log('edge is created');
	
}

Edge.prototype.DELTA = 5;

/**
 * Used as a constructor with the new operator to build an Edge object from JSON data.
 * @memberof Edge
 * @static
 * @param {!Uml} uml The uml object being built.
 * @param {!Object} edge The JSON Edge data.
 */
Edge.constructFromJSON = function(uml, edge){
	this.uml = uml;
	
    this.p0 = uml.getVertexByIndex( edge.p0 );
    this.p3 = uml.getVertexByIndex( edge.p3 );
	//console.log("p3",this.p3);
	this.c1 = uml.createControlPoint( this, edge.c1.x, edge.c1.y );
	//this.c1.setOwner( this );
							   
	this.c2 = uml.createControlPoint( this, edge.c2.x, edge.c2.y );
	//this.c2.setOwner( this );
	

	if (edge.label!=null) { 
		this.label = uml.getLabelByIndex(edge.label); 
		this.label.setParent(this); 
	}
	else{
		this.label = null;
	}

	this.colorData = ColorData.getColorByName(edge.colorData);
	this.color = this.colorData.getColor();
	this.highlighted = edge.highlighted;
	this.highlightData = ColorData.getColorByName(edge.highlightData);
	this.highlightColor = this.highlightData.getColor();
	
	// computed properties
	this.p1 = {x:0, y:0};
	this.p2 = {x:0, y:0};
	
    this.selected = false;
	
	this.track = { }; // used to track 
	
    this.p0.addIncidentEdge(this);
    this.p3.addIncidentEdge(this);
	
	this.computePoints();
}

Edge.constructFromJSON.prototype = Edge.prototype;

/*
 *   Implementation of the GraphObject interface
 */


/**
 * Build an object with Edge data that will be converted to JSON
 * @method toJSON
 * @memberof Edge.prototype
 * @return {Object} Object defining data properties for JSON conversion
 */
Edge.prototype.toJSON = function(){
	return {
		p0 : this.p0.getIndex(),
		p3 : this.p3.getIndex(),
		c1 : this.c1,
		c2 : this.c2,
		label : this.label!=null ?  this.label.getIndex() : null,
		colorData : this.colorData.getName(),
		highlighted : this.highlighted,
		highlightData : this.highlightData.getName()
	};
}

/**
 * Returns the index of the Edge in the Edge array of its uml
 * @method getIndex
 * @memberof Edge.prototype
 * @return {int} index of this Edge in the uml's Edge set
 */
Edge.prototype.getIndex = function(){
	return this.uml.getEdgeIndex(this);
};


/**
 * Sets the color data for this Edge.
 * @memberof Edge.prototype
 * @method setColor
 * @param {ColorData} color The color data.
 */
Edge.prototype.setColor = function (colorData) {
    this.colorData = colorData;
	this.color = colorData.getColor();
};

/**
 * Gets the color data for this Edge.
 * @method getColor
 * @memberof Edge.prototype
 * @returns {ColorData} color The color data.
 */
Edge.prototype.getColor = function () {
	return this.colorData;
};

/**
 * Removes this Edge from the uml.
 * @method remove
 * @memberof Edge.prototype
 * @return {Array.<(Edge|Label|ControlPoint)>} Array of this Edge, its Label, and its ControlPoints
 */
Edge.prototype.remove = function () {
	var temp = [this];
	
    this.p0.removeIncidentEdge(this);
    this.p3.removeIncidentEdge(this);
	
	// If this Edge has a label, remove.
	// Note: the Label.remove() will notify the edge to set label to null
    if (this.label) {
		temp.push(this.label);
        this.label.remove();
    }

	temp.push(this.c1);
	temp.push(this.c2);
	
	this.uml.removeControlPointFromGraph(this.c1);
	this.uml.removeControlPointFromGraph(this.c2);
	
    this.uml.removeEdgeFromGraph(this);
	
	return temp;
};

/**
 * Tests if (x,y) is on this Edge 
 * @method hit
 * @memberof Edge.prototype
 * @param {int} x The x coordinate.
 * @param {int} y The y coordinate.
 * @return {boolean} Does (x,y) hit this Edge
 */
Edge.prototype.hit = function (x, y) {
	var testContext = this.uml.getConfig().testContext;
	
	testContext.fillStyle = "#000";
	testContext.fillRect(0, 0, testContext.canvas.width, testContext.canvas.height);

	testContext.strokeStyle="#fff";
	testContext.lineWidth = 8;
	
	testContext.beginPath();
    testContext.moveTo(this.p0.x, this.p0.y);
    testContext.bezierCurveTo(this.p1.x, this.p1.y, 
										this.p2.x, this.p2.y, 
										this.p3.x, this.p3.y);

	testContext.stroke();
	
	var pixel = testContext.getImageData(x, y, 1, 1);
	
	if (pixel.data[0] != 0){
		return true;
	}
	
    return false;
};


/*
 * 	Implementation of the Drawable interface
 */
 
/**
 * Draws the Edge on an HTML canvas.
 * @memberof Edge.prototype
 * @method draw
 * @param {CanvasContext} context The 2d context for an HTML canvas.
 */
Edge.prototype.draw = function (context) {
	context.save();

    context.lineWidth = 2;
    context.fillStyle = this.color;
    context.strokeStyle = this.color;
	
    context.beginPath();
	
    context.moveTo(this.p0.x, this.p0.y);
    context.bezierCurveTo(this.p1.x, this.p1.y, this.p2.x, this.p2.y, this.p3.x, this.p3.y);
	
    context.stroke();
	
	context.restore();
	//console.log('draw edge');
};

 
/*
 * 	Implementation of the LabelOwner interface
 */
 
/**
 * Sets a Label for this Edge object.
 * @memberof Edge.prototype
 * @method setLabel
 * @param {Label} label The Label object.
 */
Edge.prototype.setLabel = function (label) {
    this.label = label;
};

/**
 * Returns the label object of this Edge
 * @memberof Edge.prototype
 * @method getLabel
 * @return {Label} The label for this Edge
 */
Edge.prototype.getLabel = function () { 
    return this.label;
};

/**
 * Returns the text location of this Edge.
 * @memberof Edge.prototype
 * @method getLabelLocation
 * @returns {Coordinate} (x,y) label location
 */
Edge.prototype.getLabelLocation = function () {
	return { x: (this.p0.x + 3*(this.p1.x + this.p2.x) + this.p3.x) / 8,
			 y: (this.p0.y + 3*(this.p1.y + this.p2.y) + this.p3.y) / 8
	} ;
	
};
 
 
/*
 * 	Implementation of the Highlightable interface
 */
 
/**
 * Sets the highlight color data for this Edge.
 * @memberof Edge.prototype
 * @method setHighlight
 * @param {ColorData} color The highlight color data.
 */
Edge.prototype.setHighlight = function (highlightData) {
	//console.log('color set');
	this.highlightData = highlightData;
	if (highlightData.getName() === 'highlightClear'){
		this.highlighted = false;
	}
    else{
		this.highlighted = true;
		this.highlightColor = highlightData.getColor();
	}    
};

/**
 * Gets the highlight color for this Edge.
 * @memberof Edge.prototype
 * @method getHighlight
 * @returns {ColorData} The highlight color data.
 */
Edge.prototype.getHighlight = function(){
	return this.highlightData;
}

Edge.prototype.clearHighlight = function (highlightData) {
	//console.log('color set');
	this.highlighted = false;
    this.highlightData = highlightData;
};


/**
 * Toggles the highlighting of this Edge.
 * @memberof Edge.prototype
 * @method toggleHighlight
 * @param {ColorData} color The highlight color data.
 */
Edge.prototype.toggleHighlight = function (colorData) {
	if (colorData.getName() === 'highlightClear'){
		this.highlighted = false;
		this.highlightData = colorData;
	}
    else if (this.highlighted === true && this.highlightData.getName() === colorData.getName() ) {
        this.highlighted = false;
		this.highlightData = ColorData['highlightClear'];
    } 
	else {
        this.highlighted = true;
		this.highlightData = colorData;
		this.highlightColor = colorData.getColor();
    }
};
 
/**
 * If the Edge highlight property is true, draws a highlight for this Edge object.
 * @memberof Edge.prototype
 * @method drawHighlight
 * @param {CanvasContext} context The 2d context for an HTML canvas.
 */
Edge.prototype.drawHighlight = function (ctxt) {
    var pattern;
    
    if (!this.highlighted) {
        return;
    }
    
    ctxt.save();
    
    ctxt.lineWidth = 10;
    ctxt.fillStyle = this.highlightColor;
    ctxt.strokeStyle = this.highlightColor;
	
    ctxt.beginPath();
	
    ctxt.moveTo(this.p0.x, this.p0.y);
    ctxt.bezierCurveTo(this.p1.x, this.p1.y, this.p2.x, this.p2.y, this.p3.x, this.p3.y);
	
    ctxt.stroke();
   
    ctxt.restore();
};
 
/*
 * 	Implementation of the Selectable interface
 */

/**
 * Set this Edge to be selected.
 * @memberof Edge.prototype
 * @method select
 */
Edge.prototype.select = function(){
	this.selected = true;
}

/**
 * Unselect this Edge.
 * @memberof Edge.prototype
 * @method unselect
 */
Edge.prototype.unselect = function(){
	this.selected = false;
}
 
/**
 * Queries the selection state of the Edge.
 * @memberof Edge.prototype
 * @method isSelected
 * @return {boolean} True if this Edge is selected.
 */
Edge.prototype.isSelected = function(){
	return this.selected;
}

 /**
 * If selected property is true, draws the select pattern on this Edge.
 * @method drawSelect
 * @memberof Edge.prototype
 * @param {CanvasContext} context The 2d drawing context for an HTML canvas.
 */
Edge.prototype.drawSelect = function (context) {
    if (!this.selected) {     
        return; 
    }
    
	context.save();
	
	context.lineWidth = 14;
	context.strokeStyle = context.fillStyle = this.uml.getConfig().selectPattern; 

    context.beginPath();
	
    context.moveTo(this.p0.x, this.p0.y);
    context.bezierCurveTo(this.p1.x, this.p1.y, this.p2.x, this.p2.y, this.p3.x, this.p3.y);
	
    context.stroke();
	context.restore();
	
	if (this.label !== null){
		this.label.lineTo(
			context, 
			(this.p0.x + 3*(this.p1.x + this.p2.x) + this.p3.x) / 8, 
			(this.p0.y + 3*(this.p1.y + this.p2.y) + this.p3.y) / 8
		);
	}
};

/*
 * 	Implementation of the Trackable interface
 */

/**
 * Start tracking this Edge.
 * It notifies its incident vertices and control points, and it's coincident edges.
 * @method trackStart
 * @memberof Edge.prototype
 */
Edge.prototype.trackStart = function(){
	var i, n;
	
	this.track.coincident = this.p0.edgeGetCoincident(this);
	
	this.p0.edgeTrackStart(this);
	this.p3.edgeTrackStart(this);
	
	this.c1.edgeTrackStart(this);
	this.c2.edgeTrackStart(this);
	
	n = this.track.coincident.length;
	for (i=0; i<n; i++){
		this.track.coincident[i].coincidentTrackStart(this);
	}
}

/**
 * Cancel tracking of this edge.  Notify incident vertices, control points, and coincident edges.
 * @method trackCancel
 * @memberof Edge.prototype
 */
Edge.prototype.trackCancel = function(){
	var i;
	
	this.p0.edgeTrackCancel(this);
	this.p3.edgeTrackCancel(this);
	
	this.c1.edgeTrackCancel(this);
	this.c2.edgeTrackCancel(this);
	
	this.computePoints();
	
	for (i=0; i<this.track.coincident.length; i++){
		this.track.coincident[i].coincidentTrackCancel(this);
	}

}

/**
 * Move this edge. Notify incident vertices, control points, and coincident edges.
 * @method trackMove
 * @memberof Edge.prototype
 * @param {int} dx Distance to move in x direction.
 * @param {int} dy Distance to move in y direction.
 */
Edge.prototype.trackMove = function (dx, dy) {
	var i, n;

    this.p0.edgeTrackMove(this, dx, dy);
    this.p3.edgeTrackMove(this, dx, dy);
	
	this.c1.edgeTrackMove(this, dx, dy);
	this.c2.edgeTrackMove(this, dx, dy);
	
	this.computePoints();
	
	n = this.track.coincident.length;
	for (i=0; i<n; i++){
		this.track.coincident[i].coincidentTrackMove(this, dx, dy);
	}
};

/**
 * End tracking of this edge.  Notify incident vertices, control points, and coincident edges.
 * @method trackEnd
 * @memberof Edge.prototype
 */
Edge.prototype.trackEnd = function(){
	var i;
	
	this.p0.edgeTrackEnd(this);
	this.p3.edgeTrackEnd(this);
	
	this.c1.edgeTrackEnd(this);
	this.c2.edgeTrackEnd(this);
	
	this.computePoints();
	
	for (i=0; i<this.track.coincident.length; i++){
		this.track.coincident[i].coincidentTrackEnd(this);
	}

}

/*
 * Edge specific methods 
 */
 
Edge.prototype.selectWithLabel = function () {
    this.selected = true;
	if (this.label){
		this.label.select();
	}
};

Edge.prototype.unselectWithLabel = function () {
    this.selected = false;
	if (this.label){
		this.label.unselect();
	}
};

/**
 * Compute the tangent point locations based on vertex and control point locations
 * @method computePoints
 * @memberof Edge.prototype
 */
Edge.prototype.computePoints = function(){
	this.p1.x = Math.round((-5*this.p0.x + 18*this.c1.x - 9*this.c2.x + 2*this.p3.x)/6);
	this.p1.y = Math.round((-5*this.p0.y + 18*this.c1.y - 9*this.c2.y + 2*this.p3.y)/6);

	this.p2.x = Math.round((2*this.p0.x - 9*this.c1.x + 18*this.c2.x - 5*this.p3.x)/6);
	this.p2.y = Math.round((2*this.p0.y - 9*this.c1.y + 18*this.c2.y - 5*this.p3.y)/6);
	
}

/**
 * Determine if the parameter edge is coincident with this Edge.
 * @method coincide
 * @memberof Edge.prototype
 * @param {Edge} edge
 * @return {Boolean} True if coincident.
 */
Edge.prototype.coincide = function(edge){
	return (this.p0 === edge.p0 && this.p3 === edge.p3)
			|| (this.p0 === edge.p3 && this.p3 === edge.p0);
}



// start tracking this edge if a coincident edge is being dragged.
// Called by the coincident edge.

/**
 * Start tracking this edge when a coincident edge is being dragged.
 * Notify the control points.  The vertices have already been notified by the dragged edge.
 * @method coincidentTrackStart
 * @memberof Edge.prototype
 * @param {Edge} edge Coincident edge that is being dragged.
 */
Edge.prototype.coincidentTrackStart = function(edge){
	this.c1.edgeTrackStart(this);
	this.c2.edgeTrackStart(this);
	this.computePoints();
}

/**
 * Cancel tracking this edge when dragging of a coincident edge has been canceled.
 * Notify the control points.  The vertices have already been notified by the dragged edge.
 * @method coincidentTrackCancel
 * @memberof Edge.prototype
 * @param {Edge} edge Coincident edge that is being dragged.
 */
Edge.prototype.coincidentTrackCancel = function(edge){
	this.c1.edgeTrackCancel(this);
	this.c2.edgeTrackCancel(this);
	this.computePoints();
}

/**
 * End tracking this edge when dragging of a coincident edge has ended.
 * Notify the control points.  The vertices have already been notified by the dragged edge.
 * Description
 * @method coincidentTrackEnd
 * @memberof Edge.prototype
 * @param {Edge} edge Coincident edge that is being dragged.
 */
Edge.prototype.coincidentTrackEnd = function(edge){
	this.c1.edgeTrackEnd(this);
	this.c2.edgeTrackEnd(this);
}

/**
 * Move this edge when dragging has moved a coincident edge.
 * Notify the control points.  The vertices have already been notified by the dragged edge.
 * @method coincidentTrackMove
 * @memberof Edge.prototype
 * @param {Edge} edge Coincident edge that is being dragged.
 * @param {int} dx Distance to move in x direction.
 * @param {int} dy Distance to move in y direction.
 */
Edge.prototype.coincidentTrackMove = function (edge, dx, dy) {
	//console.log("coincide move", this.getIndex());
	this.c1.edgeTrackMove(this, dx, dy);
	this.c2.edgeTrackMove(this, dx, dy);
	this.computePoints();
};



// edge tracks a vertex that is being dragged by the mouse
// Called by a vertex to notify edge to compute its layout
// The edge will always compute it current layout relative to its starting layout

// save edge's starting layout
// do as much possible here that stays fixed while edge moves

/* Version 1

Edge.prototype.vertexTrackStart= function(vertex){
	this.c1.edgeTrackStart(this);
	this.c2.edgeTrackStart(this);
	
	// now save data for tracking
	
	this.track.start_x = vertex.x;
	this.track.start_y = vertex.y;

	if ( vertex === this.p0 ){
		this.track.dx = this.p3.x;
		this.track.dy = this.p3.y;
	}
	else{
		this.track.dx = this.p0.x;
		this.track.dy = this.p0.y;
	}
	
	this.track.start_x -= this.track.dx;
	this.track.start_y -= this.track.dy;

	this.track.start_r = Math.sqrt( this.track.start_x*this.track.start_x 
								+ this.track.start_y*this.track.start_y );
								
	this.track.start_cos = this.track.start_x/this.track.start_r; 
	this.track.start_sin = this.track.start_y/this.track.start_r; 
	
	this.track.c1_x = this.c1.x - this.track.dx;
	this.track.c1_y = this.c1.y - this.track.dy;
	
	this.track.c2_x = this.c2.x - this.track.dx;
	this.track.c2_y = this.c2.y - this.track.dy;
}
*/

//version 2
/**
 * Start tracking this Edge when one of its incident vertices is being tracked.
 * The incident vertex could be dragged, or one of its incident edges could be dragged.
 * This Edge will be scaled and rotated based on the location of the Vertex being tracked.
 * @method vertexTrackStart
 * @memberof Edge.prototype
 * @param {Vertex} vertex The incident vertex being tracked.
 */
Edge.prototype.vertexTrackStart= function(vertex){
	var cos_t, sin_t, c1_x, c1_y, c2_x, c2_y;
	
	this.c1.edgeTrackStart(this);
	this.c2.edgeTrackStart(this);
	
	// now save data for tracking
	
	this.track.start_x = vertex.x;
	this.track.start_y = vertex.y;

	if ( vertex === this.p0 ){
		this.track.dx = this.p3.x;
		this.track.dy = this.p3.y;
	}
	else{
		this.track.dx = this.p0.x;
		this.track.dy = this.p0.y;
	}
	
	this.track.start_x -= this.track.dx;
	this.track.start_y -= this.track.dy;

	this.track.start_r = Math.sqrt( this.track.start_x*this.track.start_x 
								+ this.track.start_y*this.track.start_y );
								
	cos_t = this.track.start_cos = this.track.start_x/this.track.start_r; 
	sin_t = this.track.start_sin = this.track.start_y/this.track.start_r; 
	
	c1_x = this.c1.x - this.track.dx;
	c1_y = this.c1.y - this.track.dy;
	
	c2_x = this.c2.x - this.track.dx;
	c2_y = this.c2.y - this.track.dy;
	
	this.track.c1_x = c1_x * cos_t + c1_y * sin_t;
	this.track.c1_y = c1_y * cos_t - c1_x * sin_t;
	
	this.track.c2_x = c2_x * cos_t + c2_y * sin_t;
	this.track.c2_y = c2_y * cos_t - c2_x * sin_t;
	
}

/**
 * Cancel tracking this Edge when tracking of one of its incident vertices is canceled.
 * The incident vertex could be dragged, or one of its incident edges could be dragged.
 * The control points are restored to their start location.
 * @method vertexTrackCancel
 * @memberof Edge.prototype
 * @param {Vertex} vertex The incident Vertex being tracked.
 */
Edge.prototype.vertexTrackCancel = function(vertex){
	
	this.c1.edgeTrackCancel(this);
	this.c2.edgeTrackCancel(this);
	
	this.computePoints();
}

/**
 * End tracking this Edge when tracking of one of its incident vertices is finished.
 * The incident vertex could be dragged, or one of its incident edges could be dragged.
 * @method vertexTrackEnd
 * @memberof Edge.prototype
 * @param {Vertex} vertex The incident Vertex being tracked.
 */
Edge.prototype.vertexTrackEnd = function(vertex){
	
	this.c1.edgeTrackEnd(this);
	this.c2.edgeTrackEnd(this);
	
	//this.computePoints();
}

/* version 1
Edge.prototype.vertexTrackMove = function (vertex, dx, dy) {
	var  end_x, end_y, end_r, end_cos, end_sin, cos_t, sin_t;
	
	end_x = vertex.x - this.track.dx;
	end_y = vertex.y - this.track.dy;
	
	end_r = Math.sqrt( end_x*end_x + end_y*end_y );

	end_cos = end_x/end_r; 
	end_sin = end_y/end_r; 
	
	cos_t = this.track.start_cos*end_cos + this.track.start_sin*end_sin; 
	sin_t = end_cos * this.track.start_sin - end_sin * this.track.start_cos;
	
	var scale = end_r / this.track.start_r;
	
	this.c1.x = this.track.c1_x * cos_t + this.track.c1_y * sin_t;
	this.c1.y = this.track.c1_y * cos_t - this.track.c1_x * sin_t;
	
	this.c2.x = this.track.c2_x * cos_t + this.track.c2_y * sin_t;
	this.c2.y = this.track.c2_y * cos_t - this.track.c2_x * sin_t;
	
	this.c1.x = this.c1.x * scale + this.track.dx;
	this.c1.y = this.c1.y * scale + this.track.dy;
	
	this.c2.x = this.c2.x * scale + this.track.dx;
	this.c2.y = this.c2.y * scale + this.track.dy;
	
	this.computePoints();
};
*/

// version 2
/**
 * Move this Edge when tracking of one of its incident vertices is moved.
 * The incident vertex could be dragged, or one of its incident edges could be dragged.
 * This edge is scaled and rotated based on the new location of the vertex being tracked.
 * @method vertexTrackMove
 * @memberof Edge.prototype
 * @param {Vertex} vertex The incident Vertex being tracked.
 * @param {int} dx Distance to move in x direction.
 * @param {int} dy Distance to move in y direction.
 */
Edge.prototype.vertexTrackMove = function (vertex, dx, dy) {
	var  end_x, end_y, end_r, end_cos, end_sin, cos_t, sin_t, c1_x, c2_x, c1_y, c2_y;
	
	end_x = vertex.x - this.track.dx;
	end_y = vertex.y - this.track.dy;
	
	end_r = Math.sqrt( end_x*end_x + end_y*end_y );

	cos_t = end_cos = end_x/end_r; 
	sin_t = end_sin = end_y/end_r; 
	
	//cos_t = this.track.start_cos*end_cos + this.track.start_sin*end_sin; 
	//sin_t = end_cos * this.track.start_sin - end_sin * this.track.start_cos;
	
	var scale = end_r / this.track.start_r;
	
	c1_x = scale * this.track.c1_x;
	c1_y = this.track.c1_y;
	
	c2_x = scale * this.track.c2_x;
	c2_y = this.track.c2_y;
	
	
	
	this.c1.x = c1_x * cos_t - c1_y * sin_t + this.track.dx;
	this.c1.y = c1_y * cos_t + c1_x * sin_t + this.track.dy;
	
	this.c2.x = c2_x * cos_t - c2_y * sin_t + this.track.dx;
	this.c2.y = c2_y * cos_t + c2_x * sin_t + this.track.dy;
	
	
	this.computePoints();
};

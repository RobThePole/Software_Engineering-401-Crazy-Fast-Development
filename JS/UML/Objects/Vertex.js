/**
 * @filedesc This file contains the definition for the Vertex class.
 */


/**
 * Constructs a Vertex object from its location and containing Uml.
 *
 * @constructor
 
 * @implements GraphObject
 * @implements Drawable
 * @implements LabelOwner
 * @implements Highlightable
 * @implements Selectable
 * @implements Trackable
 
 * @param {!Uml} uml - the uml that will contain the Vertex
 * @param {int} x - the x location for the Vertex
 * @param {int} y - the y location for the Vertex
 *
 * @classdesc Vertex defines a uml vertex, its location, its attributes, 
 * and its incident Edges and Loops.
 * Location coordinates should be integers to get the best line appearance.
 */
function Vertex(uml, x, y) {
	/** 
	 * The uml that contains this Vertex.
	 * @member {!Uml} 
	 */
	this.uml = uml;
	
	// intrinsic characteristics
	
	/** @member {int} 
	  * @description The x coordinate for the Vertex. 
	  * Use an integer value for best line appearance.
	  */
    this.x = x;
	
	/** @member {int} 
	  * @description The y coordinate for the Vertex. 
	  * Use an integer value for best line appearance.
	  */
    this.y = y;
	
	/** @member {Label} 
	  * @description The Label for this Vertex.
	  * @default null
	  */
    this.label = null;
	
	/** @member {!ColorData} 
	  * @description The color data for this Vertex.
	  * @default ColorData['colorBlack']
	  */
	this.colorData = ColorData.getColorByName('colorBlack');
	
	/** @member {string} 
	  * @description The color for this Vertex.
	  * @default 'black'
	  */
    this.color = this.colorData.getColor();
	
	/** @member {boolean} 
	  * @description True if this Vertex is currently highlighted.
	  * @default false
	  */
    this.highlighted = false;  
	
	/** @member {!ColorData} 
	  * @description The highlight color data for this Vertex.
	  * @default ColorData['highlightClear']
	  */
	this.highlightData = ColorData.getColorByName('highlightClear');
	  
	/** @member {string} 
	  * @description The highlight color data for this Vertex.
	  * @default null
	  */
    this.highlightColor = null;
	
	
	/** @member {boolean} 
	  * @description True if this Vertex is currently selected.
	  * @default false
	  */
    this.selected = false;
	
	// computed properties
	
	/** @member {Array.<Edge>} 
	  * @description List of incident Edges.
	  */
    this.incidentList = [];
	
	/** @member {Array.<Loop>} 
	  * @description List of incident Loops.
	  */
	this.loopList = [];

	/** @member {!Object} 
	  * @description Tracking data for dragging this Vertex.
	  */
	this.track = {};
}

/**
 * Used as a constructor with the new operator to build a Vertex object from JSON data.
 * @static
 * @memberof Vertex
 * @param {!Uml} uml The uml object being built.
 * @param {!Object} vertex The JSON vertex data.
 */
Vertex.constructFromJSON = function(uml, vertex) {
	this.uml = uml;
	this.x = vertex.x;
	this.y = vertex.y;
	
	if (vertex.label!=null) { 
		this.label = uml.getLabelByIndex(vertex.label); this.label.setParent(this); 
	}
	else{
		this.label = null;
	}

	this.colorData = ColorData.getColorByName(vertex.colorData);
	this.color = this.colorData.getColor();
	this.highlighted = vertex.highlighted;
	this.highlightData = ColorData.getColorByName(vertex.highlightData);
	this.highlightColor = this.highlightData.getColor();
	
	// computed values
    this.incidentList = [];
	this.loopList = [];
    this.selected = false;
	this.track = {};
};

Vertex.constructFromJSON.prototype = Vertex.prototype;


/*
 *   Implementation of the GraphObject interface
 */


/**
 * Build an object with Vertex data that will be converted to JSON
 * @memberof Vertex.prototype
 * @method toJSON
 * @return {Object} Object defining data properties for JSON conversion
 */
Vertex.prototype.toJSON = function(){

	return {
		x : this.x,
		y : this.y,
		label : (this.label!=null) ? this.label.getIndex() : null,
		colorData : this.colorData.getName(),
		highlighted : this.highlighted,
		highlightData : this.highlightData.getName()
	};

};

/**
 * Returns the index of the Vertex in the Vertex array of its uml
 * @memberof Vertex.prototype
 * @method getIndex
 * @return {int} index of this Vertex in the uml's Vertex set
 */
Vertex.prototype.getIndex = function(){
	return this.uml.getVertexIndex(this);
};


/**
 * Sets the color data for this Vertex.
 * @memberof Vertex.prototype
 * @method setColor
 * @param {ColorData} color The color data.
 */
Vertex.prototype.setColor = function (colorData) {
    this.colorData = colorData;
	this.color = colorData.getColor();
};

/**
 * Gets the color data for this Vertex.
 * @memberof Vertex.prototype
 * @method setColor
 * @returns {ColorData} color The color data.
 */
Vertex.prototype.getColor = function () {
	return this.colorData;
};

/**
 * Remove this Vertex from the uml.
 * @memberof Vertex.prototype
 * @method remove
 * @return {Array.<(Vertex|Label|Edge|loop)>} Array of this vertex, its label, its incident edge and loops
 */
Vertex.prototype.remove = function () {
    var temp = [this];
	var i;
	
	// remove edges will remove them from incident lists
	// Must copy the incident lists
	var incident = this.incidentList.slice(0);
	incident = incident.concat(this.loopList);

    for (i=0; i<incident.length; i++) {
		incident[i].remove();
    }
	
	/*
	// delete the incident edges
    for (i=0; i<this.incidentList.length; i++) {
		this.incidentList[i].remove();
    }
    
	// get loops
    temp = this.loopList.slice(0);
    
	// delete the loop edges
    for (i=0; i<this.loopList.length; i++) {
		this.loopList[i].remove();
    }
    */
	
	
	 // If this Vertex has a label, remove.
	 // Note: the Label.remove() will notify the vertex to set label to null
    if (this.label) {
		temp.push(this.label);
        this.label.remove();
    }
    
    this.uml.removeVertexFromGraph(this); // Remove 'this' Vertex from Vertex set.
	
	//return temp.concat(this.incidentList, this.loopList);
	return temp.concat(incident);
};

/**
 * Tests if (x,y) is on this Vertex 
 * @memberof Vertex.prototype
 * @method hit
 * @param {int} x The x coordinate.
 * @param {int} y The y coordinate.
 * @return {boolean} Does (x,y) hit this Vertex
 */
Vertex.prototype.hit = function (x, y) {
    var dx, dy;

    dx = this.x - x;
    dy = this.y - y;

    return (dx * dx + dy * dy) <= 10 * 10;
};

/*
 * 	Implementation of the Drawable interface
 */
 
/**
 * Draws the Vertex on an HTML canvas.
 * @memberof Vertex.prototype
 * @method draw
 * @param {CanvasContext} context The 2d context for an HTML canvas.
 */
Vertex.prototype.draw = function (context) {
	context.save();
	
	context.lineWidth = 2;
    context.fillStyle = this.color;
    context.strokeStyle = this.color;
	
    context.beginPath();
    context.arc(this.x, this.y, 5, 0, 2 * Math.PI);
    
    context.fill();
    context.stroke();
	
	context.restore();
};

 
/*
 * 	Implementation of the LabelOwner interface
 */
 
/**
 * Sets a Label for this Vertex object.
 * @memberof Vertex.prototype
 * @method setLabel
 * @param {Label} label The Label object.
 */
Vertex.prototype.setLabel = function (label) {
    this.label = label;
};

/**
 * Returns the label object of this Vertex
 * @memberof Vertex.prototype
 * @method getLabel
 * @return {Label} The label for this Vertex
 */
Vertex.prototype.getLabel = function () { 
    return this.label;
};

/**
 * Returns the text location of this Vertex.
 * @memberof Vertex.prototype
 * @method getLabelLocation
 * @returns {Coordinate} (x,y) label location
 */
Vertex.prototype.getLabelLocation = function () {
    return {x: this.x, y: this.y};
};
 
 
/*
 * 	Implementation of the Highlightable interface
 */
 
/**
 * Sets the highlight color data for this Vertex.
 * @memberof Vertex.prototype
 * @method setHighlight
 * @param {ColorData} highlightData The highlight color data.
 */
Vertex.prototype.setHighlight = function (highlightData) {
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
 * Gets the highlight color for this Vertex.
 * @memberof Vertex.prototype
 * @method getHighlight
 * @returns {ColorData} The highlight color data.
 */
Vertex.prototype.getHighlight = function(){
	return this.highlightData;
}

Vertex.prototype.clearHighlight = function (highlightData) {
	//console.log('color set');
	this.highlighted = false;
    this.highlightData = highlightData;
};


/**
 * Toggles the highlighting of this Vertex.
 * @memberof Vertex.prototype
 * @method toggleHighlight
 * @param {ColorData} colorData The highlight color data.
 */
Vertex.prototype.toggleHighlight = function (colorData) {
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
 * If the Vertex highlight property is true, draws a highlight for this Vertex object.
 * @memberof Vertex.prototype
 * @method drawHighlight
 * @param {CanvasContext} context The 2d context for an HTML canvas.
 */
Vertex.prototype.drawHighlight = function (context) {
	var pattern;
	
    if (!this.highlighted) {
        return;
    }

    pattern = this.highlightColor;
	
	context.save();
	
	context.strokeStyle = pattern;
    context.lineWidth = 12;
	
	context.beginPath();
	
    context.arc(this.x, this.y, 5, 0, 2 * Math.PI);
	
    context.stroke();
	
	context.restore();
};
 
/*
 * 	Implementation of the Selectable interface
 */

/**
 * Set this Vertex to be selected.
 * @memberof Vertex.prototype
 * @method select
 */
Vertex.prototype.select = function(){
	this.selected = true;
}

/**
 * Unselect this Vertex.
 * @memberof Vertex.prototype
 * @method unselect
 */
Vertex.prototype.unselect = function(){
	this.selected = false;
}
 
/**
 * Queries the selection state of the Vertex.
 * @memberof Vertex.prototype
 * @method isSelected
 * @return {boolean} True if this Vertex is selected.
 */
Vertex.prototype.isSelected = function(){
	return this.selected;
}

 /**
 * If selected property is true, draws the select pattern on this Vertex.
 * @memberof Vertex.prototype
 * @method drawSelect
 * @param {CanvasContext} context The 2d drawing context for an HTML canvas.
 */
Vertex.prototype.drawSelect = function (context) {
    if (!this.selected) { return; }
	
	context.save();
	
	context.strokeStyle = context.fillStyle = this.uml.getConfig().selectPattern; 
    context.lineWidth = 8;
    
    context.beginPath();
	
    context.moveTo(this.x + 10, this.y);
    context.arc(this.x, this.y, 10, 0, 2 * Math.PI, false);
	
    context.closePath();

    context.fill();
    context.stroke();
	
	context.restore();
	
	if (this.label !== null){
		this.label.lineTo(context, this.x, this.y);
	}
};

 
/*
 * 	Implementation of the Trackable interface
 */

/**
 * Start tracking this Vertex.  It saves its starting position.
 * @memberof Vertex.prototype
 * @method trackStart
 */
Vertex.prototype.trackStart = function(){
	var i, n;
	
	this.track.x = this.x;
	this.track.y = this.y;
	
	n = this.incidentList.length;
	for (i=0; i<n; i++){
		this.incidentList[i].vertexTrackStart(this);
	}
	
	n = this.loopList.length;
	for (i=0; i<n; i++){
		this.loopList[i].vertexTrackStart(this);
	}
}

/**
 * Cancel tracking.  Called when this Vertex is dragged off the canvas.
 * The Vertex should return to its original start position.
 * @memberof Vertex.prototype
 * @method trackCancel
 */
Vertex.prototype.trackCancel = function(){
	var i, n;
	
	this.x = this.track.x;
	this.y = this.track.y;

	n = this.incidentList.length;
	for (i=0; i<n; i++){
		this.incidentList[i].vertexTrackCancel(this);
	}
	
	n = this.loopList.length;
	for (i=0; i<n; i++){
		this.loopList[i].vertexTrackCancel(this);
	}
	
}

/**
 * Move this Vertex.
 * @memberof Vertex.prototype
 * @method trackMove
 * @param {int} dx Distance to move in x direction.
 * @param {int} dy Distance to move in y direction.
 */
Vertex.prototype.trackMove = function (dx, dy) {
	var i, n;
	
    this.x += dx;
    this.y += dy;
	
	n = this.incidentList.length;
	for (i=0; i<n; i++){
		this.incidentList[i].vertexTrackMove(this, dx, dy);
	}
	
	n = this.loopList.length;
	for (i=0; i<n; i++){
		this.loopList[i].vertexTrackMove(this, dx, dy);
	}
	
};

/**
 * End tracking of this Vertex.
 * @memberof Vertex.prototype
 * @method trackEnd
 */
Vertex.prototype.trackEnd = function(){
	var i, n;
	
	n = this.incidentList.length;
	for (i=0; i<n; i++){
		this.incidentList[i].vertexTrackEnd(this);
	}
	
	n = this.loopList.length;
	for (i=0; i<n; i++){
		this.loopList[i].vertexTrackEnd(this);
	}
	
}
 
/*
 * Vertex specific methods for maintaining incident Edge and Loop objects
 */
 
 
/**
 * Adds specified Edge to incident list of this Vertex.
 * @memberof Vertex.prototype
 * @method addIncidentEdge
 * @param {Edge} edge An incident Edge.
 */
Vertex.prototype.addIncidentEdge = function (edge) {
    this.incidentList.push(edge);
};

/**
 * Removes specified Edge from incident list of this Vertex.
 * @memberof Vertex.prototype
 * @method removeIncidentEdge
 * @param {Edge} edge Incident Edge to remove.
 */
Vertex.prototype.removeIncidentEdge = function (edge) {
    var i = this.incidentList.indexOf(edge);
    if (i >= 0) {
        this.incidentList.splice(i, 1);
    }
};

/**
 * Adds specified Loop to Loop list of this Vertex.
 * @memberof Vertex.prototype
 * @method addIncidentLoop
 * @param {Loop} loop An incident loop.
 */
Vertex.prototype.addIncidentLoop = function (loop) {
    this.loopList.push(loop);
};

/**
 * Removes specified Loop from the Loop list of the Vertex.
 * @memberof Vertex.prototype
 * @method removeIncidentLoop
 * @param {Loop} loop Incident loop to remove.
 */
Vertex.prototype.removeIncidentLoop = function (loop) {
    var i = this.loopList.indexOf(loop);
    if (i >= 0) {
        this.loopList.splice(i, 1);
    }
};

/*
 * Other Vertex specific methods
 */
 
/**
 * Draws a line from the Vertex to a point on the canvas.
 * @memberof Vertex.prototype
 * @method lineTo
 * @param {CanvasContext} context The context for the HTML canvas.
 * @param {int} x The x coordinate of the line endpoint.
 * @param {int} y The y coordinate of the line endpoint.
 */
Vertex.prototype.lineTo = function (context, x, y) {
	context.save();
	
    context.lineWidth = 2;
    context.fillStyle = this.color;
    context.strokeStyle = this.color;
	context.setLineDash([4,3]);
	
    context.beginPath();
	
    context.moveTo(this.x, this.y);
    context.lineTo(x, y);
	
    context.stroke();
	
	context.restore();
};


/**
 * Description
 * @memberof Vertex.prototype
 * @method selectWithLabel
 */
Vertex.prototype.selectWithLabel = function () {
    this.selected = true;
	if (this.label){
		this.label.select();
	}
};

/**
 * Description
 * @memberof Vertex.prototype
 * @method unselectWithLabel
 */
Vertex.prototype.unselectWithLabel = function () {
    this.selected = false;
	if (this.label){
		this.label.unselect();
	}
};


/*
 * Vertex specific methods for tracking the Vertex when one of its incident edges is being dragged.
 */


/**
 * Return array of Edges and Loops that incident with this Vertex and are coincident with an Edge.
 * @memberof Vertex.prototype
 * @method edgeGetCoincident
 * @param {Edge} edge The Edge to test for coincident edges. It should have this vertex as an endpoint.
 * @return {Array.<(Edge|Loop)>} Array of coincident Edge and Loop objects.
 */
Vertex.prototype.edgeGetCoincident = function(edge){
	var i=0, list = [], n;
	
	n = this.incidentList.length;
	for (i=0; i<n; i++){
		if ( this.incidentList[i] !== edge && edge.coincide( this.incidentList[i] )   ){
			list.push( this.incidentList[i] );
		}
	}

	return list;
}

/**
 * Start tracking when an incident Edge object is being dragged.
 * @memberof Vertex.prototype
 * @method edgeTrackStart
 * @param {(Edge|Loop)} edge The incident Edge object.
 */
Vertex.prototype.edgeTrackStart = function(edge){
	var i, j;
	
	this.track.x = this.x;
	this.track.y = this.y;
	
	this.track.incident = [];
	
	// start tracking any incident edge that does not have the same endpoints
	// build list of non-coincident edges to the tracking edge
	for (i=0; i<this.incidentList.length; i++){
		if ( !(edge instanceof Edge) || !edge.coincide( this.incidentList[i] ) ) {
			this.incidentList[i].vertexTrackStart(this);
			this.track.incident.push( this.incidentList[i] );
		}
	}

	// handle loops incident to vertex
	for (j=0; j<this.loopList.length; j++){
		if (edge !== this.loopList[j] ){
			this.loopList[j].vertexTrackStart(this);
			this.track.incident.push(this.loopList[j]);
		}
	}
}

/**
 * Cancel tracking when dragging of an incident Edge object is canceled.
 * @memberof Vertex.prototype
 * @method edgeTrackCancel
 * @param {(Edge|Loop)} edge The incident Edge object.
 */
Vertex.prototype.edgeTrackCancel = function(edge){
	var i;
	
	this.x = this.track.x;
	this.y = this.track.y;

	// cancel tracking any incident edge that does not have the same endpoints
	for (i=0; i<this.track.incident.length; i++){
		this.track.incident[i].vertexTrackCancel(this);
	}
}

/**
 * Track the movement of the Vertex when an incident Edge object is moved.
 * @memberof Vertex.prototype
 * @method edgeTrackMove
 * @param {(Edge|Loop)} edge The incident edge object.
 * @param {int} dx Distance moved in the x direction.
 * @param {int} dy Distance moved in the y direction.
 */
Vertex.prototype.edgeTrackMove = function(edge, dx, dy){
	var i, n;
	
	this.x += dx;
	this.y += dy;
	
	var list = this.track.incident;
	
	// track incident edges
	n = list.length;
	for (i=0; i<n; i++){
		list[i].vertexTrackMove(this, dx, dy);
	}
}

/**
 * End tracking when an incident Edge object is finished being dragged.
 * @memberof Vertex.prototype
 * @method edgeTrackEnd
 * @param {(Edge|Loop)} edge The incident Edge object.
 */
Vertex.prototype.edgeTrackEnd = function(edge){
	var i;
	
	// end tracking any incident edge that does not have the same endpoints
	for (i=0; i<this.track.incident.length; i++){
		this.track.incident[i].vertexTrackEnd(this);
	}
}

/**
 * Create a ControlPoint object used to configure loops and edges (splines).
 * @constructor
 * @implements GraphObject
 * @implements Drawable
 * @implements Trackable
 * @param {!Uml} uml The uml containing this ControlPoint.
 * @param {!(Edge|Loop)} owner The Edge or Loop object configured by this ControlPoint.
 * @param {int} x The x coordinate of this ControlPoint.
 * @param {int} y The y coordinate of this ControlPoint.
 * @classdesc ControlPoint defines a visual and draggable point on an Edge or Loop.
 * They control the configuration of Edges which are implemented as Bezier splines,
 * and the diameter and positioning of Loops.
 */
function ControlPoint(uml, owner, x, y) {

	/** @member {!Uml} 
	  * @description The uml that contains this Edge.
	  */
	this.uml = uml;

	/** @member {!(Edge|Loop)} 
	  * @description The Edge or Loop object configured by this ControlPoint.
	  */
	this.owner = owner;

	/** @member {int} 
	  * @description The x coordinate.
	  */
    this.x = Math.round(x);

	/** @member {int} 
	  * @description The y coordinate.
	  */
    this.y = Math.round(y)

	/** @member {Boolean} 
	  * @description True if this ControlPoint is currently being tracked.
	  * @default false
	  */
	this.tracking = false;

	/** @member {!Object} 
	  * @description Tracking data for this ControlPoint.
	  */
	this.track = {};
}

ControlPoint.prototype.DELTA = 5;

/**
 * Used as a constructor with the new operator to build a ControlPoint object from JSON data.
 * @memberof ControlPoint
 * @static
 * @param {!Uml} uml The uml object being built.
 * @param {!Object} cp The JSON control point data.
 */
ControlPoint.constructFromJSON = function(uml, cp) {
	this.uml = uml;
	this.x = cp.x;
	this.y = cp.y;
	
	this.owner = null;
	this.tracking = false;
	this.track = {};
};

ControlPoint.constructFromJSON.prototype = ControlPoint.prototype;

/*
 *   Partial Implementation of the GraphObject interface
 */


/**
 * Build an object with ControlPoint data that will be converted to JSON
 * @method toJSON
 * @memberof ControlPoint.prototype
 * @return {Object} ControlPoint data to be converted to JSON.
 */
ControlPoint.prototype.toJSON = function(){
	return{
		x : this.x,
		y : this.y
	}
};

/**
 * Gets the index of this ControlPoint within the uml's array.
 * Used to build JSON data.
 * @method getIndex
 * @memberof ControlPoint.prototype
 * @return {int} Index of this ControlPoint in the uml's array.
 */
ControlPoint.prototype.getIndex = function(){
	return this.uml.getControlPointIndex(this);
}


/**
 * Removes this ControlPoint from the uml.
 * @method remove
 * @memberof ControlPoint.prototype
 */
ControlPoint.prototype.remove = function(){
	return this.uml.removeControlPointFromGraph(this);
}

/**
 * Determines if coordinate (x,y) is on this ControlPoint.
 * @method hit
 * @memberof ControlPoint.prototype
 * @param {int} x The x coordinate.
 * @param {int} y The y coordinate.
 * @return {Boolean} True if (x,y) hits this ControlPoint.
 */
ControlPoint.prototype.hit = function (x, y) {
    var dx, dy;

    dx = this.x - x;
    dy = this.y - y;

    return (dx * dx + dy * dy) <= this.DELTA * this.DELTA;
};

/*
 * Implement Drawable interface
 */
 
/**
 * Draws this ControlPoint on an HTML canvas.
 * @method draw
 * @memberof ControlPoint.prototype
 * @param {CanvasContext} context The 2d context for an HTML canvas.
 */
ControlPoint.prototype.draw = function (context) {
	var delta = this.DELTA;
	if (this.tracking){
		delta += 4;
	}
	
	context.save();
	
    context.beginPath();
	
	if (this.tracking){
		context.fillStyle = "green";
	}
	else{
		context.fillStyle = "yellow";
	}
    context.strokeStyle = "black";
    context.lineWidth = 2;
	
    context.moveTo(this.x, this.y - delta);
	context.lineTo(this.x + delta, this.y);
	context.lineTo(this.x, this.y + delta);
	context.lineTo(this.x - delta, this.y);
	
	context.closePath();
	
    context.fill();
    context.stroke();
	
	context.restore();
	
};

/*
 * Implement the Trackable interface
 */
 
/**
 * Start tracking this ControlPoint. Save its initial position.
 * @memberof ControlPoint.prototype
 * @method trackStart
 */
ControlPoint.prototype.trackStart = function(){
	this.tracking = true;
	this.track.x = this.x;
	this.track.y = this.y;
	this.tracking = true;
	//console.log('track CP');
}

/**
 * Cancel tracking.  Called when this ControlPoint is dragged off the canvas.
 * The ControlPoint should return to its original start position.
 * @memberof ControlPoint.prototype
 * @method trackCancel
 */
ControlPoint.prototype.trackCancel = function(){
	this.tracking = false;
	this.x = this.track.x;
	this.y = this.track.y;
	this.owner.computePoints();
	this.tracking = false;
}

/**
 * Move this ControlPoint
 * @method trackMove
 * @memberof ControlPoint.prototype
 * @param {int} dx Distance to move in x direction.
 * @param {int} dy Distance to move in y direction.
 */
ControlPoint.prototype.trackMove = function (dx, dy) {
    this.x += dx;
    this.y += dy;
	this.owner.computePoints();
};

/**
 * End tracking of this ControlPoint.
 * @method trackEnd
 * @memberof ControlPoint.prototype
 */
ControlPoint.prototype.trackEnd = function () {
    this.tracking = false;
};

/*
 * Other ControlPoint methods
 */
 

/**
 * Set a new Owner for this ControlPoint.
 * @method setOwner
 * @memberof ControlPoint.prototype
 * @param {!GraphObject} owner The new owner.
 */
ControlPoint.prototype.setOwner = function(owner){
	this.owner = owner;
}

 
/*
 * CP specific methods for tracking the CP when one of its incident edges is being dragged.
 */

/**
 * Start tracking when an incident Edge object is being dragged.
 * @method edgeTrackStart
 * @memberof ControlPoint.prototype
 * @param {(Edge|Loop)} edge
 */
ControlPoint.prototype.edgeTrackStart = function(edge){
	this.track.x = this.x;
	this.track.y = this.y;
}

/**
 * Cancel tracking when dragging an incident Edge object is canceled.
 * @method edgeTrackCancel
 * @memberof ControlPoint.prototype
 * @param {(Edge|Loop)} edge
 */
ControlPoint.prototype.edgeTrackCancel = function(edge){
	this.x = this.track.x;
	this.y = this.track.y;
}

/**
 * Track the movement of the CP when an incident Edge object is moved.
 * @method edgeTrackMove
 * @memberof ControlPoint.prototype
 * @param {(Edge|Loop)} edge
 * @param {int} dx
 * @param {int} dy
 */
ControlPoint.prototype.edgeTrackMove = function (edge, dx, dy) {
    this.x += dx;
    this.y += dy;
};


/**
 * End tracking when an incident Edge object is finished being dragged.
 * @method edgeTrackEnd
 * @memberof ControlPoint.prototype
 * @param {(Edge|Loop)} edge
 */
ControlPoint.prototype.edgeTrackEnd = function(edge){
}

	
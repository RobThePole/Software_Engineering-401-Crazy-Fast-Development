/**
 * Creates a Label object in the uml at a specified location with a specified parent.
 *
 * @constructor
 *
 * @implements GraphObject
 * @implements Drawable
 * @implements LabelOwner
 * @implements Highlightable
 * @implements Selectable
 * @implements Trackable
 *
 * @param {!Uml} uml The Uml object that contains this Label.
 * @param {!String} text The text for this Label.
 * @param {int} x The x location of this Label.
 * @param {int} y The y location of this Label.
 * @param {LabelOwner} parent The LabelOwner object, possibly null, that owns this Label.
 * @classdesc Label defines a label in the uml or for a uml object, its location and its attributes.
 */
function Label(uml, text, x, y, parent) {
	/** 
	 * The uml that contains this Label.
	 * @member {!Uml} 
	 */
	this.uml = uml;
	
	/** 
	 * The text value of this Label.
	 * @member {String} 
	 */
    this.text = text;
	
	/** 
	 * The LabelOwner that is labeled by this Label.
	 * It is null if the label is not associated with any uml object.
	 * @member {LabelOwner} 
	 */
    this.parent = parent;
	
	/** @member {int} 
	  * @description The x coordinate for the Label. 
	  * Use an integer value for best line appearance.
	  */
 	this.x = x;
	
	/** @member {int} 
	  * @description The y coordinate for the Label. 
	  * Use an integer value for best line appearance.
	  */
	this.y = y;
	
    if (parent) { // tests whether Label has parent object. 
        this.x = 10; // place Label 10 horizontal pixels from parent.
        this.y = 10; // place Label 10 vertical pixels from parent.
		parent.setLabel(this);
    } 
	
	/** @member {!ColorData} 
	  * @description The color data for this Label.
	  * @default ColorData['colorBlack']
	  */
	this.colorData = ColorData.getColorByName('colorBlack');
	
	/** @member {string} 
	  * @description The color for this Label.
	  * @default 'black'
	  */
    this.color = this.colorData.getColor();
	
	/** @member {boolean} 
	  * @description True if this Label is currently highlighted.
	  * @default false
	  */
    this.highlighted = false;  
	
	/** @member {!ColorData} 
	  * @description The highlight color data for this Label.
	  * @default ColorData['highlightClear']
	  */
	this.highlightData = ColorData.getColorByName('highlightClear');
	  
	/** @member {string} 
	  * @description The highlight color data for this Label.
	  * @default null
	  */
    this.highlightColor = null;
	
	// computed data
	
	/** @member {boolean} 
	  * @description True if this Label is currently selected.
	  * @default false
	  */
    this.selected = false;
	
	/** 
	 * WIdth of this Label's text.
	 * @member {number} 
	 */
    this.textWidth = this.uml.getConfig().context.measureText(this.text).width;
	
	/** @member {!Object} 
	  * @description Tracking data for dragging this Label.
	  */
	this.track = {};
}

/**
 * Used as a constructor with the new operator to build a Label object from JSON data.
 * @static
 * @memberof Label
 * @param {!Uml} uml The uml object being built
 * @param {!Object} label The JSON label data.
 */
Label.constructFromJSON = function (uml, label) {
	this.uml = uml;
	this.x = label.x;
	this.y = label.y;
	this.text = label.text;

	this.colorData = ColorData.getColorByName(label.colorData);
	this.color = this.colorData.getColor();
	this.highlighted = label.highlighted;
	this.highlightData = ColorData.getColorByName(label.highlightData);
	this.highlightColor = this.highlightData.getColor();
	
	// computed values
    this.parent = null;     // parent will set this

	this.textWidth = this.uml.getConfig().context.measureText(this.text).width;
	this.selected = false;
	this.track = {};
};

Label.constructFromJSON.prototype = Label.prototype;

/*
 *   Implementation of the GraphObject interface
 */

/**
 * Build an object with Label data that will be converted to JSON
 * @memberof Label.prototype
 * @method toJSON
 * @return {Object} Object defining data properties for JSON conversion
 */
Label.prototype.toJSON = function () {
	return {
		x : this.x,
		y : this.y,
		text : this.text,
		colorData : this.colorData.getName(),
		highlighted : this.highlighted,
		highlightData : this.highlightData.getName()
	};
};
 
/**
 * Returns the index of the Label in the Label set of its uml
 * @memberof Label.prototype
 * @method getIndex
 * @return {int} index of this Label in the uml's Label set
 */
Label.prototype.getIndex = function () {
	return this.uml.getLabelIndex(this);
};

/**
 * Sets the color data for this label.
 * @memberof Label.prototype
 * @method setColor
 * @param {ColorData} color The color data.
 */
Label.prototype.setColor = function (colorData) {
    this.colorData = colorData;
	this.color = colorData.getColor();
};

/**
 * Gets the color data for this Label.
 * @memberof Label.prototype
 * @method getColor
 * @return {ColorData} color The color data.
 */
Label.prototype.getColor = function () {
	return this.colorData;
};


/**
 * Remove this Label from the uml.
 * @memberof Label.prototype
 * @method remove
 */
Label.prototype.remove = function () {
    if (this.parent) { // if this label has a parent, let parent know it is null.
        this.parent.setLabel(null);
    }
    this.uml.removeLabelFromGraph(this);
	
	return this;
};


/**
 * Tests if (x,y) is on this Label 
 * @memberof Label.prototype
 * @method hit
 * @param {} x The x coordinate.
 * @param {} y The y coordinate.
 * @return {boolean} Does (x,y) hit this Label
 */
Label.prototype.hit = function (x, y) {
    var dy, loc;

    loc = {x: 0, y: 0};

    if (this.parent) {
        loc = this.parent.getLabelLocation();
    }

    loc.x += this.x;
    loc.y += this.y;

    dy = y - loc.y;
    return (loc.x <= x && x <= loc.x + this.textWidth) && (0 <= dy && dy <= 15);
};

/*
 * 	Implementation of the Drawable interface
 */
 
/**
 * Draw this Label on the canvas.
 * @memberof Label.prototype
 * @method draw
 * @param {CanvasContext} context The 2d context for an HTML canvas.
 */
Label.prototype.draw = function (context) {
    var loc = {x: 0, y: 0};

    if (this.parent) {
        loc = this.parent.getLabelLocation();
    }

	context.save();
	
    context.textBaseline = "top";
    context.fillStyle = this.color; 
	
    context.fillText(this.text, (loc.x + this.x), (loc.y + this.y));
	
	context.restore();
	//console.log("draw text " + this.text)
};

 
/*
 * 	Partial Implementation of the LabelOwner interface
 *  Simplifies changing label text if we treat the Label as a LabelOwner
 */

 /**
 * Returns the Label.  Simplifies implementation of editing the label text.
 * @memberof Label.prototype
 * @method getLabel
 * @return {Label} This Label.
 */
Label.prototype.getLabel = function () {
	return this;
};

/*
 * 	Implementation of the Highlightable interface
 */
 
/**
 * Sets the highlight color data for this Label.
 * @memberof Label.prototype
 * @method setHighlight
 * @param {ColorData} color The highlight color data.
 */
Label.prototype.setHighlight = function(highlightData) {
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
 * Gets the highlight color for this Label.
 * @memberof Label.prototype
 * @method getHighlight
 * @returns {ColorData} The highlight color data.
 */
Label.prototype.getHighlight = function(){
	return this.highlightData;
}

Label.prototype.clearHighlight = function (highlightData) {
	//console.log('color set');
	this.highlighted = false;
    this.highlightData = highlightData;
};


/**
 * Toggles the highlighting of this Label.
 * @memberof Label.prototype
 * @method toggleHighlight
 * @param {ColorData} color The highlight color data.
 */
Label.prototype.toggleHighlight = function (colorData) {
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
 * If the Vertex highlight property is true, draws a highlight for this Label object.
 * @memberof Label.prototype
 * @method drawHighlight
 * @param {CanvasContext} context The 2d context for an HTML canvas.
 */
Label.prototype.drawHighlight = function (context) {
    var loc, pattern;
    
    if (!this.highlighted) {
        return;
    }
    
    loc = {x: 0, y: 0};

    if (this.parent) {
        loc = this.parent.getLabelLocation();
    }
    loc.x += this.x;
    loc.y += this.y;
	
    context.save();
    
	context.lineCap = "round";
	context.lineJoin = "round";
    context.strokeStyle = this.highlightColor;
    context.lineWidth = 12;
	
    context.beginPath();

    context.moveTo(loc.x-2, loc.y+1);
    context.lineTo(loc.x + this.textWidth, loc.y + 5);
    context.lineTo(loc.x, loc.y + 9);
    context.lineTo(loc.x + this.textWidth+2, loc.y + 13);
    
    context.stroke();
	
    context.restore();
};

/*
 * 	Implementation of the Selectable interface
 */

/**
 * Set this Label to be selected.
 * @memberof Label.prototype
 * @method select
 */
Label.prototype.select = function(){
	this.selected = true;
}

/**
 * Unselect this Label.
 * @memberof Label.prototype
 * @method unselect
 */
Label.prototype.unselect = function(){
	this.selected = false;
}
 
/**
 * Queries the selection state of the Label.
 * @memberof Label.prototype
 * @method isSelected
 // * @return {boolean} rue if this Label is selected.
 */
Label.prototype.isSelected = function(){
	return this.selected;
}

/**
 * If selected property is true, draws the select pattern on this Label.
 * @memberof Label.prototype
 * @method drawSelect
 * @param {CanvasContext} context The 2d drawing context for an HTML canvas.
 */
Label.prototype.drawSelect = function (context) {
    if (!this.selected) { return; }

	var anchor = {x:0, y:0};
	
    var loc = {x: 0, y: 0};

    if (this.parent) {
        anchor = this.parent.getLabelLocation();
    }
    
    loc.x = anchor.x + this.x;
    loc.y = anchor.y + this.y;
	
	if (this.parent){
		context.save();
		context.lineWidth = 2;
		context.strokeStyle = "#888";
		context.beginPath();
		context.moveTo(anchor.x, anchor.y);
		context.lineTo(loc.x, loc.y);
		context.stroke();
		
		context.restore();
	}
	
	context.save();
	
	context.lineCap = "round";
	context.lineJoin = "round";
	context.lineWidth = 16;
	context.fillStyle = context.strokeStyle = this.uml.getConfig().selectPattern;

    context.beginPath();

    context.moveTo(loc.x-2, loc.y+1);
    context.lineTo(loc.x + this.textWidth, loc.y + 5);
    context.lineTo(loc.x, loc.y + 9);
    context.lineTo(loc.x + this.textWidth+2, loc.y + 13);
	
	/*
    context.moveTo(loc.x, loc.y);
    context.lineTo(loc.x + this.textWidth, loc.y);
    context.lineTo(loc.x, loc.y + 10);
    context.lineTo(loc.x + this.textWidth, loc.y + 10);
	*/
	
    context.stroke();
	
	context.restore();
};

/*
 * 	Implementation of the Trackable interface
 */

/**
 * Start tracking this Label.  It saves its starting position.
 * @memberof Label.prototype
 * @method trackStart
 */
Label.prototype.trackStart = function(){
	this.track.x = this.x;
	this.track.y = this.y;
}

/**
 * Cancel tracking.  Called when this Label is dragged off the canvas.
 * The Label should return to its original start position.
 * @memberof Label.prototype
 * @method trackCancel
 */
Label.prototype.trackCancel = function(){
	this.x = this.track.x;
	this.y = this.track.y;
}

/**
 * Move this Label.
 * @memberof Label.prototype
 * @method trackMove
 * @param {int} dx Distance to move in x direction.
 * @param {int} dy Distance to move in y direction.
 */
Label.prototype.trackMove = function (dx, dy) {
    this.x += dx;
    this.y += dy;
};

/**
 * End tracking of this Label
 * @memberof Label.prototype
 * @method trackEnd
 */
Label.prototype.trackEnd = function(){
}


/*
 * Label specific methods
 */
 
/**
 * Set the text for this Label
 * @memberof Label.prototype
 * @method setText
 * @param {String} text The text for this Label.
 */
Label.prototype.setText = function (text) {
    this.text = text;
    this.textWidth = this.uml.getConfig().context.measureText(this.text).width;
};

/**
 * Get the Text for this Label.
 * @memberof Label.prototype
 * @method getText
 * @return {String} The text for this Label.
 */
Label.prototype.getText = function () {
    return this.text;
};


/**
 * Sets the parent of this Label.
 * @memberof Label.prototype
 * @method setParent
 * @param {LabelOwner} parent The LabelOwner parent for this Label.
 */
Label.prototype.setParent = function (parent) {
	this.parent = parent;
};
 


/*
Label.prototype.selectWithLabel = function () {
    this.selected = true;
	if (this.label){
		this.label.select();
	}
};

Label.prototype.unselectWithLabel = function () {
    this.selected = false;
	if (this.label){
		this.label.unselect();
	}
};
*/


Label.prototype.lineTo = function(context, x, y){
	if (this.parent){
		context.save();
		context.lineWidth = 2;
		context.strokeStyle = "#888";
		context.setLineDash([2, 2]);
		context.beginPath();
		context.moveTo(x, y);
		context.lineTo(this.x + x, this.y + y);
		context.stroke();
		
		context.restore();
	}
}

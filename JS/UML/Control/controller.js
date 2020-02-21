
function controllerCreate(theCanvas){
	function nullFunction(){};
	
	// variables to describe system state
	var state;
	
	var uml = new Uml(theCanvas);
	
	var background = {};
	
	var controlPoints = {};
	
	var ui = null;
	
	var showCP = true;
	
	var background = null;
	var showBackground = false;
	
	var canvas = theCanvas;
	var context = canvas.getContext("2d");
	context.font = "bold 14px Arial";
	
	var selection = {
		item : null,
		
		set : function(i) {
					if (this.item){
						this.item.unselect();
					}
					this.item=i;
					this.item.select();
				},
				
		get : function() {
					return this.item;
				},
				
		exists : function() {
					return this.item !== null;
				},
			
		clear : function() {
					if ( this.item ){
						this.item.unselect();
						this.item=null;
					}
				},
	};
	
	// support functions
	
	function drawIt(){
		var h, w, x, y;
		
		context.save();
		//this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		context.fillStyle='white';
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.restore();

		if (background  && showBackground){
			context.save();
			context.globalAlpha = .50;
			
			if ( background.width/background.height > canvas.width/canvas.height ){
				w = canvas.width;
				h = Math.round(background.height * w / background.width);
				x = 0;
				y= Math.round( (canvas.height-h)/2 );
			}
			else{
				h = canvas.height;
				w = Math.round(background.width * h / background.height);
				y = 0;
				x = Math.round( (canvas.width-w)/2 );
			}
	//		context.drawImage(background, 0, 0, canvas.width, canvas.height);
			context.drawImage(background, x, y, w, h);
			context.restore();
		}
		
		/*
		if ( selection.exists() ){
			//console.log('draw selection');
			selection.get().drawSelect(context);
		}
		*/
		
		uml.newDraw(context, selection.get(), showCP);
	}
	
	// state machine states and methods
	
	function changeState(newState){
		if (state === newState){
			return;
		} 
		
		state.leaveState(newState);
		if ( state.masterState !== newState.masterState){
			state.masterState.leaveMasterState();
		}
		
		newState.enterState(state);
		
		state = newState;
		
	};
	
	/**
	 *	stateNull
	 *
	 *	prototype for all state objects
	 *	all methods are nullFunction
	 *
	 *	all new state objects are created from this object
	 *	undefined properties in derived objects will refer to this object
	 *
	 */
	 
	var stateNull = {
		data: null,
		masterState : null,
		
		enterState : nullFunction,
		leaveState : nullFunction,
		leaveMasterState: nullFunction,
		
		mouseDown : nullFunction,
		mouseMove : nullFunction,
		mouseUp : nullFunction,
		mouseEnter : nullFunction,
		mouseLeave : nullFunction,
		
		nudge: nullFunction,
		keyDown : nullFunction,
		setLabel: nullFunction,
		labelCancel : nullFunction,
		setColor : nullFunction,
		setHighlight : nullFunction,
		//clearHighlight: nullFunction,
		deleteObject : nullFunction,
		powerLabel: nullFunction,
	}
	
	/*  stateBuild - primary state for build mode */
	
	/*	all stateBuild* objects will share this data */
	
	var stateBuildData = {
		newVertex : false,
		x : 0,
		y : 0,
		startVertex : null,
		controlPoint : null,
		offStart : false
	};
	
	var stateBuild = Object.create(stateNull);
	
	stateBuild.data = stateBuildData;
	stateBuild.masterState = stateBuild;			/* this is a master state */
	
	stateBuild.enterState = function(){
		this.data.newVertex = false;
		this.data.startVertex = null;
		this.data.controlPoint = null;
		this.data.offStart = false;
		
		canvas.style.cursor = 'auto';
	};
	
	stateBuild.mouseDown = function(x, y, hit){
        if (hit && hit instanceof Vertex) {
			this.data.startVertex = hit;
			this.data.newVertex = false;
			changeState(stateBuildTrack);
        } 
		
		// Was a ControlPoint hit
		else if (hit && hit instanceof ControlPoint) {
			this.data.controlPoint = hit;
			this.data.x = x;
			this.data.y = y;
			changeState(stateBuildTrackCP);
		} 
		// No desired  hit, add a vertex at current position.
		else { 
            this.data.startVertex = uml.createVertex(x, y);
			this.data.newVertex = true;
			changeState(stateBuildTrack);
        }
		drawIt();
	};
	
	stateBuild.mouseMove = function(x, y){
		if ( uml.hitVertex(x, y) || ( showCP && uml.hitControlPoint(x, y) )  ){
			
			canvas.style.cursor = 'crosshair';			
		}
		else{
			canvas.style.cursor = 'auto';		
		}

	}
	
	/* stateBuildTrack - track mouse after mouse down in build mode */
	
	var stateBuildTrack = Object.create(stateNull);
	
	stateBuildTrack.data = stateBuildData;
	stateBuildTrack.masterState = stateBuild;
	
	stateBuildTrack.mouseMove = function(x, y){
		if ( !this.data.offStart && !this.data.startVertex.hit (x, y) ){
			this.data.offStart = true;
		}
		
		if ( uml.hitVertex(x, y)) {
			canvas.style.cursor = 'crosshair';
		}
		else{
			
			canvas.style.cursor = 'auto';
		}
		
		drawIt();
		this.data.startVertex.lineTo(context, x, y);
		
	};
	
	stateBuildTrack.mouseUp = function(x, y, hit){
		if ( this.data.offStart && this.data.startVertex.hit(x, y) ){
			//console.log('create loop');
			uml.createLoop(this.data.startVertex);
		}
		else if (hit !== null && hit instanceof Vertex) {
			if (hit !== this.data.startVertex) {
				uml.createEdge(this.data.startVertex, hit);
			}
			// else just a vertex and no edge
		} 
		else if (0 <= x && x <= canvas.width && 0 <= y && y <= canvas.height) {
			uml.createEdge(this.data.startVertex, uml.createVertex(x, y) );
		}
		
		drawIt();
		changeState(stateBuild);
		
	};
	
	stateBuildTrack.mouseLeave = function(){
		// end adding an edge
		
		/*
		keep any newly created vertex
		// get rid of any newly created vertex
		if (this.data.newVertex){
			this.data.startVertex.remove();
		}
		*/
		
		canvas.style.cursor = 'auto';
		
		drawIt();
		changeState(stateBuild);
		
	};
	
	
	/* stateBuildTrackCP - track mouse after mouse down on CP in build mode */
	
	var stateBuildTrackCP = Object.create(stateNull);
	
	stateBuildTrackCP.data = stateBuildData;
	stateBuildTrackCP.masterState = stateBuild;
	
	stateBuildTrackCP.enterState = function(prevState){
		this.data.controlPoint.trackStart();
		canvas.style.cursor = 'move';
	};
	
	stateBuildTrackCP.leaveState = function(nextState){
		this.data.controlPoint = null;
		canvas.style.cursor = 'auto';
};
	
	stateBuildTrackCP.mouseMove = function(x, y){
		this.data.controlPoint.trackMove( (x - this.data.x), 
									 (y - this.data.y) );
		this.data.x = x;
		this.data.y = y;

		drawIt();
	};
	
	stateBuildTrackCP.mouseUp = function(x, y, hit){
		this.data.controlPoint.trackMove( (x - this.data.x), 
									 (y - this.data.y) );
		this.data.controlPoint.trackEnd();
		
		this.data.x = this.x;
		this.data.y = this.y;
		
		drawIt();
		changeState(stateBuild);
		
	};
	
	stateBuildTrackCP.mouseLeave = function(){
		// end tracking a Control Point
		this.data.controlPoint.trackCancel();
	
		drawIt();
		changeState(stateBuild);
		
	};
	
	/**
	 * Label uml objects
	 */
	 
	// dragging over label owner will select the label owner
	// must unselect when not over  label owner
	var stateLabel = Object.create(stateNull);
	
	var stateLabelData = {
		selection : null,
		newLabel : false,
		changed: false,
	};
	
	stateLabel.data = stateLabelData;
	stateLabel.masterState = stateLabel;			/* this is a master state */
	
	stateLabel.enterState = function(){
		ui.showLabelSubMenu();		
		this.data.selection = null;
		this.data.newLabel = false;
		this.data.changed = false;
	}
	
	stateLabel.leaveState = function(newState){
		canvas.style.cursor = 'auto';
		/*
		if ( this.data.selection === null){
			selection.clear();
		}
		*/
		
		drawIt();
	}
	
	stateLabel.leaveMasterState = function(newState){
		canvas.style.cursor = 'auto';	
		ui.hideOptionSubMenus();
	}
	
	stateLabel.mouseMove = function(x, y){
		var hit = uml.hitNoCP(x, y);
		
		if (  hit !== null ){
			canvas.style.cursor = 'crosshair';	

			// selection.set(hit);
			drawIt();

		}
		else{
			canvas.style.cursor = 'auto';
			
			// selection.clear();
			drawIt();
			context.save();
			
			context.textBaseline = "top";
			context.fillStyle = "#888"; 
			
			context.fillText('<new label>', x, y);
			
			context.restore();
		}

	}
	
	stateLabel.mouseDown = function(x, y, hit){
		hit =  uml.hitNoCP(x, y);
		this.data.changed = false;
		this.data.newLabel = false;
		
		if ( hit === null){
			hit = uml.createLabel('<new label>', x, y, null);
			this.data.newLabel = true;
		}
		
		// if new label created, hit is a reference
		if ( 'getLabel' in hit ){
			this.data.selection = hit;
			selection.set(hit);
			changeState(stateLabelSelect);
			drawIt();
		}

	}
	
	stateLabel.mouseLeave = function(x, y){
		selection.clear();
		drawIt();
	}
	
	stateLabel.powerLabel = function(iterator){
		selection.clear();
		drawIt();

		this.data.iterator = iterator;
		if (  iterator.more() ){
			changeState(stateLabelPower);
		}
	}

	/**
	 *  Label selected object
	 */
	 
	var stateLabelSelect = Object.create(stateNull);
	
	stateLabelSelect.data = stateLabelData;
	stateLabelSelect.masterState = stateLabel;			/* this is a master state */
	
	stateLabelSelect.enterState = function(prevState){
		var label = this.data.selection.getLabel();
		if (label !== null ) {
			label = label.getText();
		}
		else {
			label = '';
		}
	
		ui.showLabelPrompt( label);
	}
	
	stateLabelSelect.leaveState = function(newState){
		canvas.style.cursor = 'auto';
		
		// make sure change state not called with new selection
		if ( state !== newState){
			if (selection.exists()){
				selection.clear();
				this.data.selection = null;
			}
			drawIt();
		}
	}
	
	stateLabelSelect.mouseMove = function(x, y){
		if ( uml.hitNoCP(x, y)  ){
			canvas.style.cursor = 'crosshair';			
		}
		else{
			canvas.style.cursor = 'auto';		
		}

	}
	
	stateLabelSelect.mouseDown = function(x, y, hit){
		var label;
		
		hit =  uml.hitNoCP(x, y);
		if ( hit === this.data.selection ){
			return;
		}
		
		selection.clear();
		
		this.data.changed = false;
		this.data.newLabel = false;
		
		if ( hit === null){
			//hit = uml.createLabel('<new label>', x, y, null);
			//this.data.newLabel = true;
			changeState(stateLabel);
			return;
		}
		
		if ( hit.getLabel ){
			this.data.selection = hit;
			this.enterState();
			selection.set(hit);
			drawIt();
		}

	}

	stateLabelSelect.powerLabel = function(iterator){
		this.data.iterator = iterator;
		if (  iterator.more() ){
			changeState(stateLabelPower);
		}
	}

	/*
	stateLabelSelect.setLabel = function(text){
		console.log('set label to ' + text);
		var label = this.data.selection.getLabel();
		
		if ( label !== null){
			if (text != ''){
				label.setText(text);
			}
			else{
				if ( this.data.selection instanceof Label){
					//selection.clear();
					//label.remove();
					changeState(stateLabel);
				}
				else{
					label.remove();
				}
			}
		}
		else{
			console.log('object has no label');
			if ( text != ''){
				uml.createLabel(text, 0, 0, this.data.selection)
			}
		}
		
		drawIt();
	}
	*/
	
	stateLabelSelect.setLabel = function(text){
		//console.log('set label to ' + text)
		var label = this.data.selection.getLabel();
		
		if ( label !== null){
			//console.log("found a label");
			if (text != ''){
				label.setText(text);
			}
			else{
				//console.log("Label is removed")
				if ( this.data.selection instanceof Label){
					//selection.clear();
					label.remove();
					changeState(stateLabel);
				}
				else{
					label.remove();
				}
			}
		}
		else{
			//console.log('object has no label');
			if ( text != ''){
				uml.createLabel(text, 0, 0, this.data.selection)
			}
		}
		
		drawIt();
	}
	
	stateLabelSelect.labelCancel = function(){
		selection.clear();
		changeState(stateLabel);
		drawIt();
	}
	
	/**
	 * Power Label uml objects
	 */
	 
	var stateLabelPower = Object.create(stateNull);
	
	stateLabelPower.data = stateLabelData;
	stateLabelPower.masterState = stateLabel;			/* this is a master state */
	
	stateLabelPower.enterState = function(){
		var label;
		this.data.selection = this.data.iterator.next();
		selection.set(this.data.selection);
		drawIt();
		
		label = this.data.selection.getLabel();
		if (label !== null ) {
			label = label.getText();
		}
		else {
			label = '';
		}
	
		ui.showLabelPrompt( label);
	}
	
	stateLabelPower.leaveState = function(newState){
		ui.hideLabelPrompt();
	}
	

	stateLabelPower.setLabel = function(text){
		//console.log('set label to ' + text)
		var label = this.data.selection.getLabel();
		
		if ( label !== null){
			if (text != ''){
				label.setText(text);
			}
			else{
				label.remove();
				selection.clear();
				changeState(stateLabel);
			}
		}
		else{
			//console.log('object has no label');
			if ( text != ''){
				uml.createLabel(text, 0, 0, this.data.selection)
			}
		}
		
		this.data.selection.unselect();
		selection.clear();
		
		if ( this.data.iterator.more() ){
			this.data.selection = this.data.iterator.next();
			selection.set(this.data.selection);
			label = this.data.selection.getLabel();
			if (label !== null ) {
				label = label.getText();
			}
			else {
				label = '';
			}
		
			ui.showLabelPrompt( label);
			
		}
		else{
			changeState(stateLabel);
		}
		
		drawIt();
	}
	

	stateLabelPower.labelCancel = function(){
		selection.clear();
		changeState(stateLabel);
		drawIt();
	}
	


	/**
	 * Highlight uml objects
	 */
	 
	var stateHighlight = Object.create(stateNull);
	
	var stateHighlightData = {
		highlight : ColorData[ 'highlightClear' ]
	};
	
	stateHighlight.data = stateHighlightData;
	stateHighlight.masterState = stateHighlight;			/* this is a master state */
	
	stateHighlight.enterState = function( prevState){
		ui.showHighlightSubMenu( this.data.highlight);
	};
	
	stateHighlight.leaveState = function( nextState ){
		ui.hideOptionSubMenus();
		canvas.style.cursor = 'auto';		
	}

	stateHighlight.setHighlight = function( highlight ){
		this.data.highlight= highlight;
	}

	/*
	stateHighlight.clearHighlight = function( ){
		this.data.highlight = {
			name : 'clear',
			color: 'white'
		} ;
	}
	*/
	
	stateHighlight.mouseDown = function(x, y, hit){
		hit = uml.hitNoCP(x, y);
		if ( hit != null && 'toggleHighlight' in hit ){
			if ( this.data.highlight.getName() == 'highlightClear' ){
				hit.clearHighlight(this.data.highlight);
			}
			else{
				hit.toggleHighlight(this.data.highlight);
			}
			drawIt();
		}
	}

	
	stateHighlight.mouseMove = function(x, y){
		if ( uml.hitNoCP(x, y) ){
			canvas.style.cursor = 'crosshair';			
		}
		else{
			canvas.style.cursor = 'auto';		
		}

	}
	/**
	 * Select uml objects
	 */
	 
	/*
	 *
	 * StateSelect - in select mode with no object selected
	 *
	 */
	 
	var stateSelect = Object.create(stateNull);
	
	var stateSelectData = {
		selection : null,
		controlPoint : null,
		x : 0,
		y : 0
	};
	
	stateSelect.data = stateSelectData;
	stateSelect.masterState = stateSelect;			/* this is a master state */
	
	stateSelect.enterState = function(prevState){
		this.data.selection = null;
		this.data.controlPoint = null;
	}
	
	stateSelect.leaveState = function(nextState){
	}
	
	stateSelect.mouseDown = function(x, y, hit){
		
		// determine if there is a hit object
        if (hit !== null) {
			this.data.x = x;
			this.data.y = y;
			
			if ( ! (hit instanceof ControlPoint) ){
				this.data.selection = hit;
				selection.set(hit);
				
				changeState(stateSelectTrack);
			}
			else{
				this.data.controlPoint = hit;
				changeState( stateSelectTrackCP );
			}
			
        } 
		
		drawIt();
		
	}
	
	stateSelect.mouseMove = function(x, y){
		if ( uml.hit(x, y, showCP) ){
			canvas.style.cursor = 'crosshair';			
		}
		else{
			canvas.style.cursor = 'auto';		
		}

	}
	
	/**
	 * Track uml objects in select mode
	 */
	 
	var stateSelectTrack = Object.create(stateNull);
	
	stateSelectTrack.data = stateSelectData;
	stateSelectTrack.masterState = stateSelect;
	
	stateSelectTrack.enterState = function(prevState){
		canvas.style.cursor = 'move';
		
		var label = this.data.selection.getLabel();
		if (label !== null ) {
			label = label.getText();
		}
		else {
			label = '';
		}
	
		ui.showObjectSubMenu(this.data.selection.getColor(), this.data.selection.getHighlight(), label);
			
		this.data.selection.trackStart();
	}
	
	stateSelectTrack.leaveState = function(nextState){
		canvas.style.cursor = 'auto';
		
	}
	
	stateSelectTrack.mouseMove = function(x, y){
		this.data.selection.trackMove( (x - this.data.x), 
									 (y - this.data.y) );
		this.data.x = x;
		this.data.y = y;

		drawIt();
	}
	
	stateSelectTrack.mouseUp = function(x, y){
		this.data.selection.trackMove( (x - this.data.x), 
									 (y - this.data.y) );
		this.data.selection.trackEnd();
		this.data.x = this.x;
		this.data.y = this.y;
		
		drawIt();
		
		changeState(stateSelectSelected);
	}
	
	stateSelectTrack.mouseLeave = function(){
		// end tracking selection
		this.data.selection.trackCancel();
		
		drawIt();
		changeState(stateSelectSelected);
		
	}
	
	
	/**
	 * Track control points in select mode
	 */
	 
	var stateSelectTrackCP = Object.create(stateNull);
	
	stateSelectTrackCP.data = stateSelectData;
	stateSelectTrackCP.masterState = stateSelect;
	
	stateSelectTrackCP.enterState = function(prevState){
		this.data.controlPoint.trackStart();
		canvas.style.cursor = 'move';
		
	}
	
	stateSelectTrackCP.leaveState = function(nextState){
		this.data.controlPoint = null;
		canvas.style.cursor = 'auto';
		
	}
	
	stateSelectTrackCP.mouseMove = function(x, y){
		this.data.controlPoint.trackMove( (x - this.data.x), 
									 (y - this.data.y) );
		this.data.x = x;
		this.data.y = y;

		drawIt();
	}
	
	stateSelectTrackCP.mouseUp = function(x, y){
		this.data.controlPoint.trackMove( (x - this.data.x), 
									 (y - this.data.y) );
		this.data.controlPoint.trackEnd();
		
		this.data.x = this.x;
		this.data.y = this.y;
		
		drawIt();
		
		if ( this.data.selection){
			changeState(stateSelectSelected)
		}
		else{
			changeState(stateSelect);
		}

	}
	
	stateSelectTrackCP.mouseLeave = function(){
		// end tracking control point
		this.data.controlPoint.trackCancel();
		
		drawIt();
		
		if ( this.data.selection){
			changeState(stateSelectSelected)
		}
		else{
			changeState(stateSelect);
		}
		
	}
	
	/**
	 * Object is selected in Select mode
	 */
	 
	var stateSelectSelected = Object.create(stateNull);
	
	stateSelectSelected.data = stateSelectData;
	stateSelectSelected.masterState = stateSelect;
	
	stateSelectSelected.enterState = function(){
		
	}
	
	stateSelectSelected.leaveState = function(newState){
		//console.log('leave stateSelectSelected');
		if (newState !== stateSelectTrack && newState !== stateSelectTrackCP) {
			ui.hideOptionSubMenus();
			if ( selection.exists() ){
				selection.clear();
			}
			drawIt();
		}
	}
	
	stateSelectSelected.mouseDown = function(x, y, hit){
		
		// determine if hit is on current selection
		// start tracking
		if ( hit == this.data.selection){
			this.data.x = x;
			this.data.y = y;
			changeState(stateSelectTrack);
		}
		
		// determine if hit is on a different object
		// start tracking the new object
        else if (hit !== null) {
			
			this.data.x = x;
			this.data.y = y;
			
			if ( ! (hit instanceof ControlPoint) ){
				// must change selection
				selection.clear();
				this.data.selection = hit;
				selection.set(hit);
				
				changeState(stateSelectTrack);
			}
			else{
				// remember selection, we will return
				this.data.controlPoint = hit;
				changeState( stateSelectTrackCP );
			}
        } 
		
		// must be no hit, clear selection and go to state stateSelect
		else {
			selection.clear();
			this.data.selection = null;
			changeState(stateSelect);
			
        }
		
		drawIt();
		
	}
	
	stateSelectSelected.mouseMove = function(x, y){
		if ( uml.hit(x, y, showCP) ){
			canvas.style.cursor = 'crosshair';			
		}
		else{
			canvas.style.cursor = 'auto';		
		}

	}
	
	
	stateSelectSelected.setColor = function(color){
		this.data.selection.setColor(color);
		
		drawIt();
	}
	
	stateSelectSelected.setHighlight = function(color){
		//console.log('Set highlight color ' + color.color);
		if ( color.getName() == 'highlightClear' ){
			this.data.selection.clearHighlight(color);
		}
		else{
			this.data.selection.setHighlight(color);
		}
		
		drawIt();
	}
	
	/*
	stateSelectSelected.clearHighlight = function(){
		this.data.selection.clearHighlight();
		
		drawIt();
	}
	*/
	
	stateSelectSelected.setLabel = function(text){
		//console.log('set label to ' + text)
		var label = this.data.selection.getLabel();
		
		if ( label !== null){
			if (text != ''){
				label.setText(text);
			}
			else{
				if ( this.data.selection instanceof Label){
					selection.clear();
					label.remove();
					changeState(stateSelect);
				}
				else{
					label.remove();
				}
			}
		}
		else{
			//console.log('object has no label');
			if ( text != ''){
				uml.createLabel(text, 0, 0, this.data.selection)
			}
		}
		
		drawIt();
	}
	
	// The object must have tracking data if we are here
	// Any new mouseDown starts tracking.  The data is not destroyed.
	stateSelectSelected.nudge = function(dx, dy){
		this.data.selection.trackMove(dx, dy);
		drawIt();
	}
	
	stateSelectSelected.deleteObject = function(){
		//console.log('delete this object')
		selection.clear();
		this.data.selection.remove();
		changeState(stateSelect);
		drawIt();
	}
	
	// controller interface
	var control = {
		setState : function(state){
			if (state == 'build' ){
				changeState(stateBuild);
			}
			else if (state == 'select'){
				changeState(stateSelect);
			}
			else if (state == 'highlight'){
				changeState(stateHighlight);
			}
			else if (state == 'label'){
				changeState(stateLabel);
			}
			else {
				//console.log('GRAPH-ENE does not recongnize state request ' + state);
			}
		},
		
		mouseDown : function (event){
			//console.log("mouse down");
		    var x = Math.round(event.clientX - canvas.getBoundingClientRect().left);
			var y = Math.round(event.clientY - canvas.getBoundingClientRect().top);
			state.mouseDown(x, y, uml.hit(x, y, showCP) );
		},
		mouseMove : function (event){
		    var x = Math.round(event.clientX - canvas.getBoundingClientRect().left);
			var y = Math.round(event.clientY - canvas.getBoundingClientRect().top);
			state.mouseMove(x, y );

		},
		mouseUp : function (event){
		    var x = Math.round(event.clientX - canvas.getBoundingClientRect().left);
			var y = Math.round(event.clientY - canvas.getBoundingClientRect().top);
			state.mouseUp(x, y, uml.hit(x, y, showCP) );

		},
		mouseClick : function (ev){},
		mouseLeave : function (ev){
			state.mouseLeave( );

		},
		mouseEnter : function (ev){
			state.mouseEnter( );
		},
		keyDown : function (ev){
			var delta;
			if ( ev.ctrlKey && !ev.shiftKey ){
				delta = 1;
			}
			else if ( ev.shiftKey && !ev.ctrlKey ){
				delta = 4;
			}
			else{
				delta = 2;
			}
			
			if ( ev.keyCode == 37 ) { 			// left
				state.nudge( -delta, 0 );
			}
			else if ( ev.keyCode == 38 ) { 		// up
				state.nudge( 0, -delta );
			}
			else if ( ev.keyCode == 39 ) { 		// right
				state.nudge( delta, 0 );
			}
			else if ( ev.keyCode == 40 ) { 		// down
				state.nudge( 0, delta );
			}
			else return;
			
			ev.preventDefault();
 
		},
		
		setColor : function(color){
			//console.log("controller set color");
			state.setColor(color);
		},
		
		setHighlight : function (color){
			state.setHighlight(color);
		},
		
		/*
		clearHighlight : function (){
			state.clearHighlight();
		},
		*/
		
		deleteObject : function(){
			//console.log('controller delete object');
			state.deleteObject();
		},
		
		setLabel : function (text){
			//console.log('controller set label to ' + text);
			state.setLabel(text);
		},
		
		labelCancel : function(){
			state.labelCancel();
		},
		
		labelVertices : function(){
			var iterator = uml.getVertexIterator();
			state.powerLabel(iterator);
		},
		
		labelEdges : function(){
			var iterator = uml.getEdgeLoopIterator();
			state.powerLabel(iterator);
			//console.log('iterator more is ' + iterator.more() )
		},
		
		getGraphAsJSON : function(){
			return JSON.stringify(uml);
		},
		
		setGraphAsJSON : function(data){
			uml = new Uml.constructFromJSON( JSON.parse(data), canvas );
			changeState(stateBuild);
			ui.setState('build');
			drawIt();
		},
		
		getPngURL : function () {
			//return canvas.toDataURL("image/png"); // base64 string
			return uml.getPngImageData();
		},


		setBackground : function(image){
			background = image;
			showBackground = true;
			ui.showBackgroundSubMenu();
			drawIt();
		},
		
		showBackground : function(){
			showBackground = true;
			drawIt();
		},
		
		hideBackground : function(){
			showBackground = false;
			drawIt();
		},
		
		clearBackground : function(){
			background = null;
			showBackground = false;
			drawIt();
			ui.hideBackgroundSubMenu();
		},
		
		showControlPoints : function(){
			showCP = true;
			drawIt();
		},
		
		hideControlPoints : function(){
			showCP = false;
			drawIt();
		},
		
		setUI : function(theUI){
			ui = theUI;
			state = stateBuild;
			ui.setState('build');
			ui.setCpOn();
		}
		
	};

	
	return control;
}


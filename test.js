
function easyLine(coords) {
	
	function makeLineSegment(coords) {
	    return new fabric.Line(coords, {
	        fill: 'red',
	        stroke: 'red',
	        strokeWidth: 5,
	        selectable: true,
	        hasControls: false,
	        //hoverCursor: 'pointer'
	    });
	}
	var line = makeLineSegment(coords);
	canvas.add(line);
	
	//use constant so custom clickable line end points are consistent UI size
	var vertexRadius = 6;
	
	function vertex(x, y, line) {
	    var c = new fabric.Circle({
	        left: x,
	        top: y,
	        strokeWidth: 0.1,
	        radius: vertexRadius,
	        fill: '',
	        stroke: 'red'
	    });
	    c.line = line;
	    c.hasControls = false;
	    c.hasBorders = true;
	    return c;
	}
	
	//add vertex points for ends of line
	var headVertex = vertex(line.get('x1'), line.get('y1'), line),
		tailVertex = vertex(line.get('x2'), line.get('y2'), line);
	
	canvas.add(headVertex, tailVertex);
	
	canvas.on('object:moving', function(e) {
	    var p = e.target;
	    console.log('--------------------------');
	    console.log('object:moving');
	    console.log(e);
    	
		//make sure we know where the point is referenced to
    	move = p.getPointByOrigin('left','top');
    	console.log('left:',move.x,' top:',move.y);

    	/* trying to deal with easyLines being in groups... beware of dragons
	    if (p.objects && p.objects.length>0){
		    //handle when easyLine's are being moved in a group!
		    $(p.objects).each(function() {
		    	console.log('\teach');
		    	updateLocation(move.x, move.y, this);
		    });
	    }
	    else {
	    */
	    	console.log('\tsingle');
	    	updateLocation(move.x, move.y, p);
	    //}

	});
	
	function updateLocation(moveX, moveY, p){
		console.log('\tupdateLocation()');
		console.log(p);
	    if (p==line) {
	    	console.log('\t\tline');

	    	//calculate location of line endpoints to update clickable vertexes on screen
	    	var x1 = line.x1,
	    		y1 = line.y1,
	    		x2 = line.x2,
	    		y2 = line.y2;
	    	
	    	if (x1<x2) { 
	    		x2 = x2-x1 + moveX;
	    		x1 = moveX;
	    	}
	    	else { 
	    		x1 = x1-x2 + moveX;
	    		x2 = moveX;
	    	}
	    	
	    	if (y1<y2) {
	    		y2 = y2-y1 + moveY;
	    		y1 = moveY;
	    	}
	    	else {
	    		y1 = y1 - y2 + moveY;
	    		y2 = moveY;
	    	}
	    	
	    	headVertex.set({
	    		left: x1, 
	    		top:  y1
	    	});
	    	tailVertex.set({
	    		left: x2, 
	    		top:  y2
	    	});
	    	
	    	headVertex.setCoords();
	    	tailVertex.setCoords();
	    	//set the actual line the vertexs are attached to... cause.. ??
	    	headVertex.line.set({
		        'x1': x1,
		        'y1': y1
		    });
	    	tailVertex.line.set({
		        'x2': x2,
		        'y2': y2
		    });
	    }
	    
	    if (p==headVertex) {
	    	console.log('\t\thead vertex moving');
	    	headVertex.line.set({
		        'x1': p.left,
		        'y1': p.top
		    });
		    //update location of line so selection box is correct
		    line.setCoords();
	    }
	    if (p==tailVertex) {
	    	console.log('\t\ttail vertex moving');
	    	tailVertex.line.set({
		        'x2': p.left,
		        'y2': p.top
		    });
		    //update location of line so selection box is correct
		    line.setCoords();
	    }
	    
	    if (p==headVertex.line) {
	    	console.log('\t\thead vertex moving....');
	    }
	    if (p==tailVertex.line) {
	    	console.log('\t\ttail vertex moving....');
	    }
	}

}

easyLine([250, 250, 300, 350]);
easyLine([450, 250, 500, 300]);
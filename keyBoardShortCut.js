document.onkeyup=function(e){
    var e = e || window.event; // for IE to cover IEs window object
if(e.ctrlKey && e.which == 90) {
     undo();
     return false;
}
else if(e.ctrlKey && e.which == 89)
{
    redo();
}
else if(e.ctrlKey && e.which == 83)
{
    save();
}
else if(e.ctrlKey && e.which == 79)
{
   console.log("LOAD");
   load(e);
}
else if (e.ctrlKey && e.which == 78)
{
    newFile();
}
else if (e.ctrlKey && e.which == 88)
{
    console.log("CUT");
    canvasDemo.canvas.getActiveObject().clone(function(cloned) 
    {
		_clipboard = cloned;
    });
    canvasDemo.canvas.remove(canvasDemo.canvas.getActiveObject());
}
else if (e.ctrlKey && e.which == 86)
{
    console.log("PASTE");
    // clone again, so you can do multiple copies.
	_clipboard.clone(function(clonedObj) {
		canvasDemo.canvas.discardActiveObject();
		clonedObj.set({
			left: clonedObj.left + 10,
			top: clonedObj.top + 10,
			evented: true,
		});
		if (clonedObj.type === 'activeSelection') {
			// active selection needs a reference to the canvas.
			clonedObj.canvas = canvasDemo.canvas;
			clonedObj.forEachObject(function(obj) {
				canvasDemo.canvas.add(obj);
			});
			// this should solve the unselectability
			clonedObj.setCoords();
		} else {
			canvasDemo.canvas.add(clonedObj);
		}
		_clipboard.top += 10;
		_clipboard.left += 10;
		canvasDemo.canvas.setActiveObject(clonedObj);
		canvasDemo.canvas.requestRenderAll();
});
}
else if (e.ctrlKey && e.which == 67)
{
    console.log("COPY");
    canvasDemo.canvas.getActiveObject().clone(function(cloned) 
    {
		_clipboard = cloned;
    });
    
}
else if (e.which == 46)
{
  deleteObject();
}


}

function getMouseCoordsX(event)
{
  var pointer = canvas.getPointer(event.e);
  var posX = pointer.x;
  return posX;
}
function getMouseCoordsY(event)
{
  var pointer = canvas.getPointer(event.e);
  var posY = pointer.y;
}
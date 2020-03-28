/*Save File Method*/
$("#saveFile").click(function (event) 
{
  var jsonData = canvasDemo.canvas.toJSON(["selectable", "evented"]);
  /* Act on the event */
  // Figure out how to save objects and then
  // Save must have Always ask you where to save files to change name of file

  var data = JSON.stringify(jsonData );
  
  SaveAsFile(data, "UML_EDITOR_SET_FILE.json", "text/plain;charset=utf-8");

});
       
/* Load File Method */
$("#loadFile").on('click', function (e) 
{
  canvasDemo._config.loadFile = true;
  e.preventDefault();
  $("#loadFileInput:hidden").trigger('click');
  var fileInput = document.getElementById('loadFileInput');

  fileInput.addEventListener('change', function (e) 
  {
  var file = fileInput.files[0];

  var reader = new FileReader();
  reader.onload = function (e) 
{
  // Clears all infromation
  canvasDemo.canvas.clear();
  canvasDemo._config.loadFile = true;
  canvasDemo._config.canvasState.splice(1,canvasDemo._config.canvasState.length-1);
  canvasDemo._config.currentStateIndex =0;
  canvasDemo.canvas.loadFromJSON(reader.result);

}
    reader.readAsText(file);
  });
});

/*New File Method*/
$("#newFile").click(function (event) 
{
  // Here we can replace with basic template or leave as it is.
  canvasDemo.canvas.loadFromJSON('{}');
  canvasDemo._config.canvasState.splice(1,canvasDemo._config.canvasState.length-1);
  canvasDemo._config.currentStateIndex =0
  canvasDemo.CanvasGrid();
});
        
/*Delete Object Method*/
$("#deleteObj").on('click', function (e) 
{
  canvasDemo.canvas.getActiveObjects().forEach((obj) =>
   {
    canvasDemo.canvas.remove(obj)
    updateCanvasState();
  });
  canvasDemo.canvas.discardActiveObject().renderAll()
});

// Make Save system work
function SaveAsFile(t, f, m) 
{
	try {
		var b = new Blob([t], {
			type: m
		});
		saveAs(b, f);
	} catch (e) {
		window.open("data:" + m + "," + encodeURIComponent(t), '_blank', '');
	}
}
// Go in and move this code somewhere else 
// Or leave it here?
var updateCanvasState = function() 
{
  if((canvasDemo._config.undoStatus == false && canvasDemo._config.redoStatus == false))
  {
    // load the data 
    var jsonData        = canvasDemo.canvas.toJSON();   
       var canvasAsJson        = JSON.stringify(jsonData);
    // Make sure the lines do not get added to the undo history
    if(jsonData.objects[jsonData.objects.length-1].saved == true)
    {
      // This takes the Lines and save it to the first slot so that it can not be erased.
      canvasDemo._config.canvasState[0] = canvasAsJson;
      return;
    }
    // Does not work with images so far need to fiqure out a way to keep this variable true
    if(canvasDemo._config.loadFile == true )
    {
        canvasDemo._config.canvasState[0] = canvasAsJson;
        return;
    }
    // Used to store history
    if(canvasDemo._config.currentStateIndex < canvasDemo._config.canvasState.length-1)
    {
      var indexToBeInserted                  = canvasDemo._config.currentStateIndex+1;
      canvasDemo._config.canvasState[indexToBeInserted] = canvasAsJson;
      var numberOfElementsToRetain           = indexToBeInserted+1;
      canvasDemo._config.canvasState                    = canvasDemo._config.canvasState.splice(0,numberOfElementsToRetain);
    }
    else
    {
        canvasDemo._config.canvasState.push(canvasAsJson);
    }
    // Check if redo button should be disabled
    canvasDemo._config.currentStateIndex = canvasDemo._config.canvasState.length-1;
    if((canvasDemo._config.currentStateIndex == canvasDemo._config.canvasState.length-1))
    {
        canvasDemo._config.redoButton.disabled= "disabled";
    }
  }
}

var undo = function() 
    {
        if(canvasDemo._config.undoFinishedStatus)
        {
            if(canvasDemo._config.currentStateIndex == 0)
            {
              canvasDemo._config.undoStatus = false;
            }
            else
            {
              if (canvasDemo._config.canvasState.length >= 1) 
              {
                canvasDemo._config.undoFinishedStatus = 0;
              if(canvasDemo._config.currentStateIndex != 0)
              {
                canvasDemo._config.undoStatus = true;
                canvasDemo.canvas.loadFromJSON(canvasDemo._config.canvasState[canvasDemo._config.currentStateIndex-1],function()
                {
                  // Random code no use?
                  //var jsonData = JSON.parse(_config.canvasState[_config.currentStateIndex-1]);
                  canvasDemo.canvas.renderAll();
                  canvasDemo._config.undoStatus = false;
                  canvasDemo._config.currentStateIndex -= 1;
                  canvasDemo._config.undoButton.removeAttribute("disabled");
                    if(canvasDemo._config.currentStateIndex !== canvasDemo._config.canvasState.length-1)
                    {
                      canvasDemo._config.redoButton.removeAttribute('disabled');
                    }
                    canvasDemo._config.undoFinishedStatus = 1;
                });
              }
                
              }
            }
        }
    }
    
    var redo = function() 
    {
      if(canvasDemo._config.redoFinishedStatus)
      {
        if(canvasDemo._config.currentStateIndex == canvasDemo._config.canvasState.length-1 )
        {
          canvasDemo._config.redoButton.disabled= "disabled";
        }
        else
        {
          if (canvasDemo._config.canvasState.length > canvasDemo._config.currentStateIndex)
          {
            canvasDemo._config.redoFinishedStatus = 0;
            canvasDemo._config.redoStatus = true;
            canvasDemo.canvas.loadFromJSON(canvasDemo._config.canvasState[canvasDemo._config.currentStateIndex+1],function()
            {
            canvasDemo.canvas.renderAll();
              canvasDemo._config.redoStatus = false;
              canvasDemo._config.currentStateIndex += 1;

              if(canvasDemo._config.currentStateIndex != 0)
              {
                canvasDemo._config.undoButton.removeAttribute('disabled');
              }
              canvasDemo._config.redoFinishedStatus = 1;

              if(canvasDemo._config.currentStateIndex == canvasDemo._config.canvasState.length-1)
              {
                canvasDemo._config.redoButton.disabled= "disabled";
              }
            });
          }
        }
      }
    }

 
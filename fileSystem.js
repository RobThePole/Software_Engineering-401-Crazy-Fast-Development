
/*Save File Method*/

$("#saveFile").click(function (event) 
{
  save();
});

       
/* Load File Method */
$("#loadFile").on('click', function (e) 
{
 load(e);
});

/*New File Method*/
$("#newFile").click(function (event) 
{
 newFile();
});
        
/*Delete Object Method*/
$("#deleteObj").on('click', function (e) 
{

  deleteObject();
});
$("#exportImage").on('click', function (e) 
{

  exportCanvas();
});
var load = function(e)
{
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
}
// Current task find a way to mult delete from a loaded file without having to move objects around
// Need to change so you do not have to click on anything else to make sure delte works
var deleteObject = function()
{

    var selection = canvasDemo.canvas.getActiveObject();
    if (selection.type === 'activeSelection') {
        selection.forEachObject(function(element) {
          
            console.log(element);
            canvasDemo.canvas.remove(element);
            
        });
    }
    else
    {
        canvasDemo.canvas.remove(selection);

        
    }
    canvasDemo.canvas.discardActiveObject();
    canvasDemo.canvas.requestRenderAll();


}
var newFile = function()
{
 // Here we can replace with basic template or leave as it is.
 canvasDemo.canvas.loadFromJSON('{}');
 canvasDemo._config.canvasState.splice(1,canvasDemo._config.canvasState.length-1);
 canvasDemo._config.currentStateIndex =0
}
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

var save = function()
{
  var jsonData = canvasDemo.canvas.toJSON(['_controlsVisibility']);
  /* Act on the event */
  // Figure out how to save objects and then
  // Save must have Always ask you where to save files to change name of file

  var data = JSON.stringify(jsonData );
  
  SaveAsFile(data, "UML_EDITOR_SET_FILE.json", "text/plain;charset=utf-8");

   
  

};
var exportCanvas = function()
{
  canvasDemo.canvas.toCanvasElement().toBlob(function(blob)
  {
    saveAs(blob,"test.png");
  });
}
var updateCanvasState = function() 
{
  if(canvasDemo._config.undoStatus == false && canvasDemo._config.redoStatus == false)
  {
    // load the data 
    var jsonData        = canvasDemo.canvas.toJSON(['_controlsVisibility']);   
    var canvasAsJson        = JSON.stringify(jsonData);
    
    // When you open the program or load a file the first index of the array saves the default version of the file.
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
      canvasDemo._config.canvasState                    = canvasDemo._config.canvasState.splice(1,numberOfElementsToRetain);
    }
    else
    {
        canvasDemo._config.canvasState.push(canvasAsJson);
    }
    // Check if redo button should be disabled
    canvasDemo._config.currentStateIndex = canvasDemo._config.canvasState.length-1;
    if(canvasDemo._config.currentStateIndex == canvasDemo._config.canvasState.length-1)
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
              if(canvasDemo._config.currentStateIndex != -1)
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
                    if((canvasDemo._config.currentStateIndex !== canvasDemo._config.canvasState.length-1) )
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
        if((canvasDemo._config.currentStateIndex == canvasDemo._config.canvasState.length-1)  )
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
    
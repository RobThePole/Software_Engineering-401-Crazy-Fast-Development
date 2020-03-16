
(function() {

 

  function add() {
    var red = new fabric.Rect({
      top: 100, left: 0, width: 80, height: 50, fill: 'red' });
    var blue = new fabric.Rect({
      top: 0, left: 100, width: 50, height: 70, fill: 'blue' });
    var green = new fabric.Rect({
      top: 100, left: 100, width: 60, height: 60, fill: 'green' });
    canvas.add(red, blue, green);
  }

  

  var $ = function(id){return document.getElementById(id)};
  var canvas = this.__canvas = new fabric.Canvas('c');
  var red = new fabric.Rect({
    top: 100, left: 0, width: 80, height: 50, fill: 'red' });
  var blue = new fabric.Rect({
    top: 0, left: 100, width: 50, height: 70, fill: 'blue' });
  var green = new fabric.Rect({
    top: 100, left: 100, width: 60, height: 60, fill: 'green' });
  fabric.Object.prototype.transparentCorners = false;

  canvas.add(red, blue, green)
  var group = $('group'),
      ungroup = $('ungroup'),
      multiselect = $('multiselect'),
      addmore = $('addmore'),
      discard = $('discard'),
      save = $('save'),
      newProject = $('newProject');

      addmore.onclick = add;

      multiselect.onclick = function() {
        canvas.discardActiveObject();
        var sel = new fabric.ActiveSelection(canvas.getObjects(), {
          canvas: canvas,
        });
        canvas.setActiveObject(sel);
        canvas.requestRenderAll();
      }

      group.onclick = function() {
        if (!canvas.getActiveObject()) {
          return;
        }
        if (canvas.getActiveObject().type !== 'activeSelection') {
          return;
        }
        canvas.getActiveObject().toGroup();
        canvas.requestRenderAll();
      }

      ungroup.onclick = function() {
        if (!canvas.getActiveObject()) {
          return;
        }
        if (canvas.getActiveObject().type !== 'group') {
          return;
        }
        canvas.getActiveObject().toActiveSelection();
        canvas.requestRenderAll();
      }

      discard.onclick = function() 
      {
        canvas.discardActiveObject();
        canvas.requestRenderAll();
      }
      
      // Change this to
      save.onclick = function()
      {
        var data = JSON.stringify(canvas);
        console.log(data);
        //localStorage['Test_data'] = data;
        SaveAsFile(data,"UML_EDITOR_FK_THIS_SAVE.json","text/plain;charset=utf-8");

       
      

      }
      // Setup up default values for the data.
      newProject.onclick = function()
      {
        // Now just need to add settings and default file name here and new project should be all set
        // Current default when no objects are on the canvas
        canvas.loadFromJSON('{}');
        console.log("New project " + JSON.stringify(canvas))

        

      }

 
})();


  // File load code is here
  // If you load this test.js by accident does same thing not sure why tested with other files does not happen besides teh JSON file which should work
  // Test to see if this code will work in differnet file later just kind of tried
  $(document).ready(function()
  {
      $("#fileInputControl").on("change",fileInputControlChangeEventHandler);
  });
    function fileInputControlChangeEventHandler(event)
    {
        let fileInputControl = event.target;
        let files = fileInputControl.files;
    
        let firstFile = files[0];
    
        let fileReader = new FileReader();
    
        fileReader.onload = function(event)
        {
            // Used just to get access to canvas might need to clean this up
            // Spent to much time CODEING get back to it later
            var canvas = this.__canvas = new fabric.Canvas('c');

            let fileContents = event.target.result;
            canvas.loadFromJSON(fileContents);
            console.log(JSON.stringify(JSON.stringify(fileContents)));
                    
        }
    
    
        fileReader.readAsText(firstFile);
    }


    // Save Function is here need to change so saving can write over file
    function SaveAsFile(t,f,m) {
      try {
          var b = new Blob([t],{type:m});
          saveAs(b, f);
      } catch (e) {
          window.open("data:"+m+"," + encodeURIComponent(t), '_blank','');
      }
  }
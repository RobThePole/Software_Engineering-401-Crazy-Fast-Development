
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
  // Default size for now needs to be set here or freaks out
  canvas.width = 1920;
  canvas.height = 1080;
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
      // File Reader Code is fixed
      window.onload = function() {
        var fileInput = document.getElementById('fileInputControl');
        
    
        fileInput.addEventListener('change', function(e) {
          var file = fileInput.files[0];
    
            var reader = new FileReader();
    
            reader.onload = function(e) {
              canvas.loadFromJSON(reader.result);
            }
    
            reader.readAsText(file);	
           
        });
    }
      

 
})();
    // Save Function is here need to change so saving can write over file
    function SaveAsFile(t,f,m) {
      try {
          var b = new Blob([t],{type:m});
          saveAs(b, f);
      } catch (e) {
          window.open("data:"+m+"," + encodeURIComponent(t), '_blank','');
      }
  }
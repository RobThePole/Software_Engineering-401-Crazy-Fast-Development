/**
 * Description
 * @method ui
 * @return interface
 */
function uiCreate(theCanvas, theController){
	var controller=theController;
	var btn;
	var i;
	var bb, bevt;
	var canvas = theCanvas;
	var selectType = 'none';
	var startLabel;
	
	//$( ":tabbable" ).css( "border-color", "red" );
	//var textFocus = document.getElementById('textboxLabelText').focus.bind(document.getElementById('textboxLabelText') );
	//$('#textboxLabelText').focus( function(){console.log("text box has focus")});
	//$('#graphCanvas').focus( function(){console.log("canvas has focus")});
	//$('#textboxLabelText').focusout( function(){console.log("text box has lost focus")});

	var buttons = {
		
		save : {
			name: "buttonSave",
			button: null,
			events : [
				{
					event : "click",
					/**
					 * Description
					 * @method handler
					 * @param {} evt
					 * @return 
					 */
					handler : function(evt){
						var blob = new Blob( 
								[controller.getGraphAsJSON()], 
								{type: 'text/plain'}
						);
						
						// special case for IE
						if(window.navigator.msSaveOrOpenBlob) {
								window.navigator.msSaveOrOpenBlob(blob, "data.graph");
								return;
						}
						
						var url = URL.createObjectURL(blob);

						// crewate an <a> element whose href is a data url
						var a = document.createElement('a');
						a.href = url;
						a.download = 'data.graph';
						a.textContent = '';
						document.body.appendChild(a);	
						a.click();
						
						a.parentNode.removeChild(a);
						
					} 
				}
			],
		},
		
		load : {
			name: "buttonLoad",
			button: null,
			events : [
				{
					event : "change",
					/**
					 * Description
					 * @method handler
					 * @param {} evt
					 * @return 
					 */
					handler : function(event){
						var file = event.target.files[0]; // FileList object
						//console.log('Read file ' + file);
						var reader = new FileReader();

						// Event handler for successful upload
						reader.onload = function(event) {
								controller.setGraphAsJSON(event.target.result);
						};
						
						// start reading file
						// onload handler will execute when done
						reader.readAsText(file);
 					} 
				}
			],
		},	
	};
			

	

	var interface = {
		/**
		 * Description
		 * @method setController
		 * @param {} theController
		 * @return 
		 */
		setController : function( theController ){
			controller = theController;
			//console.log("Set the controller")
		},
		
		/**
		 * Description
		 * @method setState
		 * @param {} theState
		 * @return 
		 */
		setState : function( state ){
			if ( state == 'build'){
				$('#buttonBuild').prop('checked', true);
				$('#buttonBuild').button('refresh');
				
			}
			else if ( state == 'select'){
				$('#buttonSelect').prop('checked', true);
				$('#buttonSelect').button('refresh');
			}
			else if ( state == 'label'){
				$('#buttonLabel').prop('checked', true);
				$('#buttonLabel').button('refresh');
			}
			else if ( state == 'highlight'){
				$('#buttonHighlight').prop('checked', true);
				$('#buttonHighlight').button('refresh');
			}
			
		},
		
		/**
		 * Description
		 * @method showOptions
		 * @return 
		 */
		showHighlightSubMenu : function( hcolor ){
			//$('#radioHighlight .color-button').removeClass('radio-active');
			//$('#radioHighlight input[value=' + hcolor.getName() + '] + label').addClass('radio-active');	
			$('#radioHighlight input[value=' + hcolor.getName() + ']').prop('checked', true);	
			$('#radioHighlight input[value=' + hcolor.getName() + ']').button('refresh');	
			//$('radioColor'+color).
			
			$('#objectOptions').hide();
			$('#radioColor').hide();
			$('#radioHighlight').show();
			$('#labelSubMenu').hide();
			
			$('#objectOptionSubMenu').fadeIn('fast');
			
			$('#labelPromptSubMenu').fadeOut('fast');
		}, 
		
		showObjectSubMenu : function( color, hcolor, label ){
			//$('#radioColor .color-button').removeClass('radio-active');
			$('#radioColor input[value=' + color.getName() + ']').prop('checked', true);	
			$('#radioColor input[value=' + color.getName() + ']').button('refresh');	
			//$('#radioHighlight .color-button').removeClass('radio-active');
			$('#radioHighlight input[value=' + hcolor.getName() + ']').prop('checked', true);	
			$('#radioHighlight input[value=' + hcolor.getName() + ']').button('refresh');	
			//$('radioColor'+color).
			$('#textboxLabelText').val(label);
			startLabel = label;
			
			$('#objectOptions').show();
			$('#radioColor').show();
			$('#radioHighlight').show();
			$('#labelSubMenu').hide();
			$('#objectOptionSubMenu').fadeIn('fast');
			
			$('#buttonLabelCancel').hide();
			$('#labelPrompt').show();
			$('#labelPromptSubMenu').fadeIn('fast');
		},
		
		showLabelSubMenu : function(){
			$('#objectOptions').hide();
			$('#radioColor').hide();
			$('#radioHighlight').hide();
			$('#labelSubMenu').show();
			$('#objectOptionSubMenu').fadeIn('fast');
			
			$('#labelPromptSubMenu').fadeOut('fast');
			
		},
		
		showLabelPrompt : function(label){
			$('#textboxLabelText').val(label);
			startLabel = label;
			
			$('#buttonLabelCancel').show();
			
			$('#labelPrompt').show();
			$('#labelPromptSubMenu').fadeIn('fast');
			$('#textboxLabelText').focus();
			$('#textboxLabelText')[0].setSelectionRange(0,$('#textboxLabelText').val().length);
		},
		
		hideLabelPrompt : function(label){
			$('#labelPromptSubMenu').fadeOut('fast');
		},
		
		hideOptionSubMenus : function(){
			$('#objectOptionSubMenu').fadeOut('fast');
			$('#labelPromptSubMenu').fadeOut('fast');
		},
		
		showBackgroundSubMenu : function(){
			$('#radioBackgroundShow').prop('checked', true);	
			$('#radioBackgroundShow').button('refresh');	
			$('#showBackgroundOption').fadeIn('fast');
		},
		
		hideBackgroundSubMenu : function(){
			$('#showBackgroundOption').fadeOut('fast');
		},
		
		setCpOn: function(){
			$('#radioCpOn').prop('checked', true);	
			$('#radioCpOn').button('refresh');	
			
		}
	};

		
	for (btn in buttons){
		
		bb = buttons[btn];
		bb.button = $('#'+bb.name);
		console.log( bb.name);
		bb.button.button();
		
		for (i=0; i<bb.events.length; i++){
			//bb.button.bind(bb.events[i].event, bb.name, bb.events[i].handler);
			//console.log(bb.name + ' ' + bb.events[i].event);
			bb.button[bb.events[i].event](bb.events[i].handler);
		}
	};
	
	// register ui event handlers on the canvas
	
	canvas.addEventListener('mousedown', 
		function (event) {
			controller.mouseDown(event);
		}, 
		false
	);
	
	canvas.addEventListener('mousemove', 
		function (event) {
			controller.mouseMove(event);
		}, 
		false
	);
	
	canvas.addEventListener('mouseup', 
		function (event) {
			controller.mouseUp(event);
		}, 
		false
	);
    
   canvas.addEventListener('mouseenter', 
		function (event) {
			controller.mouseEnter(event);
		}, 
		false
	);
	
    canvas.addEventListener('mouseleave', 
		function (event) {
			controller.mouseLeave(event);
		}, 
		false
	);
	
    canvas.addEventListener('keydown', 
		function (event) {
			controller.keyDown(event);
		}, 
		false
	);
	
	return interface;
}
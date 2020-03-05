/*
* As of now the script is used for the 'Polymorphic' buttons, to have different 
* pictorials we are using a list of string names (picture names) for each individual
* button state, and using a loop to pass it to our 'Pictorial'. 
*/

 $(document).ready(function () {
        <!--On page load-->
        $("#myModal").modal();
        <!--Get Started Button-->
        $("#btn_getStarted").click(function () {
            $("#myModal").modal();
        })

        /*Btn Class*/
        var classBtnState = true;
        $("#btnClass").click(function () {
            $("#classaccordion").removeClass("d-none");
            $("#classaccordion").addClass("d-block");
            $("#btnClass").addClass("active");
            classBtnState = false;
            classActiveHideRestButtons();

            /*Dynamic Slide Show*/
            $('.carousel-inner').empty();
            var str = ['classPlaceHolder.png','classPlaceHolder.png','classPlaceHolder.png']    /*Mention all images in here*/
            appendImageSlideShow(str);

        })


        /*Btn Object*/
        var objectBtnState = true;
        $("#btnObject").click(function () {
            <!--            if (objectBtnState) {-->
                $("#Objectaccordion").removeClass("d-none");
                $("#Objectaccordion").addClass("d-block");
                $("#btnObject").addClass("active");
                objectBtnState = false;
                objectActiveHideRestButtons();
                /*Dynamic Slide Show*/
                $('.carousel-inner').empty();
                var str = ['objectPlaceHolder.png','objectPlaceHolder.png','objectPlaceHolder.png']    /*Mention all images in here*/
                appendImageSlideShow(str);
            })

        /*Btn Use Case*/
        var useCaseBtnState = true;
        $("#btnUseCase").click(function () {
            <!--            if (useCaseBtnState) {-->
                $("#usecaseaccordion").removeClass("d-none");
                $("#usecaseaccordion").addClass("d-block");
                $("#btnUseCase").addClass("active");
                useCaseBtnState = false;
                useCaseActiveHideRestButtons();
                /*Dynamic Slide Show*/
                $('.carousel-inner').empty();
                var str = ['usePlaceHolder.png','usePlaceHolder.png','usePlaceHolder.png']    /*Mention all images in here*/
                appendImageSlideShow(str);
            })

        /*Btn Activity*/
        var activityBtnState = true;
        $("#btnActivity").click(function () {
            <!--            if (activityBtnState) {-->
                $("#activityaccordion").removeClass("d-none");
                $("#activityaccordion").addClass("d-block");
                $("#btnActivity").addClass("active");
                activityBtnState = false;
                activityActiveHideRestButtons();
                /*Dynamic Slide Show*/
                $('.carousel-inner').empty();
                var str = ['activityPlaceHolder.png', 'activityPlaceHolder.png', 'activityPlaceHolder.png']    /*Mention all images in here*/
                appendImageSlideShow(str);

            })

        /*Btn Sequence*/
        var sequenceBtnState = true;
        $("#btnSequence").click(function () {
            <!--            if (sequenceBtnState) {-->
                $("#sequenceaccordion").removeClass("d-none");
                $("#sequenceaccordion").addClass("d-block");
                $("#btnSequence").addClass("active");
                sequenceBtnState = false;
                sequenceActiveHideRestButtons();

                /*Dynamic Slide Show*/
                $('.carousel-indicators').empty();
                $('.carousel-inner').empty();
                var str = ['sequencePlaceHolder.png','sequencePlaceHolder.png','sequencePlaceHolder.png']    /*Mention all images in here*/
                appendImageSlideShow(str);
            })
    });
	<!-- This is how we accomplis the 'Polymorphic' menu --> 
    <!--Hide Rest buttons-->
    function classActiveHideRestButtons(){
        $("#Objectaccordion").addClass("d-none");
        $("#Objectaccordion").removeClass("d-block");
        $("#usecaseaccordion").addClass("d-none");
        $("#usecaseaccordion").removeClass("d-block");
        $("#activityaccordion").addClass("d-none");
        $("#activityaccordion").removeClass("d-block");
        $("#sequenceaccordion").addClass("d-none");
        $("#sequenceaccordion").removeClass("d-block");
        $("#btnObject").removeClass("active");
        $("#btnUseCase").removeClass("active");
        $("#btnActivity").removeClass("active");
        $("#btnSequence").removeClass("active");
        objectBtnState = true;
        usecaseBtnState = true;
        activityBtnState = true;
        sequenceBtnState = true;
    }
    <!--Hide Rest buttons-->
    function objectActiveHideRestButtons(){
        $("#classaccordion").addClass("d-none");
        $("#classaccordion").removeClass("d-block");
        $("#usecaseaccordion").addClass("d-none");
        $("#usecaseaccordion").removeClass("d-block");
        $("#activityaccordion").addClass("d-none");
        $("#activityaccordion").removeClass("d-block");
        $("#sequenceaccordion").addClass("d-none");
        $("#sequenceaccordion").removeClass("d-block");
        $("#btnClass").removeClass("active");
        $("#btnUseCase").removeClass("active");
        $("#btnActivity").removeClass("active");
        $("#btnSequence").removeClass("active");
        classBtnState = true;
        usecaseBtnState = true;
        activityBtnState = true;
        sequenceBtnState = true;
    }
    <!--Hide Rest buttons-->
    function useCaseActiveHideRestButtons(){
        $("#Objectaccordion").addClass("d-none");
        $("#Objectaccordion").removeClass("d-block");
        $("#classaccordion").addClass("d-none");
        $("#classaccordion").removeClass("d-block");
        $("#activityaccordion").addClass("d-none");
        $("#activityaccordion").removeClass("d-block");
        $("#sequenceaccordion").addClass("d-none");
        $("#sequenceaccordion").removeClass("d-block");
        $("#btnClass").removeClass("active");
        $("#btnObject").removeClass("active");
        $("#btnActivity").removeClass("active");
        $("#btnSequence").removeClass("active");
    }
    <!--Hide Rest buttons-->
    function activityActiveHideRestButtons(){
        $("#Objectaccordion").addClass("d-none");
        $("#Objectaccordion").removeClass("d-block");
        $("#usecaseaccordion").addClass("d-none");
        $("#usecaseaccordion").removeClass("d-block");
        $("#sequenceaccordion").addClass("d-none");
        $("#sequenceaccordion").removeClass("d-block");
        $("#classaccordion").addClass("d-none");
        $("#classaccordion").removeClass("d-block");
        $("#btnClass").removeClass("active");
        $("#btnUseCase").removeClass("active");
        $("#btnSequence").removeClass("active");
        $("#btnObject").removeClass("active");
    }
    <!--Hide Rest buttons-->
    function sequenceActiveHideRestButtons(){
        $("#Objectaccordion").addClass("d-none");
        $("#Objectaccordion").removeClass("d-block");
        $("#usecaseaccordion").addClass("d-none");
        $("#usecaseaccordion").removeClass("d-block");
        $("#activityaccordion").addClass("d-none");
        $("#activityaccordion").removeClass("d-block");
        $("#classaccordion").addClass("d-none");
        $("#classaccordion").removeClass("d-block");
        $("#btnClass").removeClass("active");
        $("#btnUseCase").removeClass("active");
        $("#btnActivity").removeClass("active");
        $("#btnObject").removeClass("active");
    }


    /*Image append slide show function*/
	/* Here we can edit the width and height of the specific image array */ 
    function appendImageSlideShow(str){
        var body = '', bodyIndicators = '' ;
        for (var i = 0; i < str.length; i++) {
            if (i == 0) {
                bodyIndicators += "<li data-target='#demo' data-slide-to='"+i+"' class='active'></li>";
                body += "<div class='carousel-item active'><img src='images/"+str[i]+"' "+
                "alt='Los Angeles' width='650' height='400' style='margin-left: 20%;'></div>";
            }else{
                bodyIndicators += "<li data-target='#demo' data-slide-to='"+i+"' class=''></li>";
                body += "<div class='carousel-item'><img src='images/"+str[i]+"' "+
                "alt='Los Angeles' width='650' height='400' style='margin-left: 20%;'></div>";
            }
        }
        $('.carousel-indicators').html(bodyIndicators);/*Add body in slide Show*/
        $('.carousel-inner').html(body);/*Add body in slide Show*/
    }
	
/* Canvas Snap to Grid code */ 
var canvas = new fabric.Canvas('c', { selection: false });
var grid = 50;

// create grid
var canvasWidth = 1575;
var canvasHeight = 900; 
for (var i = 0; i < (canvasWidth / grid); i++) {
  canvas.add(new fabric.Line([ i * grid, 0, i * grid, canvasHeight], { stroke: '#ccc', selectable: false }));
  canvas.add(new fabric.Line([ 0, i * grid, canvasWidth, i * grid], { stroke: '#ccc', selectable: false }))
}

// Add Objects 
// Add Rectangle 
function addRectangle(){
canvas.add(new fabric.Rect({ 
  left: 100, 
  top: 100, 
  width: 50, 
  height: 50, 
  fill: '#faa', 
  originX: 'left', 
  originY: 'top',
  centeredRotation: true,
  shadow: 'rgba(0,0,0,0.4) 5px 5px 7px'
}));
}
// Add Circle Option 
function addCircle(){
canvas.add(new fabric.Circle({ 
  left: 300, 
  top: 300, 
  radius: 50, 
  fill: '#9f9', 
  originX: 'left', 
  originY: 'top',
  centeredRotation: true,
  shadow: 'rgba(0,0,0,0.4) 5px 5px 7px'
}));
}
// Add TextBox 
function addTextBox(){
var t1 = new fabric.Textbox('MyText', {
    width: 150,
    top: 5,
    left: 5,
    fontSize: 16,
    textAlign: 'center',
    fixedWidth: 150
});
// This is to make the text shrink depending on the size of the text and the text box. 
canvas.on('text:changed', function(opt) {
  var t1 = opt.target;
  if (t1.width > t1.fixedWidth) {
    t1.fontSize *= t1.fixedWidth / (t1.width + 1);
    t1.width = t1.fixedWidth;
  }
});
canvas.add(t1);	
}


// snap to grid
canvas.on('object:moving', function(options) { 
  options.target.set({
    left: Math.round(options.target.left / grid) * grid,
    top: Math.round(options.target.top / grid) * grid
  });
  
});

/* Canvas Out of Bounds Code */ 
canvas.on('object:moving', function (e) {
        var obj = e.target;
         // if object is too big ignore
        if(obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width){
            return;
        }        
        obj.setCoords();        
        // top-left  corner
        if(obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0){
            obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top);
            obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left);
        }
        // bot-right corner
        if(obj.getBoundingRect().top+obj.getBoundingRect().height  > obj.canvas.height || obj.getBoundingRect().left+obj.getBoundingRect().width  > obj.canvas.width){
            obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
            obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
        }
});

    var left1 = 0;
    var top1 = 0 ;
    var scale1x = 0 ;    
    var scale1y = 0 ;    
    var width1 = 0 ;    
    var height1 = 0 ;
  canvas.on('object:scaling', function (e){
    var obj = e.target;
    obj.setCoords();
    var brNew = obj.getBoundingRect();
    
    if (((brNew.width+brNew.left)>=obj.canvas.width) || ((brNew.height+brNew.top)>=obj.canvas.height) || ((brNew.left<0) || (brNew.top<0))) {
    obj.left = left1;
    obj.top=top1;
    obj.scaleX=scale1x;
    obj.scaleY=scale1y;
    obj.width=width1;
    obj.height=height1;
  }
    else{    
      left1 =obj.left;
      top1 =obj.top;
      scale1x = obj.scaleX;
      scale1y=obj.scaleY;
      width1=obj.width;
      height1=obj.height;
    }
 });
 /* Code to prevent shapes from touching */ 
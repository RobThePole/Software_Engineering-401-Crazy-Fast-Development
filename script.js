/*
* As of now the script is used for the 'Polymorphic' buttons, to have different 
* pictorials we are using a list of string names (picture names) for each individual
* button state, and using a loop to pass it to our 'Pictorial'. 
*/

 $(document).ready(function () {
        //<!--On page load-->
        $("#myModal").modal();
        //<!--Get Started Button-->
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
	//<!-- This is how we accomplis the 'Polymorphic' menu --> 
    //<!--Hide Rest buttons-->
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
    //<!--Hide Rest buttons-->
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
    //<!--Hide Rest buttons-->
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
    //<!--Hide Rest buttons-->
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
    //<!--Hide Rest buttons-->
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
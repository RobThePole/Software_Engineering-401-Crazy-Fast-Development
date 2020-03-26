    // <!-- This is how we accomplis the 'Polymorphic' menu --> 
    // <!--Hide Rest buttons-->
    var classActiveHideRestButtons = function() 
    {
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

    // <!--Hide Rest buttons-->
    var objectActiveHideRestButtons = function() {
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
    
// <!--Hide Rest buttons-->
    var useCaseActiveHideRestButtons = function() {
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
// <!--Hide Rest buttons-->
    var activityActiveHideRestButtons = function() {
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
// <!--Hide Rest buttons-->
    var sequenceActiveHideRestButtons = function() {
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
    function appendImageSlideShow(str) {
      var body = '',
        bodyIndicators = '';
      for (var i = 0; i < str.length; i++) {
        if (i == 0) {
          bodyIndicators += "<li data-target='#demo' data-slide-to='" + i + "' class='active'></li>";
          body += "<div class='carousel-item active'><img src='images/" + str[i] + "' " +
            "alt='Los Angeles' width='600' height='350' class ='text-center' style='margin-left: 80px;'></div>";
        } else {
          bodyIndicators += "<li data-target='#demo' data-slide-to='" + i + "' class=''></li>";
          body += "<div class='carousel-item'><img src='images/" + str[i] + "' " +
            "alt='Los Angeles' width='600' height='350' class ='text-center' style='margin-left: 80px;'></div>";
        }
      }
      $('.carousel-indicators').html(bodyIndicators); /*Add body in slide Show*/
      $('.carousel-inner').html(body); /*Add body in slide Show*/
    }

    // Not sure what this code does please add Comments on what it does
    $("#myModal").modal();
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
      var str = ['ClassPH.png', 'ClassPH.png', 'ClassPH.png'] /*Mention all images in here*/
      appendImageSlideShow(str);

    })


    /*Btn Object*/
    var objectBtnState = true;
    $("#btnObject").click(function () {
      $("#Objectaccordion").removeClass("d-none");
      $("#Objectaccordion").addClass("d-block");
      $("#btnObject").addClass("active");
      objectBtnState = false;
      objectActiveHideRestButtons();
      /*Dynamic Slide Show*/
      $('.carousel-inner').empty();
      var str = ['ObjectPH.png', 'ObjectPH.png', 'ObjectPH.png'] /*Mention all images in here*/
      appendImageSlideShow(str);
    })

    /*Btn Use Case*/
    var useCaseBtnState = true;
    $("#btnUseCase").click(function () {

      $("#usecaseaccordion").removeClass("d-none");
      $("#usecaseaccordion").addClass("d-block");
      $("#btnUseCase").addClass("active");
      useCaseBtnState = false;
      useCaseActiveHideRestButtons();
      /*Dynamic Slide Show*/
      $('.carousel-inner').empty();
      var str = ['UsePH.png', 'UsePH.png', 'UsePH.png'] /*Mention all images in here*/
      appendImageSlideShow(str);
    })

    /*Btn Activity*/
    var activityBtnState = true;
    $("#btnActivity").click(function () {
      $("#activityaccordion").removeClass("d-none");
      $("#activityaccordion").addClass("d-block");
      $("#btnActivity").addClass("active");
      activityBtnState = false;
      activityActiveHideRestButtons();
      /*Dynamic Slide Show*/
      $('.carousel-inner').empty();
      var str = ['ActivityPH.png', 'ActivityPH.png', 'ActivityPH.png'] /*Mention all images in here*/
      appendImageSlideShow(str);

    })

    /*Btn State Machine*/
    var sequenceBtnState = true;
    $("#btnSequence").click(function () {
      $("#sequenceaccordion").removeClass("d-none");
      $("#sequenceaccordion").addClass("d-block");
      $("#btnSequence").addClass("active");
      sequenceBtnState = false;
      sequenceActiveHideRestButtons();

      /*Dynamic Slide Show*/
      $('.carousel-indicators').empty();
      $('.carousel-inner').empty();
      var str = ['StatePH.png', 'StatePH.png', 'StatePH.png'] /*Mention all images in here*/
      appendImageSlideShow(str);
    })

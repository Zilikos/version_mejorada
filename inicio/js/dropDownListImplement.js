
$(document).ready(function(){
    if($("form > div > select").length > 0){
        var selector = $("form > div > select");

        for(var i=0;i<selector.length;i++){
            ($(selector[i]).parent().attr("id")==="language-select") ? $(selector[i]).parent().append('<div class="selectValue"><span>'+$(selector[i]).children("option:selected").text()+'</span><span class="flecha"></span></div>').css("position", "relative") : $(selector[i]).parent().append('<div class="selectValue"><span class="centerIcon">'+$(selector[i]).children("option:selected").text()+'</span><span class="rightIcon"><span></span></span></div>').css("position", "relative");
            $(selector[i]).siblings("div.selectValue").css("left", $(selector[i]).offset().left - $(selector[i]).parent().offset().left).css("top", $(selector[i]).offset().top - $(selector[i]).parent().offset().top);
        }

        $("form > div > select")
        .off("change")
        .on("change", function(e){
            e.stopPropagation();
            var $target = $(e.target);
            ($(selector[i]).parent().attr("id")==="language-select") ? $target.siblings("div.selectValue").empty().html('<span>'+ $target.children("option:selected").text()+'</span><span class="flecha"></span>' ) : $target.siblings("div.selectValue").children("span.centerIcon").empty().html($target.children("option:selected").text());
        });
    }
    
    if($("#ContactForm_subject").length > 0)
    {
        var $target = $("#ContactForm_subject");
        $target.parent().append('<div class="selectValue"><span class="centerIcon">'+$("#ContactForm_subject").children("option:selected").text()+'</span><span class="rightIcon"><span></span></span></div>').css("position", "relative");
        $target.siblings("div.selectValue").css("left", $("#ContactForm_subject").offset().left - $("#ContactForm_subject").parent().offset().left).css("top", $("#ContactForm_subject").offset().top - $("#ContactForm_subject").parent().offset().top);
        $target
        .off('change')
        .on("change", function(event){
            event.stopPropagation();
            var $targetEvent = $(event.target);
            $targetEvent.siblings("div.selectValue").children("span.centerIcon").empty().html($targetEvent.children("option:selected").text());
        })      
    }
    
    if($("#Paso1Form_selEngPrev").length > 0)
    {
        $("#CampusModals")
        .off("change", "#Paso1Form_selEngPrev")
        .on("change", "#Paso1Form_selEngPrev", function(e) {
            e.stopPropagation();
            var $target = $(e.target);
            $target.siblings("div.selectValue").children("span.centerIcon").empty().html($target.children("option:selected").text());
        });
    }
    
    if($("#Paso1Form_dedicacion").length > 0)
    {
        $("#CampusModals")
        .off("change", "#Paso1Form_dedicacion")
        .on("change", "#Paso1Form_dedicacion", function(e) {
            e.stopPropagation();
            var $target = $(e.target);
            $target.siblings("div.selectValue").children("span.centerIcon").empty().html($target.children("option:selected").text());
        });
    }

    if($("div.divRightGeneral.left").length > 0)
    {
        $("div.divRightGeneral.left")
        .off("click", ".sepia")
        .on("click", ".sepia", function(event){
            event.preventDefault();
            event.stopPropagation();
            popUpPasateaPremium($("#urlPopup").val());
        });
    }
    if($("div#divRightContent").length > 0)
    {
        $("div#divRightContent")
        .off("click", "#noAccesCompose")
        .on("click", "#noAccesCompose", function(event){
            event.preventDefault();
            event.stopPropagation();
            popUpPasateaPremium($("#urlPopup").val());
        });
    }
    // Card errors Tooltip
    if($("#dIdErrorSummary").length > 0)
    {
        $("#dIdErrorSummary")
            .off("click", "#cardPosIssues")
            .on("click", "#cardPosIssues", function(event){
                event.preventDefault();
                event.stopPropagation();
                popUpCreditCard($("#urlPopup").val());
            });
    }
    // Card errors Tooltip
    if($(".containerPaso3 .errorMessage").length > 0)
    {
        $('#paypalIssues').click(function(){
            popUpCreditCard($("#urlPopupPaypal").val());
        });
    }
    if($("div.subContainerLine4 > a").length > 0)
    {
        $("div.subContainerLine4 > a").hover(
            function(){
                $("div.containerIndexImagesLine4 > div").addClass("jquery_hover");
            },
            function(){
                $("div.containerIndexImagesLine4 > div").removeClass("jquery_hover");
            }
        );
    }

});

function popUpChangeLevel(controler){
    var level = $("#level").children("option:selected").text();
    $.ajax({
        cache: true,
        type: "POST",
        url: controler,
        data: { "level" : level, "YII_CSRF_TOKEN" : $("#level").parent("div").parent("form").children('div').children('input[name="YII_CSRF_TOKEN"]').val()},
        async: false,
        success: function(response){
            var $dialog = $('<div id="sharerdialog">'+response+'</div>');
            $dialog.dialog({
                closeOnEscape: true,
                autoOpen: false,
                title: false,
                position: "center",
                width: 670,
                /*height: auto,*/
                resizable: false,
                modal: true,
                draggable: false,
                open: function(event, ui) {
                    var aux = $("a.ui-dialog-titlebar-close").html();
                    $("#ui-dialog-title-sharerdialog").empty().remove();
                    $("a.ui-dialog-titlebar-close").empty();
                    $("a.ui-dialog-titlebar-close").html(aux);
                    $("div.ui-dialog").attr("id","CampusModals");
                    $("#sharerdialog").off('click', 'div.bodyPopUpCambiodeLevel > a > .button')
                    .on("click", "div.bodyPopUpCambiodeLevel > a > .button", function(event){
                        event.preventDefault();
                        event.stopPropagation();
                        $dialog.dialog('close');
                    })
                },
                close: function(event, ui){
                    $("#level").parent("div").parent("form").submit();
                    $('#sharerdialog').empty().remove();
                    $("#sharerdialog").dialog('destroy');
                }
                
            });
            $dialog.dialog('open');
        }
    });
}
function popUpPasateaPremium(url){
    $.ajax({
        cache: true,
        type: "GET",
        url: url,
        async: false,
        success: function(response){
            var $dialog = $('<div id="sharerdialog">'+response+'</div>');
            $dialog.dialog({
                closeOnEscape: true,
                autoOpen: false,
                title: false,
                position: "center",
                width: 696,
                /*height: auto,*/
                resizable: false,
                modal: true,
                draggable: false,
                open: function(event, ui) {
                    var aux = $("a.ui-dialog-titlebar-close").html();
                    $("#ui-dialog-title-sharerdialog").remove();
                    $("a.ui-dialog-titlebar-close").empty();
                    $("a.ui-dialog-titlebar-close").html(aux);
                    $("div.ui-dialog").attr("id","CampusModals");
                    var premium = $('#divBtnGoPremium').attr('href');
                    $('.popup_anuncioPremium a').attr('href', premium);
                },
                close: function(event, ui){
                    $('#sharerdialog').empty().remove();
                    $("#sharerdialog").dialog('destroy');
                }
                
            });
            $dialog.dialog('open');
        }
    });
}
function popUpCreditCard(url){
    $.ajax({
        beforeSend: function(){
        },
        cache: true,
        type: "GET",
        url: url,
        async: false,
        success: function(response){
            var $dialog = $('<div id="sharerdialog">'+response+'</div>');

            $dialog.dialog({
                closeOnEscape: true,
                autoOpen: false,
                title: false,
                position: "center",
                width: 350,
                /*height: auto,*/
                resizable: false,
                modal: true,
                draggable: false,
                open: function(event, ui) {
                    var aux = $("a.ui-dialog-titlebar-close").html();
                    $("#ui-dialog-title-sharerdialog").remove();
                    $("a.ui-dialog-titlebar-close").empty();
                    $("a.ui-dialog-titlebar-close").html(aux);
                    $("div.ui-dialog").attr("id","CampusModals");
                },
                close: function(event, ui){
                    $('#sharerdialog').empty().remove();
                    $("#sharerdialog").dialog('destroy');
                }

            });
            $dialog.dialog('open');
        }
    });
}
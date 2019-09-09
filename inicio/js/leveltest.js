/**
 *
 * Funciones propias del Test de nivel.
 *
 * Prerrequisitos:
 * - Jquery.
 * - Fancybox.
 * - lt_campusURL = URL to the Campus. Ej. https://campus.abaenglish.com
 *
 */

/*
 * Url al campus.
 *
 * Required.
 *
 */
var lt_campusURL = '';

/*
 * Accion cuando el test se ha terminado.
 *
 * Optional.
 *
 */
var lt_callback = function(code) { console.log('The Test \''+code+'\' is done.'); };

/*
 * Accion cuando hay un error.
 *
 * Optional.
 *
 */
var lt_errorCallBack = function(code, msg, data) { console.log(msg); };

/*
 * Codigo del test.
 *
 * Optional.
 */
var lt_code = 'new';

/*
 * Default language.
 *
 * Optional.
 */
var lt_language = 'en';

/*
 * Tiempo entre preguntas.
 *
 * Optional.
 */
var lt_offsetTimeout = 2000;
var lt_closeBtnStatus =true;
var lt_HeightStatus ='430px';
var lt_WidthStatus ='600px';
var lt_onbefore = function(){};
var lt_onafter = function(){};

/* *************************************************************************************************************
 * No tocar a partir de aqui. **********************************************************************************
 * ************************************************************************************************************* */

/*
 * Semaforo para que no se pulse el boton de siguiente mas de una vez.
 */
var lt_nextBtnActive = true;
var abaLeveltest = new function() {
    //var nextBtnActive = true;
    //var code = 'new';
    //var campusURL = '';
    //var offsetTimeout = 2000;

    this.getURLCampus = function() {
        return lt_campusURL;
    }

    this.setURLCampus = function(lvalue) {
        lt_campusURL = lvalue;
    }

    this.getCallback = function() {
        return lt_callback;
    }

    this.setCallback = function(lvalue) {
        lt_callback = lvalue;
    }

    this.getErrorCallback = function() {
        return lt_errorCallBack;
    }

    this.setErrorCallback = function(lvalue) {
        lt_errorCallBack = lvalue;
    }

    this.getOffsetTimeout = function() {
        return lt_offsetTimeout;
    }

    this.setOffsetTimeout = function(timeout) {
        lt_offsetTimeout = timeout;
    }

    this.getCode = function() {
        return lt_code;
    }

    this.setCode = function(code) {
        lt_code = code;
    }

    this.getLanguage = function() {
        return lt_language;
    }

    this.setLanguage = function(isoLanguage) {
        lt_language = isoLanguage;
    }

    this.getBtnActive = function() {
        return lt_nextBtnActive;
    }

    this.setBtnActive = function(status) {
        lt_nextBtnActive = status;
    }

    this.getCloseButtonStatus = function() {
        return lt_closeBtnStatus;
    }

    this.setCloseButtonStatus = function(status) {
        lt_closeBtnStatus = status;
    }

    this.getHeight = function() {
        return lt_HeightStatus;
    }

    this.setHeight = function(status) {
        lt_HeightStatus = status;
    }

    this.getWidth = function() {
        return lt_WidthStatus;
    }

    this.setWidth = function(status) {
        lt_WidthStatus = status;
    }

    this.setOnBefore = function(callback) {
        lt_onbefore = callback;
    }

    this.setOnAfter = function(callback) {
        lt_onafter = callback;
    }
    this.init = function() {
        abaLeveltest.setBtnActive(true);
        $('#form_submit').click( function() {
            if ( abaLeveltest.getBtnActive() == false ) return false;
            var selectedOption = $('input[name=radioTestOptions]:checked').val();
            if ( typeof selectedOption == 'undefined' ) { console.log('You must select one answer before go to next question.'); return false; }
            abaLeveltest.setBtnActive(false);

            var parameters = { answer: selectedOption, code: abaLeveltest.getCode(), language: abaLeveltest.getLanguage() };
            abaLeveltest.start( parameters, true );
        });
    }

    this.submit = function(code, campusURL, isoLanguage) {
        abaLeveltest.setURLCampus(campusURL);
        abaLeveltest.setCode(code);
        abaLeveltest.setLanguage(isoLanguage);
        if ( abaLeveltest.getBtnActive() == false ) return false;
        var selectedOption = $('input[name=radioTestOptions]:checked').val();
        if ( typeof selectedOption == 'undefined' ) { console.log('You must select one answer before go to next question.'); return false; }
        abaLeveltest.setBtnActive(false);

        var parameters = { answer: selectedOption, code: code, language: isoLanguage };
        abaLeveltest.start( parameters, true );
    }

    this.start = function(parameters, nextQuestion) {
        var offsetTimeout = abaLeveltest.getOffsetTimeout();
        if (typeof nextQuestion != 'undefined') {
            var url = abaLeveltest.getURLCampus()+'/leveltest/next';
        } else {
            var url = abaLeveltest.getURLCampus()+'/leveltest';
            offsetTimeout = 100;
        }

        abaLeveltest.setBtnActive(false);
        var successF = function(data) {
            if (!data.ok) {lt_errorCallBack(data.errorCode, data.errorMsg, data); return;}

            answerSelected = $('input:radio[name=radioTestOptions]:checked');
            answerWrapper = answerSelected.closest('li');

            icon = document.createElement('span');
            icon.className = data.okAnswer ? 'ico-successTestLevel okTestLevel' : 'ico-koTestLevel koTestLevel';
            icon.style.marginLeft = '15px';

            color = data.okAnswer ? 'green' : 'red';
            answerWrapper.css('border-color', color);
            answerWrapper.find('span').css('color', color);
            answerWrapper.find('label2').append(icon);


            if ( data.end ) {
                lt_callback(abaLeveltest.getCode(), data.level, data.isoLanguage);
            } else {
                setTimeout( function() {
                    abaLeveltest.showContent( data.html, abaLeveltest.getCloseButtonStatus());
                    abaLeveltest.labelActive();
                    abaLeveltest.setBtnActive(true);
                }, offsetTimeout );
            }
        };
        var errorF = function() { lt_errorCallBack(-4, 'Level Test error'); console.log('Level Test error'); };
        var doneF = function() { };

        this.launchAjax(url, parameters, successF, errorF, doneF);
    }

    this.showContent = function( content, close, width, height ) {
        if( typeof width == 'undefined' ) width = abaLeveltest.getWidth();
        if( typeof height == 'undefined' ) height = abaLeveltest.getHeight();

        lt_onbefore();
        $.fancybox.close();
        $.fancybox( {
            fitToView	: true,
            width		: width,
            height		: height,
            autoSize	: false,
            closeClick	: false,
            closeBtn    : close,
            modal       : !close,
            openEffect	: 'none',
            closeEffect	: 'none',
            scrolling   : 'auto',
            content: content,
            helpers: {
                overlay: {
                    css: {
                        'background-image': 'url("https://campus.abaenglish.com/themes/ABAenglish/media/images/fondoModal.png")'
                    }
                }
            }
        });
        lt_onafter();
    }

    this.close = function() {
        $.fancybox.close();
    }

    this.launchAjax = function ( url, parameters, successF, errorF, doneF ) {
        if ( typeof successF == 'undefined' || successF == '' ) successF = function(data) {};
        if ( typeof errorF == 'undefined' || errorF == '' ) errorF = function(jqXHR, textStatus, error) { console.log(textStatus + ': ' + error); };
        if ( typeof doneF == 'undefined' || doneF == '' ) doneF = function() {};

            $.ajax({
            data:  parameters,
            url: url,
            context: document.body,
            type: 'POST',
            dataType:"json",
            success: function(data) {
                successF( data );
            },
            error: function(jqXHR, textStatus, error) {
                errorF( jqXHR, textStatus, error );
            },
        }).done(function() {
            doneF();
        });
    }

    this.labelActive = function() {
        $( document ).ready(function() {
            $("ul.welcomeLevelTest li").click(function () {
                $(this).find("input").prop("checked", true);
            });
        });
    }

 }
/**
 * Created by earandes on 30/11/15.
 */

$(document).ready( function() {

    abaLeveltest.setCloseButtonStatus(false);
    abaLeveltest.setOnBefore(function(){
        campusPopup.container.dialog("destroy");
    });
    abaLeveltest.setCallback(function(code, level, isoLanguage) { campusLtCallback(code, level, isoLanguage); });
    abaLeveltest.setErrorCallback(function(code, level, data) { campusLtErrorCallback(code, level, data); });

});

function campusLtCallback(code, level, isoLanguage) {
    //console.log('Campus fi del test, nivell '+level);

    dataLayer.push({'levelSelected': level});
    dataLayer.push({'event': 'level_select'});

    var url = '/welcome/finishTestLevel';
    var parameters = {
        level: level,
        code: code
    };
    var doneF = function(data){

        abaLeveltest.setHeight('370px');
        abaLeveltest.showContent(data.html, false);
    }
    abaLeveltest.launchAjax(url, parameters,doneF);
}

function campusLtErrorCallback(code, msg, data) {
    console.log('Error en el test ('+code+').');

}

function startDemoTestLevel() {

    abaLeveltest.setHeight('400px');
    abaLeveltest.setCloseButtonStatus(true);
    abaLeveltest.setOnBefore(function(){});
    abaLeveltest.setCallback(function(code, level, isoLanguage) { campusLtDemoCallback(code, level, isoLanguage); });
    abaLeveltest.setErrorCallback(function(code, level, data) { campusLtErrorDemoCallback(code, level, data); });
    abaLeveltest.start();
}

function campusLtDemoCallback(code, level, isoLanguage) {
    //console.log('Campus demo fi del test, nivell '+level);

    var url = '/welcome/thisIsDemo';
    var parameters = {
        level: level,
        code: code
    };
    var doneF = function(data){

        abaLeveltest.setHeight('275px');
        abaLeveltest.showContent(data.html, true);
    }
    abaLeveltest.launchAjax(url, parameters,doneF);
}

function campusLtErrorDemoCallback(code, msg, data) {
    console.log('Error en el test (' + code + ').');
}

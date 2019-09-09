function loadDefaultBanner() {
  var urlBanner2 = location.protocol + '//' + document.domain.trim() + $('#urlSelfBannerSecure').text().trim();

  $.ajax({
    cache: true,
    type: 'GET',
    url: urlBanner2,
    async: false,
    success: function(data) {
      $('#idBannerConversion').empty().html(data);
    },
  });
}

$(document).ready(function() {
  if ($('#idBannerConversion').length > 0) {
    var urlBanner = $('#urlBannerDynamic').text().replace('https', 'http');
    if (location.protocol === 'https:') {
      urlBanner = urlBanner.replace('http', 'https');
    }

    $.ajax({
      cache: true,
      type: 'GET',
      url: urlBanner,
      timeout: 10,
      async: false,
      success: function(data) {
        var returnHTML = $(data).filter('.selligent_wrapper').html();
        $('#idBannerConversion').empty().html(returnHTML);
      },

      error: function() {
        loadDefaultBanner();
      },

      complete: function(data, status) {
        if (('' + status) == 'error') {
          loadDefaultBanner();
        }
      },
    });
  }

  // fire code for dealing with AB test for displaying customer support options
  testAb6086();

  /* Functionaltiy for the new Home Campus Page */
  $('.help span').click(function() {
    var helpIsSelected = $('.help').hasClass('selected');

    $('.help').toggleClass('selected');
    $('.help ul').toggle(!helpIsSelected);
  });

  /*------------FAQ Behaviours---------------*/

  // Show/Hide FAQ selected
  $('div.bodyAyuda ol > li > span').on('click', function() {
    $(this).next('div').toggle();
  });

  //Show/Hide the group of FAQ clicked
  $('.help_dropdwon p.faq_category').on('click', function() {
    $(this).parent().toggleClass('closed');
  });

  if (campusUtils.getURLParameter('subject') != '' && (campusUtils.getURLParameter('question') != '')) {
    $('#subject_' + campusUtils.getURLParameter('subject')).removeClass('closed');
    $('#question_' + campusUtils.getURLParameter('question')).css('display', 'block');
  }

  //Billing form: function to copy the values from the top of the profile form to the billing form
  $('#copyData').click(function() {
    $('#ProfileForm_invoicesName').val($('#ProfileForm_name').val());
    $('#ProfileForm_invoicesSurname').val($('#ProfileForm_surnames').val());
    $('#ProfileForm_invoicesCity').val($('#ProfileForm_city').val());
    $('#ProfileForm_invoicesCountry').val($('#ProfileForm_countryId').val());
    $('#ProfileForm_invoicesCountry').trigger('change');
  });

  /* --------NEW EVENT : Assign Premium link from Selligent ---------- */

  getSelligentPremiumLink('#aLinkGoToActivateCard');
  var sCSButtonId = '#support-premium';
  var $oCSButton = $(sCSButtonId);
  if ($oCSButton.length > 0) {
    //copy the Selligent Banner URL to support-premium button to keep the code DRY.
    getSelligentPremiumLink(sCSButtonId);
    var aNewLink = campusUtils.updateURLParameter('idpartner', $oCSButton.prop('href'), 300277);
    $oCSButton.prop('href', aNewLink);
  }
  /*------------------------------*/

  /* Checks if 6086 testAB is active and displays proper variation while destroying the other from DOM
  *  Prevents "Flash of Variation while loading" that occurs because of VWO */
  function testAb6086() {
    var $oTestBlocks = $('.support');
    var $ABA = $('.support.ABA');
    var $ABB = $('.support.ABB');
    var $ABP = $('.support.ABAPremium');
    if ($oTestBlocks.length > 0) {
      var variation = campusUtils.readCookie('_vis_opt_exp_35_combi');
      if (variation == 1) {
        // user comes through control, i.e, they never see advert for upgrade to premium for free support)
        if ($ABA.length > 0) {

          // Shows Control if available, destroys Variant1
          $ABA.show(); // shows customer support info
          $ABB.remove(); //hides advert "upgrade to premium for free support")
        }
      } else if (variation == 2) {
        if ($ABB.length > 0) {

          // Shows Variant1 if available, destroys Control
          $ABB.show(); //shows advert "upgrade to premium for free support")
          $ABA.remove(); // hides customer support info
        }
      } else {
        // user came through variant 1 (they saw advert for free support upon upgrade)
        if ($ABP.length > 0) {

          // Shows Customer Support block if available as premium
          $ABP.show(); //shows customer support info
        } else if ($ABA.length > 0) {

          // Shows the last case when testAB is not present (i.e.: localhost)
          $ABA.show();
        }
      }
    }
  }
  /* ENDS 6086 testAB */

  function getSelligentPremiumLink(aButton) {
    var urlToSelligent = $('#divBtnGoPremium').prop('href');
    if ($(aButton).length > 0) {
      $(aButton).prop('href', urlToSelligent);
    }
  }

  $(window).on({
    resize: campusUtils.onWindowResize,
    load: campusUtils.onWindowLoad,
  });
});

var campusUtils = {
  onWindowResize: function() {
    campusUtils.centerModal();
  },
  /* 5809 */
  onWindowLoad: function() {
    campusUtils.centerPayBlock();
  },

  centerPayBlock: function() {
    var MOBILE_LAYOUT_WIDTH = 737;
    if ($(window).width() < MOBILE_LAYOUT_WIDTH && typeof campusUtils.getURLParameter('show') !== 'undefined') {
      var $scrollTarget = $('#' + campusUtils.getURLParameter('show'));

      var delay = 2000;
      $('html, body').stop(true, true).animate({scrollTop: $scrollTarget.offset().top - $(window).height() / 2 + $scrollTarget.height() / 2}, delay);
    }
  },

  getURLParameter: function(sParam, sURL) {
    if (typeof sPageURL == 'undefined') {
      var sPageURL = window.location.search.substring(1);
    } else {
      var sPageURL = sURL;
    }

    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
      var sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] == sParam) {
        return sParameterName[1];
      }
    }
  },

  updateURLParameter: function(sParam, sURL, newVal) {
    var newAdditionalURL = '';
    var tempArray = sURL.split('?');
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = '';
    if (additionalURL) {
      tempArray = additionalURL.split('&');
      var i = 0;
      for (i; i < tempArray.length; i++) {
        if (tempArray[i].split('=')[0] != sParam) {
          newAdditionalURL += temp + tempArray[i];
          temp = '&';
        }
      }
    }

    var rowsTxt = temp + '' + sParam + '=' + newVal;
    return baseURL + '?' + newAdditionalURL + rowsTxt;
  },

  /* ENDS 5809 */

  readCookie: function(name) {
  var nameEQ = name + '=';
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }

  return null;
},

  centerModal: function() {
    /* TODO: potentional refactoring bug  */
    var pos = campusUtils.getPos(document.getElementById('divRightContent'));
    var popup = $('.ui-dialog').first()[0];
    if (popup !== null && popup !== undefined) {
      popup.style.top = pos.y + 'px';
      popup.style.left = pos.x + 'px';
    }
  },

  openModal: function(url, width, height) {
    $.ajax({
      cache: true,
      type: 'GET',
      url: url,
      async: false,
      success: function(response) {
        var $dialog = $('<div id="sharerdialog">' + response + '</div>');
        $dialog.dialog({
          closeOnEscape: true,
          autoOpen: false,
          title: false,
          position: [-1000, -1000],
          width: width,
          height: height,
          resizable: false,
          modal: true,
          draggable: false,
          open: function(event, ui) {
            var premium = $('#divBtnGoPremium').attr('href');
            $('#ui-dialog-title-sharerdialog').remove();
            $('div.ui-dialog').attr('id', 'CampusModals');
            $('.popup_anuncioPremium a').attr('href', premium);
            $('#CampusModals.ui-dialog').css('position', 'absolute');
            campusUtils.centerModal();
          },

          close: function() {
            $('#sharerdialog').empty().remove().dialog('destroy');
          },
        });

        $dialog.dialog('open');
      },
    });
  },

  closeModal: function() {
    $('#sharerdialog').dialog('close');
  },

  getPos: function(el) {
    for (var lx = 0, ly = 0;
        el != null;
        lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
    return {x: lx, y: ly};
  },
  /*
   * Collects layer by Id and displays its content on a Sharer Dialog Box
   */
  openModalFromHtml: function(divId, width, height) {
    var $divId = $('#' + divId);
    $divId.hide();
    var $dialog = $('<div id="sharerdialog">' + $divId.html() + '</div>');
    $dialog.dialog({
      closeOnEscape: true,
      autoOpen: false,
      title: false,
      position: [-1000, -1000],
      width: width,
      height: height,
      resizable: false,
      modal: true,
      draggable: false,
      open: function(event, ui) {
        var closeLink = $('a.ui-dialog-titlebar-close');
        var aux = closeLink.html();
        var premium = $('#divBtnGoPremium').attr('href');
        $('#ui-dialog-title-sharerdialog').remove();
        closeLink.empty().html(aux);
        $('div.ui-dialog').attr('id', 'CampusModals');
        $('.popup_anuncioPremium a').attr('href', premium);
        $('#CampusModals.ui-dialog').css('position', 'absolute');
        campusUtils.centerModalHtml();
      },

      close: function() {
        var $divId = $('#' + divId);
        $divId.hide();
        $('#sharerdialog').empty().remove().dialog('destroy');
      },

    });

    $dialog.dialog('open');
  },

  centerModalHtml: function() {
    $('#sharerdialog').dialog('option', 'position', 'center');
  },
};

//----------variables-----------
var zip = '';
var iframe;
//----------variables-----------


//------ready---------------
$(document).ready(function () {
  zip = JSON.parse($('#zip').text());
  $('iframe').on('load', function () {
    iframe = $('iframe')[0].contentDocument.getElementsByTagName('body')
    $(iframe).click(function () {
      checkLink();
    });
  })
  $('.zips').change(function () {
    var option = $(this).find("option:selected");
    $('iframe').attr('src', option.text().split('.')[0])
  });
});
//------ready---------------










//---------function--------------------
function checkLink() {
  $(iframe).find('div').each(function(){
  	if($(this).text().length > 1){
      zip.forEach(elem => {
          if ($(this).text() == elem.title) {
            edit_url('zip', elem.zip);
            $('iframe').attr('src', elem.zip.split('.zip')[0])
          }
      });
  	}
  });
}

function edit_url(tag, val) {
  var edited_href = document.location.search;
  if (edited_href.length > 0) {
    var exec = new RegExp(tag+'=([^&]+)', "gi");
    edited_href = edited_href.replace(exec, tag+'='+val);
    history.pushState('', '', edited_href);
  }else {
    history.pushState('', '', '?'+tag+'='+val);
  }
}
//---------function--------------------




















//--------end-----------

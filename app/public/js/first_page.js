$(document).ready(function () {
  var lastScrollTop = $(window).scrollTop();
  $(window).on('scroll', function(e){
    st = $(this).scrollTop();
    if(st < lastScrollTop) {
      // up
      $('.paralax.move').each(function () {
        $(this).css('top', parseInt($(this).css('top'))-2+'px');
      });
    }
    else {
      $('.paralax.move').each(function () {
        $(this).css('top', parseInt($(this).css('top'))+2+'px');
      });
      // down
    }
    lastScrollTop = st;

  });

$('.open-menu-list').click(function () {
  if (parseInt($('.document-header .menu').css('height')) < 280) {
    $('.document-header .menu').css('height', '280px');
    $('.header-list-div').show()
    $('.menu-list').css('display', 'block');
  }else {
    $('.document-header .menu').css('height', '40px');
    $('.header-list-div').hide()
  }
});


$('.toForm').click(function () {
    scrollTo();
});


});

function scrollTo() {
  $('html, body').animate({
    scrollTop: $('#map').offset().top
  }, 500, function () {
    $('.map .name').focus();
  });
}

function send_message(elem) {
  var elem = $(elem).parent();
  var msg = {
    name: elem.find('.name').val(),
    email: elem.find('.email').val(),
    msg: elem.find('.msg').val()
  };
  Alert.success('Сообщение успешно отправлено, '+elem.find('.name').val(), 'Сообщение отправлено.')
  console.log(msg);
}


































//-------------------------------------------------------------

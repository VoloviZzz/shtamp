$(document).ready(function () {
  var newFile = 0;
  $(document).on('keydown', function (e) {
		if (e.shiftKey && e.ctrlKey && e.keyCode == 'S'.charCodeAt(0)) {
			saveEditedFiles()
		}
	});

  $(document).on('keydown', function (e) {
    if (e.shiftKey && e.ctrlKey && e.keyCode == 'F'.charCodeAt(0)) {
      if ($('.code-editor').css('height') == "500px") {
        $('.code-editor').css('height', '100%');
        element = $('.code-editor').get(0);
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        }
      }
    }else if (e.which == 27) {
      $('.code-editor').css('height', '500px');
    }
  });

  $('.directory').click(function () {
    $('.'+$(this).find('span').text()).toggle(200);
  });

  $('.addFile').click(function () {
    var file = prompt('Имя файла', 'index.js');
    var path = $(this).data('path');
    var elem = $(this);
    $.post('/api/codeEditor/addFS', {
        path: path,
        file: file,
      })
      .done(function (result) {
        if (result.status == 'ok') {
          newFile++;
          elem.after('<div data-path="'+path+'" id="newFile'+newFile+'" class="directory edit-file '+$(this).parent().text()+'">┣───<span>'+file+'</span></div>');
          $('#newFile'+newFile).on('mouseup', function (e) {
            if (e.originalEvent.button != 1) {
              $('.seleced-editors .file').each(function () {
                $(this).removeClass('open');
              });
              var path = $(this).data('path')+$(this).find('span').text();
              $('.seleced-editors').append('<div data-path="'+path+'" class="file open">'+$(this).find('span').text()+'</div>');
              $('.open').on('mouseup', function (e) {
                if (e.originalEvent.button == 1) {
                  $(this).hide(200, function () {
                    $(this).remove();
                    var tmp_path = $(this).data('path');
                    $('.js-ace-editor').each(function () {
                      if ($(this).data('path') == tmp_path) {
                        $(this).hide(200, function () {
                          $(this).remove();
                          $($('.js-ace-editor')[$('.js-ace-editor').length-1]).show(200);
                        })
                      }
                    });
                  });
                }else {
                  $('.seleced-editors .file').each(function () {
                    $(this).removeClass('open');
                  });
                  $(this).addClass('open');
                  var tmp_path = $(this).data('path');
                  $('.js-ace-editor').each(function () {
                    if ($(this).data('path') != tmp_path) {
                      $(this).hide();
                    }else {
                      $(this).show();
                    }
                  })
                }
              });
              var extengen = $(this).find('span').text().split('.')[1];
              $.post('/api/codeEditor/getFile', {
                  dirname: $(this).data('path')+$(this).find('span').text(),
                })
              .done(function (result) {
                if (result.status == 'ok') {
                  console.log(result);
                  $('.js-ace-editor').hide(200);
                  $('.show-editor').append('<div class="js-ace-editor" data-path="'+path+'" data-lang = "'+extengen+'">'+result.value+'</div>');
                  addEditor($('.js-ace-editor')[$('.js-ace-editor').length-1]);
                }
              });
            }else {
              if (confirm('Вы действительно хотите удалить файл?')) {
                if (confirm('Этот файл будет безвозвратно удалён!')) {
                  var elem = this;
                  var path = $(this).data('path');
                  $.post('/api/codeEditor/rmFS', {
                      path: $(this).data('path')+$(this).find('span').text(),
                    })
                  .done(function (result) {
                    if (result.status == 'ok') {
                      alert('Файл удалён.');
                      $(elem).hide(200, function () {
                        $(elem).remove();
                      });

                      $('.file').each(function () {
                        if (path == $(this).data('path')) {
                          $(this).hide(200, function () {
                            $(this).remove();

                            $('.js-ace-editor').each(function () {
                              if ($(this).data('path') == path) {
                                $(this).hide(200, function () {
                                  $(this).remove();
                                  $($('.js-ace-editor')[$('.js-ace-editor').length-1]).show(200);
                                })
                              }
                            });
                          });
                        }
                      })
                    }
                  });
                }
              }
            }
          });
        }
      });
  });

  $('.edit-file').on('mouseup', function (e) {
    if (e.originalEvent.button != 1) {



      $('.seleced-editors .file').each(function () {
        $(this).removeClass('open');
      });
      // $(this).addClass('open');
      var tmp_path2 = $(this).data('path')+$(this).find('span').text();
      var tmp_path = $(this).data('path');
      $('.js-ace-editor').each(function () {
        if ($(this).data('path') != tmp_path2) {
          $(this).hide();
        }else {
          $(this).show();
        }
      })

      var path = $(this).data('path')+$(this).find('span').text();
      var opened_file = false;
      $('.seleced-editors .file').each(function () {
        if ($(this).data('path') != path) {
          $(this).removeClass('open');
        }else {
          opened_file = true;
          $(this).addClass('open');
        }
      });

      if (opened_file == false) {
        $('.seleced-editors').append('<div data-path="'+path+'" class="file open">'+$(this).find('span').text()+'</div>');
        $('.open').on('mouseup', function (e) {
          if (e.originalEvent.button == 1) {
            $(this).hide(200, function () {
              $(this).remove();
              var tmp_path = $(this).data('path');
              $('.js-ace-editor').each(function () {
                if ($(this).data('path') == tmp_path) {
                  $(this).hide(200, function () {
                    $(this).remove();
                    $($('.js-ace-editor')[$('.js-ace-editor').length-1]).show(200);
                  })
                }
              });
            });
          }else {
            $('.seleced-editors .file').each(function () {
              $(this).removeClass('open');
            });
            $(this).addClass('open');
            var tmp_path = $(this).data('path');
            $('.js-ace-editor').each(function () {
              if ($(this).data('path') != tmp_path) {
                $(this).hide();
              }else {
                $(this).show();
              }
            })
          }
        });

        var extengen = $(this).find('span').text().split('.')[1];
        $.post('/api/codeEditor/getFile', {
            dirname: $(this).data('path')+$(this).find('span').text(),
          })
        .done(function (result) {
          if (result.status == 'ok') {
            $('.js-ace-editor').hide(200);
            $('.show-editor').append('<div class="js-ace-editor" data-path="'+path+'" data-lang = "'+extengen+'">'+result.value+'</div>');
            addEditor($('.js-ace-editor')[$('.js-ace-editor').length-1]);
          }
        });

      }



    }else {
      if (confirm('Вы действительно хотите удалить файл?')) {
        if (confirm('Этот файл будет безвозвратно удалён!')) {
          var elem = this;
          var path = $(this).data('path')+$(this).find('span').text();
          $.post('/api/codeEditor/rmFS', {
              path: $(this).data('path')+$(this).find('span').text(),
            })
          .done(function (result) {
            if (result.status == 'ok') {
              alert('Файл удалён.');
              $(elem).hide(200, function () {
                $(elem).remove();
              });

              $('.file').each(function () {
                if (path == $(this).data('path')) {
                  $(this).hide(200, function () {
                    $(this).remove();

                    $('.js-ace-editor').each(function () {
                      if ($(this).data('path') == path) {
                        $(this).hide(200, function () {
                          $(this).remove();
                          $($('.js-ace-editor')[$('.js-ace-editor').length-1]).show(200);
                        })
                      }
                    });
                  });
                }
              })
            }
          });
        }
      }
    }
  });



  $('.file').on('mouseup', function (e) {
    if (e.originalEvent.button == 1) {
      $(this).hide(200, function () {
        $(this).remove();
        var tmp_path = $(this).data('path');
        $('.js-ace-editor').each(function () {
          if ($(this).data('path') == tmp_path) {
            $(this).hide(200, function () {
              $(this).remove();
              $($('.js-ace-editor')[$('.js-ace-editor').length-1]).show(200);
            })
          }
        });
      });
    }else {
      $('.seleced-editors .file').each(function () {
        $(this).removeClass('open');
      });
      $(this).addClass('open');
      var tmp_path = $(this).data('path');
      $('.js-ace-editor').each(function () {
        if ($(this).data('path') != tmp_path) {
          $(this).hide();
        }else {
          $(this).show();
        }
      })
    }
  });





})


function addEditor(elem) {
  var editor = ace.edit(elem);
	var $elem = $(elem);
  editor.pathName = $elem.data('path');
	editors.push(editor);
	var fragmentId = $elem.data('fragment-id');

	editor.setTheme("ace/theme/monokai");
	editor.setAutoScrollEditorIntoView(true);
	if ($elem.data('lang') == 'html') {
		editor.session.setMode("ace/mode/html");
	}else if ($elem.data('lang') == 'js') {
		editor.session.setMode("ace/mode/javascript");
	}else if ($elem.data('lang') == 'ejs') {
		editor.session.setMode("ace/mode/ejs");
	}else if ($elem.data('lang') == 'css') {
		editor.session.setMode("ace/mode/css");
	}else {
		editor.session.setMode("ace/mode/html");
	}
}

function saveEditedFiles() {
  var path = $('.open').data('path');
  editors.forEach(function (editor) {
    if (path == editor.pathName) {
      $.post('/api/codeEditor/setFS', {
          path: editor.pathName,
          template: editor.getValue(),
        })
        .done(function (result) {
          if (result.status == 'ok') {
            alert('saved');
          }
        });
    }
  });



}

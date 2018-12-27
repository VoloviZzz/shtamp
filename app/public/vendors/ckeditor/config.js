/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function (config) {
	config.filebrowserUploadUrl = '/api/images/uploadCKeditor';
	config.allowedContent = true;
	config.removePlugins = 'spellchecker,about,save,newpage,print,templates,scayt,flash,pagebreak,smiley,preview,find';
	config.extraPlugins = 'lineheight,autogrow,codesnippet,videoembed';
	config.autoGrow_bottomSpace = 50;
	config.autoGrow_onStartup = true;
	config.contentsCss = '/css/imports/buttons-and-inputs.css';
	config.forcePasteAsPlainText = true;
};

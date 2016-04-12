/*jshint node: true, jquery: true*/
/* globals brackets, define, Mustache */
/*!
 * Brackets Selected Char Counter
 *
 * @author Alê Monteiro
 * @license MIT
 * @home https://github.com/alemonteiro/selected-char-count
 */
define(function (require, exports, module) {
	'use strict';

	// Get dependencies.
	var EditorManager = brackets.getModule('editor/EditorManager'),
		AppInit = brackets.getModule('utils/AppInit'),

		// Extension basics.
		Strings = require('modules/Strings'),
        $counter;

	/**
	If there's selected text on current editor
	*/
	function hasTextSelection() {
		var editor = EditorManager.getActiveEditor();
		return editor && editor.hasSelection();
	}

    function showSelectedCharCount(c) {
        if ( c && c > 0 ) {
            $counter.text(" - " + c + " " + Strings.FOOTER_LABEL);
        }
        else {
            $counter.text('');
        }
    }

    function countSelectedChars(editor) {
        var selectedText = editor.getSelectedText();
        return selectedText ? selectedText.length : false;
    }

    function onEditorSelectionHandler(e, editor, keyBoardEvt) {
        var c = countSelectedChars(editor);
        showSelectedCharCount(c);
    }

    function onEditorActive(e, editorGainingFocus, editorLosingFocus) {
        if ( editorLosingFocus ) {
            editorLosingFocus.off("keydown", onEditorSelectionHandler);
            editorLosingFocus.off("cursorActivity", onEditorSelectionHandler);
        }
        if(editorGainingFocus) {
            editorGainingFocus.on("keydown", onEditorSelectionHandler);
            editorGainingFocus.on("cursorActivity", onEditorSelectionHandler);
        }
    }
	/**
	 * Add main listeners
	 */
	function registerListeners() {
        EditorManager.on("activeEditorChange", onEditorActive);
	}

	// Register panel and setup event listeners.
	AppInit.appReady(function () {

        $counter = $('<div id="selected-char-counter"></div>').appendTo("#status-info");

		// Setup listeners.
		registerListeners();

        onEditorActive(null, EditorManager.getActiveEditor(), false);
	});

});

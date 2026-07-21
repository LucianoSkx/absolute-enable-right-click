// ==UserScript==
// @name         Absolute Enable Right Click & Copy
// @name:en      Absolute Enable Right Click & Copy
// @name:pt-BR   Absolute Enable Right Click & Copy
// @namespace    https://greasyfork.org/pt-BR/users/1301195-luciano-inf
// @version      1.0
// @author       Luciano.Oliveirals
// @license      MIT
// @run-at       document-body
// @grant        none
// @match        *://*/*
// @icon         https://raw.githubusercontent.com/LucianoSkx/absolute-enable-right-click-violentmonkey/main/icon.svg
// @supportURL   https://github.com/LucianoSkx/absolute-enable-right-click-violentmonkey/issues
// @homepageURL  https://github.com/LucianoSkx/absolute-enable-right-click-violentmonkey
// @description Ativa clique direito e cópia em qualquer site, removendo proteções de seleção e menu de contexto.
// @description:en Enable right click and copy on any website, removing selection and context menu protections.
// @description:pt-BR Ativa clique direito e cópia em qualquer site, removendo proteções de seleção e menu de contexto.
// ==/UserScript==

(function() {
    'use strict';

    /* =============================================
       Force enable right-click globally
       ============================================= */
    function enableRightClick() {
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            e.stopPropagation();
        }, true);

        var protectedElements = document.querySelectorAll(
            '.no-right-click, [data-no-right-click], [oncontextmenu]'
        );
        protectedElements.forEach(function(el) {
            el.removeAttribute('oncontextmenu');
            el.classList.remove('no-right-click', 'disable-right-click', 'protected-text', 'no-select');
            el.style.userSelect = 'text';
            el.style.cursor = 'text';
        });

        document.body.style.webkitUserSelect = 'text';
        document.body.style.mozUserSelect = 'text';
        document.body.style.msUserSelect = 'text';
        document.body.style.userSelect = 'text';

        var overrideStyle = document.createElement('style');
        overrideStyle.textContent =
            '* {' +
            '  user-select: text !important;' +
            '  -webkit-user-select: text !important;' +
            '  -moz-user-select: text !important;' +
            '  -ms-user-select: text !important;' +
            '  cursor: text !important;' +
            '  pointer-events: auto !important;' +
            '}';
        document.head.appendChild(overrideStyle);
    }

    /* =============================================
       Force enable copy
       ============================================= */
    function enableCopy() {
        document.addEventListener('copy', function(e) {
            var selection = window.getSelection();
            if (selection && selection.toString().trim().length > 0) {
                if (e.preventDefault) e.preventDefault();
                if (e.stopPropagation) e.stopPropagation();
                return false;
            }
        }, true);

        document.addEventListener('cut', function(e) {
            var selection = window.getSelection();
            if (selection && selection.toString().trim().length > 0) {
                if (e.preventDefault) e.preventDefault();
                if (e.stopPropagation) e.stopPropagation();
                return false;
            }
        }, true);
    }

    /* =============================================
       Remove copy protection messages & overlays
       ============================================= */
    function removeCopyProtectionMessages() {
        var selectors = [
            '.text-protection', '.cant-copy', '[data-no-select]',
            '.no-select', '.copy-blocked', '.overlay-block',
            '[class*="protected"]', '[class*="disabled"]',
            '.overlay', '.blocker', '.modal', '.popup',
            'div[style*="pointer-events: none"]'
        ];

        document.querySelectorAll(selectors.join(', ')).forEach(function(el) {
            var text = (el.textContent || '').toLowerCase();
            if (text.indexOf('copy') !== -1 ||
                text.indexOf('copiar') !== -1 ||
                text.indexOf('right click') !== -1 ||
                text.indexOf('clique direito') !== -1 ||
                text.indexOf('selection') !== -1 ||
                text.indexOf('seleção') !== -1) {
                el.remove();
            }
        });
    }

    /* =============================================
       Remove drag & drop restrictions
       ============================================= */
    function removeDragRestrictions() {
        document.addEventListener('dragstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
        }, true);

        document.addEventListener('selectstart', function(e) {
            var target = e.target;
            while (target && target.nodeType === 1) {
                var style = window.getComputedStyle(target);
                if (style.userSelect === 'none' ||
                    style.webkitUserSelect === 'none' ||
                    style.mozUserSelect === 'none') {
                    e.preventDefault();
                    e.stopPropagation();
                }
                target = target.parentElement;
            }
        }, true);
    }

    /* =============================================
       Remove common anti-copy CSS classes
       ============================================= */
    function removeAntiCopyCSS() {
        var style = document.createElement('style');
        style.textContent =
            '.noselect, .no-select, .noCopy, .no-copy, .unselectable, ' +
            '.disable-select, .disableCopy, .disable-copy, ' +
            '[unselectable="on"], [data-selectable="false"], ' +
            '.not-selectable, .copy-disabled {' +
            '  user-select: text !important;' +
            '  -webkit-user-select: text !important;' +
            '  -moz-user-select: text !important;' +
            '  -ms-user-select: text !important;' +
            '  pointer-events: auto !important;' +
            '  cursor: text !important;' +
            '}';
        document.head.appendChild(style);
    }

    /* =============================================
       Initialization
       ============================================= */
    function init() {
        enableRightClick();
        enableCopy();
        removeCopyProtectionMessages();
        removeDragRestrictions();
        removeAntiCopyCSS();

        var mutationObserver = new MutationObserver(function(mutations) {
            for (var i = 0; i < mutations.length; i++) {
                var addedNodes = mutations[i].addedNodes;
                for (var j = 0; j < addedNodes.length; j++) {
                    var node = addedNodes[j];
                    if (node.nodeType !== 1) continue;

                    if (node.classList &&
                        (node.classList.contains('text-protection') ||
                         node.classList.contains('no-right-click') ||
                         node.hasAttribute('data-no-select') ||
                         node.hasAttribute('oncontextmenu'))) {
                        removeCopyProtectionMessages();
                        node.style.userSelect = 'text';
                        node.style.cursor = 'text';
                    }
                }
            }
        });

        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style', 'data-no-select', 'oncontextmenu']
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

// ==UserScript==
// @name         Absolute Enable Right Click & Copy
// @name:en      Absolute Enable Right Click & Copy
// @name:pt-BR   Absolute Enable Right Click & Copy
// @namespace    https://greasyfork.org/pt-BR/users/1301195-luciano-inf
// @version      2.0
// @author       Luciano.Oliveirals
// @license      MIT
// @run-at       document-body
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @match        *://*/*
// @icon         https://raw.githubusercontent.com/LucianoSkx/absolute-enable-right-click-violentmonkey/main/icon.svg
// @supportURL   https://greasyfork.org/pt-BR/scripts/588000-absolute-enable-right-click-copy
// @homepageURL  https://github.com/LucianoSkx/absolute-enable-right-click-violentmonkey
// @description Ativa clique direito e cópia em qualquer site, removendo proteções de seleção e menu de contexto. Use o atalho Ctrl+Shift+R para alternar.
// @description:en Enable right click and copy on any website, removing selection and context menu protections. Use Ctrl+Shift+R to toggle.
// @description:pt-BR Ativa clique direito e cópia em qualquer site, removendo proteções de seleção e menu de contexto. Use Ctrl+Shift+R para alternar.
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'isEnabled';
    const DEFAULT_ENABLED = true;

    let isEnabled = GM_getValue(STORAGE_KEY, DEFAULT_ENABLED);

    function setIsEnabled(value) {
        isEnabled = value;
        GM_setValue(STORAGE_KEY, isEnabled);
        GM_notification({
            text: isEnabled
                ? 'Absolute Enable Right Click: ATIVADO'
                : 'Absolute Enable Right Click: DESATIVADO',
            timeout: 1500
        });
    }

    function toggle() {
        setIsEnabled(!isEnabled);
        if (isEnabled) {
            applyAll();
        } else {
            removeAll();
        }
    }

    GM_registerMenuCommand('✅ Ativar script', () => setIsEnabled(true) && applyAll());
    GM_registerMenuCommand('❌ Desativar script', () => setIsEnabled(false) && removeAll());
    GM_registerMenuCommand('🔄 Alternar ativação', () => toggle());

    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'r') {
            e.preventDefault();
            toggle();
        }
    }, true);

    /* =============================================
       State management
       ============================================= */
    const state = {
        styleElements: [],
        observer: null,
        eventListeners: []
    };

    function createStyle(cssText) {
        const style = document.createElement('style');
        style.textContent = cssText;
        document.head.appendChild(style);
        state.styleElements.push(style);
        return style;
    }

    function removeStyles() {
        state.styleElements.forEach(function(style) {
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        });
        state.styleElements = [];
    }

    function removeObserver() {
        if (state.observer) {
            state.observer.disconnect();
            state.observer = null;
        }
    }

    /* =============================================
       Enable right-click
       ============================================= */
    function enableRightClick() {
        function onContextMenu(e) {
            e.stopPropagation();
        }
        document.addEventListener('contextmenu', onContextMenu, true);
        state.eventListeners.push({ type: 'contextmenu', listener: onContextMenu });

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

        createStyle(
            '* {' +
            '  user-select: text !important;' +
            '  -webkit-user-select: text !important;' +
            '  -moz-user-select: text !important;' +
            '  -ms-user-select: text !important;' +
            '  cursor: text !important;' +
            '  pointer-events: auto !important;' +
            '}'
        );
    }

    /* =============================================
       Enable copy
       ============================================= */
    function enableCopy() {
        function onCopy(e) {
            var selection = window.getSelection();
            if (selection && selection.toString().trim().length > 0) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }
        function onCut(e) {
            var selection = window.getSelection();
            if (selection && selection.toString().trim().length > 0) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }
        document.addEventListener('copy', onCopy, true);
        document.addEventListener('cut', onCut, true);
        state.eventListeners.push({ type: 'copy', listener: onCopy });
        state.eventListeners.push({ type: 'cut', listener: onCut });
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
        function onDragStart(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        function onSelectStart(e) {
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
        }
        document.addEventListener('dragstart', onDragStart, true);
        document.addEventListener('selectstart', onSelectStart, true);
        state.eventListeners.push({ type: 'dragstart', listener: onDragStart });
        state.eventListeners.push({ type: 'selectstart', listener: onSelectStart });
    }

    /* =============================================
       Remove common anti-copy CSS classes
       ============================================= */
    function removeAntiCopyCSS() {
        createStyle(
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
            '}'
        );
    }

    /* =============================================
       MutationObserver for dynamic content
       ============================================= */
    function startObserver() {
        state.observer = new MutationObserver(function(mutations) {
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

        state.observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style', 'data-no-select', 'oncontextmenu']
        });
    }

    /* =============================================
       Apply / Remove all protections
       ============================================= */
    function applyAll() {
        removeCopyProtectionMessages();
        enableRightClick();
        enableCopy();
        removeDragRestrictions();
        removeAntiCopyCSS();
        startObserver();
    }

    function removeAll() {
        removeStyles();
        removeObserver();
        state.eventListeners = [];
    }

    /* =============================================
       Initialization
       ============================================= */
    function init() {
        if (isEnabled) {
            applyAll();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

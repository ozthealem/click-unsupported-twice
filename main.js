'use strict';

/*
 * Click Unsupported Twice - an Obsidian plugin.
 * Copyright (C) 2026  Ozgur Serdar
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version. See the LICENSE file for details.
 */

const { Plugin } = require('obsidian');

// Extensions Obsidian can open natively - we DON'T touch these; they keep
// their normal behavior. Everything else counts as "unsupported" and follows
// the rule: single click = select, double click = open in the default app.
const NATIVE = new Set([
  'md', 'txt', 'pdf', 'canvas', 'base', 'json',
  'png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg', 'webp', 'avif',
  'mp3', 'wav', 'm4a', 'ogg', '3gp', 'flac',
  'mp4', 'webm', 'ogv', 'mov', 'mkv'
]);

function extOf(path) {
  if (!path || !path.includes('.')) return '';
  return path.split('.').pop().toLowerCase();
}

function isUnsupported(path) {
  const ext = extOf(path);
  return ext && !NATIVE.has(ext);
}

module.exports = class ClickUnsupportedTwice extends Plugin {
  onload() {
    // --- SINGLE CLICK: don't open the unsupported file, just select it ---
    // We listen in the capture phase so we intercept before Obsidian's own
    // "open" handler runs.
    this.registerDomEvent(document, 'click', (evt) => {
      const titleEl = evt.target.closest('.nav-file-title');
      if (!titleEl) return;

      const path = titleEl.getAttribute('data-path');
      if (!isUnsupported(path)) return; // supported file -> behave normally

      evt.preventDefault();
      evt.stopPropagation();
      this.selectOnly(titleEl);
    }, true);

    // --- DOUBLE CLICK: open the unsupported file in the default app ---
    this.registerDomEvent(document, 'dblclick', (evt) => {
      const titleEl = evt.target.closest('.nav-file-title');
      if (!titleEl) return;

      const path = titleEl.getAttribute('data-path');
      if (!isUnsupported(path)) return;

      evt.preventDefault();
      evt.stopPropagation();
      this.openExternally(path);
    }, true);
  }

  selectOnly(titleEl) {
    const container = this.app.workspace.containerEl;
    container
      .querySelectorAll('.nav-file-title.is-active, .nav-file-title.has-focus')
      .forEach((el) => el.classList.remove('is-active', 'has-focus'));
    titleEl.classList.add('is-active', 'has-focus');
  }

  openExternally(path) {
    // Preferred: Obsidian's own "open in default app" method, if present.
    if (typeof this.app.openWithDefaultApp === 'function') {
      this.app.openWithDefaultApp(path);
      return;
    }
    // Fallback: open the absolute path via the Electron shell.
    try {
      const { shell } = require('electron');
      const full = this.app.vault.adapter.getFullPath(path);
      shell.openPath(full);
    } catch (e) {
      console.error('Click Unsupported Twice: could not open file', e);
    }
  }
};

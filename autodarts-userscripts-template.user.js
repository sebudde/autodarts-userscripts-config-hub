// ==UserScript==
// @id           autodarts-userscripts-template@https://github.com/sebudde/autodarts-userscripts-config-hub
// @name         Autodarts Userscripts Template to use with ADUSCH
// @namespace    https://github.com/sebudde/autodarts-userscripts-config-hub
// @version      0.0.1
// @description  Userscript to provide a config page for play.autodarts.io.
// @author       sebudde / dotty
// @match        https://play.autodarts.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=autodarts.io
// @license      MIT
// @downloadURL  https://github.com/sebudde/autodarts-userscripts-config-hub/raw/main/autodarts-userscripts-template.user.js
// @updateURL    https://github.com/sebudde/autodarts-userscripts-config-hub/raw/main/autodarts-userscripts-template.user.js
// @grant        GM.getValue
// @grant        GM.setValue
// ==/UserScript==

(function() {
  'use strict';

  setTimeout(function () {
    unsafeWindow.observeDOM(document, {}, ['adusch'], () =>  {
      console.log('ADUSCH ready');

      const aduschConfigContainer = document.querySelector('.adusch_configcontainer');

      const myConfig = `
        <section id="mein-script-config">
          <h3>Mein Script</h3>
          <div>
            <label for="mein-script-config-option-1">Option 1</label>
            <input id="mein-script-config-option-1" type="text" value="standard value">
          </div>
          <div>
            <label for="mein-script-config-option-2">Option 2</label>
            <input id="mein-script-config-option-2" type="text" value="standard value">
          </div>
        </section>
        `
      const myConfigContainer = document.createElement('div');
      myConfigContainer.innerHTML = myConfig;
      aduschConfigContainer.append(myConfigContainer)

    });
  }, 0);





})()

// ==UserScript==
// @id           autodarts-userscripts-template@https://github.com/sebudde/autodarts-userscripts-config-hub
// @name         Autodarts Userscripts Template to use with ADUSCH
// @namespace    https://github.com/sebudde/autodarts-userscripts-config-hub
// @version      0.0.2
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

    setTimeout(() => {
        unsafeWindow.observeDOM(document, {}, ['adusch'], async () => {
            console.log('ADUSCH ready');

            let option1avalue = (await GM.getValue('option1a') || '');
            let option1bvalue = (await GM.getValue('option1b') || '');
            let option1cvalue = (await GM.getValue('option1c') || '');
            let option2value = (await GM.getValue('option2') || '');

            let option3value = (await GM.getValue('option3') || true);
            let option4value = (await GM.getValue('option4') || false);
            let option5value = (await GM.getValue('option5') || false);

            const aduschConfigContainer = document.querySelector('.adusch_configcontainer');
            console.log('option3value', option3value);
            const myConfig = `
        <section id="mein-script-config">
          <h3>Mein Script</h3>
          <div>
            <label for="mein-script-config-option1">Option 1a</label>
            <input id="mein-script-config-option1a" placeholder="option 1a" type="text" value="${option1avalue}">
          </div>
          <div>
            <label for="mein-script-config-option1">Option 1b</label>
            <input id="mein-script-config-option1b" placeholder="option 1b" type="text" value="${option1bvalue}">
            <input id="mein-script-config-option1c" placeholder="option 1c" type="text" value="${option1cvalue}">
          </div>
          <div>
            <label for="mein-script-config-option2">Option 2</label>
            <input id="mein-script-config-option2" class="xl" placeholder="option 2" type="text" value="${option2value}">
          </div>
           <div>
            <label for="mein-script-config-option3">Options</label>
            <button id="mein-script-config-option3" class="${option3value ? 'active' : ''}" type="button" value="${option3value}">${option3value}</button>
            <button id="mein-script-config-option4" class="${option4value ? 'active' : ''}" type="button" value="${option4value}">${option4value}</button>
          </div>
           <div>
            <label for="mein-script-config-option5" class="xl">Option with a long title</label>
            <button id="mein-script-config-option5" class="${option5value ? 'active' : ''}" type="button" value="${option5value}">${option5value ? 'ON' : 'OFF'}</button>
          </div>
        </section>
        `;
            const myConfigContainer = document.createElement('div');
            myConfigContainer.innerHTML = myConfig;
            aduschConfigContainer.append(myConfigContainer);

            const inputEl = myConfigContainer.querySelectorAll('input');
            [...inputEl].forEach((el) => (el.addEventListener('blur', (e) => {
                GM.setValue(e.target.id.split('config-')[1], e.target.value);
            })));

            const buttonEl = myConfigContainer.querySelectorAll('button');
            [...buttonEl].forEach((el) => (el.addEventListener('click', (e) => {
                const targetKey = e.target.id.split('config-')[1];
                const newBtnValue = e.target.value !== 'true';
                e.target.value = newBtnValue;
                e.target.innerText = newBtnValue;
                if (targetKey === 'option5') e.target.innerText = newBtnValue ? 'ON' : 'OFF';
                e.target.classList.toggle('active', newBtnValue);
                GM.setValue(targetKey, newBtnValue);
            })));

        });
    }, 0);

})();

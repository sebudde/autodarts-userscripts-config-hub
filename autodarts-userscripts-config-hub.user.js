// ==UserScript==
// @id           autodarts-userscripts-config-hub@https://github.com/sebudde/autodarts-userscripts-config-hub
// @name         Autodarts Userscripts Config Hub (ADUSCH)
// @namespace    https://github.com/sebudde/autodarts-userscripts-config-hub
// @version      0.0.1
// @description  Userscript to provide a config page for play.autodarts.io.
// @author       sebudde / dotty
// @match        https://play.autodarts.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=autodarts.io
// @license      MIT
// @downloadURL  https://github.com/sebudde/autodarts-userscripts-config-hub/raw/main/autodarts-userscripts-config-hub.user.js
// @updateURL    https://github.com/sebudde/autodarts-userscripts-config-hub/raw/main/autodarts-userscripts-config-hub.user.js
// @grant        GM.getValue
// @grant        GM.setValue
// ==/UserScript==

(async function() {
    'use strict';

    //////////////// CONFIG END ////////////////////

    const readyClasses = {
        play: 'css-1lua7td',
        lobbies: 'css-1q0rlnk',
        table: 'css-p3eaf1', // matches & boards
        match: 'css-ul22ge',
        matchHistory: 'css-10z204m'
    };

    let firstLoad = true;

    let configPathName = '/config';
    const pageContainer = document.createElement('div');

    const observeDOM = (function() {
        const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

        return function(obj, callback) {
            if (!obj || obj.nodeType !== 1) return;
            const mutationObserver = new MutationObserver(callback);
            mutationObserver.observe(obj, {
                attributes: true,
                childList: true,
                subtree: true
            });
            return mutationObserver;
        };
    })();

    //////////////// CSS classes start ////////////////////
    const adp_style = document.createElement('style');
    adp_style.type = 'text/css';
    adp_style.innerHTML = `
        body {
          /* mobile viewport bug fix */
          min-height: -webkit-fill-available!important;
        }
        html {
          height: -webkit-fill-available;
        }
        #root {
            height: 100vh;
        }
        .adp_config-header {
              font-weight: 700;
              align-self: flex-start;
        }
        h2.adp_config-header { font-size: 1.5em; }
        h3.adp_config-header { font-size: 1.2em; }
    `;
    document.getElementsByTagName('head')[0].appendChild(adp_style);

    let headerEl;
    let mainContainerEl;

    const setActiveAttr = (el, isActive) => {
        if (isActive) {
            el.setAttribute('data-active', '');
            el.classList.add('active');
        } else {
            el.removeAttribute('data-active');
            el.classList.remove('active');
        }
    };

    ////////////////   ////////////////////

    const onDOMready = async () => {
        console.log('firstLoad', firstLoad);
        headerEl = document.querySelector('.css-gmuwbf');
        mainContainerEl = document.querySelectorAll('#root > div')[1];

        let hideHeaderGM = await GM.getValue('hideHeader');
        headerEl.style.display = hideHeaderGM ? 'none' : 'flex';
        mainContainerEl.style.height = hideHeaderGM ? '100%' : 'calc(-72px + 100%)';
        mainContainerEl.children[0].style.height = '100%';

        if (firstLoad) {
            firstLoad = false;

            //////////////// add config page  ////////////////////

            pageContainer.classList.add('css-gmuwbf');
            const configContainer = document.createElement('div');
            configContainer.classList.add('css-10z204m');
            pageContainer.appendChild(configContainer);
            pageContainer.style.display = 'none';

            const configHeader = document.createElement('h2');
            configHeader.classList.add('adp_config-header');
            configHeader.innerText = 'Config';
            configContainer.appendChild(configHeader);

            //////////////// add menu  ////////////////////
            const menuBtn = document.createElement('a');
            menuBtn.classList.add('css-1nlwyv4');
            menuBtn.classList.add('adp_menu-btn');
            menuBtn.innerText = 'Config';
            menuBtn.style.cursor = 'pointer';
            const menuContainer = document.querySelector('.css-1igwmid');
            menuContainer.appendChild(menuBtn);

            [...document.querySelectorAll('.css-1nlwyv4')].forEach((el) => (el.addEventListener('click', async (event) => {
                document.querySelector('#root > div:nth-of-type(2)').style.display = 'flex';
                pageContainer.style.display = 'none';
                if (event.target.classList.contains('adp_menu-btn')) {
                    // switch to page "Matches History" because we need its CSS
                    menuContainer.querySelector('a:nth-of-type(4)').click();
                    window.history.pushState(null, '', configPathName);
                }

            }, false)));

        }

        console.log('DOM ready');
    };

    ////////////////  end ////////////////////

    const handleConfigPage = () => {
        console.log('config ready');
        document.querySelector('#root > div:nth-of-type(2)').style.display = 'none';
        pageContainer.style.display = 'flex';
    };

    const handleMatchHistory = () => {
        console.log('matchHistory ready');
        if (location.pathname === configPathName) {
            handleConfigPage();
        }
    };

    const readyClassesValues = Object.values(readyClasses);

    observeDOM(document.getElementById('root'), function(mutationrecords) {
        mutationrecords.some((record) => {
            if (record.addedNodes.length && record.addedNodes[0].classList?.length) {
                const elemetClassList = [...record.addedNodes[0].classList];
                return elemetClassList.some((className) => {
                    if (className.startsWith('css-')) {
                        // console.log('className', className);
                        if (!readyClassesValues.includes(className)) return false;
                        const key = Object.keys(readyClasses).find((key) => readyClasses[key] === className);
                        if (key) {
                            onDOMready();
                            if (key === 'matchHistory') handleMatchHistory()
                            return true;
                        }
                    }
                });
            }
        });
    });
})();

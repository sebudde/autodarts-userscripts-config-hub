// ==UserScript==
// @id           autodarts-userscripts-config-hub@https://github.com/sebudde/autodarts-userscripts-config-hub
// @name         Autodarts Userscripts Config Hub (ADUSCH)
// @namespace    https://github.com/sebudde/autodarts-userscripts-config-hub
// @version      0.0.3
// @description  Userscript to provide a config page for play.autodarts.io.
// @author       sebudde / dotty
// @match        https://play.autodarts.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=autodarts.io
// @license      MIT
// @downloadURL  https://github.com/sebudde/autodarts-userscripts-config-hub/raw/main/autodarts-userscripts-config-hub.user.js
// @updateURL    https://github.com/sebudde/autodarts-userscripts-config-hub/raw/main/autodarts-userscripts-config-hub.user.js
// ==/UserScript==

(function() {
    'use strict';

    unsafeWindow.observeDOM = (() => {
        const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        const observerOptions = {
            attributes: true,
            childList: true,
            subtree: true
        };

        return (obj = document, options = {}, classList = [], callback) => {
            if (!obj) return;
            const mutationObserver = new MutationObserver((mutationrecords) => {
                mutationrecords.some((record) => {
                    if (record.addedNodes.length && record.addedNodes[0].classList?.length) {
                        const elementClassList = [...record.addedNodes[0].classList];
                        return elementClassList.some((className) => {
                            if (classList?.length) {
                                if (classList.includes(className)) {
                                    callback && callback(className);
                                    return true;
                                }
                            } else {
                                callback && callback(className);
                            }
                        });
                    }
                });
            });
            mutationObserver.observe(obj, {
                ...observerOptions, ...options
            });
            return mutationObserver;
        };
    })();

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
    const aduschPageContainer = document.createElement('div');

    //////////////// CSS classes start ////////////////////
    const adusch_style = document.createElement('style');
    adusch_style.type = 'text/css';
    adusch_style.innerHTML = `
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
        .adusch h2, .adusch h3 {
              font-weight: 700;
              align-self: flex-start;
        }
        .adusch h2 { font-size: 1.5em; }
        .adusch h3 { font-size: 1.2em; }
        .adusch_configcontainer > div {
            width: 100%;
        }
        .adusch_configcontainer section {
            display: flex;
            flex-direction: column;
            gap: var(--chakra-space-4);
        }
        .adusch_configcontainer section > div {
            display: flex;
            gap: 2rem;
            align-items: center;
        }
        .adusch_configcontainer section label {
            width: 86px;
            margin-right: 1rem;
            font-weight: 700;
        }
        .adusch_configcontainer section input {
            width: 300px;
            height: var(--input-height);
            font-size: var(--input-font-size);
            padding-inline-start: var(--input-padding);
            padding-inline-end: var(--input-padding);
            border-radius: var(--input-border-radius);
            min-width: 0px;
            outline: transparent solid 2px;
            outline-offset: 2px;
            position: relative;
            appearance: none;
            transition-property: var(--chakra-transition-property-common);
            transition-duration: var(--chakra-transition-duration-normal);
            --input-font-size: var(--chakra-fontSizes-md);
            --input-padding: var(--chakra-space-4);
            --input-border-radius: var(--chakra-radii-md);
            --input-height: var(--chakra-sizes-10);
            border-width: 1px;
            border-style: solid;
            border-image: initial;
            border-color: inherit;
            background: inherit;
        }

        .adusch_configcontainer section input:focus-visible, .adusch_configcontainer section input[data-focus-visible] {
            z-index: 1;
            border-color: rgb(99, 179, 237);
            box-shadow: rgb(99, 179, 237) 0px 0px 0px 1px;
        }
    `;
    document.getElementsByTagName('head')[0].appendChild(adusch_style);

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

        if (firstLoad) {
            firstLoad = false;

            //////////////// add config page  ////////////////////
            aduschPageContainer.classList.add('css-gmuwbf');
            aduschPageContainer.classList.add('adusch');
            aduschPageContainer.classList.add('adusch_pagecontainer');
            const aduschConfigContainer = document.createElement('div');
            aduschConfigContainer.classList.add('css-10z204m');
            aduschConfigContainer.classList.add('adusch_configcontainer');
            aduschPageContainer.appendChild(aduschConfigContainer);
            aduschPageContainer.style.display = 'none';

            const aduschConfigHeader = document.createElement('h2');
            aduschConfigHeader.innerText = 'Autodarts Userscripts Config Hub';
            aduschConfigContainer.appendChild(aduschConfigHeader);

            document.getElementById('root').appendChild(aduschPageContainer);

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
                aduschPageContainer.style.display = 'none';
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
        aduschPageContainer.style.display = 'flex';
    };

    const handleMatchHistory = () => {
        console.log('matchHistory ready');
        if (location.pathname === configPathName) {
            handleConfigPage();
        }
    };

    const readyClassesValues = Object.values(readyClasses);

    observeDOM(document.getElementById('root'), {}, readyClassesValues, (className) => {
        if (className.startsWith('css-')) {
            // console.log('className', className);
            if (!readyClassesValues.includes(className)) return false;
            const key = Object.keys(readyClasses).find((key) => readyClasses[key] === className);
            if (key) {
                onDOMready();
                if (key === 'matchHistory') {
                    handleMatchHistory();
                }
            }
        }
    });

    // observeDOM(document.getElementById('root'), {}, [], (className) =>  {
    //     console.log('className',className);
    // });
})();

/**
 * @name Lazy Load
 * @author PLEJ
 */

'use strict';
const lazyLoad = (() => {
    let images = [];
    let iObserver;
    const selector = '[data-lazy-src]';
    const plug = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIyLjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MDAgNTAwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MDAgNTAwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe29wYWNpdHk6MC4xO2ZpbGw6IzU4Mzc4Nzt9Cgkuc3Qxe2ZpbGw6IzU4Mzc4Nzt9Cjwvc3R5bGU+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00ODcsNDkwSDExYy0xLjEsMC0yLTAuOS0yLTJWMTJjMC0xLjEsMC45LTIsMi0yaDQ3NmMxLjEsMCwyLDAuOSwyLDJ2NDc2QzQ4OSw0ODkuMSw0ODguMSw0OTAsNDg3LDQ5MHoiLz4KPGc+Cgk8Zz4KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMzAyLjMsMzExLjNIMTk1LjdjLTQuNCwwLTgtMy42LTgtOFYxOTYuN2MwLTQuNCwzLjYtOCw4LThoMTA2LjdjNC40LDAsOCwzLjYsOCw4djEwNi43CgkJCUMzMTAuMywzMDcuNywzMDYuNywzMTEuMywzMDIuMywzMTEuM3ogTTE5NS43LDE5NGMtMS41LDAtMi43LDEuMi0yLjcsMi43djEwNi43YzAsMS41LDEuMiwyLjcsMi43LDIuN2gxMDYuNwoJCQljMS41LDAsMi43LTEuMiwyLjctMi43VjE5Ni43YzAtMS41LTEuMi0yLjctMi43LTIuN0gxOTUuN3oiLz4KCTwvZz4KCTxnPgoJCTxwb2x5Z29uIGNsYXNzPSJzdDEiIHBvaW50cz0iMjk1LjEsMjc4LjYgMjY1LDI0OC40IDI1OC45LDI1NC42IDI1NS4xLDI1MC44IDI2NSwyNDAuOSAyOTguOSwyNzQuOCAJCSIvPgoJPC9nPgoJPGc+CgkJPHBvbHlnb24gY2xhc3M9InN0MSIgcG9pbnRzPSIyMDIuOSwyNzMuMiAxOTkuMSwyNjkuNCAyMzcsMjMxLjYgMjY0LjIsMjU4LjggMjYwLjQsMjYyLjYgMjM3LDIzOS4xIAkJIi8+Cgk8L2c+Cgk8Zz4KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjg2LjMsMjQ0LjdjLTUuOSwwLTEwLjctNC44LTEwLjctMTAuN3M0LjgtMTAuNywxMC43LTEwLjdTMjk3LDIyOC4xLDI5NywyMzRTMjkyLjIsMjQ0LjcsMjg2LjMsMjQ0Ljd6CgkJCSBNMjg2LjMsMjI4LjdjLTIuOSwwLTUuMywyLjQtNS4zLDUuM3MyLjQsNS4zLDUuMyw1LjNjMi45LDAsNS4zLTIuNCw1LjMtNS4zUzI4OS4zLDIyOC43LDI4Ni4zLDIyOC43eiIvPgoJPC9nPgo8L2c+Cjwvc3ZnPgo=';

    const config = {
        rootMargin: '300px 0px',
        threshold: 0.01
    };

    /**
     * @function Init
     */
    const init = () => {
        initEvents();

        document.querySelectorAll(selector).forEach(getElement);

        new (window.MutationObserver || window.WebKitMutationObserver)(
            (mutationList) => {
                mutationList.forEach(
                    ( mutation ) => mutation.addedNodes.forEach( (elem) => {
                        if (!elem || !elem.matches ) return;

                        if (elem.matches(selector))
                            return getElement(elem);

                        elem.querySelectorAll(selector).forEach(getElement);
                    } )
                )
            }
        ).observe(
            document.body,
            {
                childList : true,
                subtree: true
            }
        );
    };

    /**
     * @function Init Events
     */
    const initEvents = () => {
        if ('IntersectionObserver' in window) {
            iObserver = new IntersectionObserver(handleIntersection, config);
        } else {
            window.addEventListener('scroll', ()=> {
                images.forEach(image => checkSingle(image));
            });
        }
    };

    /**
     * Get elements
     * @param {object} element
     */
    const getElement = (element) => {
        images.push(element);
        // placeholder(element);

        if ('IntersectionObserver' in window) {
            iObserver.observe(element);
        } else {
            checkSingle(element);
        }
    };

    /**
     * @desc set image placeholder, if not has
     * @param {object} image
     */
    const placeholder = (image) => {
        if (!image.hasAttribute('src') && !image.hasAttribute('srcset')) {
            image.src = plug;
        }
    };

    /**
     * Load image
     * @param {object} image
     */
    const loadImage = (image) => {
        const src = image.dataset.lazySrc;
        if (!src) return;

        let attrName;

        switch (image.tagName) {
            case 'SOURCE':
                attrName = 'srcset';
                break;
            case 'VIDEO':
                attrName = 'poster';
                break;
            default:
                attrName = 'src';
        }

        image.setAttribute( attrName, src );
        image.removeAttribute('data-lazy-src');
    };


    /**
     * Handle intersection
     * @param {array} entries
     */
    const handleIntersection = (entries) => {
        entries.forEach(entry => {
            if (entry.intersectionRatio > 0) {
                iObserver.unobserve(entry.target);
                loadImage(entry.target);
            }
        });
    };

    /**
     * @desc Check position single image
     */
    const _checkPosition = (image) => {
        return image.getBoundingClientRect().top * 0.3 <= window.innerHeight;
    };

    /**
     * Check single
     * @desc check single element when document load
     * @param {array} element
     */
    const checkSingle = (image) => {
        if (_checkPosition(image)) {
            loadImage(image);
        }
    };

    return {
        init: init
    };
})();

export {lazyLoad}

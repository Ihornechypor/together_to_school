/**
 * @name Lazy Load
 * @author PLEJ
 */

'use strict';
const lazyBg = (() => {
    let _o;

    const init = () => {
        _o = {
            selector: '[data-lazy-bg]',
            observer: {
                iObserver: null,
                config: {
                    rootMargin: '300px 0px',
                    threshold: 0.01
                }
            },
            elements: [],
            webpSupported: chechWebpSupport()
        };

        initEvents();
        document.querySelectorAll(_o.selector).forEach(getElement);
    };

    const chechWebpSupport = () => {
        const elem = document.createElement('canvas');

        if (!!(elem.getContext && elem.getContext('2d'))) {
            const testString = (!(window.mozInnerScreenX == null)) ? 'png' : 'webp';
            return elem.toDataURL('image/webp').indexOf('data:image/' + testString) === 0;
        }
        return false;
    };

    const initEvents = () => {
        if ('IntersectionObserver' in window) {
            // console.log('IntersectionObserver')
            _o.observer.iObserver = new IntersectionObserver(handleIntersection, _o.observer.config);
        } else {
            window.addEventListener('scroll', ()=> _o.elements.forEach(element => checkSingle(element)));
        }
    };

    const getParams = (element) => {
        const value = element.getAttribute('data-lazy-bg');
        const replaced = value.replace(/'/g, '"');

        return JSON.parse(replaced);
    };

    const getElement = (element) => {
        _o.elements.push(element);
        setPlaceholder(element);

        if ('IntersectionObserver' in window) {
            _o.observer.iObserver.observe(element);
        } else {
            checkSingle(element);
        }
    };

    const getExtension = (item)=> {
        let ext = '';
        item.ext.forEach((singleExt)=> {
            if (singleExt === 'webp' && _o.webpSupported) {
                ext = 'webp';
            }

            if (singleExt !== 'webp' && !_o.webpSupported) {
                ext = singleExt;
            }
        });
        return ext;
    };

    const setPlaceholder = (element) => {
        const params = getParams(element);

        params.forEach((item) => {
            if (!item.plch) return;

            element.style.setProperty(
              "--" + item.var,
              'url("' + document.location.pathname + item.url + item.plch + '.' + getExtension(item) + '")'
            );
        })
    };

    const setImage = (element) => {
        const params = getParams(element);

        if (element.hasAttribute('data-lazy-init')) return;

        params.forEach((item) => {
            if (!item.img) return;

            const image = new Image();
            const src = document.location.pathname + item.url + item.img + '.' + getExtension(item);
            image.src = src;

            image.onload = () => {
                element.style.setProperty(
                  "--" + item.var,
                  'url("' + src + '")'
                );

                element.setAttribute('data-lazy-init', true);
                element.removeAttribute('data-lazy-bg');
            }
        })
    };

    const handleIntersection = (entries) => {
        entries.forEach(entry => {
            if (entry.intersectionRatio > 0) {
                _o.observer.iObserver.unobserve(entry.target);
                setImage(entry.target);
            }
        });
    };

    const _checkPosition = (element) => {
        return element.getBoundingClientRect().top * 0.3 <= window.innerHeight;
    };

    const checkSingle = (element) => {
        if (_checkPosition(element)) setImage(element);
    };

    return {
        init
    };
})();

export {lazyBg}

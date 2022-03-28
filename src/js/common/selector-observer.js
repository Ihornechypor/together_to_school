/**
 * P4 - [Core] Selector observer
 * Created by AK
 *
 * Using example:
 * selectorObserver('[data-selector-name]', ()=> { doSomething() });
 *
 * Don't abuse this function!
 */

function selectorObserver( target = '', callback = () => {}, options = {} ) {
    const config = {
        observerOptions: {
            attributes: false,
            childList : true,
            subtree   : true
        },
        containerSelector: 'body',
        processOnce      : true
    };
    let o = Object.assign( {}, config, options );

    let containerObserver = document.querySelector( o.containerSelector );
    if ( !containerObserver || !target ) return;

    processObserverElements(target, callback, o);

    let MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    let observer = new MutationObserver( ( ) => {
        processObserverElements(target, callback, o);
    } );

    observer.observe( containerObserver, o.observerOptions );
}

function processObserverElements(target, callback, o) {
    let elements = [...document.querySelectorAll( target )];

    if ( o.processOnce )
        elements = elements.filter( ( e ) => !e.getAttribute( 'element' ) );

    elements
        .forEach( ( element ) => {
            o.processOnce && element.setAttribute(
                'element',
                target
                    .split(",")[0]
                    .replace( 'data-', '' )
                    .replace( '#', '' )
                    .replace( '.', '' )
                    .replace( '[', '' )
                    .replace( ']', '' )
            );

            callback( element );
        } );
}

window.selectorObserver = selectorObserver;

export { selectorObserver };
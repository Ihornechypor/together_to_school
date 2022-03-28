/**
 * browserDetect
 * @author PLEJ
 */

const browserDetect = {
  o: {},

  init: function () {
    this.o = { html: document.getElementsByTagName( 'html' )[0] };
    this.check( navigator.userAgent );
  },

  check: function ( navigator ) {
    if ( navigator.indexOf( 'MSIE' ) >= 0 ) {
      this.setClass( 'is-ie' );
    } else if ( navigator.indexOf( 'Chrome' ) >= 0 ) {
      this.setClass( 'is-chrome' );
    } else if ( navigator.indexOf( 'Firefox' ) >= 0 ) {
      this.setClass( 'is-firefox' );
    } else if ( navigator.indexOf( 'Safari' ) >= 0 && navigator.indexOf( 'Chrome' ) < 0 ) {
      this.setClass( 'is-safari' );
    } else if ( navigator.indexOf( 'Opera' ) >= 0 ) {
      this.setClass( 'is-opera' );
    }
  },

  /**
   * @function setClass
   * @desc
   */
  setClass: function ( name ) {
    this.o.html.classList.add( name );
  }
};

export { browserDetect }
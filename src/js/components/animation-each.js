/**
 * animationEach
 * @author PLEJ
 */

const animationEach = (() => {
  /**
   * Init functionality
   */
  const init = () =>
    document.querySelectorAll('[data-animate-each]').forEach(initEvents);

  const initEvents = (element) => {
    initEach(element); // if element is already on viewport
    window.addEventListener('scroll', () => initEach(element));
  };

  const initEach = (element) => {
    const tempTimeout = element.getAttribute('data-animate-timeout');
    const timeout = tempTimeout ? tempTimeout : 300;
    const top = element.getBoundingClientRect().top;
    const items = element.querySelectorAll('[data-animate-item]');

    if (top <= window.innerHeight) {
      element.hasAttribute('data-animate-item') &&
        element.classList.add('animated');

      for (let j = 0; j < items.length; j++) {
        let item = items[j];

        setTimeout(() => {
          item.classList.add('animated');
        }, j * timeout);
      }
    } else if (element.getAttribute('data-animate-each') === 'repeat') {
      for (let k = 0; k < items.length; k++) {
        let item = items[k];

        item.classList.remove('animated');
      }
    }
  };

  return {
    init: init
  };
})();

export { animationEach };

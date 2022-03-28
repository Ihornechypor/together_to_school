/**
 * @author PLEJ
 */

import { breakpoint } from '../common/breakpoint';

export const customSmoothScroll = (() => {
  /**
   * @function Init
   * @desc Update {object} & initEvents
   */
  const init = () => {
    document
      .querySelectorAll('[data-smooth-scroll]')
      .forEach((el) => initEvents(el));
  };

  /**
   * @function initEvents
   * @desc Init all function events
   */
  const initEvents = (trigger) => {
    trigger.addEventListener('click', smoothScroll.bind(this));
  };

  /**
   * @function smoothScroll
   * @desc scroll to target element
   */
  const smoothScroll = (event) => {
    event.preventDefault();

    const trigger = event.currentTarget;
    const id = trigger.hash;

    const offset =
      Number(
        breakpoint.large('up')
          ? trigger.dataset.smoothScrollOffset
          : trigger.dataset.smoothScrollOffsetMob
      ) || 0;

    if (!id) return;

    scrollIt(document.querySelector(id), 300, offset);
  };

  const scrollIt = (destination, duration, offset) => {
    const start = window.pageYOffset;
    const startTime =
      'now' in window.performance ? performance.now() : new Date().getTime();

    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
    const windowHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.getElementsByTagName('body')[0].clientHeight;
    const destinationOffset =
      typeof destination === 'number'
        ? destination
        : destination.getBoundingClientRect().top + window.pageYOffset;
    const destinationOffsetToScroll =
      Math.round(
        documentHeight - destinationOffset < windowHeight
          ? documentHeight - windowHeight
          : destinationOffset
      ) + offset;

    if ('requestAnimationFrame' in window === false) {
      window.scroll(0, destinationOffsetToScroll);

      return;
    }

    const scroll = () => {
      const now =
        'now' in window.performance ? performance.now() : new Date().getTime();
      const time = Math.min(1, (now - startTime) / duration);
      window.scroll(
        0,
        Math.ceil(time * (destinationOffsetToScroll - start) + start)
      );

      //fix for browser zoom bug (scroll freeze)
      const pageY = Math.ceil(window.pageYOffset);

      if (
        pageY === destinationOffsetToScroll ||
        pageY === destinationOffsetToScroll - 1 ||
        pageY === destinationOffsetToScroll + 1
      )
        return;

      window.requestAnimationFrame(scroll);
    };

    scroll();
  };

  return {
    init: init
  };
})();

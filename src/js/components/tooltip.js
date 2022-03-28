/**
 * P4 - MODULES [General] - Tooltip
 * @author PLEJ
 */
import { selectorObserver } from './selector-observer';
import { breakpoint } from '../common/breakpoint';

const customTooltip = {
  o: {},

  /**
   * @function Init
   * @desc Update {object} & initEvents
   */
  init: function () {
    this.o = {
      tooltip: [],
      counter: 0,

      classes: {
        trigger: 'tooltip-trigger',
        target: 'tooltip-content',
        floatedLeft: 'floated-left',
        floatedCenter: 'floated-center', //UNUSED
        floatedUp: 'floated-up',
        active: 'active'
      }
    };

    let processElement = (element) => {
      if (!element || !element.dataset || element.dataset.tooltipInitialized)
        return;

      let tooltip = {};

      tooltip.trigger = element.querySelector('.' + this.o.classes.trigger);
      tooltip.target = element.querySelector('.' + this.o.classes.target);
      tooltip.parent = element;

      if (!tooltip.trigger || !tooltip.target) return;

      this.o.tooltip.push(tooltip);

      this.setAria(tooltip);
      this.targetPlacement(tooltip);
      this.initEvents(tooltip);
      this.checkPosition(tooltip);

      element.dataset.tooltipInitialized = true;
    };

    this._initWindowEvents();

    // document.querySelectorAll('[data-custom-tooltip]').forEach( processElement );
    selectorObserver('[data-custom-tooltip]', processElement);
  },

  /**
   * @function setAria
   * @desc set aria attributes
   */
  setAria: function (tooltip) {
    // let tooltips = this.o.tooltip;

    if (!tooltip.target.id) {
      let targetId = 'tooltip-' + this.o.counter++;
      tooltip.target.id = targetId;
      tooltip.trigger.setAttribute('aria-describedby', targetId);
    }

    // Trigger
    tooltip.trigger.setAttribute('aria-label', 'Dodatkowa informacja?');
    tooltip.trigger.setAttribute('role', 'button');
    tooltip.trigger.setAttribute('aria-expanded', false);

    // Target
    tooltip.target.setAttribute('role', 'tooltip');
  },

  /**
   * @function initEvents
   * @desc Init all function events
   */
  initEvents: function (tooltip) {
    if (breakpoint.large('up')) {
      // tooltip.trigger.addEventListener( 'focus', () => this.onShow( tooltip ) );
      // tooltip.trigger.addEventListener( 'blur', () => setTimeout( () => this.onClose( tooltip ), 100 ) );
      tooltip.trigger.addEventListener('keydown', (e) =>
        this.keyboardControl(e, tooltip)
      );
      tooltip.target.addEventListener('keydown', (e) =>
        this.keyboardControl(e, tooltip)
      );

      tooltip.target.addEventListener(
        'touchstart',
        (e) => e.stopPropagation(),
        { passive: true }
      );
      tooltip.trigger.addEventListener('click', (e) =>
        this.onToggle(e, tooltip)
      );

      // tooltip.target.addEventListener( 'focusin', () => this.customFocus( tooltip ) );
      // tooltip.target.addEventListener( 'focusout', () => this.customBlur( tooltip ) );
    } else {
      tooltip.target.addEventListener(
        'touchstart',
        (e) => e.stopPropagation(),
        { passive: true }
      );
      tooltip.trigger.addEventListener('click', (e) =>
        this.onToggle(e, tooltip)
      );
    }
  },

  /**
   * @function customFocus and customBlur - detect focus in tooltip
   * @desc ...
   */
  customFocus: function (tooltip) {
    tooltip.parent.dataset.tooltipContentIsHighlighted = true;
  },

  customBlur: function (tooltip) {
    let blurEvent = document.createEvent('Event');
    blurEvent.initEvent('blur', true, true);

    tooltip.parent.dataset.tooltipContentIsHighlighted = false;
    tooltip.trigger.dispatchEvent(blurEvent);
  },

  /**
   * @function bodyTouch
   * @desc ...
   */
  bodyTouch: function (event) {
    this.o.tooltip.forEach((tooltip) => {
      if (tooltip.trigger === null) return;

      if (
        event.target !== tooltip.trigger &&
        tooltip.trigger.classList.contains(this.o.classes.active)
      ) {
        tooltip.target.classList.remove(this.o.classes.active);
        tooltip.trigger.classList.remove(this.o.classes.active);
        tooltip.trigger.setAttribute('aria-expanded', false);
      }
    });
  },

  /**
   * @function keyboardControl
   * @desc ...
   */
  keyboardControl: function (event, tooltip) {
    if (event.key === 'Escape') {
      this.onClose(tooltip);
    } else if (['Enter', ' '].includes(event.key)) {
      event.preventDefault();
      this.onToggle(event, tooltip);
    }
  },
  /**
   * @function onToggle
   * @desc ...
   */
  onToggle: function (event, tooltip) {
    event.stopPropagation();

    if (!tooltip.target.classList.contains(this.o.classes.active)) {
      this.onShow(tooltip);
    } else {
      this.onClose(tooltip);
    }
  },

  /**
   * @function onShow
   * @desc ...
   */
  onShow: function (tooltip) {
    this.o.tooltip.forEach(
      (toBeClosed) => toBeClosed !== tooltip && this.onClose(toBeClosed)
    );
    this.checkPosition(tooltip);

    tooltip.trigger.classList.add(this.o.classes.active);
    tooltip.target.classList.add(this.o.classes.active);
    tooltip.trigger.setAttribute('aria-expanded', true);
  },

  /**
   * @function onClose
   * @desc ...
   */
  onClose: function (tooltip) {
    if (tooltip.parent.dataset.tooltipContentIsHighlighted != 'true') {
      tooltip.trigger.classList.remove(this.o.classes.active);
      tooltip.target.classList.remove(this.o.classes.active);
      tooltip.trigger.setAttribute('aria-expanded', false);
    }
  },

  /**
   * @function checkPosition
   * @desc ...
   */
  checkPosition: function (tooltip) {
    let target, rect, targetWidth, targetHeight, offsetTop, offsetLeft;

    if (!tooltip.parent.offsetHeight && !tooltip.parent.offsetWidth) {
      if (tooltip.trigger.classList.contains(this.o.classes.active)) {
        this.onClose(tooltip);
      }
      return;
    }

    target = tooltip.target;

    if (target === null) return;
    // Get rect
    rect = tooltip.parent.getBoundingClientRect();
    offsetLeft = rect.left;
    offsetTop = rect.top;
    targetWidth = target.offsetWidth;
    targetHeight = target.offsetHeight;

    let positionTop = offsetTop - targetHeight;

    target.style.top = positionTop + 'px';
    target.style.left = offsetLeft + 'px';

    // Checking vertical position
    this.checkVertical(target, offsetTop, targetHeight);

    // Checking horizontal position
    this.checkHorizontal(target, offsetLeft, targetWidth);
  },

  checkVertical: function (target, offsetTop, targetHeight) {
    if (offsetTop < targetHeight) {
      target.classList.add('floated-up');
    } else {
      target.classList.remove('floated-up');
    }
  },

  checkHorizontal: function (target, offsetLeft, targetWidth) {
    if (document.body.clientWidth < offsetLeft + targetWidth) {
      target.classList.add('floated-left');
    } else {
      target.classList.remove('floated-left');
    }
  },

  updatePositions: function () {
    this.o.tooltip.forEach((tooltip) => this.checkPosition(tooltip));
  },

  _initWindowEvents: function () {
    window.addEventListener('touchstart', this.bodyTouch.bind(this));
    window.addEventListener('click', this.bodyTouch.bind(this));
    window.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      this.o.tooltip.forEach(this.onClose);
    });
    window.addEventListener('scroll', () => this.updatePositions());
    window.addEventListener('resize', () => this.updatePositions());
  },

  /**
   * move tooltip content to end of body
   *
   * @param element
   */
  targetPlacement: function (tooltip) {
    let target = tooltip.target;
    let targetCopy = target.parentNode.removeChild(target);

    document.body.appendChild(targetCopy);
    tooltip.target = targetCopy;
  }
};

export { customTooltip };

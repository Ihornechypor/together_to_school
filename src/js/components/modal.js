/**
 * P4 - Custom modal
 * Created by AK
 */

const customModal = {
  o: {},

  /**
   * Init
   */
  init: function () {
    this.o = {
      html: document.querySelector('html'),
      pageWrapper: document.querySelector('[data-page-wrapper]'),
      modalTrigger: document.querySelectorAll('[data-open-modal]'),
      modalClose: document.querySelectorAll('[data-close-modal]'),
      modalTarget: document.querySelectorAll('[data-custom-modal]'),

      classes: {
        layerVisible: 'layer-visible',
        modalOpen: 'modal-open',
        openedModal: 'opened-modal',
        thisOpenedModal: 'this-opened-modal',
        tabable: 'modal-tabable',
        closeModal: 'close-modal',
        expanded: 'expanded',
        animated: 'modal-animated',
        innerAnimated: 'inner-animated',
        animateOut: 'animate-out'
      },

      helpers: { focusElements: 'a, button, input, [tabindex="0"]' }
    };

    this.initEvents();
  },

  /**
   * Init events
   */
  initEvents: function () {
    this.o.modalTrigger.forEach((el) => {
      el.addEventListener('click', (event) => this.onClickOpen(event));
      this.setTriggerAria(el);
    });

    this.o.modalClose.forEach((el) => {
      el.addEventListener('click', (event) => this.onClickClose(event));
    });

    this.o.modalTarget.forEach((el) => {
      el.addEventListener('click', (event) => this.overlayClick(event));
      this.setTargetAria(el);
    });

    window.addEventListener('keydown', (event) =>
      this.accessibleKeyboard(event)
    );
  },

  /**
   * set aria attributes
   * @private
   */
  setTargetAria: function (modalTarget) {
    if (modalTarget.classList.contains(this.o.classes.openedModal)) {
      this.o.html.classList.add(this.o.classes.modalOpen);
      this.o.pageWrapper.classList.add(this.o.classes.layerVisible);
      modalTarget.setAttribute('aria-hidden', 'false');
    } else {
      this.o.html.classList.remove(this.o.classes.modalOpen);
      this.o.pageWrapper.classList.remove(this.o.classes.layerVisible);
      modalTarget.setAttribute('aria-hidden', 'true');
    }
  },

  /**
   * set aria attributes
   * @private
   */
  setTriggerAria: function (modalTrigger) {
    let id = modalTrigger.getAttribute('data-open-modal');

    modalTrigger.setAttribute('aria-haspopup', 'true');
    modalTrigger.setAttribute('aria-controls', id);
  },

  /**
   * On Click
   * @private
   */
  onClickOpen: function (event) {
    event.preventDefault();

    let trigger = event.currentTarget;
    let target = trigger.getAttribute('data-open-modal');
    const targetInner = document
      .getElementById(target)
      .querySelector('.modal-inner');
    const topPosition = trigger.getBoundingClientRect().top;
    const leftPosition = trigger.getBoundingClientRect().left;

    targetInner.style.width = trigger.offsetWidth + 'px';
    targetInner.style.height = trigger.offsetHeight + 'px';
    targetInner.style.top = topPosition + 'px';
    targetInner.style.left = leftPosition + 4 + 'px';

    this.onShow(target);
    trigger.classList.add(this.o.classes.thisOpenedModal);

    return false;
  },

  /**
   * On modal show
   * @private
   */
  onShow: function (id) {
    const activeModal = document.querySelector('#' + id);
    const innerModal = activeModal.querySelector('.modal-inner');

    //close other modal if visible
    this.onClickClose();

    this.o.html.classList.add(this.o.classes.modalOpen);
    this.o.pageWrapper.classList.add(this.o.classes.layerVisible);

    activeModal.style.display = 'block';
    activeModal.setAttribute('aria-hidden', 'false');

    setTimeout(function () {
      innerModal.classList.add(customModal.o.classes.innerAnimated);
    }, 0);

    activeModal.setAttribute('tabindex', '0');
    activeModal.classList.add(this.o.classes.openedModal);
    activeModal.focus();

    activeModal.querySelectorAll(this.o.helpers.focusElements).forEach((el) => {
      el.classList.add(this.o.classes.tabable);
    });

    //update modal carousels when modal animation finishes
    setTimeout(function () {
      customModal.afterOpenModal(activeModal);
    }, 400);

    return false;
  },

  /**
   * Update modal carousels after modal open
   */

  afterOpenModal: function (activeModal) {
    let hasItemsCarousel = activeModal.querySelector('[data-items-carousel]');
    let hasFlexslider = activeModal.querySelector('[data-basic-flexslider]');
    let hasTooltip = activeModal.querySelector('[data-custom-tooltip]');

    if (hasItemsCarousel) itemsCarousel._carouselUpdate();

    if (hasFlexslider) hasFlexslider.dispatchEvent(new CustomEvent('resize'));

    if (hasTooltip) customTooltip.updatePositions();
  },

  /**
   * On Click
   * @private
   */
  onClickClose: function () {
    const activeModal = document.querySelector(
      '[data-custom-modal].opened-modal'
    );

    if (!activeModal) return;

    let innerModal = activeModal.querySelector('.modal-inner');

    innerModal.classList.add(this.o.classes.animateOut);

    this.o.html.classList.remove(this.o.classes.modalOpen);
    this.o.pageWrapper.classList.remove(this.o.classes.layerVisible);
    activeModal.classList.remove(
      this.o.classes.openedModal,
      this.o.classes.animated
    );
    innerModal.classList.remove(this.o.classes.innerAnimated);

    document.querySelectorAll('.' + this.o.classes.tabable).forEach((el) => {
      el.classList.remove(this.o.classes.tabable);
    });

    const buttonModal = document.querySelector(
      '.' + this.o.classes.thisOpenedModal
    );

    if (buttonModal) {
      buttonModal.focus();
      buttonModal.classList.remove(this.o.classes.thisOpenedModal);
    }

    // removeAria
    activeModal.style.display = 'none';
    activeModal.setAttribute('aria-hidden', 'true');
    activeModal.setAttribute('tabindex', '-1');

    innerModal.classList.remove(this.o.classes.animateOut);
  },

  /**
   * Keyboard support
   * @private
   */
  accessibleKeyboard: function (event) {
    const keyCode = event.keyCode || event.which;
    const activeModal = document.querySelector(
      '[data-custom-modal].opened-modal'
    );

    if (!activeModal) return;

    const tabables = activeModal.querySelectorAll(
      '.' + this.o.classes.tabable + ':not(:disabled)'
    );
    const currentFocus = document.activeElement;

    if (keyCode === 9) {
      const temp_last = tabables[tabables.length - 1];

      if (!event.shiftKey && currentFocus === temp_last) {
        event.preventDefault();

        activeModal.querySelector('.' + this.o.classes.closeModal).focus();
      }

      if (
        event.shiftKey &&
        currentFocus.classList.contains(this.o.classes.closeModal)
      ) {
        event.preventDefault();

        temp_last.focus();
      }
    }

    if (keyCode === 27) {
      event.preventDefault();

      if (!activeModal.getAttribute('[data-layer-disabled]'))
        this.onClickClose();
    }

    if (keyCode === 32) {
      const temp_for = currentFocus.getAttribute('for');

      if (temp_for) {
        event.preventDefault();
        document
          .getElementById(temp_for)
          .dispatchEvent(new CustomEvent('click'));
      }
    }
  },

  overlayClick: function (event) {
    let _this = event.target;

    if (_this.hasAttribute('data-prevent-close')) return;

    if (_this.classList.contains(this.o.classes.openedModal))
      this.onClickClose();
  },

  getElementOffset: function (el) {
    let top = 0;
    let left = 0;
    let element = el;

    do {
      top += element.offsetTop || 0;
      left += element.offsetLeft || 0;
      element = element.offsetParent;
    } while (element);

    return {
      top,
      left
    };
  }
};

export { customModal };

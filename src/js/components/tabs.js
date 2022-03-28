/**
 * Custom tabs
 * Created by AK
 */

const tabs = (() => {
  let o = {};

  /**
   * Init
   */
  const init = () => {
    o = {
      tabs: document.querySelectorAll('[data-tabs]'),
      trigger: document.querySelectorAll('[data-tabs] [data-tab-trigger]'),
      targetContent: document.querySelectorAll('.tab-content'),
      targetWrapper: document.querySelectorAll('[data-tabs-content]'),
      classes: {
        active: 'is-active'
      }
    };

    if (o.tabs && o.trigger) {
      _setWcag();
      document
        .querySelectorAll('[data-tab-trigger]')
        .forEach((tabTrigger) => initEvents(tabTrigger));
      _checkActiveTab();
    }
  };

  /**
   * Init events
   */
  const initEvents = (elem) => {
    elem.addEventListener('touch', _tabSwitcher.bind(this));
    elem.addEventListener('click', _tabSwitcher.bind(this));
  };

  /**
   * Set aria attributes
   * @private
   */
  const _setWcag = () => {
    // Static roles
    o.tabs.forEach((elem) => {
      elem.setAttribute('role', 'tablist');
    });

    // Aria relations
    o.trigger.forEach(function (that) {
      let triggerTarget = that.dataset.tabTrigger;
      that.setAttribute('id', triggerTarget + '-label');
      that.setAttribute('role', 'tab');
      that.parentNode.matches('.tabs-title') &&
        that.parentNode.setAttribute('role', 'presentation');
    });

    o.targetContent.forEach(function (that) {
      let target = that.getAttribute('id');
      that.setAttribute('aria-labelledby', target + '-label');
      that.setAttribute('role', 'tabpanel');
    });
  };

  /**
   * Check active tab
   * @private
   */
  const _checkActiveTab = () => {
    o.tabs.forEach((tabElem) => {
      let initTab,
        urlHash,
        urlTarget,
        activeTab,
        activeTabParent,
        activeTabTarget;

      if (tabElem.dataset.noHash) {
        initTab = tabElem.dataset.initTab;
        urlHash = initTab;
        urlTarget = tabElem.querySelector(
          '[data-tab-trigger="' + urlHash + '"]'
        );
        activeTab = initTab;
        activeTabParent = initTab;
        activeTabTarget = initTab;
      } else {
        urlHash = window.location.hash.split('#')[1];

        if (!urlHash) urlHash = window.location.href.split('?')[1];

        urlTarget = tabElem.querySelector(
          '[data-tab-trigger="' + urlHash + '"]'
        );
        activeTab = tabElem.querySelector('.is-active [data-tab-trigger]');
        activeTabParent = activeTab.parentNode;
        activeTabTarget = activeTab.dataset.tabTrigger;
      }

      if (urlTarget) {
        _setActiveTab(urlTarget);
        _setActiveContent(urlHash);
      } else if (activeTabParent) {
        _setActiveTab(activeTab);
        _setActiveContent(activeTabTarget);
      }
    });
  };

  /**
   * On click tabs switcher
   * @private
   */
  const _tabSwitcher = (event) => {
    event.preventDefault();

    let triggerEvent = event.currentTarget;
    let triggerTarget = triggerEvent.dataset.tabTrigger;

    _setActiveTab(triggerEvent);
    _setActiveContent(triggerTarget);

    if (
      o.tabs.length === 1 &&
      !triggerEvent.closest('[data-tabs]').dataset.noHash
    ) {
      _setURL(triggerTarget, triggerEvent);
    }

    triggerEvent.focus();
  };

  /**
   * Add hash to url
   * @private
   */
  const _setURL = (target) => {
    let location = '#' + target;

    if (window.history.pushState) {
      window.history.pushState(null, null, location);
    }
  };

  /**
   * Set active tab
   * @private
   */
  const _setActiveTab = (trigger) => {
    let tabTitlesUl = trigger.closest('[data-tabs]');
    let currentTabTitle = trigger.parentNode;
    tabTitlesUl.querySelectorAll('.tabs-title').forEach((elem) => {
      elem.classList.remove(o.classes.active);
      let childTrigger = elem.querySelector('[data-tab-trigger]');
      if (childTrigger) {
        childTrigger.setAttribute('aria-selected', 'false');
      }
    });

    currentTabTitle.classList.add(o.classes.active);
    trigger.setAttribute('aria-selected', 'true');
  };

  /**
   * Content switcher
   * @private
   */
  const _setActiveContent = (target) => {
    let targetContent = document.querySelector(
      '.tab-content[id="' + target + '"]'
    );

    if (!targetContent) return;

    let activeContent = Array.from(targetContent.parentNode.children).filter(
      (elem) => elem.classList.contains('is-active')
    );

    activeContent.forEach((elem) => {
      elem.classList.remove(o.classes.active);
      elem.setAttribute('aria-hidden', 'true');
    });

    targetContent.classList.add(o.classes.active);
    targetContent.setAttribute('aria-hidden', 'false');

    const swiper = targetContent.querySelector('.swiper-container-initialized');

    if (swiper) {
      swiper.swiper.update();
      swiper.swiper.pagination.render();
      swiper.swiper.pagination.update();
      swiper.swiper.navigation.update();
    }
  };

  return {
    init: init
  };
})();

export { tabs };

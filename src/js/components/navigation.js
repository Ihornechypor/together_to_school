export const navigation = (() => {
  const _o = {
    menuTrigger: document.querySelector('[data-menu-trigger]'),
    menuWrapper: document.querySelector('[data-menu-wrapper]'),
    menuItem: document.querySelectorAll('[data-menu-wrapper] a'),
    pageBody: document.body
  };

  const init = () => {
    if (_o.menuTrigger) {
      _o.menuTrigger.addEventListener('click', (e) =>
        onClickMenuTrigger(e, _o.menuTrigger)
      );
      _o.menuWrapper.addEventListener('click', (e) =>
        closeWhenWhiteFreeClicked(e, _o.menuTrigger)
      );
      window.addEventListener('resize', () => close());
      _o.menuItem.forEach((each) => (each.onclick = close));
    }
  };

  const waitForTransition = () => {
    _o.menuWrapper.removeEventListener(
      'transitionend',
      waitForTransition,
      false
    );
    _o.menuWrapper.classList.toggle('main-menu-wrapper-transitionend');
  };

  const closeWhenWhiteFreeClicked = (e) => {
    if (e.target.classList.contains('main-menu-wrapper-nav')) {
      close();
    }
  };

  const onClickMenuTrigger = (e, trigger) => {
    _o.pageBody.classList.toggle('navigation-open');
    trigger.classList.toggle('active');
    _o.menuWrapper.classList.toggle('active');
    _o.menuWrapper.addEventListener('transitionend', waitForTransition, false);
  };

  const close = () => {
    _o.pageBody.classList.remove('navigation-open');
    _o.menuWrapper.classList.remove('main-menu-wrapper-transitionend');
    _o.menuTrigger.classList.remove('active');
    _o.menuWrapper.classList.remove('active');
  };

  return {
    init: init
  };
})();

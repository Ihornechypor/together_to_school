const _breakpoints = {
  small: 0,
  medium: 640,
  large: 1024,
  xlarge: 1200,
  xxlarge: 1440
};

const breakpoint = {
  small: function () {
    return window.innerWidth < _breakpoints.medium;
  },
  medium: function (param) {
    switch (param) {
      case 'up':
        return window.innerWidth >= _breakpoints.medium;
      case 'down':
        return window.innerWidth < _breakpoints.large;
      default:
        return (
          window.innerWidth >= _breakpoints.medium &&
          window.innerWidth < _breakpoints.large
        );
    }
  },
  large: function (param) {
    switch (param) {
      case 'up':
        return window.innerWidth >= _breakpoints.large;
      case 'down':
        return window.innerWidth < _breakpoints.xlarge;
      default:
        return (
          window.innerWidth >= _breakpoints.large &&
          window.innerWidth < _breakpoints.xlarge
        );
    }
  },
  xlarge: function (param) {
    switch (param) {
      case 'up':
        return window.innerWidth >= _breakpoints.xlarge;
      case 'down':
        return window.innerWidth < _breakpoints.xxlarge;
      default:
        return (
          window.innerWidth >= _breakpoints.xlarge &&
          window.innerWidth < _breakpoints.xxlarge
        );
    }
  },
  xxlarge: function () {
    return window.innerWidth >= _breakpoints.xxlarge;
  }
};

export { breakpoint };

if (typeof P4 !== 'undefined' && typeof P4.namespace !== 'undefined') {
  P4.namespace('P4.helper.breakpoint');
  P4.helper.breakpoint = breakpoint;
}

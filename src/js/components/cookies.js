export const cookies = (() => {
  let cookies;

  const closeCookies = (e) => {
    e.preventDefault();
    cookies.classList.add("closed");
    const animationEnd = () => {
      cookies.style.display = "none";
      cookies.setAttribute("aria-hidden", "true");
    };
    cookies.addEventListener("animationend", animationEnd, false);
    cookies.addEventListener("webkitAnimationEnd", animationEnd, false);
    createCookie("lpCookie", true, 30);
  };

  const init = () => {
    cookies = document.querySelector("[data-cookies-bar]");
    if (!cookies) return;

    cookies
      .querySelectorAll("[data-close-cookies]")
      .forEach((each) => (each.onclick = closeCookies));

    if (!getCookie("lpCookie")) cookies.style.display = "block";
  };

  const getCookie = (name) => {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  const createCookie = (name, value, days) => {
    let expires;
    if (days) {
      let date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toGMTString();
    } else {
      expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  };

  return {
    init: init
  };
})();

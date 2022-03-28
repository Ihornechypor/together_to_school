/**
 * MODULES - custom modal
 * @author PLEJ
 */

const lazyYoutube = (() => {
  const players = document.querySelectorAll('[data-lazy-player]');

  const init = () => {
    players.forEach((player) => {
      const cover = player.querySelector('[data-cover]');

      cover.addEventListener('click', () => embedVideo(cover));
    });
  };
  const embedVideo = (cover) => {
    const container = cover.parentNode;
    const src = `${cover.dataset.movieUrl}?autoplay=1&rel=0&enablejsapi=1`;

    container.innerHTML = `<iframe src="${src}"
                                       frameborder="0"
                                       allowfullscreen="1"
                                       allow="accelerometer; clipboard-write; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                       >
                               </iframe>`;
  };

  return {
    init: init
  };
})();

export { lazyYoutube };

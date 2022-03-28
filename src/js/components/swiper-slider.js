import Swiper, { Navigation, Pagination } from 'swiper/swiper.esm.js';

export const swiperSlider = (() => {
    const init = () => {
        const mySwiper = new Swiper('.my-swiper', {
            modules: [Navigation, Pagination],
            autoplay: false,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            }
        });
    };

    return {
        init: init
    };
})();


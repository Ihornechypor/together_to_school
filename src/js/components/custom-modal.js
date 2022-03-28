/**
 * MODULES - custom modal
 * @author PLEJ
 */

const customModal = (() => {
    const wrapper = document.querySelector("html");

    const init = () => {
        const triggers = document.querySelectorAll('[data-custom-modal]');
        triggers.forEach(each => initEvent(each));
    };

    const initEvent = (element) => {
        const selector = element.dataset.customModal;
        const script = element.dataset.initScript;
        const modal = document.querySelector( selector );

        let component = {
            target: element,
            script: script,
            modal: modal
        };

        element.addEventListener("click", () => onClick(component));
        modal.querySelectorAll('[data-close-modal]').forEach(each => each.addEventListener("click", () => closeModal(component)) );
    };

    const onClick = (component) => {
        if(component.script)
            appendScript(component);

        openModal(component);
    };

    const openModal = (component) => {
        component.modal.classList.add("active");
        wrapper.classList.add("modalOpened");

        setTimeout( function() {
            component.modal.classList.add("animated");
        }, 200 );
    };

    const closeModal = (component) => {
        component.modal.classList.remove("active", "animated");
        wrapper.classList.remove("modalOpened");
    };

    const appendScript = (component) => {
        component.target.removeAttribute('data-init-script');
        const script = document.createElement("script");
        script.src = component.script;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    };

    return {
        init: init
    };
})();

export {customModal}
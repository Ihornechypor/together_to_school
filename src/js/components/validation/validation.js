/**
 * Validation
 */

import {validationRules} from "./validation-rules";

const validation = (() => {
    let _o = {
        inputs: null,
        progressBar: document.querySelector("[data-progress-bar]"),
        progressStatus: null,
        customFileInput: document.querySelector('.custom-file-input'),
        selectors: {
            rules: "[data-validation-rules]",
            form: "[data-validation-form]",
        }
    };

    let status = [];

    const init = () => {
        validationRules.init();
        initEvents();

        if (_o.progressBar) _o.progressStatus = _o.progressBar.querySelector("[data-progress-status]")
    };

    const initEvents = () => {
        const forms = document.querySelectorAll(_o.selectors.form);
        const inputs = document.querySelectorAll(
            _o.selectors.form + " " + _o.selectors.rules
        );

        forms.forEach((form) => {
            form.addEventListener("submit", submitForm);
        });

        inputs.forEach((input) => {
            input.addEventListener("change", validateInput);
            input.addEventListener("focusout", validateInput);
        });
    };

    const submitForm = () => {
        event.preventDefault();
        status = [];
        const form = event.target;
        const inputs = form.querySelectorAll(_o.selectors.rules);
        const errorContainer = form.querySelector("[data-form-error]");
        const submitBtn = form.querySelector('[type="submit"]');
        const fileInputs = form.querySelectorAll('[data-custom-file]');
        const progressBar = form.querySelector('[data-progress-bar]');

        inputs.forEach((input) => validateInput(input));
        validateFileInputs(fileInputs);

        setTimeout(() => {
            if (!status.includes(false)) {

                submitBtn.innerHTML = `Wysyłam`;

                grecaptcha.ready(() => {
                    grecaptcha
                        .execute('6LfTbf8ZAAAAAPT-xFE8UT7ts-Cu7VI07w5cLho4', {action: 'submit'})
                        .then((token) => {

                            let request = new XMLHttpRequest();
                            request.responseType = "json";

                            if (progressBar) {
                                request.upload.onloadstart = () => {
                                    progressBar.classList.add("init");
                                };
                                request.upload.onprogress = (e) => {
                                    const progress = parseInt(e.loaded / e.total * 100, 10);
                                    progressBar.innerText = `${progress}%`
                                    progressBar.style.setProperty('--progress', `${progress}%`);
                                };
                                request.upload.onload = () => {
                                    progressBar.classList.add("close");
                                    progressBar.classList.remove("init");
                                };
                            }

                            request.onreadystatechange = function () {
                                if (request.status >= 200 && request.status < 300) {
                                    if (!request.response) return;
                                    console.log('response: '+ request.response);

                                    const isError = request.response.error;

                                    if (isError) {
                                        const message = isError.message ? isError.message : "Nieznany błąd. Spróbuj ponownie za chwilę.";
                                        setFormError(errorContainer, message);

                                        submitBtn.innerHTML = `Błąd`;
                                        submitBtn.classList.add('error');
                                    } else {
                                        form.classList.add('success');
                                    }
                                } else if (request.status === 400) {
                                    const isError = request.response.error;
                                    const message = isError.message ? isError.message : "Nieznany błąd. Spróbuj ponownie za chwilę.";
                                    setFormError(errorContainer, message);
                                    submitBtn.innerHTML = `Błąd`;
                                    submitBtn.classList.add('error');
                                } else {
                                    // console.log('response: '+ request.response);
                                }
                            };

                            request.open("POST", form.action, true);
                                const fd = new FormData();
                                let name = form.querySelector('[name="name"]');
                                let email = form.querySelector('[name="email"]');
                                let description = form.querySelector('[name="description"]');

                                // order of the append is important, file last!
                                fd.append('recaptcha', token);
                                fd.append('name', name ? name.value : '');
                                fd.append('email', email.value);
                                fd.append('description', description ? description.value : '');
                                for (let i = 0; i < fileInputs.length; i++) {
                                    fd.append('assets[]', fileInputs[i].files[0]);
                                }
                                request.send(fd);
                        });
                });
            }
        });
    };

    const validateFileInputs = (files) => {

        files.forEach( (file) => {
            let container = file.parentNode;

            if (file.files.length === 0) {
                container.classList.add('error');
                status.push(false);
            }

            if (container.classList.contains('error')) {
                status.push(false);
            }
        });
    };

    const setFormError = (messageContainer, message) => {
        const isParagraph = messageContainer.querySelector("p");

        if (isParagraph) {
            isParagraph.innerText = message;
        } else {
            const paragraph = document.createElement("p");
            const text = document.createTextNode(message);
            paragraph.appendChild(text);
            messageContainer.appendChild(paragraph);
        }
    };

    const validateInput = (input) => {
        if (input.target) input = input.target;

        let rules = getValidationRules(input);
        let type = input.getAttribute("type");
        let value = "";
        let isAnyError = false;
        let validateResponse;

        switch (type) {
            case "checkbox":
                value = input.checked;
                break;
            case "file":
                if (input.files && input.files[0]) value = input.files[0];
                break;
            case "email":
                value = input;
                break;
            default:
                value = input.value;
        }

        for (let i = 0; i < rules.length; i++) {
            let currentRule = validationRules.returnValidationRule(rules[i]);
            validateResponse = currentRule(value, type);

            if (validateResponse.error) {
                isAnyError = true;
                break;
            } else {
                isAnyError = false;
            }
        }

        status.push(!isAnyError);

        if (isAnyError) {
            setError(input, validateResponse.msg);
        } else {
            setSuccess(input, validateResponse.msg);
        }
    };

    const getValidationRules = (element) => {
        let data = element.dataset.validationRules;
        return data.split(",");
    };

    const setError = (element, msg) => {
        const container = element.parentNode;
        container.classList.remove("success");

        if (container.classList.contains("error")) {
            const alert = container.querySelector("small");
            alert.innerHTML = msg;
        } else {
            container.classList.add("error");

            let newAlert = document.createElement("small");
            newAlert.setAttribute("role", "alert");
            newAlert.innerHTML = msg;
            container.appendChild(newAlert);
        }
    };

    const setSuccess = (element, msg) => {
        const container = element.parentNode;
        const alert = container.querySelector("small");
        if (alert)
            container.removeChild(alert);

        container.classList.remove("error");
    };

    return {
        init: init
    };
})();

export {validation};

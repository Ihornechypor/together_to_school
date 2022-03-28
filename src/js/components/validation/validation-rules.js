/**
 * Validation rules used in validation.js
 */

const validationRules = (() => {
  let _matching = {};

  /**
   * Set rule-logic matching
   */
  const init = () => {
    _matching = {
      required,
      name,
      email,
      sameEmail,
      password
    };
  };

  // prevent pasting to input
  const noPaste = document.querySelector("[data-no-paste]");

  if (noPaste) {
    noPaste.onpaste = e => {
      e.preventDefault();
      return false;
    };
  }

  /**
   * Return matching rule
   * @param rule
   */
  const returnValidationRule = (rule) => {
    //TODO: add some element check/ parsing
    rule = rule.trim();
    return _matching[rule];
  };

  /**
   * required field validation test. Sometimes it can be a boolean value
   *
   * @param {String|Boolean|Array} value
   * @returns {boolean}
   */
  const required = (inputValue, type) => {
    if (type !== "checkbox" && type !== "file" && type !== "email") {
      inputValue = inputValue.replace(/\s+/g, "");
    } else if (type === "email") {
      let value = inputValue.value;
      inputValue = value.replace(/\s+/g, "");
    }

    if (!inputValue) {
      return {
        error: true,
        msg: "Pole jest wymagane",
      };
    }
    return { error: false };
  };
  /**
   * Name/surname validation test
   *
   * @param {String} value
   * @returns {Boolean}
   */
  const name = (value) => {
    return /^[a-zżźćńółęąś\s\-]+$/i.test(value)
      ? { error: false }
      : {
          error: true,
          msg: "Pole może zawierać tylko litery",
        };
  };

  const email = (input) => {
    let value = input.value;
    let polishLetters = /[ąĄćĆęĘłŁńŃóÓśŚźŹżŻ]/;

    if (value.indexOf("@") > -1) {
      let name = value.split("@")[0];

      if (name.length > 64) {
        return {
          error: true,
          msg: "Podany e-mail jest nieprawidłowy",
        };
      }
    }

    if (value.match(polishLetters) !== null) {
      return {
        error: true,
        msg: "Podany e-mail jest nieprawidłowy",
      };
    }

    if (!value) {
      return {
        error: true,
        msg: "Podany e-mail jest nieprawidłowy",
      };
    }

    return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      value
    )
      ? { error: false }
      : {
          error: true,
          msg: "Podany e-mail jest nieprawidłowy",
        };
  };

  const sameEmail = (input) => {
    let baseContainer = input.parentNode.previousElementSibling;

    if (baseContainer) {
      let baseEmail = baseContainer.querySelector('[type="email"]');

      return baseEmail.value !== input.value
          ? { error: true, msg: "Podane e-maile nie są identyczne" }
          : { error: false };
    }

  };

  const password = (value) => {
    let correctValue = value.match(
        /^(?=.*[a-zżźćńółęąśA-ZŻŹĆŃÓŁĘĄŚ\d].*)[a-zżźćńółęąśA-ZŻŹĆŃÓŁĘĄŚ\d]{6,9}$/g
      ),
      minLength = 6;

    if (correctValue) {
      return { error: false };
    } else if (value.length < minLength) {
      return {
        error: true,
        msg: `Hasło jest za krótkie powinna mieścić ${minLength} znaków`,
      };
    } else {
      return {
        error: true,
        msg: `Hasło powinne mieścić od 6 do 9 liter lub cyfr`,
      };
    }
  };

  return {
    init: init,
    returnValidationRule: returnValidationRule,
  };
})();

export { validationRules };

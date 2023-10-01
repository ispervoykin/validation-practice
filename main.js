const form = document.querySelector("form");
form.reset();

const inputFields = {
    email: document.querySelector("#email"),
    country: document.querySelector("#country"),
    zipCode: document.querySelector("#zipCode"),
    password: document.querySelector("#password"),
    confirmPassword: document.querySelector("#confirmPassword"),
};

const emailError = (() => {
    const valueMissing = () => "You need to enter an email address.";
    const typeMismatch = () => "Entered value needs to be an email address.";

    return { valueMissing, typeMismatch };
})();

const countryError = (() => {
    const valueMissing = () => "You need to enter a country name.";
    const typeMismatch = () => "Entered value needs to be a country name.";
    const tooShort = (length) => `Country name should be at least ${inputFields.country.minLength} characters; you entered ${length}.`;
    const patternMismatch = () => "Country name should contain ether English or Russian letters.";

    return {
        valueMissing,
        typeMismatch,
        tooShort,
        patternMismatch,
    };
})();

const zipCodeError = (() => {
    const valueMissing = () => "You need to enter a ZIP code.";
    const typeMismatch = () => "Entered value needs to be a ZIP code.";
    const rangeUnderflow = (length) => `ZIP Code should be at least ${inputFields.zipCode.min.length} characters; you entered ${length}.`;
    const patternMismatch = () => "ZIP code should only contain numbers.";

    return {
        valueMissing,
        typeMismatch,
        rangeUnderflow,
        patternMismatch,
    };
})();

const passwordError = (() => {
    const valueMissing = () => "You need to enter a password.";
    const typeMismatch = () => "Entered value needs to be a password.";
    const tooShort = (length) => `Password should be at least ${inputFields.password.minLength} characters; you entered ${length}.`;

    return { valueMissing, typeMismatch, tooShort };
})();

const confirmPasswordError = (() => {
    const valueMissing = () => "You need to confirm the password.";
    const customError = () => "The passwords must match.";

    return { valueMissing, customError };
})();

const errorStringToObject = {
    emailError,
    countryError,
    zipCodeError,
    passwordError,
    confirmPasswordError,
};

for (const field in inputFields) {
    inputFields[field].addEventListener("input", () => {
        checkIfValid(inputFields[field]);
    });
}

function removeError(element) {
    const errorName = `${element.id}Error`;
    const error = document.querySelector(`.${errorName}`);
    // In case there is an error message visible, if the field
    // is valid, we remove the error message.
    error.textContent = ""; // Reset the content of the message
    error.className = `error ${errorName}`; // Reset the visual state of the message
}

function checkIfValid(element) {
    if (element.id === "confirmPassword" || element.id === "password") {
        if (!checkEquality()) {
            showError(inputFields.confirmPassword);
        } else {
            removeError(inputFields.confirmPassword);
        }
    }
    if (element.validity.valid) {
        removeError(element);
    } else {
        // If there is still an error, show the correct error
        showError(element);
    }
}

function showError(element) {
    const errorName = `${element.id}Error`;
    const error = document.querySelector(`.${errorName}`);
    if (element.validity.valueMissing) {
        // If the field is empty,
        // display the following error message.
        error.textContent = errorStringToObject[errorName].valueMissing();
    } else if (element.validity.typeMismatch) {
        // If the field doesn't contain an email address,
        // display the following error message.
        error.textContent = errorStringToObject[errorName].typeMismatch();
    } else if (element.validity.tooShort) {
        // If the data is too short,
        // display the following error message.
        error.textContent = errorStringToObject[errorName].tooShort(element.value.length);
    } else if (element.validity.rangeUnderflow) {
        error.textContent = errorStringToObject[errorName].rangeUnderflow(element.value.length);
    } else if (element.validity.patternMismatch) {
        error.textContent = errorStringToObject[errorName].patternMismatch();
    } else if (element.validity.customError) {
        error.textContent = errorStringToObject[errorName].customError();
    }
    // Set the styling appropriately
    error.className = `error ${errorName} active`;
}

inputFields.zipCode.addEventListener("keypress", (e) => {
    if (!/^[0-9]*$/.test(e.key)) {
        e.preventDefault();
    }
});

document.querySelectorAll(".show-password-button").forEach((element) => {
    element.addEventListener("click", () => {
        const inputField = element.previousElementSibling;
        if (inputField.type === "password") {
            inputField.type = "text";
        } else {
            inputField.type = "password";
        }
    });
});

function checkEquality() {
    if (inputFields.confirmPassword.value !== inputFields.password.value) {
        inputFields.confirmPassword.setCustomValidity("The passwords must match");
        return 0;
    }
    inputFields.confirmPassword.setCustomValidity("");
    return 1;
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    for (const field in inputFields) {
        checkIfValid(inputFields[field]);
    }
});

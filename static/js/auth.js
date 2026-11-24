document.querySelectorAll(".toggle-password").forEach(function (button) {
  button.addEventListener("click", function () {
    const input = document.getElementById(button.getAttribute("aria-controls"));
    const isHidden = input.type === "password";

    input.type = isHidden ? "text" : "password";
    button.textContent = isHidden ? "Hide" : "Show";
    button.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
  });
});



const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


const rules = {
  name: function (value) {
    return value.trim() ? "" : "Please enter your full name.";
  },

  email: function (value) {
    if (!value.trim()) return "Please enter your email address.";
    if (!emailPattern.test(value.trim())) return "Please enter a valid email address.";
    return "";
  },

  password: function (value, input) {
    const min = Number(input.dataset.minLength || 0);

    if (!value) return "Please enter your password.";
    if (min && value.length < min) return "Password must be at least " + min + " characters.";
    return "";
  },
};

function showError(input, message) {
  const field = input.closest(".field");
  const error = field.querySelector(".error");

  error.textContent = message;
  field.classList.toggle("has-error", Boolean(message));
  input.setAttribute("aria-invalid", message ? "true" : "false");
}

function validateInput(input) {
  const rule = rules[input.dataset.rule];
  const message = rule ? rule(input.value, input) : "";

  showError(input, message);

  return message === "";
}


document.querySelectorAll("form").forEach(function (form) {
  const inputs = form.querySelectorAll("[data-rule]");
  const status = form.querySelector(".form-status");

  inputs.forEach(function (input) {
    input.addEventListener("blur", function () {
      if (input.value !== "") validateInput(input);
    });

    input.addEventListener("input", function () {
      if (input.closest(".field").classList.contains("has-error")) validateInput(input);
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    status.textContent = "";

    let firstInvalid = null;

    inputs.forEach(function (input) {
      if (!validateInput(input) && !firstInvalid) firstInvalid = input;
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    status.textContent =
      form.id === "login-form"
        ? "Login successful!"
        : "Account created successfully!";

    form.reset();
  });
});
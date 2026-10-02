"use strict";

function isValidStudentNumber(value) {
  return (
    typeof value === "string" &&
    /^\d{2}-\d{4}-\d{3}$/.test(value.trim())
  );
}

function isValidPassword(value) {
  return (
    typeof value === "string" &&
    value.length >= 8 &&
    /[A-Z]/.test(value) &&
    /[0-9]/.test(value) &&
    /[@$!]/.test(value) &&
    !/\s/.test(value)
  );
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    isValidStudentNumber,
    isValidPassword
  };
}

if (typeof document !== "undefined") {
  function initializeForm() {
    const form = document.getElementById("registrationForm");

    if (!form) {
      return;
    }

    const fieldIds = [
      "fullName",
      "studentNumber",
      "email",
      "mobileNumber",
      "password",
      "confirmPassword",
      "course",
      "terms"
    ];

    const fields = {};

    fieldIds.forEach(function (id) {
      fields[id] = document.getElementById(id);
    });

    const passwordFeedback =
      document.getElementById("passwordFeedback");
    const successMessage =
      document.getElementById("successMessage");
    const registrationSummary =
      document.getElementById("registrationSummary");

    const summaryFields = {
      fullName: "summaryName",
      studentNumber: "summaryStudentNumber",
      email: "summaryEmail",
      mobileNumber: "summaryMobileNumber",
      course: "summaryCourse"
    };

    function setError(id, message) {
      document.getElementById(id + "Error").textContent = message;
      fields[id].setAttribute(
        "aria-invalid",
        message ? "true" : "false"
      );

      return message === "";
    }

    function validateField(id) {
      const value = fields[id].value;
      let message = "";

      switch (id) {
        case "fullName":
          if (value.trim() === "") {
            message = "Enter your full name.";
          } else if (value.trim().length < 2) {
            message = "Full name must contain at least two characters.";
          }
          break;

        case "studentNumber":
          if (value.trim() === "") {
            message = "Enter your student number.";
          } else if (!isValidStudentNumber(value)) {
            message = "Enter a student number in the format 24-1234-123.";
          }
          break;

        case "email":
          if (value.trim() === "") {
            message = "Enter your email address.";
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
            message = "Enter an email address such as student@example.com.";
          }
          break;

        case "mobileNumber":
          if (value.trim() === "") {
            message = "Enter your mobile number.";
          } else if (!/^(09|\+639)\d{9}$/.test(value.trim())) {
            message =
              "Use 09 followed by nine digits or +639 followed by nine digits, without spaces or hyphens.";
          }
          break;

        case "password":
          if (value === "") {
            message = "Enter a password.";
          } else if (!isValidPassword(value)) {
            message =
              "Use at least eight characters, one uppercase letter, one digit, and one of @, $, or !, with no whitespace.";
          }
          break;

        case "confirmPassword":
          if (value === "") {
            message = "Confirm your password.";
          } else if (value !== fields.password.value) {
            message = "Passwords must match exactly.";
          }
          break;

        case "course":
          if (value !== "BSIT" && value !== "BSCS") {
            message = "Select BSIT or BSCS.";
          }
          break;

        case "terms":
          if (!fields.terms.checked) {
            message = "You must agree to the terms and conditions.";
          }
          break;
      }

      return setError(id, message);
    }

    function clearOutput() {
      successMessage.textContent = "";
      registrationSummary.hidden = true;

      Object.values(summaryFields).forEach(function (summaryId) {
        document.getElementById(summaryId).textContent = "";
      });
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearOutput();

      [
        "fullName",
        "studentNumber",
        "email",
        "mobileNumber"
      ].forEach(function (id) {
        fields[id].value = fields[id].value.trim();
      });

      let firstInvalidField = null;

      fieldIds.forEach(function (id) {
        const valid = validateField(id);

        if (!valid && firstInvalidField === null) {
          firstInvalidField = fields[id];
        }
      });

      if (firstInvalidField !== null) {
        firstInvalidField.focus();
        return;
      }

      Object.entries(summaryFields).forEach(function (entry) {
        const fieldId = entry[0];
        const summaryId = entry[1];

        document.getElementById(summaryId).textContent =
          fields[fieldId].value;
      });

      registrationSummary.hidden = false;
      successMessage.textContent =
        "Registration details validated successfully!";
    });

    fields.password.addEventListener("input", function () {
      const value = fields.password.value;

      if (value === "") {
        passwordFeedback.textContent = "";
        passwordFeedback.className = "";
      } else {
        const valid = isValidPassword(value);

        passwordFeedback.textContent = valid
          ? "Password meets all requirements."
          : "Password needs at least eight characters, one uppercase letter, one digit, and one of @, $, or !, with no whitespace.";

        passwordFeedback.className = valid ? "valid" : "invalid";
      }

      validateField("password");

      if (
        fields.confirmPassword.value !== "" ||
        fields.confirmPassword.getAttribute("aria-invalid") === "true"
      ) {
        validateField("confirmPassword");
      }
    });

    fields.fullName.addEventListener("blur", function () {
      validateField("fullName");
    });

    fields.course.addEventListener("change", function () {
      validateField("course");
    });

    fields.terms.addEventListener("change", function () {
      validateField("terms");
    });

    [
      "studentNumber",
      "email",
      "mobileNumber",
      "confirmPassword"
    ].forEach(function (id) {
      fields[id].addEventListener("blur", function () {
        validateField(id);
      });
    });

    fieldIds.forEach(function (id) {
      if (id === "password" || id === "course" || id === "terms") {
        return;
      }

      fields[id].addEventListener("input", function () {
        if (fields[id].getAttribute("aria-invalid") === "true") {
          validateField(id);
        }
      });
    });

    form.addEventListener("input", clearOutput);
    form.addEventListener("change", clearOutput);

    form.addEventListener("reset", function () {
      fieldIds.forEach(function (id) {
        setError(id, "");
      });

      passwordFeedback.textContent = "";
      passwordFeedback.className = "";
      clearOutput();
    });

    clearOutput();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeForm);
  } else {
    initializeForm();
  }
}
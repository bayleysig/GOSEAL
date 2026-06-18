// GOSEAL website interactions.
// This file keeps the site static so it can run on GitHub Pages.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import emailjs from "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/+esm";

// Paste your Firebase web app config below.
// In Firebase, go to Project settings > General > Your apps > Web app > SDK setup and configuration.
const firebaseConfig = {
  apiKey: "AIzaSyCVCIJ9nDQ7tWNYFzWChJGhBYRna16ZHwA",
  authDomain: "goseal-842d4.firebaseapp.com",
  projectId: "goseal-842d4",
  storageBucket: "goseal-842d4.firebasestorage.app",
  messagingSenderId: "122913307195",
  appId: "1:122913307195:web:3bbcf88e0c75cf1755fa1e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// EmailJS sends the booking details to the GOSEAL email inbox.
// Update these values in EmailJS if you ever create a new service or template.
const emailJsConfig = {
  publicKey: "PV06F_Ypi_mnu7Idw",
  serviceId: "service_pjuw1ac",
  templateId: "template_myzcu07"
};

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const bookingForm = document.querySelector("#bookingForm");
const formMessage = document.querySelector("#formMessage");
const currentYear = document.querySelector("#currentYear");
const submitButton = bookingForm.querySelector(".form-submit");

currentYear.textContent = new Date().getFullYear();

function closeMobileMenu() {
  navToggle.classList.remove("is-open");
  navLinks.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

function showFormMessage(message, type) {
  formMessage.textContent = message;
  formMessage.style.color = type === "error" ? "#b91c1c" : "#166534";
}

function getFieldValue(formData, fieldName) {
  return String(formData.get(fieldName) || "").trim();
}

function hasFirebaseConfig() {
  return Object.values(firebaseConfig).every((value) => !value.startsWith("PASTE_"));
}

function getReadableDateTime() {
  return new Date().toLocaleString("en-AU", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

navToggle.addEventListener("click", () => {
  const isOpen = navToggle.classList.toggle("is-open");
  navLinks.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("menu-open", isOpen);
});

navItems.forEach((item) => {
  item.addEventListener("click", closeMobileMenu);
});

bookingForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  showFormMessage("", "success");

  if (!bookingForm.checkValidity()) {
    bookingForm.reportValidity();
    showFormMessage("Please complete the required fields before submitting.", "error");
    return;
  }

  if (!hasFirebaseConfig()) {
    showFormMessage("Firebase is not connected yet. Please paste your Firebase config into script.js.", "error");
    return;
  }

  const formData = new FormData(bookingForm);
  const request = {
    fullName: getFieldValue(formData, "fullName"),
    phone: getFieldValue(formData, "phone"),
    email: getFieldValue(formData, "email"),
    jobAddress: getFieldValue(formData, "jobAddress"),
    serviceType: getFieldValue(formData, "serviceType"),
    preferredDate: getFieldValue(formData, "preferredDate"),
    preferredTime: getFieldValue(formData, "preferredTime"),
    message: getFieldValue(formData, "message"),
    createdAt: serverTimestamp()
  };

  const emailParams = {
    ...request,
    createdAt: getReadableDateTime(),
    name: request.fullName,
    time: getReadableDateTime()
  };

  try {
    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    await addDoc(collection(db, "bookings"), request);
    await emailjs.send(
      emailJsConfig.serviceId,
      emailJsConfig.templateId,
      emailParams,
      emailJsConfig.publicKey
    );

    bookingForm.reset();
    showFormMessage("Thanks, your request has been recorded. GOSEAL will contact you shortly.", "success");
  } catch (error) {
    console.error("Firebase booking submission failed:", error);
    showFormMessage("Sorry, something went wrong. Please try again or contact GOSEAL directly.", "error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Submit Request";
  }
});

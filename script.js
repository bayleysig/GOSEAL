// GOSEAL website interactions.
// This file keeps the site static so it can run on GitHub Pages.

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const bookingForm = document.querySelector("#bookingForm");
const formSuccess = document.querySelector("#formSuccess");
const currentYear = document.querySelector("#currentYear");

currentYear.textContent = new Date().getFullYear();

function closeMobileMenu() {
  navToggle.classList.remove("is-open");
  navLinks.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
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

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(bookingForm);
  const request = {
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    jobAddress: formData.get("jobAddress"),
    serviceType: formData.get("serviceType"),
    preferredDate: formData.get("preferredDate"),
    preferredTime: formData.get("preferredTime"),
    message: formData.get("message"),
    submittedAt: new Date().toISOString()
  };

  // GitHub Pages does not process form submissions by itself.
  // To send real enquiries later, replace this localStorage section with one of:
  // - Formspree: set the form action/method in index.html, or POST to Formspree here.
  // - Netlify Forms: add the Netlify form attributes in index.html when hosted on Netlify.
  // - EmailJS: call emailjs.send(...) here using your EmailJS service and template IDs.
  // - Your own backend: send this request object with fetch("YOUR_API_URL", { method: "POST", ... }).
  const savedRequests = JSON.parse(localStorage.getItem("gosealBookingRequests")) || [];
  savedRequests.push(request);
  localStorage.setItem("gosealBookingRequests", JSON.stringify(savedRequests));

  bookingForm.reset();
  formSuccess.textContent = "Thanks, your request has been recorded. GOSEAL will contact you shortly.";
});

const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("#nav-menu");
const navBackdrop = document.querySelector(".nav-backdrop");
const navLinks = document.querySelectorAll(".nav-links a");
const dialog = document.querySelector("#access-dialog");
const form = document.querySelector("#access-form");
const fields = document.querySelector("#access-fields");
const success = document.querySelector("#access-success");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function setCompactHeader() {
  header.classList.toggle("is-compact", window.scrollY > 12);
}

function closeMenu() {
  document.body.classList.remove("nav-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open menu");
}

function openMenu() {
  document.body.classList.add("nav-open");
  navToggle.setAttribute("aria-expanded", "true");
  navToggle.setAttribute("aria-label", "Close menu");
}

navToggle.addEventListener("click", () => {
  const expanded = navToggle.getAttribute("aria-expanded") === "true";
  if (expanded) closeMenu();
  else openMenu();
});

navMenu.querySelectorAll("a, button").forEach((el) => {
  el.addEventListener("click", () => closeMenu());
});

navBackdrop.addEventListener("click", () => closeMenu());

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

window.addEventListener("scroll", setCompactHeader, { passive: true });
setCompactHeader();

const sections = ["product", "how-it-works", "trust"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

function updateCurrentNav() {
  const offset = 120;
  let current = null;
  for (const section of sections) {
    if (section.getBoundingClientRect().top - offset <= 0) current = section.id;
  }
  navLinks.forEach((link) => {
    const match = current && link.getAttribute("href") === `#${current}`;
    if (match) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
}

window.addEventListener("scroll", updateCurrentNav, { passive: true });
updateCurrentNav();

function reveal() {
  const nodes = document.querySelectorAll(".reveal");
  if (reduceMotion.matches) {
    nodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );

  nodes.forEach((node) => observer.observe(node));
}

reveal();

document.querySelectorAll("[data-open-access]").forEach((button) => {
  button.addEventListener("click", () => {
    fields.hidden = false;
    success.hidden = true;
    form.reset();
    dialog.showModal();
  });
});

document.querySelectorAll("[data-close-access]").forEach((button) => {
  button.addEventListener("click", () => dialog.close());
});

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  fields.hidden = true;
  success.hidden = false;
});

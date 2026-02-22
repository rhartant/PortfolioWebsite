/* ============================================================
   project-page.js
   JavaScript for individual project/case study pages.
   Linked from your HTML via: <script src="project-page.js"></script>
   Place that <script> tag just before the closing </body> tag.
   ============================================================ */


/* ── Theme Toggle ──────────────────────────────────────────
   Handles switching between light and dark mode.
   The current theme is saved in localStorage so it persists
   when the user navigates to a different page or comes back later.
   ---------------------------------------------------------- */

// Grab the toggle button and both icons from the page
const themeToggle = document.getElementById('themeToggle');
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');

// 'root' refers to the <html> element — setting data-theme on it
// lets CSS selectors like [data-theme="dark"] apply site-wide
const root = document.documentElement;

// applyTheme() does three things at once:
//   1. Sets data-theme="light" or "dark" on <html>
//   2. Saves the choice to localStorage (persists across pages)
//   3. Shows the correct icon (sun in dark mode, moon in light mode)
function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    sunIcon.style.display  = theme === 'dark' ? 'none'  : 'block';
    moonIcon.style.display = theme === 'dark' ? 'block' : 'none';
}

// On page load, restore whatever theme the user had last set.
// Falls back to 'light' if nothing is saved yet.
applyTheme(localStorage.getItem('theme') || 'light');

// When the toggle is clicked, flip to the opposite theme
themeToggle.addEventListener('click', () => {
    const currentlyDark = root.getAttribute('data-theme') === 'dark';
    applyTheme(currentlyDark ? 'light' : 'dark');
});


/* ── Scroll to Top Button ──────────────────────────────────
   The button is hidden by default (see CSS: opacity: 0).
   Once the user scrolls past 400px, we add the .visible class
   which makes it appear. Clicking it smoothly scrolls back up.
   ---------------------------------------------------------- */

const scrollTopBtn = document.getElementById('scrollTop');

// Listen for scroll events — show or hide the button based on position
window.addEventListener('scroll', () => {
    // classList.toggle adds the class if the condition is true, removes it if false
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
});

// Scroll back to the top of the page when the button is clicked
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
});
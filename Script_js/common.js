async function loadContent(elementSelector, url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
        }
        const html = await response.text();
        document.querySelector(elementSelector).innerHTML = html;

        const path = window.location.pathname;
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        navLinks.forEach(link => {
            if (link.href.includes(path)) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });

    } catch (error) {
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadContent('#header-container', 'header.html');
    loadContent('#footer-container', 'footer.html');
});
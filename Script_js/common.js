async function loadContent(elementSelector, url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
        }
        const html = await response.text();
        document.querySelector(elementSelector).innerHTML = html;

        const currentPath = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath === currentPath) {
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
    const containers = [
        { selector: '#header-container', url: 'header.html' },
        { selector: '#footer-container', url: 'footer.html' }
    ];

    containers.forEach(container => {
        loadContent(container.selector, container.url);
    });
});
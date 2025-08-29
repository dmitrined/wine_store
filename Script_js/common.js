// Функция для загрузки и вставки HTML-контента из внешнего файла
async function loadContent(elementSelector, url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
        }
        const html = await response.text();
        document.querySelector(elementSelector).innerHTML = html;
        console.log(`Content from ${url} loaded successfully.`);
    } catch (error) {
        console.error(error);
    }
}

// Запускаем загрузку контента после полной загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
    const containers = [
        { selector: '#header-container', url: 'header.html' },
        { selector: '#footer-container', url: 'footer.html' }
    ];

    containers.forEach(container => {
        loadContent(container.selector, container.url);
    });
});

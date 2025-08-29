// Функция для загрузки контента
async function loadContent(elementSelector, url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
        }
        const html = await response.text();
        document.querySelector(elementSelector).innerHTML = html;
    } catch (error) {
        console.error(error);
    }
}

// Функция для установки ширины offcanvas
function setOffcanvasWidth() {
    const navItems = document.querySelectorAll('.offcanvas .nav-item');
    let maxWidth = 0;

    navItems.forEach(item => {
        const itemWidth = item.offsetWidth;
        if (itemWidth > maxWidth) {
            maxWidth = itemWidth;
        }
    });

    const offcanvas = document.querySelector('.offcanvas');
    if (offcanvas && maxWidth > 0) {
        offcanvas.style.width = `${maxWidth + 50}px`; // Добавляем запас
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    // Загружаем шапку и ждём, пока она загрузится
    await loadContent('#header-container', 'header.html');
    
    // Загружаем подвал
    loadContent('#footer-container', 'footer.html');

    // После загрузки шапки устанавливаем ширину offcanvas
    setOffcanvasWidth();
});
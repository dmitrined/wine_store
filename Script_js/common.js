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

// Функция для создания HTML-карточки товара из данных JSON
function createWineCard(wine) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const isFavorite = favorites.includes(wine.id);
    // Определяем начальный класс цвета
    const colorClass = isFavorite ? 'text-danger' : 'text-secondary';
    
    // SVG-код для иконки
    const heartSvg = `
        <svg class="bi bi-heart-fill ${colorClass} clickable-icon" width="24" height="24" fill="currentColor" viewBox="0 0 16 16" data-product-id="${wine.id}">
          <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.735 3.562-3.248 8 1.314"/>
        </svg>
    `;

    return `
    <div class="card product-card my-2" id="wine_card" style="width: 13rem;">
      <div class="d-flex justify-content-end p-2">
        ${heartSvg}
      </div>
      <img src="${wine.image}" class="card-img-top p-4" alt="${wine.name}">
      <div class="card-body">
        <h5 class="card-title">$${wine.price.toFixed(2)}</h5>
        <p class="card-text mb-0">${wine.volume} | ${wine.producer}</p>
        <p class="card-text fw-bold">${wine.name}</p>
        <div class="d-grid mt-3">
          <button class="btn btn-danger btn-lg text-white" type="button">
            <svg class="bi bi-cart-fill me-2" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.616l-.07-.354A.5.5 0 0 1 2 3H.5a.5.5 0 0 1-.5-.5zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7-1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
            In den Warenkorb
          </button>
        </div>
      </div>
    </div>
    `;
}

// Функция для загрузки JSON-данных и рендеринга карточек
async function renderWineCards(containerSelector, dataUrl) {
    try {
        const response = await fetch(dataUrl);
        if (!response.ok) {
            throw new Error(`Fehler beim Abrufen der Daten von ${dataUrl}: ${response.status} ${response.statusText}`);
        }
        const wines = await response.json();
        const container = document.querySelector(containerSelector);

        if (!container) {
            console.warn(`Container mit dem Selektor '${containerSelector}' wurde nicht gefunden. Karten werden nicht gerendert.`);
            return;
        }
        
        let cardsHtml = '';
        wines.forEach(wine => {
            cardsHtml += createWineCard(wine);
        });

        container.innerHTML = cardsHtml;
        
        addHeartIconListeners();
    } catch (error) {
        console.error("Fehler beim Rendern der Weinkarten:", error.message);
    }
}

// Функция для добавления/удаления товара из избранного
function addHeartIconListeners() {
    const heartIcons = document.querySelectorAll('.clickable-icon');
    
    heartIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const productId = parseInt(icon.dataset.productId);
            let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

            if (favorites.includes(productId)) {
                favorites = favorites.filter(id => id !== productId);
                // Удаляем красный цвет, добавляем серый
                icon.classList.remove('text-danger');
                icon.classList.add('text-secondary');
            } else {
                favorites.push(productId);
                // Удаляем серый цвет, добавляем красный
                icon.classList.remove('text-secondary');
                icon.classList.add('text-danger');
            }

            localStorage.setItem('favorites', JSON.stringify(favorites));
            console.log("Список избранного:", favorites);
        });
    });
}

// Запускаем все функции после полной загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
    // Загрузка статических HTML-файлов (header и footer)
    const containers = [
        { selector: '#header-container', url: 'header.html' },
        { selector: '#footer-container', url: 'footer.html' }
    ];
    containers.forEach(container => {
        loadContent(container.selector, container.url);
    });

    // Рендеринг карточек товаров. Этот вызов должен быть в конце.
    renderWineCards('#white_wine_cards', './data/wines.json');
});
document.addEventListener('DOMContentLoaded', function() {
    const productGrid = document.getElementById('productGrid');
    const categoryButtons = document.querySelectorAll('.category-btn');

    // Check if we are on the shop page
    if (!productGrid) return;

    // Initial render of all products
    renderProducts(products);

    // Check for URL parameters (e.g. coming from index.html categories)
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    if (categoryParam) {
        filterProducts(categoryParam);
        // Update active button state
        updateActiveButton(categoryParam);
    }

    // Category filter click events
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            filterProducts(category);
            
            // Update active class
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    function filterProducts(category) {
        if (category === 'all') {
            renderProducts(products);
        } else {
            const filtered = products.filter(p => p.category === category);
            renderProducts(filtered);
        }
    }

    function updateActiveButton(category) {
        categoryButtons.forEach(btn => {
            btn.classList.remove('active');
            if(btn.getAttribute('data-category') === category) {
                btn.classList.add('active');
            }
        });
    }

    function renderProducts(productsToRender) {
        productGrid.innerHTML = '';

        if (productsToRender.length === 0) {
            productGrid.innerHTML = '<p class="no-products">No products found in this category.</p>';
            return;
        }

        productsToRender.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            
            // Navigate to detail page on click
            card.onclick = (e) => {
                // Prevent navigation if clicking the "Quick Add" button
                if (e.target.closest('.quick-add-cart')) return;
                window.location.href = `product-detail.html?id=${product.id}`;
            };

            card.innerHTML = `
                <div class="product-image">
                    <img src="${product.image[0]}" alt="${product.name}" style="width:100%; height:100%; object-fit:cover;">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <span class="product-category">${product.category.toUpperCase()}</span>
                    <button class="quick-add-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            `;
            productGrid.appendChild(card);
        });

        // Attach listeners to the new Quick Add buttons
        document.querySelectorAll('.quick-add-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Stop bubbling to card click
                const id = parseInt(btn.getAttribute('data-id'));
                const product = products.find(p => p.id === id);
                if (product && window.addToCart) {
                    window.addToCart(product);
                }
            });
        });
    }
});
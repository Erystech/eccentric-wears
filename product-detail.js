document.addEventListener('DOMContentLoaded', function() {
    const mainImageElement = document.getElementById('mainImage');

    if(!mainImageElement) return;

    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    const product = products.find(p => p.id === productId);


    if (product) {
        //Product details
        document.getElementById('productName').textContent = product.name;
        document.getElementById('productPrice').textContent = `$${product.price.toFixed(2)}`;
        document.getElementById('productCategory').textContent = product.category.toUpperCase();
        document.getElementById('productDescription').textContent = product.description || 'No description available';

        //setting main image
        mainImageElement.src = product.image[0];
        mainImageElement.alt = product.name;

        // create thumbnails
        const thumbnailsContainer = document.getElementById('thumbnails');
        thumbnailsContainer.innerHTML = '';

        product.image.forEach((img, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src =img;
            thumbnail.alt = `${product.name} view ${index + 1}` ;
            thumbnail.loading = 'lazy';

            thumbnail.onclick = () => {
                mainImageElement.src = img;
                document.querySelectorAll('.thumbnails img').forEach(t => t.classList.remove('active'));
                thumbnail.classList.add('active')
            };
            if (index === 0) thumbnail.classList.add('active');
            thumbnailsContainer.appendChild(thumbnail);
        });

        // Add to cart functionality
        const addToCartBtn = document.querySelector('.add-to-cart');
        if(addToCartBtn) {
            addToCartBtn.addEventListener('click', function() {
                if (product && window.addToCart) {
                    window.addToCart(product);
            }
            });
        }
        displayRelatedProducts(product);
    } else {
        document.querySelector('.detail-container').innerHTML = `
        <div class="error-message" style="text-align: center; padding: 3rem;">
                <h2>Product Not Found</h2>
                <p>Sorry, the product you're looking for doesn't exist.</p>
                <a href="/shop.html" class="shopBtn" style="display: inline-block; margin-top: 1rem;">Back to Shop</a>
            </div>
        `
    };

    //Function to display related products
    function displayRelatedProducts(currentProduct) {
        const relatedGrid = document.getElementById('relatedProductsGrid');
        if (!relatedGrid) return;

        // Get related products (same category, excluding current product)
        let relatedProducts = products.filter(p => 
            p.category === currentProduct.category && 
            p.id !== currentProduct.id
        );

        // If not enough products in same category, add from other categories
        if (relatedProducts.length < 4) {
            const additionalProducts = products.filter(p => 
                p.id !== currentProduct.id && 
                !relatedProducts.includes(p)
            );
            relatedProducts = [...relatedProducts, ...additionalProducts];
        }

        // Limit to 4 products
        relatedProducts = relatedProducts.slice(0, 4);

        // Render related products
        relatedGrid.innerHTML = relatedProducts.map(product => `
            <div class="related-product-card" data-product-id="${product.id}">
                <img src="${product.image[0]}" alt="${product.name}" loading="lazy">
                <div class="related-product-info">
                    <h3>${product.name}</h3>
                    <p class="related-price">$${product.price.toFixed(2)}</p>
                    <button class="related-add-cart" data-product-id="${product.id}">
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');

        // Attach click listeners for related products
        attachRelatedProductListeners();
    }

    // Attach listeners to related products
    function attachRelatedProductListeners() {
        // Click on card to view product
        document.querySelectorAll('.related-product-card').forEach(card => {
            card.addEventListener('click', function(e) {
                // Don't navigate if clicking the add to cart button
                if (e.target.closest('.related-add-cart')) {
                    return;
                }
                
                const productId = this.getAttribute('data-product-id');
                window.location.href = `product-detail.html?id=${productId}`;
            });
        });

        // Add to cart buttons
        document.querySelectorAll('.related-add-cart').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent card click
                const productId = parseInt(this.getAttribute('data-product-id'));
                const product = products.find(p => p.id === productId);
                if (product && window.addToCart) {
                    window.addToCart(product);
                }
            });
        });
    }
});


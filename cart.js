
document.addEventListener('DOMContentLoaded', function() {

    let cart = [];

    function initCart() {
        loadCartFromStorage();
        createCartHTML();
        updateCartBadge();
        attachCartListeners();
    }

    // ===== LOCAL STORAGE FUNCTIONS =====
    
    // Load cart from localStorage
    function loadCartFromStorage() {
        const savedCart = localStorage.getItem('eccentricCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    }

    //  Save cart to localStorage
    function saveCartToStorage() {
        localStorage.setItem('eccentricCart', JSON.stringify(cart));
    }

    // ===== CREATE CART HTML =====
    
    // Inject cart HTML into page
    function createCartHTML() {
        // Check if cart already exists
        if (document.querySelector('.cart-overlay')) return;

        const cartHTML = `
            <div class="cart-overlay">
                <div class="cart-panel">
                    <div class="cart-header">
                        <h2>Your Cart (<span class="cart-count">0</span>)</h2>
                        <button class="close-cart" aria-label="Close cart">&times;</button>
                    </div>
                    
                    <div class="cart-items-container">
                        <!-- Cart items will be rendered here -->
                    </div>
                    
                    <div class="cart-footer">
                        <div class="cart-total">
                            <span>Subtotal:</span>
                            <span class="cart-subtotal">$0.00</span>
                        </div>
                        <button class="checkout-btn">Proceed to Checkout</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', cartHTML);
    }

    
    
    // Add item to cart
    function addToCart(product) {
        // Check if item already exists
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            // Increase quantity
            existingItem.quantity += 1;
        } else {
            // Add new item
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image[0],
                quantity: 1
            });
        }

        saveCartToStorage();
        updateCartUI();
        openCart();
        showAddedFeedback();
    }

    // Remove item from cart
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCartToStorage();
        updateCartUI();
    }

    // Update item quantity
    function updateQuantity(productId, change) {
        const item = cart.find(item => item.id === productId);
        
        if (item) {
            item.quantity += change;
            
            // Remove if quantity is 0
            if (item.quantity <= 0) {
                removeFromCart(productId);
                return;
            }
            
            saveCartToStorage();
            updateCartUI();
        }
    }

    // Clear entire cart
    function clearCart() {
        cart = [];
        saveCartToStorage();
        updateCartUI();
    }

    //Get cart count
    function getCartCount() {
        return cart.reduce((total, item) => total + item.quantity, 0);
    }

    // Get cart subtotal
    function getCartSubtotal() {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // ===== UI UPDATE FUNCTIONS =====
    
    // Update all cart UI elements
    function updateCartUI() {
        updateCartBadge();
        renderCartItems();
        updateCartTotal();
    }

    // Update cart badge number
    function updateCartBadge() {
        const badge = document.querySelector('.cart-badge');
        const count = getCartCount();
        
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        } else {
            // Create badge if it doesn't exist
            const cartIcon = document.querySelector('.cart-icon');
            if (cartIcon && count > 0) {
                const newBadge = document.createElement('span');
                newBadge.className = 'cart-badge';
                newBadge.textContent = count;
                cartIcon.appendChild(newBadge);
            }
        }

        // Update count in cart header
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = count;
        }
    }

    // Render cart items
    function renderCartItems() {
        const container = document.querySelector('.cart-items-container');
        if (!container) return;

        if (cart.length === 0) {
            container.innerHTML = `
                <div class="cart-empty">
                    <div class="empty-cart-icon">🛒</div>
                    <p>Your cart is empty</p>
                    <a href="/shop.html" class="shop-now-btn">Shop Now</a>
                </div>
            `;
            return;
        }

        container.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" data-id="${item.id}" aria-label="Decrease quantity">−</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
                    </div>
                </div>
                <button class="remove-item" data-id="${item.id}" aria-label="Remove item">&times;</button>
            </div>
        `).join('');

        // Attach event listeners to new buttons
        attachItemListeners();
    }

    // Update cart total
    function updateCartTotal() {
        const subtotalElement = document.querySelector('.cart-subtotal');
        if (subtotalElement) {
            const subtotal = getCartSubtotal();
            subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        }
    }

    // ===== CART PANEL FUNCTIONS =====
    
    // Open cart panel
    function openCart() {
        const overlay = document.querySelector('.cart-overlay');
        if (overlay) {
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    }

    // Close cart panel
    function closeCart() {
        const overlay = document.querySelector('.cart-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    }

    // 🟢 ADDITION: Toggle cart panel
    function toggleCart() {
        const overlay = document.querySelector('.cart-overlay');
        if (overlay && overlay.classList.contains('active')) {
            closeCart();
        } else {
            openCart();
        }
    }

   
    
    //  Show "Added to cart" feedback
    function showAddedFeedback() {
        // Animate badge
        const badge = document.querySelector('.cart-badge');
        if (badge) {
            badge.classList.add('pulse');
            setTimeout(() => badge.classList.remove('pulse'), 600);
        }
    }

    // ===== EVENT LISTENERS =====
    
    // Attach main cart listeners
    function attachCartListeners() {
        // Cart icon click
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.addEventListener('click', toggleCart);
        }

        // Close cart button
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('close-cart')) {
                closeCart();
            }
        });

        // Click outside cart to close
        document.addEventListener('click', function(e) {
            const overlay = document.querySelector('.cart-overlay');
            if (e.target === overlay) {
                closeCart();
            }
        });

        // Checkout button
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('checkout-btn')) {
                handleCheckout();
            }
        });

        // Add to cart buttons (for product detail page)
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('add-to-cart')) {
                if (typeof products === 'undefined') {
                    console.error('Products data not loaded!');
                    return;
                }
                const productId = parseInt(new URLSearchParams(window.location.search).get('id'));
                const product = products.find(p => p.id === productId);
                
                if (product) {
                    addToCart(product);
                }
            }
        });
    }

    // Attach listeners to cart item buttons
    function attachItemListeners() {
        // Remove item buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                removeFromCart(productId);
            });
        });

        // Quantity decrease buttons
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                updateQuantity(productId, -1);
            });
        });

        // Quantity increase buttons
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                updateQuantity(productId, 1);
            });
        });
    }

    // ===== CHECKOUT HANDLER =====
    
    // Handle checkout
    function handleCheckout() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        // TODO: Implement actual checkout
        alert(`Proceeding to checkout with ${getCartCount()} items totaling $${getCartSubtotal().toFixed(2)}`);
        
        // For now, just close the cart
        // In production, you'd navigate to checkout page
        // window.location.href = '/checkout.html';
    }

    // ===== INITIALIZE =====
    initCart();

    //Make addToCart globally accessible for shop page
    window.addToCart = addToCart;
});
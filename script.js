let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Load menu items
window.onload = function() {
    const foodItems = JSON.parse(localStorage.getItem("foodItems")) || [];
    const foodMenu = document.getElementById("foodMenu");

    foodMenu.innerHTML = foodItems.map((item, index) => `
        <div class="food-card">
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>₹${item.price}</p>
            <button class="add-to-cart-btn" 
                    onclick="addToCart(${index})" 
                    id="btn-${index}">
                Add to Cart
            </button>
        </div>
    `).join('');
    updateCart();
};

function addToCart(index) {
    const foodItems = JSON.parse(localStorage.getItem("foodItems")) || [];
    const item = foodItems[index];
    
    const existingItem = cart.find(cartItem => cartItem.name === item.name);
    
    if (!existingItem) {
        cart.push({
            name: item.name,
            price: item.price,
            quantity: 1,
            image: item.image
        });
        
        const btn = document.getElementById(`btn-${index}`);
        btn.classList.add('added');
        btn.innerHTML = 'Added ✓';
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

function updateCart() {
    const cartDiv = document.getElementById("cart");
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartDiv.innerHTML = `
        <div class="cart-header">
            <h3>Your Cart (${totalItems})</h3>
        </div>
        ${cart.map((item, index) => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" width="40">
                <div class="item-details">
                    <span>${item.name}</span>
                    <span>₹${item.price} x ${item.quantity}</span>
                </div>
                <div class="item-controls">
                    <button onclick="updateQuantity(${index}, 'decrease')">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${index}, 'increase')">+</button>
                    <button onclick="removeFromCart(${index})" class="remove-btn">×</button>
                </div>
            </div>
        `).join('')}
        <div class="cart-total">
            <span>Total:</span>
            <span>₹${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</span>
        </div>
    `;
}

function updateQuantity(index, action) {
    if (action === 'increase') {
        cart[index].quantity++;
    } else if (action === 'decrease') {
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
        } else {
            removeFromCart(index);
            return;
        }
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

function removeFromCart(index) {
    const removedItem = cart.splice(index, 1)[0];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    
    // Reset button state
    const foodItems = JSON.parse(localStorage.getItem("foodItems")) || [];
    const itemIndex = foodItems.findIndex(item => item.name === removedItem.name);
    const btn = document.getElementById(`btn-${itemIndex}`);
    if (btn) {
        btn.classList.remove('added');
        btn.innerHTML = 'Add to Cart';
    }


    // Check if cart is empty
    if (cart.length === 0) {
        alert("Your cart is empty. Please add items to the cart first.");
        return;
    }

    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    console.log("Total calculated:", total); // Debugging

    // Create bill modal
    const billModal = document.createElement('div');
    billModal.className = 'bill-modal';
    billModal.innerHTML = `
        <div class="bill-header">
            <h2><i class="fas fa-receipt"></i> Canteen Bill</h2>
            <p>Date: ${new Date().toLocaleDateString()}</p>
        </div>
        ${cart.map((item, index) => `
            <div class="bill-item">
                <div class="item-row">
                    <span>${item.name} x ${item.quantity}</span>
                    <span>₹${item.price * item.quantity}</span>
                </div>
            </div>
        `).join('')}
        <div class="bill-total">
            <div class="item-row">
                <strong>Total:</strong>
                <strong>₹${total}</strong>
            </div>
        </div>
        <div class="bill-actions">
            <button onclick="handlePayment()" class="payment-btn">
                <i class="fas fa-credit-card"></i> Pay Now
            </button>
            <button onclick="printBill()" class="print-btn">
                <i class="fas fa-print"></i> Print
            </button>
        </div>
    `;

    // Add overlay
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.onclick = () => {
        document.body.removeChild(overlay);
        document.body.removeChild(billModal);
    };

    // Append modal and overlay to the body
    document.body.appendChild(overlay);
    document.body.appendChild(billModal);

    console.log("Bill modal added to DOM:", billModal); // Debugging
    console.log("Bill modal HTML:", billModal.innerHTML); // Debugging
}
    
    // Create bill modal
    const billModal = document.createElement('div');
    billModal.className = 'bill-modal';
    billModal.innerHTML = `
        <div class="bill-header">
            <h2><i class="fas fa-receipt"></i> Canteen Bill</h2>
            <p>Date: ${new Date().toLocaleDateString()}</p>
        </div>
        ${cart.map((item, index) => `
            <div class="bill-item">
                <div class="item-row">
                    <span>${item.name} x ${item.quantity}</span>
                    <span>₹${item.price * item.quantity}</span>
                </div>
            </div>
        `).join('')}
        <div class="bill-total">
            <div class="item-row">
                <strong>Total:</strong>
                <strong>₹${total}</strong>
            </div>
        </div>
        <div class="bill-actions">
            <button onclick="handlePayment()" class="payment-btn">
                <i class="fas fa-credit-card"></i> Pay Now
            </button>
            <button onclick="printBill()" class="print-btn">
                <i class="fas fa-print"></i> Print
            </button>
        </div>
    `;

    // Add overlay
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.onclick = () => {
        document.body.removeChild(overlay);
        document.body.removeChild(billModal);
    };

    document.body.appendChild(overlay);
    document.body.appendChild(billModal);


function handlePayment() {
    const paymentWindow = window.open("", "Payment", "width=600,height=400");
    
    paymentWindow.document.write(`
        <html>
            <head>
                <title>Payment</title>
                <style>
                    body { 
                        font-family: Arial; 
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        background: #f5f5f5;
                    }
                    .payment-container {
                        background: white;
                        padding: 30px;
                        border-radius: 10px;
                        box-shadow: 0 0 15px rgba(0,0,0,0.1);
                        animation: scaleUp 0.3s ease-out;
                    }
                    @keyframes scaleUp {
                        from { transform: scale(0.9); opacity: 0; }
                        to { transform: scale(1); opacity: 1; }
                    }
                </style>
            </head>
            <body>
                <div class="payment-container">
                    <h2><i class="fas fa-lock"></i> Secure Payment</h2>
                    <div class="payment-amount">
                        <i class="fas fa-rupee-sign"></i>
                        ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
                    </div>
                    <input type="text" placeholder="Card Number" class="card-input">
                    <input type="text" placeholder="MM/YY" class="expiry-input">
                    <input type="text" placeholder="CVV" class="cvv-input">
                    <button onclick="processPayment()" class="pay-now-btn">
                        <i class="fas fa-check-circle"></i> Confirm Payment
                    </button>
                </div>
                <script>
                    function processPayment() {
                        const success = document.createElement('div');
                        success.className = 'payment-success';
                        success.innerHTML = \`
                            <div style="background: #4CAF50; color: white; padding: 20px; border-radius: 5px;">
                                <i class="fas fa-check-circle"></i> Processing...
                            </div>
                        \`;
                        document.body.appendChild(success);
                        
                        setTimeout(() => {
                            window.close();
                            window.opener.showPaymentSuccess();
                        }, 2000);
                    }
                </script>
            </body>
        </html>
    `);
}

function showPaymentSuccess() {
    const notification = document.createElement('div');
    notification.className = 'payment-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <div>
            <h3>Payment Successful!</h3>
            <p>₹${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)} received</p>
        </div>
    `;

    document.body.appendChild(notification);

    // Clear cart after payment
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();

    // Remove notification after animation
    setTimeout(() => {
        notification.remove();
    }, 3500);
}

/**
 * Autobuy Product System
 * Handles product purchasing functionality
 */

class AutobuySystem {
    constructor() {
        this.bindEvents();
    }
    
    bindEvents() {
        // Wait for DOM to be fully loaded to make sure all products are rendered
        document.addEventListener('DOMContentLoaded', () => {
            // Add event listeners to all purchase buttons
            const purchaseButtons = document.querySelectorAll('.purchase-btn');
            purchaseButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = e.currentTarget.getAttribute('data-product-id');
                    const productName = e.currentTarget.closest('.product-card').querySelector('.product-name').textContent;
                    const productPrice = e.currentTarget.closest('.product-card').querySelector('.product-price').textContent;
                    
                    this.initiateCheckout({
                        id: productId,
                        name: productName,
                        price: productPrice
                    });
                });
            });
        });
    }
    
    initiateCheckout(product) {
        // Show confirmation modal
        this.showConfirmationModal(product, () => {
            // This will be called when the user confirms the purchase
            this.processPayment(product);
        });
    }
    
    showConfirmationModal(product, onConfirm) {
        // Remove existing modal if there is one
        const existingModal = document.querySelector('.modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create modal element
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Confirm Purchase</h2>
                <div class="product-details">
                    <h3>${product.name}</h3>
                    <p class="product-description">Are you sure you want to purchase this product?</p>
                    <p class="product-price">${product.price}</p>
                </div>
                <div class="modal-buttons">
                    <button class="btn btn-secondary cancel-btn">Cancel</button>
                    <button class="btn btn-primary confirm-btn">Confirm Purchase</button>
                </div>
            </div>
        `;
        
        // Add to document
        document.body.appendChild(modal);
        
        // Handle close button
        const closeButton = modal.querySelector('.close-modal');
        closeButton.addEventListener('click', () => {
            modal.remove();
        });
        
        // Handle cancel button
        const cancelButton = modal.querySelector('.cancel-btn');
        cancelButton.addEventListener('click', () => {
            modal.remove();
        });
        
        // Handle confirm button
        const confirmButton = modal.querySelector('.confirm-btn');
        confirmButton.addEventListener('click', () => {
            modal.remove();
            onConfirm();
        });
        
        // Close when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Show modal with animation
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }
    
    processPayment(product) {
        // Show notification
        showNotification(`Processing purchase for ${product.name}...`, 'success');
        
        // Fetch product URL from backend
        fetch(`/api/products`)
            .then(response => response.json())
            .then(data => {
                const productData = data.products.find(p => p.id === product.id);
                
                if (productData && productData.url) {
                    setTimeout(() => {
                        window.open(productData.url, '_blank');
                        showNotification(`Redirecting to ${product.name} purchase page`, 'success');
                    }, 1000);
                } else {
                    showNotification('Product URL not available', 'error');
                    console.error('Product URL not found for ID:', product.id);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Error processing purchase. Please try again.', 'error');
            });
    }
}

// Add modal styles to the document
function addModalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .modal {
            display: flex;
            position: fixed;
            z-index: 1001;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .modal.show {
            opacity: 1;
        }
        
        .modal-content {
            background-color: var(--bg-dark);
            border-radius: 10px;
            padding: 2rem;
            width: 90%;
            max-width: 500px;
            position: relative;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
            transform: scale(0.8);
            transition: transform 0.3s ease;
        }
        
        .modal.show .modal-content {
            transform: scale(1);
        }
        
        .close-modal {
            position: absolute;
            top: 15px;
            right: 15px;
            font-size: 24px;
            font-weight: bold;
            color: var(--text-muted);
            cursor: pointer;
        }
        
        .close-modal:hover {
            color: var(--text-primary);
        }
        
        .product-details {
            margin: 1.5rem 0;
        }
        
        .product-description {
            color: var(--text-muted);
            margin: 0.5rem 0;
        }
        
        .product-price {
            font-size: 1.5rem;
            color: var(--success);
            font-weight: 700;
            margin: 1rem 0;
        }
        
        .modal-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 1.5rem;
        }
    `;
    
    document.head.appendChild(style);
}

// Initialize Autobuy system
const autobuySystem = new AutobuySystem();

// Add modal styles
document.addEventListener('DOMContentLoaded', () => {
    addModalStyles();
});

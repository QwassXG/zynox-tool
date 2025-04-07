/**
 * Discord Nitro Promo Checker
 * Handles validation of Discord Nitro promo links
 */

class PromoChecker {
    constructor() {
        // Initialize DOM elements
        this.promoInput = document.getElementById('promo-input');
        this.validatePromosBtn = document.getElementById('validate-promos-btn');
        this.clearPromosBtn = document.getElementById('clear-promos-btn');
        this.promoResults = document.getElementById('promo-results');
        this.promoCards = document.getElementById('promo-cards');
        this.validCountElement = document.getElementById('promo-valid-count');
        this.totalCountElement = document.getElementById('promo-total-count');
        this.promoLoader = document.getElementById('promo-loader');
        
        // Bind events
        this.bindEvents();
    }
    
    bindEvents() {
        // Promo validation
        if (this.validatePromosBtn) {
            this.validatePromosBtn.addEventListener('click', () => this.validatePromos());
        }
        
        // Clear functionality
        if (this.clearPromosBtn) {
            this.clearPromosBtn.addEventListener('click', () => this.clearPromos());
        }
        
        // Enter key for promo validation
        if (this.promoInput) {
            this.promoInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter' && e.ctrlKey) this.validatePromos();
            });
        }
    }
    
    // Clear promos and results
    clearPromos() {
        this.promoInput.value = '';
        this.promoResults.style.display = 'none';
        this.promoCards.innerHTML = '';
        
        // Add animation to clear button
        this.clearPromosBtn.classList.add('btn-clicked');
        setTimeout(() => {
            this.clearPromosBtn.classList.remove('btn-clicked');
        }, 800);
        
        showNotification('Promo checker cleared');
    }
    
    // Validate promo links
    async validatePromos() {
        const promosText = this.promoInput.value.trim();
        
        if (!promosText) {
            showNotification('Please enter Nitro promo links', 'error');
            return;
        }
        
        const links = promosText.split('\n')
            .map(link => link.trim())
            .filter(link => link.length > 0);
            
        if (links.length === 0) {
            showNotification('No valid promo links found', 'error');
            return;
        }
        
        this.setLoading(true);
        this.promoCards.innerHTML = '';
        
        try {
            const response = await fetch('/api/validate-promo-links', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ links })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.displayResults(data.results);
            } else {
                showNotification(data.message || 'Error validating promo links', 'error');
                this.promoCards.innerHTML = `<p class="error-message">${data.message || 'Error validating promo links'}</p>`;
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error validating promo links', 'error');
            this.promoCards.innerHTML = `<p class="error-message">Error: ${error.message}</p>`;
        } finally {
            this.setLoading(false);
        }
    }
    
    // Display results for promo links
    displayResults(results) {
        if (!results || results.length === 0) {
            this.promoCards.innerHTML = '<p>No results found</p>';
            return;
        }
        
        const validResults = results.filter(result => result.valid);
        const validCount = validResults.length;
        
        // Update counts
        this.validCountElement.textContent = validCount;
        this.totalCountElement.textContent = results.length;
        
        // Show results container
        this.promoResults.style.display = 'block';
        
        // Create card for each result
        results.forEach(result => {
            const cardHTML = this.createPromoResultHTML(result);
            const cardElement = document.createElement('div');
            cardElement.innerHTML = cardHTML;
            this.promoCards.appendChild(cardElement.firstElementChild);
        });
    }
    
    // Create HTML for promo result card
    createPromoResultHTML(result) {
        if (!result.valid) {
            return `
                <div class="promo-card invalid">
                    <h3><i class="fas fa-times-circle"></i> Invalid Promo</h3>
                    <div class="detail">
                        <span class="label">Message:</span>
                        <span class="value">${result.message || 'This promo link is not valid or has expired.'}</span>
                    </div>
                    <div class="promo-url">${result.promo_url}</div>
                </div>
            `;
        }
        
        return `
            <div class="promo-card">
                <h3><i class="fas fa-gift"></i> ${result.name}</h3>
                <div class="detail">
                    <span class="label">Description:</span>
                    <span class="value">${result.description || 'No description available'}</span>
                </div>
                <div class="detail">
                    <span class="label">Expiration:</span>
                    <span class="value">${result.expiration}</span>
                </div>
                <div class="detail">
                    <span class="label">Promo Code:</span>
                    <span class="value">${result.promo_code}</span>
                </div>
                <div class="promo-url">${result.promo_url}</div>
            </div>
        `;
    }
    
    // Set loading state
    setLoading(isLoading) {
        this.promoLoader.style.display = isLoading ? 'block' : 'none';
        this.validatePromosBtn.disabled = isLoading;
    }
}

// Initialize promo checker when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PromoChecker();
});

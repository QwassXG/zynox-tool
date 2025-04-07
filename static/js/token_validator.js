/**
 * Discord Token Validator
 * Handles validation of Discord tokens and displays account information
 */

class TokenValidator {
    constructor() {
        // Initialize DOM elements
        this.tokenInput = document.getElementById('token-input');
        this.validateTokensBtn = document.getElementById('validate-tokens-btn');
        this.clearTokensBtn = document.getElementById('clear-tokens-btn');
        this.tokenResults = document.getElementById('token-results');
        this.tokenCards = document.getElementById('token-cards');
        this.validCountElement = document.getElementById('valid-count');
        this.totalCountElement = document.getElementById('total-count');
        this.copyValidTokensBtn = document.getElementById('copy-valid-tokens');
        this.tokenLoader = document.getElementById('token-loader');
        
        // Store valid tokens
        this.validTokens = [];
        
        // Bind events
        this.bindEvents();
    }
    
    bindEvents() {
        // Token validation
        this.validateTokensBtn.addEventListener('click', () => this.validateTokens());
        
        // Clear functionality
        this.clearTokensBtn.addEventListener('click', () => this.clearTokens());
        
        // Enter key for token validation
        this.tokenInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) this.validateTokens();
        });
        
        // Copy valid tokens
        if (this.copyValidTokensBtn) {
            this.copyValidTokensBtn.addEventListener('click', () => {
                if (this.validTokens.length > 0) {
                    navigator.clipboard.writeText(this.validTokens.join('\n'))
                        .then(() => showNotification(`Copied ${this.validTokens.length} valid tokens to clipboard`))
                        .catch(err => console.error('Could not copy text:', err));
                } else {
                    showNotification('No valid tokens to copy', 'warning');
                }
            });
        }
    }
    
    // Clear tokens and results
    clearTokens() {
        this.tokenInput.value = '';
        this.tokenResults.style.display = 'none';
        this.tokenCards.innerHTML = '';
        this.validTokens = [];
        
        // Add animation to clear button
        this.clearTokensBtn.classList.add('btn-clicked');
        setTimeout(() => {
            this.clearTokensBtn.classList.remove('btn-clicked');
        }, 800);
        
        showNotification('Token checker cleared');
    }
    
    // Validate tokens
    async validateTokens() {
        const tokensText = this.tokenInput.value.trim();
        
        if (!tokensText) {
            showNotification('Please enter tokens', 'error');
            return;
        }
        
        const tokens = tokensText.split('\n')
            .map(token => token.trim())
            .filter(token => token.length > 0);
            
        if (tokens.length === 0) {
            showNotification('No valid tokens found', 'error');
            return;
        }
        
        this.setLoading(true);
        this.validTokens = [];
        
        try {
            // Validate all tokens using the multi-token endpoint
            const response = await fetch('/api/validate-tokens', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tokens })
            });
            
            const data = await response.json();
            
            if (data.results) {
                this.displayResults(data.results);
            } else {
                showNotification('Error: Invalid response from server', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error validating tokens', 'error');
        } finally {
            this.setLoading(false);
        }
    }
    
    // Display results for tokens
    displayResults(results) {
        this.tokenCards.innerHTML = '';
        
        if (!results || results.length === 0) {
            this.tokenCards.innerHTML = '<p>No results found</p>';
            return;
        }
        
        const validResults = results.filter(result => result.valid);
        const validCount = validResults.length;
        
        // Store valid tokens for copy functionality
        this.validTokens = validResults.map(result => result.token);
        
        // Update counts
        this.validCountElement.textContent = validCount;
        this.totalCountElement.textContent = results.length;
        
        // Show results container
        this.tokenResults.style.display = 'block';
        
        // Create card for each result
        results.forEach(result => {
            const cardHTML = this.createTokenResultHTML(result);
            const cardElement = document.createElement('div');
            cardElement.innerHTML = cardHTML;
            this.tokenCards.appendChild(cardElement.firstElementChild);
        });
    }
    
    // Create HTML for token result card
    createTokenResultHTML(data) {
        if (!data.valid) {
            return `
                <div class="token-card invalid">
                    <h3>Invalid Token</h3>
                    <p>${data.message || 'This token is not valid or has expired.'}</p>
                </div>
            `;
        }
        
        return `
            <div class="token-card">
                <h3>${data.username}</h3>
                <div class="detail">
                    <span class="label">Email:</span>
                    <span class="value">${data.email}</span>
                </div>
                <div class="detail">
                    <span class="label">Email Verified:</span>
                    <span class="value ${data.email_verified ? 'verified' : 'not-verified'}">
                        ${data.email_verified ? 'Yes' : 'No'}
                    </span>
                </div>
                <div class="detail">
                    <span class="label">Phone:</span>
                    <span class="value">${data.phone}</span>
                </div>
                <div class="detail">
                    <span class="label">Phone Verified:</span>
                    <span class="value ${data.phone_verified ? 'verified' : 'not-verified'}">
                        ${data.phone_verified ? 'Yes' : 'No'}
                    </span>
                </div>
                <div class="detail">
                    <span class="label">Nitro:</span>
                    <span class="value">${data.nitro}</span>
                </div>
                <div class="detail">
                    <span class="label">Created:</span>
                    <span class="value">${data.creation_date} (${data.account_age} days old)</span>
                </div>
            </div>
        `;
    }
    
    // Set loading state
    setLoading(isLoading) {
        this.tokenLoader.style.display = isLoading ? 'block' : 'none';
        this.validateTokensBtn.disabled = isLoading;
    }
}

// Initialize token validator when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TokenValidator();
});

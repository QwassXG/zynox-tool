/**
 * Combo Formatter
 * Handles formatting of email:pass:token combinations
 */

class ComboFormatter {
    constructor() {
        // Initialize DOM elements
        this.comboInput = document.getElementById('combo-input');
        this.formatComboBtn = document.getElementById('format-combo-btn');
        this.clearComboBtn = document.getElementById('clear-combo-btn');
        this.tokensList = document.getElementById('tokens-list');
        this.emailPassList = document.getElementById('email-pass-list');
        this.tokensCount = document.getElementById('tokens-count');
        this.comboCount = document.getElementById('combo-count');
        this.tokensCopyBtn = document.getElementById('tokens-copy-btn');
        this.emailPassCopyBtn = document.getElementById('email-pass-copy-btn');
        this.comboLoader = document.getElementById('combo-loader');
        this.resultsContainer = document.getElementById('combo-results');
        
        // Bind events
        this.bindEvents();
    }
    
    bindEvents() {
        // Format combo
        this.formatComboBtn.addEventListener('click', () => this.formatCombo());
        
        // Clear combo
        this.clearComboBtn.addEventListener('click', () => this.clearCombo());
        
        // Enter key for combo formatting
        this.comboInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) this.formatCombo();
        });
        
        // Copy buttons
        if (this.tokensCopyBtn) {
            this.tokensCopyBtn.addEventListener('click', () => {
                const text = this.tokensList.textContent;
                if (text && text.trim()) {
                    this.copyText(text, 'Tokens copied to clipboard');
                } else {
                    showNotification('No tokens to copy', 'warning');
                }
            });
        }
        
        if (this.emailPassCopyBtn) {
            this.emailPassCopyBtn.addEventListener('click', () => {
                const text = this.emailPassList.textContent;
                if (text && text.trim()) {
                    this.copyText(text, 'Email:Pass copied to clipboard');
                } else {
                    showNotification('No email:pass to copy', 'warning');
                }
            });
        }
    }
    
    // Clear combo and results
    clearCombo() {
        this.comboInput.value = '';
        this.resultsContainer.style.display = 'none';
        this.tokensList.textContent = '';
        this.emailPassList.textContent = '';
        
        // Add animation to clear button
        this.clearComboBtn.classList.add('btn-clicked');
        setTimeout(() => {
            this.clearComboBtn.classList.remove('btn-clicked');
        }, 800);
        
        showNotification('Combo formatter cleared');
    }
    
    // Format combo list
    async formatCombo() {
        const comboText = this.comboInput.value.trim();
        
        if (!comboText) {
            showNotification('Please enter combo list', 'error');
            return;
        }
        
        this.setLoading(true);
        
        try {
            const response = await fetch('/api/format-combo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ combo: comboText })
            });
            
            const data = await response.json();
            
            if (!data) {
                showNotification('Error: Invalid response from server', 'error');
                return;
            }
            
            this.displayResults(data);
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error formatting combo', 'error');
        } finally {
            this.setLoading(false);
        }
    }
    
    // Display formatted results
    displayResults(data) {
        // Reset the results
        this.tokensList.textContent = '';
        this.emailPassList.textContent = '';
        
        // Tokens
        if (data.tokens && data.tokens.length > 0) {
            this.tokensList.textContent = data.tokens.join('\n');
            this.tokensCount.textContent = data.tokens.length;
        }
        
        // Email:Pass
        if (data.email_pass && data.email_pass.length > 0) {
            this.emailPassList.textContent = data.email_pass.join('\n');
            this.comboCount.textContent = data.email_pass.length;
        }
        
        // Show results container if we have any results
        const hasResults = (data.tokens && data.tokens.length > 0) || 
                          (data.email_pass && data.email_pass.length > 0);
        
        if (hasResults) {
            this.resultsContainer.style.display = 'block';
            
            // Show notification
            const totalCount = (data.tokens ? data.tokens.length : 0) + 
                              (data.email_pass ? data.email_pass.length : 0);
            
            showNotification(`Successfully formatted ${totalCount} items`);
        } else {
            showNotification('No valid combo format found', 'error');
        }
    }
    
    // Copy text to clipboard
    copyText(text, successMessage) {
        navigator.clipboard.writeText(text)
            .then(() => showNotification(successMessage))
            .catch(err => {
                console.error('Could not copy text:', err);
                showNotification('Failed to copy to clipboard', 'error');
            });
    }
    
    // Set loading state
    setLoading(isLoading) {
        this.comboLoader.style.display = isLoading ? 'block' : 'none';
        this.formatComboBtn.disabled = isLoading;
    }
}

// Initialize combo formatter when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ComboFormatter();
});

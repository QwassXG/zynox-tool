/**
 * 3D Loading Animation
 * Creates a smooth loading transition when the page is loaded or refreshed
 */
class LoadingManager {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.isLoading = false;
        this.init();
    }

    init() {
        // Show loading screen immediately
        this.show();
        
        // Add event listeners
        window.addEventListener('load', () => this.hide());
        
        // Add loading screen styles if not already in CSS
        this.addLoadingStyles();
    }

    show() {
        if (this.loadingScreen) {
            this.isLoading = true;
            this.loadingScreen.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    hide() {
        if (this.loadingScreen && this.isLoading) {
            // Add a small delay for smoother transition
            setTimeout(() => {
                this.loadingScreen.style.opacity = '0';
                
                setTimeout(() => {
                    this.loadingScreen.style.display = 'none';
                    this.loadingScreen.style.opacity = '1';
                    document.body.style.overflow = 'auto';
                    this.isLoading = false;
                }, 500);
            }, 500);
        }
    }

    addLoadingStyles() {
        // Only add styles if they don't exist
        if (!document.getElementById('loading-screen-styles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'loading-screen-styles';
            
            styleElement.textContent = `
                #loading-screen {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: #202225;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                    transition: opacity 0.5s ease;
                }
                
                .loading-content {
                    text-align: center;
                }
                
                .loading-spinner {
                    width: 70px;
                    height: 70px;
                    margin: 0 auto 20px;
                    border: 5px solid rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    border-top-color: #5865F2;
                    border-left-color: #EB459E;
                    border-right-color: #57F287;
                    animation: spin 1s infinite linear, colorChange 3s infinite ease-in-out;
                }
                
                .loading-text {
                    color: #FFFFFF;
                    font-family: 'Nunito', sans-serif;
                    font-size: 1.2rem;
                    font-weight: 600;
                    letter-spacing: 2px;
                    animation: pulse 1.5s infinite;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @keyframes colorChange {
                    0% { border-top-color: #5865F2; border-left-color: #EB459E; border-right-color: #57F287; }
                    33% { border-top-color: #EB459E; border-left-color: #57F287; border-right-color: #5865F2; }
                    66% { border-top-color: #57F287; border-left-color: #5865F2; border-right-color: #EB459E; }
                    100% { border-top-color: #5865F2; border-left-color: #EB459E; border-right-color: #57F287; }
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `;
            
            document.head.appendChild(styleElement);
        }
    }
}

// Initialize loading manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const loadingManager = new LoadingManager();
    
    // Force show the loading screen on page refresh
    window.addEventListener('beforeunload', () => {
        document.getElementById('loading-screen').style.display = 'flex';
        document.getElementById('loading-screen').style.opacity = '1';
    });
});
// Battery SOC Checker JavaScript
class BatterySOCChecker {
  constructor() {
    // Use the batteries API endpoint
    this.baseUrl = '/batteries';

    this.initializeElements();
    this.attachEventListeners();
  }
  initializeElements() {
    // Input elements
    this.batteryIdInput = document.getElementById('battery-id');
    this.fetchBtn = document.getElementById('fetch-soc-btn');
    this.clearBtn = document.getElementById('clear-btn');

    // Display elements
    this.loadingDiv = document.getElementById('loading');
    this.resultsDiv = document.getElementById('results');
    this.errorDiv = document.getElementById('error');
    this.noDataDiv = document.getElementById('no-data');

    // Result elements
    this.batteryOemSpan = document.getElementById('battery-oem');
    this.currentSocSpan = document.getElementById('current-soc');
    this.socProgress = document.getElementById('soc-progress');
    this.socPercentage = document.getElementById('soc-percentage');
    this.errorMessage = document.getElementById('error-message');
  }

  attachEventListeners() {
    this.fetchBtn.addEventListener('click', () => this.fetchBatterySOC());
    this.clearBtn.addEventListener('click', () => this.clearResults());

    // Allow Enter key to trigger fetch
    this.batteryIdInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.fetchBatterySOC();
      }
    });

    // Clear error when user starts typing
    this.batteryIdInput.addEventListener('input', () => {
      this.hideError();
    });
  }

  async fetchBatterySOC() {
    const batteryId = this.batteryIdInput.value.trim();

    if (!batteryId) {
      this.showError('Please enter a battery ID');
      this.batteryIdInput.focus();
      return;
    }

    this.showLoading();
    this.hideError();
    this.hideResults();

    try {
      const url = `${this.baseUrl}/${batteryId}/soc`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Handle wrapped response format from controller
      const batteryData = data.data || data;

      if (!batteryData || typeof batteryData.current_soc === 'undefined') {
        throw new Error('Invalid response format - missing SOC data');
      }

      this.displayResults(batteryData);
    } catch (error) {
      console.error('Error fetching battery SOC:', error);
      this.showError(this.getErrorMessage(error));
    } finally {
      this.hideLoading();
    }
  }

  displayResults(data) {
    const { battery_oem, current_soc } = data;

    // Update text values
    this.batteryOemSpan.textContent = battery_oem || 'Unknown';
    this.currentSocSpan.textContent = `${current_soc}%`;

    // Update SOC progress bar
    this.updateSOCProgress(current_soc);

    // Show results
    this.showResults();
  }

  updateSOCProgress(soc) {
    const percentage = Math.max(0, Math.min(100, soc));

    // Update progress bar width
    this.socProgress.style.width = `${percentage}%`;
    this.socPercentage.textContent = `${percentage}%`;

    // Update progress bar color based on SOC level
    this.socProgress.className = 'soc-progress';
    if (percentage <= 20) {
      this.socProgress.classList.add('low');
    } else if (percentage <= 60) {
      this.socProgress.classList.add('medium');
    } else {
      this.socProgress.classList.add('high');
    }
  }

  clearResults() {
    this.batteryIdInput.value = '';
    this.hideResults();
    this.hideError();
    this.hideLoading();
    this.showNoData();
    this.batteryIdInput.focus();
  }

  showLoading() {
    this.loadingDiv.classList.remove('hidden');
    this.fetchBtn.disabled = true;
    this.fetchBtn.textContent = 'Fetching...';
  }

  hideLoading() {
    this.loadingDiv.classList.add('hidden');
    this.fetchBtn.disabled = false;
    this.fetchBtn.textContent = 'Fetch SOC';
  }

  showResults() {
    this.resultsDiv.classList.remove('hidden');
    this.noDataDiv.classList.add('hidden');
  }

  hideResults() {
    this.resultsDiv.classList.add('hidden');
  }

  showError(message) {
    this.errorMessage.textContent = message;
    this.errorDiv.classList.remove('hidden');
    this.noDataDiv.classList.add('hidden');
  }

  hideError() {
    this.errorDiv.classList.add('hidden');
  }

  showNoData() {
    this.noDataDiv.classList.remove('hidden');
  }

  getErrorMessage(error) {
    if (error.message.includes('Failed to fetch')) {
      return 'Network error - please check your internet connection and try again.';
    }

    if (error.message.includes('HTTP 401')) {
      return 'Authentication failed - invalid API key.';
    }

    if (error.message.includes('HTTP 404')) {
      return 'Battery not found - please check the battery ID and try again.';
    }

    if (error.message.includes('HTTP 429')) {
      return 'Too many requests - please wait a moment and try again.';
    }

    if (error.message.includes('HTTP 500')) {
      return 'Server error - please try again later.';
    }

    return error.message || 'An unexpected error occurred. Please try again.';
  }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new BatterySOCChecker();
});

// Optional: Add some utility functions for debugging
window.batterySOCDebug = {
  testConnection: async () => {
    try {
      const response = await fetch('/batteries/test/soc', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Test connection status:', response.status);
      return response.status;
    } catch (error) {
      console.error('Test connection failed:', error);
      return false;
    }
  },
};

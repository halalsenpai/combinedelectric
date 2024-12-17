class SolarWizard {
    constructor() {
        this.currentStep = 1;
        this.selectedGoal = null;
        this.formData = new FormData();
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Goal selection
        document.querySelectorAll('.goal-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.handleGoalSelection(e.currentTarget);
            });
        });

        // Navigation buttons
        document.getElementById('prevBtn').addEventListener('click', () => this.previousStep());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextStep());
    }

    handleGoalSelection(card) {
        // Remove previous selection
        document.querySelectorAll('.goal-card').forEach(c => c.classList.remove('selected'));
        
        // Add selection to clicked card
        card.classList.add('selected');
        
        // Store selected goal
        this.selectedGoal = card.dataset.goal;
        
        // Show next button
        document.getElementById('nextBtn').style.display = 'block';
    }

    loadStepForm() {
        const formContainer = document.getElementById('step-2');
        formContainer.innerHTML = this.getFormTemplate();
        
        // Initialize form event listeners
        this.initializeFormListeners();
    }

    getFormTemplate() {
        switch(this.selectedGoal) {
            case 'complete_solar':
                return this.getCompleteSolarForm();
            case 'backup':
                return this.getBackupForm();
            case 'reduce_bill':
                return this.getReduceBillForm();
            default:
                return '';
        }
    }

    // Form templates for each goal
    getCompleteSolarForm() {
        return `
            <h3 class="text-center mb-4">Complete Solar Solution</h3>
            <div class="form-section">
                <form id="solar-form">
                    <div class="mb-3">
                        <label class="form-label">Monthly Electricity Bill (PKR)</label>
                        <input type="number" class="form-control" name="monthly-bill" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Usage Type</label>
                        <select class="form-select" name="usage-type" required>
                            <option value="residential">Residential</option>
                            <option value="commercial">Commercial</option>
                        </select>
                    </div>
                </form>
            </div>
        `;
    }

    // Add other form templates...

    nextStep() {
        if (this.currentStep === 1 && !this.selectedGoal) {
            alert('Please select a goal to continue');
            return;
        }

        this.currentStep++;
        this.updateUI();

        if (this.currentStep === 2) {
            this.loadStepForm();
        } else if (this.currentStep === 3) {
            this.calculateAndShowResults();
        }
    }

    previousStep() {
        this.currentStep--;
        this.updateUI();
    }

    updateUI() {
        // Update progress bar
        const progress = ((this.currentStep - 1) / 2) * 100;
        document.querySelector('.progress-bar').style.width = `${progress}%`;

        // Update steps
        document.querySelectorAll('.step').forEach((step, index) => {
            if (index + 1 < this.currentStep) {
                step.classList.add('completed');
            } else if (index + 1 === this.currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active', 'completed');
            }
        });

        // Show/hide steps
        document.querySelectorAll('.step-content').forEach((content, index) => {
            content.classList.toggle('d-none', index + 1 !== this.currentStep);
        });

        // Update navigation buttons
        document.getElementById('prevBtn').style.display = this.currentStep === 1 ? 'none' : 'block';
        document.getElementById('nextBtn').style.display = this.currentStep === 3 ? 'none' : 'block';
    }

    calculateAndShowResults() {
        // Get form data and calculate results
        const form = document.getElementById('solar-form');
        const formData = new FormData(form);
        formData.append('goal', this.selectedGoal);
        
        const results = calculateResults(formData);
        this.displayResults(results);
    }

    displayResults(results) {
        // Implementation from main.js displayResults function
    }
}

// Initialize wizard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.solarWizard = new SolarWizard();
}); 
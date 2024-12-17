const SOLAR_CONSTANTS = {
    // System Parameters
    system: {
        peakSunHours: 5, // Karachi average
        systemEfficiency: 0.85,
        panelWattage: 590, // Jinko N-Type Bifacial
        energyPerPanel: 2.95, // kWh/day for 590W panel
        averageTariff: 64.40, // PKR/unit
        batteryEfficiency: 0.95, // Lithium-ion efficiency
    },

    // Component Specifications
    components: {
        panels: {
            model: "Jinko N-Type Bifacial 590W",
            wattage: 590,
            dailyEnergy: 2.95, // kWh/day
            pricePerPanel: 18585
        },
        batteries: {
            lithium: {
                model: "Inverex Power Wall 48V",
                capacity: 5.3, // kWh
                price: 435000,
                efficiency: 0.95
            }
        },
        inverters: {
            small: {
                model: "Inverex Nitrox 3KW Hybrid",
                capacity: 3,
                price: 210000
            },
            medium: {
                model: "Inverex Nitrox 6KW Hybrid",
                capacity: 6,
                price: 290000
            },
            large: {
                model: "Inverex Nitrox 10KW Hybrid",
                capacity: 10,
                price: 320000
            }
        }
    },

    // Installation Costs
    installation: {
        base: 40000,
        maxBase: 60000,
        perKw: 5000 // Additional cost per kW
    },

    // Display Settings
    display: {
        obfuscatePrices: true // Flag to control price display
    }
};

class SolarCalculator {
    constructor() {
        this.currentStep = 1;
        this.selectedGoal = null;
        console.log('SolarCalculator initialized');
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Goal selection
        const goalCards = document.querySelectorAll('.goal-card');
        console.log('Found goal cards:', goalCards.length);

        goalCards.forEach(card => {
            card.addEventListener('click', (e) => {
                console.log('Goal card clicked:', card.dataset.goal);
                e.preventDefault();
                this.handleGoalSelection(e.currentTarget);
            });
        });
    }

    handleGoalSelection(card) {
        console.log('Handling goal selection:', card.dataset.goal);
        
        // Remove selection from all cards
        document.querySelectorAll('.goal-card').forEach(c => {
            c.classList.remove('selected');
        });
        
        // Add selection to clicked card
        card.classList.add('selected');
        this.selectedGoal = card.dataset.goal;
        
        // Automatically go to next step
        setTimeout(() => this.nextStep(), 300); // Small delay for visual feedback
    }

    nextStep() {
        if (this.currentStep === 1 && !this.selectedGoal) {
            alert('Please select a goal to continue');
            return;
        }

        if (this.currentStep < 3) {
            this.currentStep++;
            this.updateUI();

            if (this.currentStep === 2) {
                const formContainer = document.getElementById('step-2');
                formContainer.innerHTML = this.getFormTemplate();
            } else if (this.currentStep === 3) {
                this.calculateAndShowResults();
            }
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateUI();
        }
    }

    updateUI() {
        // Update progress bar
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            const progress = ((this.currentStep - 1) / 2) * 100;
            progressBar.style.width = `${progress}%`;
        }

        // Update steps
        document.querySelectorAll('.step').forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index + 1 < this.currentStep) {
                step.classList.add('completed');
            } else if (index + 1 === this.currentStep) {
                step.classList.add('active');
            }
        });

        // Show/hide step content
        document.querySelectorAll('.step-content').forEach((content, index) => {
            if (index + 1 === this.currentStep) {
                content.classList.remove('d-none');
            } else {
                content.classList.add('d-none');
            }
        });
    }

    getFormTemplate() {
        switch(this.selectedGoal) {
            case 'complete_solar':
                return `
                    <h4 class="text-center mb-4">Go Completely Solar</h4>
                    <div class="form-section">
                        <form id="solar-form" onsubmit="return false;">
                            <input type="hidden" name="goal" value="complete_solar">
                            
                            <!-- Monthly Bill -->
                            <div class="mb-4">
                                <label class="form-label">Monthly Electricity Bill</label>
                                <div class="input-group">
                                    <span class="input-group-text">PKR</span>
                                    <input type="number" class="form-control" name="monthly-bill" 
                                        placeholder="e.g., 15,000" required min="1000" max="500000">
                                </div>
                                <div class="form-text">Enter your average monthly K-Electric bill</div>
                            </div>
                            <!-- System Information -->
                            <div class="system-info bg-light p-3 rounded mb-4">
                                <h6 class="mb-3">System Components</h6>
                                <div class="row g-3">
                                    <div class="col-md-4">
                                        <div class="d-flex align-items-center">
                                            <i class="bi bi-sun me-2 text-primary"></i>
                                            <div>
                                                <small class="text-muted d-block">Solar Panels</small>
                                                <span>${SOLAR_CONSTANTS.components.panels.model}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="d-flex align-items-center">
                                            <i class="bi bi-battery-charging me-2 text-primary"></i>
                                            <div>
                                                <small class="text-muted d-block">Battery</small>
                                                <span>${SOLAR_CONSTANTS.components.batteries.lithium.model}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="d-flex align-items-center">
                                            <i class="bi bi-lightning-charge me-2 text-primary"></i>
                                            <div>
                                                <small class="text-muted d-block">Inverter</small>
                                                <span>Hybrid Inverter</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="d-flex flex-column gap-3">
                                <button type="button" class="btn btn-primary btn-lg" onclick="window.solarCalculator.calculateAndShowResults()">
                                    <i class="bi bi-calculator me-2"></i>
                                    Calculate Solar Solution
                                </button>
                                <button type="button" class="btn btn-outline-secondary" onclick="window.solarCalculator.previousStep()">
                                    <i class="bi bi-arrow-left me-2"></i>
                                    Back to Goals
                                </button>
                            </div>
                        </form>
                    </div>
                `;

            case 'backup':
                return `
                    <h4 class="text-center mb-4">Maximize Backup Solution</h4>
                    <div class="form-section">
                        <!-- Info Card -->
                        <div class="alert alert-info mb-4">
                            <div class="d-flex">
                                <i class="bi bi-info-circle-fill me-2 mt-1"></i>
                                <div>
                                    <strong>How it works:</strong>
                                    <p class="mb-2 small">We'll calculate your optimal backup system based on:</p>
                                    <ul class="mb-0 small">
                                        <li>Your average power consumption</li>
                                        <li>Required backup duration</li>
                                        <li>Latest lithium battery technology</li>
                                        <li>Smart hybrid inverter system</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <form id="solar-form">
                            <input type="hidden" name="goal" value="backup">
                            
                            <!-- Monthly Bill -->
                            <div class="mb-4">
                                <label class="form-label">Monthly Electricity Bill</label>
                                <div class="input-group">
                                    <span class="input-group-text">PKR</span>
                                    <input type="number" class="form-control" name="monthly-bill" 
                                        placeholder="e.g., 15,000" required min="1000" max="500000">
                                </div>
                                <div class="form-text">Enter your average monthly K-Electric bill</div>
                            </div>

                            <!-- Backup Hours -->
                            <div class="mb-4">
                                <label class="form-label d-flex justify-content-between align-items-center flex-wrap gap-2">
                                    <span>Required Backup Duration</span>
                                    <span class="badge bg-primary">Most Important</span>
                                </label>
                                <div class="backup-options">
                                    <div class="backup-grid">
                                        <input type="radio" class="btn-check" name="backup-hours" 
                                            id="backup4" value="4">
                                        <label class="backup-option" for="backup4">
                                            <div class="backup-content">
                                                <div class="backup-icon">
                                                    <i class="bi bi-clock"></i>
                                                </div>
                                                <div class="backup-details">
                                                    <div class="backup-type">Basic</div>
                                                    <div class="backup-hours">4 Hours</div>
                                                </div>
                                            </div>
                                        </label>

                                        <input type="radio" class="btn-check" name="backup-hours" 
                                            id="backup8" value="8">
                                        <label class="backup-option" for="backup8">
                                            <div class="backup-content">
                                                <div class="backup-icon">
                                                    <i class="bi bi-clock"></i>
                                                </div>
                                                <div class="backup-details">
                                                    <div class="backup-type">Standard</div>
                                                    <div class="backup-hours">8 Hours</div>
                                                </div>
                                            </div>
                                        </label>

                                        <input type="radio" class="btn-check" name="backup-hours" 
                                            id="backup12" value="12" checked>
                                        <label class="backup-option" for="backup12">
                                            <div class="backup-content">
                                                <div class="backup-icon">
                                                    <i class="bi bi-clock"></i>
                                                </div>
                                                <div class="backup-details">
                                                    <div class="backup-type">Extended</div>
                                                    <div class="backup-hours">12 Hours</div>
                                                </div>
                                            </div>
                                        </label>

                                        <input type="radio" class="btn-check" name="backup-hours" 
                                            id="backup24" value="24">
                                        <label class="backup-option" for="backup24">
                                            <div class="backup-content">
                                                <div class="backup-icon">
                                                    <i class="bi bi-clock-fill"></i>
                                                </div>
                                                <div class="backup-details">
                                                    <div class="backup-type">Complete</div>
                                                    <div class="backup-hours">24 Hours</div>
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                <div class="backup-info mt-3">
                                    <div class="info-item">
                                        <i class="bi bi-lightning-charge-fill text-warning"></i>
                                        <span>Choose based on your typical load-shedding duration</span>
                                    </div>
                                    <div class="info-item">
                                        <i class="bi bi-battery-charging text-success"></i>
                                        <span>Longer backup requires more battery capacity</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Features -->
                            <div class="bg-light p-3 rounded mb-4">
                                <h6 class="mb-3">Your Backup System Will Include:</h6>
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <div class="d-flex align-items-center">
                                            <i class="bi bi-battery text-primary me-2"></i>
                                            <span class="small">Premium Lithium Batteries</span>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="d-flex align-items-center">
                                            <i class="bi bi-lightning text-primary me-2"></i>
                                            <span class="small">Smart Hybrid Inverter</span>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="d-flex align-items-center">
                                            <i class="bi bi-sun text-primary me-2"></i>
                                            <span class="small">High-Efficiency Solar Panels</span>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="d-flex align-items-center">
                                            <i class="bi bi-phone text-primary me-2"></i>
                                            <span class="small">Mobile Monitoring System</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="d-flex flex-column gap-3">
                                <button type="button" class="btn btn-primary btn-lg" onclick="window.solarCalculator.calculateAndShowResults()">
                                    <i class="bi bi-calculator me-2"></i>
                                    Calculate Backup Solution
                                </button>
                                <button type="button" class="btn btn-outline-secondary" onclick="window.solarCalculator.previousStep()">
                                    <i class="bi bi-arrow-left me-2"></i>
                                    Back to Goals
                                </button>
                            </div>
                        </form>
                    </div>
                `;

            case 'reduce_bill':
                return `
                    <h4 class="text-center mb-4">Reduce Your Energy Bill</h4>
                    <div class="form-section">
                        <!-- Info Card -->
                        <div class="alert alert-info mb-4">
                            <div class="d-flex">
                                <i class="bi bi-info-circle-fill me-2 mt-1"></i>
                                <div>
                                    <strong>How it works:</strong>
                                    <p class="mb-2 small">We'll calculate an optimal solar system to reduce your electricity bill by your target percentage.</p>
                                </div>
                            </div>
                        </div>

                        <form id="solar-form">
                            <input type="hidden" name="goal" value="reduce_bill">
                            
                            <!-- Monthly Bill -->
                            <div class="mb-4">
                                <label class="form-label">Monthly Electricity Bill</label>
                                <div class="input-group">
                                    <span class="input-group-text">PKR</span>
                                    <input type="number" class="form-control" name="monthly-bill" 
                                        placeholder="e.g., 15,000" required min="1000" max="500000">
                                </div>
                                <div class="form-text">Enter your average monthly K-Electric bill</div>
                            </div>

                            <!-- Reduction Target -->
                            <div class="mb-4">
                                <label class="form-label d-flex justify-content-between">
                                    Target Bill Reduction
                                    <span class="badge bg-primary">Select Target</span>
                                </label>
                                <div class="reduction-options">
                                    <div class="row g-3">
                                        <div class="col-3">
                                            <input type="radio" class="btn-check" name="reduction" 
                                                id="reduce25" value="25">
                                            <label class="btn btn-outline-primary w-100" for="reduce25">
                                                <div class="small">Basic</div>
                                                25%
                                            </label>
                                        </div>
                                        <div class="col-3">
                                            <input type="radio" class="btn-check" name="reduction" 
                                                id="reduce50" value="50" checked>
                                            <label class="btn btn-outline-primary w-100" for="reduce50">
                                                <div class="small">Standard</div>
                                                50%
                                            </label>
                                        </div>
                                        <div class="col-3">
                                            <input type="radio" class="btn-check" name="reduction" 
                                                id="reduce75" value="75">
                                            <label class="btn btn-outline-primary w-100" for="reduce75">
                                                <div class="small">Advanced</div>
                                                75%
                                            </label>
                                        </div>
                                        <div class="col-3">
                                            <input type="radio" class="btn-check" name="reduction" 
                                                id="reduce90" value="90">
                                            <label class="btn btn-outline-primary w-100" for="reduce90">
                                                <div class="small">Maximum</div>
                                                90%
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div class="mt-3">
                                    <div class="d-flex align-items-center">
                                        <i class="bi bi-graph-down-arrow text-success me-2"></i>
                                        <small class="text-muted">Higher reduction requires more solar panels and batteries</small>
                                    </div>
                                </div>
                            </div>

                            <div class="d-flex flex-column gap-3">
                                <button type="button" class="btn btn-primary btn-lg" onclick="window.solarCalculator.calculateAndShowResults()">
                                    <i class="bi bi-calculator me-2"></i>
                                    Calculate Bill Reduction Solution
                                </button>
                                <button type="button" class="btn btn-outline-secondary" onclick="window.solarCalculator.previousStep()">
                                    <i class="bi bi-arrow-left me-2"></i>
                                    Back to Goals
                                </button>
                            </div>
                        </form>
                    </div>
                `;
        }
    }

    calculateAndShowResults() {
        const form = document.getElementById('solar-form');
        if (!form) return;

        // Validate form
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = new FormData(form);
        const goal = formData.get('goal');
        let results;

        try {
            switch(goal) {
                case 'complete_solar':
                    results = this.calculateCompleteSolar(formData);
                    break;
                case 'backup':
                    results = this.calculateBackupSystem(formData);
                    break;
                case 'reduce_bill':
                    results = this.calculateBillReduction(formData);
                    break;
                default:
                    throw new Error('Invalid goal selected');
            }

            // Move to next step and show results
            this.currentStep = 3;
            this.updateUI();
            this.displayResults(results);
        } catch (error) {
            console.error('Calculation error:', error);
            alert('There was an error calculating your solar solution. Please try again.');
        }
    }

    calculateCompleteSolar(formData) {
        const monthlyBill = parseFloat(formData.get('monthly-bill'));
        console.log(`Monthly bill: ${monthlyBill} kWh`);
        const backupHours = 19;

        console.log(`Backup hours: ${backupHours} hours`);

        // 1. Calculate Monthly Units (kWh)
        const monthlyUnits = monthlyBill / SOLAR_CONSTANTS.system.averageTariff;
        console.log(`Monthly units: ${monthlyUnits} kWh`);

        // 2. Calculate Daily Load
        const dailyLoad = monthlyUnits / 30;
        console.log(`Daily load: ${dailyLoad} kWh`);

        // 3. Calculate System Size
        const systemSizeKw = dailyLoad / SOLAR_CONSTANTS.system.peakSunHours;
        console.log(`System size: ${systemSizeKw} kW`);

        // 4. Calculate Number of Panels
        const numberOfPanels = Math.ceil(dailyLoad / SOLAR_CONSTANTS.system.energyPerPanel);
        console.log(`Number of panels: ${numberOfPanels}`);

        // 5. Calculate Battery Requirements
        const backupLoad = (dailyLoad / 24) * backupHours;
        console.log(`Backup load: ${backupLoad} kWh`);
        const batteryCapacity = backupLoad / SOLAR_CONSTANTS.system.batteryEfficiency;
        console.log(`Battery capacity: ${batteryCapacity} kWh`);
        const numberOfBatteries = Math.ceil(batteryCapacity / SOLAR_CONSTANTS.components.batteries.lithium.capacity);
        console.log(`Number of batteries: ${numberOfBatteries}`);

        // 6. Determine Inverter Size
        const inverterSize = this.determineInverterSize(systemSizeKw);
        console.log(`Inverter size: ${inverterSize}`);
        const inverter = SOLAR_CONSTANTS.components.inverters[inverterSize];

        // 7. Calculate Costs
        const panelsCost = numberOfPanels * SOLAR_CONSTANTS.components.panels.pricePerPanel;
        console.log(`Panels cost: ${panelsCost} $`);
        const batteriesCost = numberOfBatteries * SOLAR_CONSTANTS.components.batteries.lithium.price;
        console.log(`Batteries cost: ${batteriesCost} $`);
        const inverterCost = inverter.price;
        console.log(`Inverter cost: ${inverterCost} $`);
        const installationCost = this.calculateInstallationCost(systemSizeKw);
        console.log(`Installation cost: ${installationCost} $`);

        // Calculate battery backup duration
        const totalBatteryCapacity = numberOfBatteries * SOLAR_CONSTANTS.components.batteries.lithium.capacity;
        const averageHourlyLoad = dailyLoad / 24; // Average load per hour
        const calculatedBackupHours = (totalBatteryCapacity * SOLAR_CONSTANTS.system.batteryEfficiency) / averageHourlyLoad;
        
        console.log(`Total battery capacity: ${totalBatteryCapacity} kWh`);
        console.log(`Average hourly load: ${averageHourlyLoad} kWh`);
        console.log(`Estimated backup hours: ${calculatedBackupHours} hours`);

        // Create system specification with backup details
        const systemSpec = {
            dailyLoad,
            systemSizeKw,
            panels: {
                quantity: numberOfPanels,
                model: SOLAR_CONSTANTS.components.panels.model,
                totalCapacity: numberOfPanels * SOLAR_CONSTANTS.components.panels.wattage / 1000,
                cost: panelsCost
            },
            battery: {
                quantity: numberOfBatteries,
                model: SOLAR_CONSTANTS.components.batteries.lithium.model,
                totalCapacity: totalBatteryCapacity,
                backupHours: Math.round(calculatedBackupHours * 10) / 10, // Round to 1 decimal
                cost: batteriesCost
            },
            inverter: {
                ...inverter,
                cost: inverterCost
            },
            installation: {
                cost: installationCost
            },
            performance: {
                dailyGeneration: numberOfPanels * SOLAR_CONSTANTS.system.energyPerPanel,
                monthlyGeneration: numberOfPanels * SOLAR_CONSTANTS.system.energyPerPanel * 30,
                averageHourlyLoad: averageHourlyLoad
            }
        };

        // Calculate savings and payback
        const monthlySavings = systemSpec.performance.monthlyGeneration * SOLAR_CONSTANTS.system.averageTariff;
        console.log(`Monthly savings: ${monthlySavings} $`);
        const totalCost = panelsCost + batteriesCost + inverterCost + installationCost;
        console.log(`Total cost: ${totalCost} $`);
        const paybackYears = totalCost / (monthlySavings * 12);
        console.log(`Payback years: ${paybackYears} years`);

        return {
            systemSpec,
            costs: {
                panels: panelsCost,
                batteries: batteriesCost,
                inverter: inverterCost,
                total: panelsCost + batteriesCost + inverterCost
            },
            savings: {
                monthly: monthlySavings,
                annual: monthlySavings * 12,
                paybackYears: (panelsCost + batteriesCost + inverterCost) / (monthlySavings * 12)
            }
        };
    }

    calculateBackupSystem(formData) {
        // Get inputs
        const monthlyBill = parseFloat(formData.get('monthly-bill'));
        const requiredBackupHours = parseInt(formData.get('backup-hours')) || 12;
        
        // Calculate daily consumption from bill
        const monthlyUnits = monthlyBill / SOLAR_CONSTANTS.system.averageTariff;
        const dailyLoad = monthlyUnits / 30;
        
        // Calculate backup requirements
        const backupLoad = (dailyLoad / 24) * requiredBackupHours;
        const batteryCapacity = backupLoad / SOLAR_CONSTANTS.system.batteryEfficiency;
        
        // Calculate number of batteries needed
        const numberOfBatteries = Math.ceil(batteryCapacity / SOLAR_CONSTANTS.components.batteries.lithium.capacity);
        
        // Calculate solar panels needed to charge batteries daily
        const dailyChargingNeeded = backupLoad / SOLAR_CONSTANTS.system.peakSunHours;
        const numberOfPanels = Math.ceil(dailyChargingNeeded / (SOLAR_CONSTANTS.components.panels.wattage * 0.001));
        
        // Determine appropriate inverter size
        const systemSizeKw = (dailyLoad / SOLAR_CONSTANTS.system.peakSunHours) * 1.2; // Add 20% margin
        const inverterSize = this.determineInverterSize(systemSizeKw);
        const inverter = SOLAR_CONSTANTS.components.inverters[inverterSize];
        
        // Calculate costs
        const panelsCost = numberOfPanels * SOLAR_CONSTANTS.components.panels.pricePerPanel;
        const batteriesCost = numberOfBatteries * SOLAR_CONSTANTS.components.batteries.lithium.price;
        const inverterCost = inverter.price;
        
        // Calculate savings
        const dailyGeneration = numberOfPanels * SOLAR_CONSTANTS.system.energyPerPanel;
        const monthlyGeneration = dailyGeneration * 30;
        const monthlySavings = monthlyGeneration * SOLAR_CONSTANTS.system.averageTariff;
        const totalCost = panelsCost + batteriesCost + inverterCost;
        
        // Create system specification
        const systemSpec = {
            dailyLoad,
            systemSizeKw,
            panels: {
                quantity: numberOfPanels,
                model: SOLAR_CONSTANTS.components.panels.model,
                totalCapacity: numberOfPanels * SOLAR_CONSTANTS.components.panels.wattage / 1000,
                cost: panelsCost
            },
            battery: {
                quantity: numberOfBatteries,
                model: SOLAR_CONSTANTS.components.batteries.lithium.model,
                totalCapacity: numberOfBatteries * SOLAR_CONSTANTS.components.batteries.lithium.capacity,
                backupHours: requiredBackupHours,
                cost: batteriesCost
            },
            inverter: {
                ...inverter,
                cost: inverterCost
            },
            performance: {
                dailyGeneration,
                monthlyGeneration,
                dailyBackupKwh: backupLoad,
                averageHourlyLoad: dailyLoad / 24
            }
        };

        return {
            systemSpec,
            costs: {
                panels: panelsCost,
                batteries: batteriesCost,
                inverter: inverterCost,
                total: totalCost
            },
            savings: {
                monthly: monthlySavings,
                annual: monthlySavings * 12,
                paybackYears: totalCost / (monthlySavings * 12)
            }
        };
    }

    calculateBillReduction(formData) {
        // Get inputs
        const monthlyBill = parseFloat(formData.get('monthly-bill'));
        const reductionPercent = parseInt(formData.get('reduction'));
        const reduction = reductionPercent / 100;
        
        // Calculate consumption
        const monthlyUnits = monthlyBill / SOLAR_CONSTANTS.system.averageTariff;
        const dailyLoad = monthlyUnits / 30;
        
        // Calculate target reduction
        const targetDailyReduction = dailyLoad * reduction;
        
        // Calculate system size needed
        const systemSizeKw = targetDailyReduction / SOLAR_CONSTANTS.system.peakSunHours;
        
        // Calculate components needed
        const numberOfPanels = Math.ceil(targetDailyReduction / SOLAR_CONSTANTS.system.energyPerPanel);
        const numberOfBatteries = Math.ceil(numberOfPanels / 8); // Rough estimate: 1 battery per 8 panels
        
        // Determine inverter size
        const inverterSize = this.determineInverterSize(systemSizeKw);
        const inverter = SOLAR_CONSTANTS.components.inverters[inverterSize];
        
        // Calculate costs
        const panelsCost = numberOfPanels * SOLAR_CONSTANTS.components.panels.pricePerPanel;
        const batteriesCost = numberOfBatteries * SOLAR_CONSTANTS.components.batteries.lithium.price;
        const inverterCost = inverter.price;
        const totalCost = panelsCost + batteriesCost + inverterCost;
        
        // Calculate savings
        const dailyGeneration = numberOfPanels * SOLAR_CONSTANTS.system.energyPerPanel;
        const monthlyGeneration = dailyGeneration * 30;
        const monthlySavings = monthlyGeneration * SOLAR_CONSTANTS.system.averageTariff;
        
        // Create system specification
        const systemSpec = {
            dailyLoad,
            systemSizeKw,
            panels: {
                quantity: numberOfPanels,
                model: SOLAR_CONSTANTS.components.panels.model,
                totalCapacity: numberOfPanels * SOLAR_CONSTANTS.components.panels.wattage / 1000,
                cost: panelsCost
            },
            battery: {
                quantity: numberOfBatteries,
                model: SOLAR_CONSTANTS.components.batteries.lithium.model,
                totalCapacity: numberOfBatteries * SOLAR_CONSTANTS.components.batteries.lithium.capacity,
                backupHours: 4, // Minimum backup
                cost: batteriesCost
            },
            inverter: {
                ...inverter,
                cost: inverterCost
            },
            performance: {
                dailyGeneration,
                monthlyGeneration,
                targetReduction: reductionPercent,
                averageHourlyLoad: dailyLoad / 24
            }
        };

        return {
            systemSpec,
            costs: {
                panels: panelsCost,
                batteries: batteriesCost,
                inverter: inverterCost,
                total: totalCost
            },
            savings: {
                monthly: monthlySavings,
                annual: monthlySavings * 12,
                paybackYears: totalCost / (monthlySavings * 12)
            }
        };
    }

    displayResults(results) {
        const resultsContainer = document.getElementById('step-3');
        
        resultsContainer.innerHTML = `
            <div class="result-card">
                <div class="p-4">
                    <!-- Savings Highlight (Most important info first) -->
                    <div class="savings-highlight mb-4 p-4 bg-gradient border rounded-4 shadow-sm">
                        <div class="row g-4">
                            <div class="col-md-6">
                                <div class="savings-card bg-white p-3 rounded-3 h-100 border">
                                    <div class="d-flex justify-content-between align-items-start">
                                        <div>
                                            <div class="text-muted small mb-1">Monthly Savings</div>
                                            <div class="h2 mb-0 text-success">PKR ${Math.round(results.savings.monthly).toLocaleString()}</div>
                                            <div class="text-success small mt-1">
                                                <i class="bi bi-graph-up-arrow me-1"></i>
                                                ${Math.round((results.systemSpec.performance.monthlyGeneration / (results.systemSpec.dailyLoad * 30)) * 100)}% Grid Independence
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="savings-card bg-white p-3 rounded-3 h-100 border">
                                    <div class="text-muted small mb-1">Investment Range</div>
                                    <div class="h4 mb-0">PKR ${(Math.round(results.costs.total*0.9/1000)*1000).toLocaleString()} - ${(Math.round(results.costs.total*1.1/1000)*1000).toLocaleString()}</div>
                                    <div class="text-primary small mt-1">ROI: ${results.savings.paybackYears.toFixed(1)} years</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- System Overview (Collapsible) -->
                    <div class="accordion mb-4" id="systemDetails">
                        <div class="accordion-item border-0 bg-light rounded">
                            <h2 class="accordion-header">
                                <button class="accordion-button collapsed bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#systemSpecs">
                                    <div>
                                        <h6 class="mb-0">Recommended System Specifications</h6>
                                        <small class="text-muted">${results.systemSpec.systemSizeKw.toFixed(1)} kW System • ${results.systemSpec.battery.backupHours}h Backup</small>
                                    </div>
                                </button>
                            </h2>
                            <div id="systemSpecs" class="accordion-collapse collapse" data-bs-parent="#systemDetails">
                                <div class="accordion-body">
                                    <div class="row g-3">
                                        <div class="col-md-4">
                                            <div class="spec-item">
                                                <i class="bi bi-sun text-warning"></i>
                                                <div>
                                                    <div class="fw-bold">${results.systemSpec.panels.quantity}x Solar Panels</div>
                                                    <small class="text-muted">${results.systemSpec.panels.totalCapacity.toFixed(1)} kW Total</small>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="spec-item">
                                                <i class="bi bi-battery-charging text-success"></i>
                                                <div>
                                                    <div class="fw-bold">${results.systemSpec.battery.quantity}x Batteries</div>
                                                    <small class="text-muted">${results.systemSpec.battery.totalCapacity.toFixed(1)} kWh Storage</small>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="spec-item">
                                                <i class="bi bi-lightning-charge text-primary"></i>
                                                <div>
                                                    <div class="fw-bold">${results.systemSpec.inverter.capacity}kW Inverter</div>
                                                    <small class="text-muted">Hybrid System</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Key Benefits -->
                    <div class="benefits-section mb-4">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <div class="benefit-card p-3 border rounded">
                                    <div class="d-flex">
                                        <i class="bi bi-sun text-warning fs-4 me-3"></i>
                                        <div>
                                            <h6 class="mb-1">Clean Energy Production</h6>
                                            <p class="mb-0 small text-muted">${Math.round(results.systemSpec.performance.monthlyGeneration)} kWh monthly generation</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="benefit-card p-3 border rounded">
                                    <div class="d-flex">
                                        <i class="bi bi-shield-check text-success fs-4 me-3"></i>
                                        <div>
                                            <h6 class="mb-1">Reliable Backup Power</h6>
                                            <p class="mb-0 small text-muted">${results.systemSpec.battery.backupHours} hours of backup support</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Call to Action -->
                    <div class="cta-box p-4 bg-light border rounded-4">
                        <div class="text-center mb-3">
                            <span class="badge bg-success mb-2">Free Consultation</span>
                            <h5 class="mb-2">Ready to Start Saving?</h5>
                            <p class="text-muted mb-3">Get a personalized quote and free site inspection</p>
                        </div>
                        
                        <div class="d-flex flex-column gap-3">
                            <button class="btn btn-primary btn-lg" onclick="window.solarCalculator.showQuoteModal(${JSON.stringify(results).replace(/"/g, '&quot;')})">
                                <i class="bi bi-whatsapp me-2"></i>
                                Get Detailed Quote on WhatsApp
                            </button>
                            <button class="btn btn-outline-secondary" onclick="window.solarCalculator.previousStep()">
                                <i class="bi bi-arrow-left me-2"></i>
                                Modify Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Initialize Bootstrap components
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // Helper methods
    determineInverterSize(systemSizeKw) {
        if (systemSizeKw <= 3) return 'small';
        if (systemSizeKw <= 6) return 'medium';
        return 'large';
    }

    calculateInstallationCost(systemSizeKw) {
        return SOLAR_CONSTANTS.installation.base + (systemSizeKw * SOLAR_CONSTANTS.installation.perKw);
    }

    showQuoteModal(results) {
        this.quoteResults = results; // Store results for quote request
        const quoteModal = document.getElementById('quoteModal');
        if (quoteModal) {
            const modal = new bootstrap.Modal(quoteModal);
            modal.show();
        } else {
            console.error('Quote modal not found in the DOM');
        }
    }

    sendQuoteRequest(event) {
        event.preventDefault();
        const form = event.target;
        const phone = form.phone.value;
        
        // Format the system details for WhatsApp
        const results = this.quoteResults;
        const message = this.formatQuoteMessage(results, phone);
        
        // Create WhatsApp link with formatted message
        const whatsappLink = `https://wa.me/+16313048422?text=${encodeURIComponent(message)}`;
        
        // Close modal and open WhatsApp
        const quoteModal = document.getElementById('quoteModal');
        if (quoteModal) {
            const modal = bootstrap.Modal.getInstance(quoteModal);
            if (modal) {
                modal.hide();
            }
        }
        window.open(whatsappLink, '_blank');
    }

    formatQuoteMessage(results, phone) {
        const systemType = results.systemSpec.performance.targetReduction ? 
            `Bill Reduction (${results.systemSpec.performance.targetReduction}%)` :
            results.systemSpec.battery.backupHours === 19 ? 
            'Complete Solar' : 'Backup Solution';

        // Calculate monthly bill based on consumption
        const estimatedBill = results.systemSpec.dailyLoad * 30 * SOLAR_CONSTANTS.system.averageTariff;

        return `
*NEW SOLAR SYSTEM INQUIRY*
------------------------------------------

*Customer Details*
• Phone: ${phone}
• Current Monthly Bill: ~PKR ${Math.round(estimatedBill).toLocaleString()}
• Solution Type: ${systemType}

*System Overview*
• System Size: ${results.systemSpec.systemSizeKw.toFixed(1)} kW
• Daily Usage: ${results.systemSpec.dailyLoad.toFixed(1)} kWh
• Backup Time: ${results.systemSpec.battery.backupHours} hours

*Recommended Components*
• ${results.systemSpec.panels.quantity}x Solar Panels (${SOLAR_CONSTANTS.components.panels.wattage}W each)
• ${results.systemSpec.battery.quantity}x Lithium Batteries (${SOLAR_CONSTANTS.components.batteries.lithium.capacity}kWh each)
• ${results.systemSpec.inverter.capacity}kW Hybrid Inverter

*Expected Performance*
• Monthly Generation: ${Math.round(results.systemSpec.performance.monthlyGeneration)} kWh
• Grid Independence: ${Math.round((results.systemSpec.performance.monthlyGeneration / (results.systemSpec.dailyLoad * 30)) * 100)}%
• Monthly Savings: PKR ${Math.round(results.savings.monthly).toLocaleString()}
• Annual Savings: PKR ${Math.round(results.savings.annual).toLocaleString()}
• ROI Period: ${results.savings.paybackYears.toFixed(1)} years

*Investment Range*
• Components Cost: PKR ${(Math.round(results.costs.total*0.9/1000)*1000).toLocaleString()} - ${(Math.round(results.costs.total*1.1/1000)*1000).toLocaleString()}
• Installation: To be determined after site inspection

*Next Steps*
1. Site inspection scheduling
2. Final quotation with installation
3. Installation timeline discussion

*Site Details Required*
• Location/Area
• Roof type & space
• Current electrical setup

------------------------------------------
`.trim();
    }

    formatPrice(amount, obfuscate = SOLAR_CONSTANTS.display.obfuscatePrices) {
        if (obfuscate) {
            // Return price range indicator instead of actual amount
            const magnitude = Math.floor(Math.log10(amount));
            const prefix = "PKR ";
            if (magnitude >= 6) {
                return `${prefix}${Math.floor(amount/1000000)}M+`;
            } else if (magnitude >= 5) {
                return `${prefix}${Math.floor(amount/100000)}L+`;
            } else {
                return "Contact for Price";
            }
        }
        return `PKR ${amount.toLocaleString()}`;
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing calculator');
    const calculator = new SolarCalculator();
    window.solarCalculator = calculator;

    // Update the steps HTML in your wizard container
    document.querySelector('.steps').innerHTML = `
        <div class="step active" data-title="Select Goal">1</div>
        <div class="step" data-title="Enter Details">2</div>
        <div class="step" data-title="View Results">3</div>
    `;
});

document.addEventListener('DOMContentLoaded', function() {
    // Scroll Spy for Table of Contents
    const sections = document.querySelectorAll('.blog-content section');
    const tocLinks = document.querySelectorAll('.toc-list a');
    
    function updateTOC() {
        let found = false;
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const id = section.getAttribute('id');
            const link = document.querySelector(`.toc-list a[href="#${id}"]`);
            
            if (rect.top <= 100 && rect.bottom >= 100 && !found) {
                link?.classList.add('active');
                found = true;
            } else {
                link?.classList.remove('active');
            }
        });
    }

    // Smooth scroll for TOC links
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const offset = 80; // Adjust based on your header height
                    const targetPosition = targetSection.offsetTop - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Update TOC on scroll
    window.addEventListener('scroll', updateTOC);
    updateTOC(); // Initial call
});
 
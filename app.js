// Application State
let currentSection = 'main-menu';

// Utility Functions
function showSection(sectionId) {
    console.log('Navigating to section:', sectionId);
    
    // Hide all sections
    const allSections = document.querySelectorAll('#main-menu, #gear-calculations, #flange-calculations');
    allSections.forEach(section => {
        if (section) {
            section.classList.add('hidden');
        }
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        currentSection = sectionId;
        console.log('Successfully navigated to:', sectionId);
        
        // Initialize calculations if moving to flange section
        if (sectionId === 'flange-calculations') {
            setTimeout(() => {
                calculateFlangeC();
            }, 200);
        }
    } else {
        console.error('Section not found:', sectionId);
    }
}

function validateInput(value) {
    return value !== '' && !isNaN(value) && parseFloat(value) > 0;
}

function formatResult(value, decimals = 2) {
    if (isNaN(value) || !isFinite(value)) return '--';
    return parseFloat(value).toFixed(decimals);
}

function showError(inputElement) {
    if (inputElement) {
        inputElement.classList.add('error');
        setTimeout(() => {
            inputElement.classList.remove('error');
        }, 3000);
    }
}

// Gear Calculation Functions
function calculateTeethCount() {
    const diameter = document.getElementById('teeth-diameter').value;
    const module = document.getElementById('teeth-module').value;
    const resultElement = document.getElementById('teeth-result');
    
    if (validateInput(diameter) && validateInput(module)) {
        const teeth = parseFloat(diameter) / parseFloat(module);
        resultElement.textContent = Math.round(teeth);
        resultElement.closest('.result-display').classList.add('success');
    } else {
        resultElement.textContent = '--';
        resultElement.closest('.result-display').classList.remove('success');
        
        if (!validateInput(diameter)) {
            showError(document.getElementById('teeth-diameter'));
        }
        if (!validateInput(module)) {
            showError(document.getElementById('teeth-module'));
        }
    }
}

function calculateGearRatio() {
    const drivingTeeth = document.getElementById('driving-teeth').value;
    const drivenTeeth = document.getElementById('driven-teeth').value;
    const resultElement = document.getElementById('ratio-result');
    
    if (validateInput(drivingTeeth) && validateInput(drivenTeeth)) {
        const ratio = parseFloat(drivenTeeth) / parseFloat(drivingTeeth);
        resultElement.textContent = formatResult(ratio, 3);
        resultElement.closest('.result-display').classList.add('success');
    } else {
        resultElement.textContent = '--';
        resultElement.closest('.result-display').classList.remove('success');
        
        if (!validateInput(drivingTeeth)) {
            showError(document.getElementById('driving-teeth'));
        }
        if (!validateInput(drivenTeeth)) {
            showError(document.getElementById('driven-teeth'));
        }
    }
}

function calculatePitchDiameter() {
    const module = document.getElementById('pitch-module').value;
    const teeth = document.getElementById('pitch-teeth').value;
    const resultElement = document.getElementById('pitch-result');
    
    if (validateInput(module) && validateInput(teeth)) {
        const diameter = parseFloat(module) * parseFloat(teeth);
        resultElement.textContent = formatResult(diameter);
        resultElement.closest('.result-display').classList.add('success');
    } else {
        resultElement.textContent = '--';
        resultElement.closest('.result-display').classList.remove('success');
        
        if (!validateInput(module)) {
            showError(document.getElementById('pitch-module'));
        }
        if (!validateInput(teeth)) {
            showError(document.getElementById('pitch-teeth'));
        }
    }
}

function calculateModule() {
    const diameter = document.getElementById('module-diameter').value;
    const teeth = document.getElementById('module-teeth').value;
    const resultElement = document.getElementById('module-result');
    
    if (validateInput(diameter) && validateInput(teeth)) {
        const module = parseFloat(diameter) / parseFloat(teeth);
        resultElement.textContent = formatResult(module);
        resultElement.closest('.result-display').classList.add('success');
    } else {
        resultElement.textContent = '--';
        resultElement.closest('.result-display').classList.remove('success');
        
        if (!validateInput(diameter)) {
            showError(document.getElementById('module-diameter'));
        }
        if (!validateInput(teeth)) {
            showError(document.getElementById('module-teeth'));
        }
    }
}

// Flange Calculation Functions
function calculateFlangeC() {
    const boltsInput = document.getElementById('flange-bolts');
    const dimensionInput = document.getElementById('flange-dimension');
    const resultElement = document.getElementById('flange-result');
    
    if (!boltsInput || !dimensionInput || !resultElement) {
        console.error('Flange calculation elements not found');
        return;
    }
    
    const bolts = boltsInput.value;
    const dimensionB = dimensionInput.value;
    
    if (validateInput(bolts) && validateInput(dimensionB)) {
        const A = parseFloat(bolts);
        const B = parseFloat(dimensionB);
        
        // Calculate angle in degrees: 180 - (360/A)
        const angleInDegrees = 180 - (360 / A);
        // Convert to radians
        const angleInRadians = (angleInDegrees * Math.PI) / 180;
        // Calculate C = sin(angle) * B
        const C = Math.sin(angleInRadians) * B;
        
        resultElement.textContent = formatResult(C);
        const resultDiv = resultElement.closest('.result-display');
        if (resultDiv) {
            resultDiv.classList.add('success');
        }
    } else {
        resultElement.textContent = '--';
        const resultDiv = resultElement.closest('.result-display');
        if (resultDiv) {
            resultDiv.classList.remove('success');
        }
        
        if (!validateInput(bolts)) {
            showError(boltsInput);
        }
        if (!validateInput(dimensionB)) {
            showError(dimensionInput);
        }
    }
}

function calculatePCD() {
    const diameter = document.getElementById('pcd-diameter').value;
    const bolts = document.getElementById('pcd-bolts').value;
    const resultElement = document.getElementById('pcd-result');
    
    if (validateInput(diameter) && validateInput(bolts)) {
        // Simple approximation: PCD ≈ 0.8 * outer diameter for typical flanges
        const pcd = parseFloat(diameter) * 0.8;
        resultElement.textContent = formatResult(pcd);
        resultElement.closest('.result-display').classList.add('success');
    } else {
        resultElement.textContent = '--';
        resultElement.closest('.result-display').classList.remove('success');
        
        if (!validateInput(diameter)) {
            showError(document.getElementById('pcd-diameter'));
        }
        if (!validateInput(bolts)) {
            showError(document.getElementById('pcd-bolts'));
        }
    }
}

function calculateThickness() {
    const diameter = document.getElementById('thickness-diameter').value;
    const pressure = document.getElementById('thickness-pressure').value;
    const resultElement = document.getElementById('thickness-result');
    
    if (validateInput(diameter) && validateInput(pressure)) {
        const D = parseFloat(diameter);
        const P = parseFloat(pressure);
        
        // Basic flange thickness estimation: t = D/20 + pressure factor
        const basicThickness = D / 20;
        const pressureFactor = P / 10; // Simple pressure adjustment
        const thickness = basicThickness + pressureFactor;
        
        resultElement.textContent = formatResult(thickness);
        resultElement.closest('.result-display').classList.add('success');
    } else {
        resultElement.textContent = '--';
        resultElement.closest('.result-display').classList.remove('success');
        
        if (!validateInput(diameter)) {
            showError(document.getElementById('thickness-diameter'));
        }
        if (!validateInput(pressure)) {
            showError(document.getElementById('thickness-pressure'));
        }
    }
}

// Navigation Event Listeners
function setupNavigationListeners() {
    // Main navigation buttons
    const gearNavBtn = document.getElementById('gear-nav-btn');
    const flangeNavBtn = document.getElementById('flange-nav-btn');
    const gearBackBtn = document.getElementById('gear-back-btn');
    const flangeBackBtn = document.getElementById('flange-back-btn');
    
    if (gearNavBtn) {
        gearNavBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Gear navigation clicked');
            showSection('gear-calculations');
        });
    }
    
    if (flangeNavBtn) {
        flangeNavBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Flange navigation clicked');
            showSection('flange-calculations');
        });
    }
    
    if (gearBackBtn) {
        gearBackBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Gear back button clicked');
            showSection('main-menu');
        });
    }
    
    if (flangeBackBtn) {
        flangeBackBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Flange back button clicked');
            showSection('main-menu');
        });
    }
}

// Event Listeners Setup
function setupCalculationListeners() {
    // Gear Calculations Event Listeners
    const gearInputs = [
        { ids: ['teeth-diameter', 'teeth-module'], callback: calculateTeethCount },
        { ids: ['driving-teeth', 'driven-teeth'], callback: calculateGearRatio },
        { ids: ['pitch-module', 'pitch-teeth'], callback: calculatePitchDiameter },
        { ids: ['module-diameter', 'module-teeth'], callback: calculateModule }
    ];
    
    gearInputs.forEach(group => {
        group.ids.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', group.callback);
                element.addEventListener('change', group.callback);
            }
        });
    });
    
    // Flange Calculations Event Listeners
    const flangeInputs = [
        { ids: ['flange-bolts', 'flange-dimension'], callback: calculateFlangeC },
        { ids: ['pcd-diameter', 'pcd-bolts'], callback: calculatePCD },
        { ids: ['thickness-diameter', 'thickness-pressure'], callback: calculateThickness }
    ];
    
    flangeInputs.forEach(group => {
        group.ids.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', group.callback);
                element.addEventListener('change', group.callback);
            }
        });
    });
    
    // Input validation - only allow positive numbers
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', function() {
            // Remove error class when user starts typing
            this.classList.remove('error');
            
            // Prevent negative values
            if (parseFloat(this.value) < 0) {
                this.value = '';
            }
        });
        
        // Prevent non-numeric characters
        input.addEventListener('keypress', function(e) {
            // Allow numbers, decimal point, and control keys
            if (!/[0-9\.]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }
        });
    });
}

// Keyboard Navigation
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Escape key to return to main menu
        if (e.key === 'Escape' && currentSection !== 'main-menu') {
            showSection('main-menu');
        }
        
        // Enter key on buttons
        if (e.key === 'Enter' && e.target.classList.contains('btn')) {
            e.target.click();
        }
    });
}

// Copy Results Functionality
function setupCopyFunctionality() {
    document.querySelectorAll('.result-display').forEach(resultDiv => {
        resultDiv.addEventListener('click', function() {
            const resultText = this.textContent;
            if (navigator.clipboard && resultText !== '--') {
                navigator.clipboard.writeText(resultText).then(() => {
                    // Show copied feedback
                    const originalText = this.innerHTML;
                    this.innerHTML = '<strong style="color: var(--color-success);">تم النسخ! ✓</strong>';
                    setTimeout(() => {
                        this.innerHTML = originalText;
                    }, 1500);
                }).catch(() => {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = resultText;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                });
            }
        });
    });
}

// Application Initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('حاسبة الهندسة الميكانيكية تم تحميلها');
    
    // Setup all functionality
    setupNavigationListeners();
    setupCalculationListeners();
    setupKeyboardNavigation();
    setupCopyFunctionality();
    
    // Show main menu by default
    showSection('main-menu');
    
    // Add smooth transitions
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.3s ease-in-out';
        document.body.style.opacity = '1';
    }, 100);
    
    console.log('Application initialized successfully');
});
// ...existing code...

function navigateToSection(sectionId) {
    // Hide all calculation sections and main menu
    document.querySelectorAll('.calculation-section, .main-menu').forEach(sec => {
        sec.classList.add('hidden');
    });
    // Show the selected section
    document.getElementById(sectionId).classList.remove('hidden');
}

// ...existing code...

// Make functions globally available for potential external use
window.showSection = showSection;
window.calculateTeethCount = calculateTeethCount;
window.calculateGearRatio = calculateGearRatio;
window.calculatePitchDiameter = calculatePitchDiameter;
window.calculateModule = calculateModule;
window.calculateFlangeC = calculateFlangeC;
window.calculatePCD = calculatePCD;
window.calculateThickness = calculateThickness;
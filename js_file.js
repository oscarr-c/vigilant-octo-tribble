// Password Security Tool - Main JavaScript File

// Common passwords database (subset for demonstration)
const commonPasswords = [
    'password', '123456', 'password123', 'admin', 'qwerty', 'letmein',
    'welcome', 'monkey', '1234567890', 'abc123', 'Password1', 'password1',
    'user', 'test', 'guest', 'root', '12345', '123456789', 'qwerty123',
    'iloveyou', 'princess', 'dragon', 'sunshine', 'master', 'shadow',
    'football', 'baseball', 'basketball', 'soccer', 'hockey', 'tennis',
    '000000', '111111', '222222', '333333', '444444', '555555',
    'passw0rd', 'p@ssword', 'p@ssw0rd', 'password!', 'Password!',
    'login', 'hello', 'world', 'computer', 'internet', 'security'
];

// Weak password patterns
const weakPatterns = [
    { pattern: /^[a-z]+$/, message: "all lowercase letters" },
    { pattern: /^[A-Z]+$/, message: "all uppercase letters" },
    { pattern: /^[0-9]+$/, message: "all numbers" },
    { pattern: /^(.)\1+$/, message: "repeated characters" },
    { pattern: /(123|abc|qwe)/i, message: "sequential patterns" },
    { pattern: /^(password|admin|user|test)/i, message: "common password start" },
    { pattern: /^.{1,5}$/, message: "too short" },
    { pattern: /(password|admin|login|user)/i, message: "common words" }
];

/**
 * Generate a password based on user inputs
 */
function generatePassword() {
    const pet = document.getElementById('petName').value.trim();
    const year = document.getElementById('birthYear').value;
    const color = document.getElementById('favColor').value.trim();
    const number = document.getElementById('luckyNumber').value;
    const style = document.getElementById('passwordStyle').value;

    if (!validateInputs(pet, year, color, number)) {
        return;
    }

    const password = createPassword(pet, year, color, number, style);
    displayGeneratedPassword(password);
    
    // Add fade-in animation
    const output = document.getElementById('generatedPasswords');
    output.classList.add('fade-in');
}

/**
 * Generate multiple password variations
 */
function generateMultiple() {
    const pet = document.getElementById('petName').value.trim();
    const year = document.getElementById('birthYear').value;
    const color = document.getElementById('favColor').value.trim();
    const number = document.getElementById('luckyNumber').value;

    if (!validateInputs(pet, year, color, number)) {
        return;
    }

    const passwords = [
        { password: createPassword(pet, year, color, number, 'camelCase'), style: 'CamelCase' },
        { password: createPassword(pet, year, color, number, 'symbols'), style: 'With Symbols' },
        { password: createPassword(pet, year, color, number, 'leetspeak'), style: 'Leet Speak' }
    ];

    displayMultiplePasswords(passwords);
    
    // Add fade-in animation
    const output = document.getElementById('generatedPasswords');
    output.classList.add('fade-in');
}

/**
 * Validate user inputs
 */
function validateInputs(pet, year, color, number) {
    const errors = [];
    
    if (!pet) errors.push('Pet/Animal name');
    if (!year) errors.push('Birth year');
    if (!color) errors.push('Favorite color');
    if (!number) errors.push('Lucky number');
    
    if (errors.length > 0) {
        alert(`Please fill in the following fields: ${errors.join(', ')}`);
        return false;
    }
    
    if (year < 1900 || year > 2024) {
        alert('Please enter a valid birth year between 1900 and 2024');
        return false;
    }
    
    return true;
}

/**
 * Create password based on style
 */
function createPassword(pet, year, color, number, style) {
    switch (style) {
        case 'camelCase':
            return capitalizeFirst(pet) + capitalizeFirst(color) + year + number;
        
        case 'underscore':
            return pet.toLowerCase() + '_' + color.toLowerCase() + '_' + year + '_' + number;
        
        case 'symbols':
            return capitalizeFirst(pet) + '@' + capitalizeFirst(color) + '#' + year + '!' + number;
        
        case 'leetspeak':
            const leetPet = toLeetSpeak(pet);
            const leetColor = toLeetSpeak(color);
            return capitalizeFirst(leetPet) + '_' + capitalizeFirst(leetColor) + '_' + year + '!' + number;
        
        default:
            return capitalizeFirst(pet) + capitalizeFirst(color) + year + number;
    }
}

/**
 * Convert text to leet speak
 */
function toLeetSpeak(text) {
    const leetMap = {
        'a': '4', 'A': '4',
        'e': '3', 'E': '3',
        'i': '1', 'I': '1',
        'o': '0', 'O': '0',
        's': '5', 'S': '5',
        't': '7', 'T': '7'
    };
    
    return text.split('').map(char => leetMap[char] || char).join('');
}

/**
 * Capitalize first letter of string
 */
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Display a single generated password
 */
function displayGeneratedPassword(password) {
    const output = document.getElementById('generatedPasswords');
    const strength = analyzeStrength(password);
    const isCommon = checkIfCommon(password);
    const weakPattern = checkWeakPatterns(password);
    
    output.innerHTML = `
        <div class="password-output">
            <strong>Generated Password:</strong><br>
            <span style="font-size: 1.2em; color: #2c3e50;">${password}</span>
            <button class="copy-btn" onclick="copyToClipboard('${password}')">Copy</button>
        </div>
        <div class="strength-meter">
            <div class="strength-fill ${strength.class}"></div>
        </div>
        <div class="feedback ${getSecurityLevel(strength.score, isCommon, weakPattern)}">
            <strong>Strength: ${strength.text}</strong><br>
            Length: ${password.length} characters<br>
            ${isCommon ? '⚠️ Contains common password elements' : '✅ No common password patterns detected'}<br>
            ${weakPattern.detected ? '⚠️ Contains: ' + weakPattern.issues.join(', ') : '✅ No obvious weak patterns detected'}
        </div>
    `;
}

/**
 * Display multiple password variations
 */
function displayMultiplePasswords(passwords) {
    const output = document.getElementById('generatedPasswords');
    let html = '<h3 style="color: #2c3e50; margin-bottom: 20px;">Password Variations:</h3>';
    
    passwords.forEach((item, index) => {
        const strength = analyzeStrength(item.password);
        const isCommon = checkIfCommon(item.password);
        const weakPattern = checkWeakPatterns(item.password);
        
        html += `
            <div class="password-output" style="margin-bottom: 20px;">
                <strong>${item.style} Style:</strong><br>
                <span style="font-size: 1.2em; color: #2c3e50;">${item.password}</span>
                <button class="copy-btn" onclick="copyToClipboard('${item.password}')">Copy</button>
                <div class="strength-meter">
                    <div class="strength-fill ${strength.class}"></div>
                </div>
                <small><strong>Security:</strong> ${strength.text} ${isCommon ? '(Contains common elements)' : '(Unique patterns)'}</small>
            </div>
        `;
    });
    
    output.innerHTML = html;
}

/**
 * Check password security
 */
function checkPassword() {
    const password = document.getElementById('passwordToCheck').value;
    
    if (!password) {
        alert('Please enter a password to check');
        return;
    }

    const strength = analyzeStrength(password);
    const isCommon = checkIfCommon(password);
    const weakPattern = checkWeakPatterns(password);
    const suggestions = getImprovementSuggestions(password);

    const output = document.getElementById('passwordAnalysis');
    output.innerHTML = `
        <div class="strength-meter">
            <div class="strength-fill ${strength.class}"></div>
        </div>
        <div class="feedback ${getSecurityLevel(strength.score, isCommon, weakPattern.detected)}">
            <strong>Password Analysis Results</strong><br><br>
            <strong>Strength: ${strength.text}</strong><br>
            Length: ${password.length} characters<br>
            ${isCommon ? '❌ Found in common passwords database!' : '✅ Not in common passwords database'}<br>
            ${weakPattern.detected ? '⚠️ Weak patterns detected: ' + weakPattern.issues.join(', ') : '✅ No obvious weak patterns detected'}
        </div>
        ${suggestions.length > 0 ? `
            <div class="suggestions">
                <strong>Recommendations for Improvement:</strong>
                <ul>
                    ${suggestions.map(s => `<li>${s}</li>`).join('')}
                </ul>
            </div>
        ` : '<div class="feedback success"><strong>Your password looks strong!</strong> 🎉</div>'}
    `;
    
    // Add fade-in animation
    output.classList.add('fade-in');
}

/**
 * Analyze and edit password
 */
function analyzeAndEdit() {
    const password = document.getElementById('currentPassword').value;
    
    if (!password) {
        alert('Please enter a password to analyze');
        return;
    }

    const analysis = getDetailedAnalysis(password);
    const improvedVersions = generateImprovedVersions(password);

    const output = document.getElementById('editingSuggestions');
    output.innerHTML = `
        <div class="feedback warning">
            <strong>Detailed Analysis:</strong><br>
            ${analysis.summary}
        </div>
        
        
// Utility Functions
const generateKey = (text, secretKey) => {
    return secretKey ? CryptoJS.SHA256(secretKey).toString() : 'default-key';
};

const encrypt = (text, secretKey) => {
    const key = generateKey(text, secretKey);
    return CryptoJS.AES.encrypt(text, key).toString();
};

const decrypt = (encryptedText, secretKey) => {
    const key = generateKey(encryptedText, secretKey);
    const decrypted = CryptoJS.AES.decrypt(encryptedText, key);
    return decrypted.toString(CryptoJS.enc.Utf8);
};

// Validation Functions
const validateInput = (type, value) => {
    switch (type) {
        case 'link':
            value = value.trim();
            if (!value) return false;
            
            // Extract domain and check for dot
            const domain = value.replace(/^https?:\/\//, '')  // Remove protocol
                              .split(/[/?#]/)[0];            // Get domain part
            return domain && domain.includes('.');
        case 'phone':
            const phonePattern = /^\+?[\d\s-]{8,}$/;
            return phonePattern.test(value);
        case 'text':
        case 'password':
            return value.trim().length > 0;
        default:
            return true;
    }
};

// History Management
class HistoryManager {
    constructor() {
        this.password = localStorage.getItem('historyPassword');
        this.history = JSON.parse(localStorage.getItem('cryptHistory') || '[]');
    }

    setPassword(password) {
        const hashedPassword = CryptoJS.SHA256(password).toString();
        localStorage.setItem('historyPassword', hashedPassword);
        this.password = hashedPassword;
    }

    verifyPassword(password) {
        const hashedPassword = CryptoJS.SHA256(password).toString();
        return this.password === hashedPassword;
    }

    addEntry(type, operation, input, result) {
        const entry = {
            timestamp: new Date().toISOString(),
            type,
            operation,
            input: type === 'password' ? '********' : input,
            result: type === 'password' ? '********' : result
        };
        this.history.push(entry);
        localStorage.setItem('cryptHistory', JSON.stringify(this.history));
    }

    getHistory() {
        return this.history;
    }
}

// DOM Elements
const elements = {
    encryptInput: document.getElementById('encrypt-input'),
    decryptInput: document.getElementById('decrypt-input'),
    encryptKey: document.getElementById('encrypt-key'),
    decryptKey: document.getElementById('decrypt-key'),
    encryptBtn: document.getElementById('encryptBtn'),
    decryptBtn: document.getElementById('decryptBtn'),
    copyEncrypted: document.getElementById('copyEncrypted'),
    copyDecrypted: document.getElementById('copyDecrypted'),
    encryptResult: document.getElementById('encrypt-result'),
    decryptResult: document.getElementById('decrypt-result'),
    encryptedText: document.getElementById('encrypted-text'),
    decryptedText: document.getElementById('decrypted-text'),
    encryptError: document.getElementById('encrypt-error'),
    decryptError: document.getElementById('decrypt-error'),
    historyBtn: document.getElementById('historyBtn'),
    historyModal: document.getElementById('historyModal'),
    passwordModal: document.getElementById('passwordModal'),
    historyContent: document.getElementById('historyContent'),
    closeHistory: document.getElementById('closeHistory'),
    submitPassword: document.getElementById('submitPassword'),
    cancelPassword: document.getElementById('cancelPassword'),
    historyPassword: document.getElementById('historyPassword'),
    passwordError: document.getElementById('passwordError'),
    tabs: document.querySelectorAll('.tab-btn'),
    phoneInput: document.getElementById('phone-input'),
    countryCode: document.getElementById('country-code'),
    phoneNumber: document.getElementById('phone-number')
};

// Initialize History Manager
const historyManager = new HistoryManager();

// Current State
let currentType = 'text';

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Tab Switching
    elements.tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            elements.tabs.forEach(t => t.classList.remove('tab-active'));
            tab.classList.add('tab-active');
            currentType = tab.dataset.type;
            
            // Clear inputs and results
            elements.encryptInput.value = '';
            elements.countryCode.value = '';
            elements.phoneNumber.value = '';
            elements.encryptKey.value = '';
            elements.encryptResult.classList.add('hidden');
            elements.copyEncrypted.classList.add('hidden');
            elements.encryptError.classList.add('hidden');

            // Show/Hide Phone Input
            if (currentType === 'phone') {
                elements.phoneInput.classList.remove('hidden');
                elements.encryptInput.parentElement.classList.add('hidden');
            } else {
                elements.phoneInput.classList.add('hidden');
                elements.encryptInput.parentElement.classList.remove('hidden');
            }
        });
    });

    // Toggle Password Visibility
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', () => {
            const input = button.parentElement.querySelector('input');
            const icon = button.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Encrypt Button
    elements.encryptBtn.addEventListener('click', () => {
        let input = currentType === 'phone' 
            ? `${elements.countryCode.value} ${elements.phoneNumber.value}`.trim()
            : elements.encryptInput.value;
        
        const secretKey = elements.encryptKey.value;

        // Validate Input
        if (!validateInput(currentType, input)) {
            elements.encryptError.textContent = `Invalid ${currentType} format`;
            elements.encryptError.classList.remove('hidden');
            return;
        }

        try {
            const encrypted = encrypt(input, secretKey);
            elements.encryptedText.textContent = encrypted;
            elements.encryptResult.classList.remove('hidden');
            elements.copyEncrypted.classList.remove('hidden');
            elements.encryptError.classList.add('hidden');
            
            // Add to history
            historyManager.addEntry(currentType, 'encrypt', input, encrypted);
        } catch (error) {
            elements.encryptError.textContent = 'Encryption failed. Please try again.';
            elements.encryptError.classList.remove('hidden');
        }
    });

    // Decrypt Button
    elements.decryptBtn.addEventListener('click', () => {
        const input = elements.decryptInput.value;
        const secretKey = elements.decryptKey.value;

        if (!input) {
            elements.decryptError.textContent = 'Please enter text to decrypt';
            elements.decryptError.classList.remove('hidden');
            return;
        }

        try {
            const decrypted = decrypt(input, secretKey);
            elements.decryptedText.textContent = decrypted;
            elements.decryptResult.classList.remove('hidden');
            elements.copyDecrypted.classList.remove('hidden');
            elements.decryptError.classList.add('hidden');
            
            // Add to history
            historyManager.addEntry('unknown', 'decrypt', input, decrypted);
        } catch (error) {
            elements.decryptError.textContent = 'Decryption failed. Please check your input and secret key.';
            elements.decryptError.classList.remove('hidden');
        }
    });

    // Copy Buttons
    elements.copyEncrypted.addEventListener('click', () => {
        navigator.clipboard.writeText(elements.encryptedText.textContent);
        showToast('Copied to clipboard!');
    });

    elements.copyDecrypted.addEventListener('click', () => {
        navigator.clipboard.writeText(elements.decryptedText.textContent);
        showToast('Copied to clipboard!');
    });

    // History Modal
    elements.historyBtn.addEventListener('click', () => {
        if (!historyManager.password) {
            elements.passwordModal.style.display = 'block';
        } else {
            showHistory();
        }
    });

    elements.closeHistory.addEventListener('click', () => {
        elements.historyModal.style.display = 'none';
    });

    elements.submitPassword.addEventListener('click', () => {
        const password = elements.historyPassword.value;
        
        if (!historyManager.password) {
            historyManager.setPassword(password);
            elements.passwordModal.style.display = 'none';
            showHistory();
        } else if (historyManager.verifyPassword(password)) {
            elements.passwordModal.style.display = 'none';
            showHistory();
        } else {
            elements.passwordError.textContent = 'Incorrect password';
            elements.passwordError.classList.remove('hidden');
        }
    });

    elements.cancelPassword.addEventListener('click', () => {
        elements.passwordModal.style.display = 'none';
        elements.historyPassword.value = '';
        elements.passwordError.classList.add('hidden');
    });
});

// Helper Functions
function showHistory() {
    const history = historyManager.getHistory();
    elements.historyContent.innerHTML = history.length === 0 
        ? '<p class="text-gray-500 text-center">No history yet</p>'
        : generateHistoryTable(history);
    elements.historyModal.style.display = 'block';
}

function generateHistoryTable(history) {
    return `
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operation</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Input</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                ${history.reverse().map(entry => `
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${new Date(entry.timestamp).toLocaleString()}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${entry.type}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${entry.operation}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${entry.input}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${entry.result}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 translate-y-0';
    toast.textContent = message;

    // Add to document
    document.body.appendChild(toast);

    // Remove after 2 seconds
    setTimeout(() => {
        toast.classList.add('translate-y-full');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

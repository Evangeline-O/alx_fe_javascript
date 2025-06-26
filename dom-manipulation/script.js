// Quote data structure
let quotes = [];
let currentFilter = 'all';
let syncInterval;

// DOM Elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const categoryFilter = document.getElementById('categoryFilter');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const addQuoteBtn = document.getElementById('addQuoteBtn');
const exportBtn = document.getElementById('exportBtn');
const importFile = document.getElementById('importFile');
const syncStatus = document.getElementById('syncStatus');

// Initialize application
function init() {
    loadQuotes();
    showRandomQuote();
    setupEventListeners();
    startSync();
}

// Load quotes from localStorage
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    const storedFilter = sessionStorage.getItem('currentFilter');
    
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    } else {
        // Default quotes
        quotes = [
            { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
            { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership" },
            { text: "Your time is limited, so don't waste it living someone else's life.", category: "Life" }
        ];
        saveQuotes();
    }
    
    if (storedFilter) {
        currentFilter = storedFilter;
        categoryFilter.value = currentFilter;
    }
    
    populateCategories();
}

// Save quotes to localStorage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
    sessionStorage.setItem('currentFilter', currentFilter);
}

// Display random quote
function showRandomQuote() {
    let filteredQuotes = quotes;
    
    if (currentFilter !== 'all') {
        filteredQuotes = quotes.filter(quote => quote.category === currentFilter);
    }
    
    if (filteredQuotes.length === 0) {
        quoteDisplay.textContent = "No quotes available for this category.";
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    quoteDisplay.innerHTML = `
        <p>"${quote.text}"</p>
        <p class="quote-category">— ${quote.category}</p>
    `;
}

// Add new quote
function addQuote() {
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim() || 'General';
    
    if (!text) {
        alert('Please enter a quote!');
        return;
    }
    
    quotes.push({ text, category });
    saveQuotes();
    
    // Reset form
    newQuoteText.value = '';
    newQuoteCategory.value = '';
    
    // Update UI
    populateCategories();
    showRandomQuote();
}

// Populate categories dropdown
function populateCategories() {
    // Get unique categories
    const categories = [...new Set(quotes.map(quote => quote.category))];
    
    // Clear existing options except "All"
    while (categoryFilter.options.length > 1) {
        categoryFilter.remove(1);
    }
    
    // Add new categories
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Filter quotes by category
function filterQuotes() {
    currentFilter = categoryFilter.value;
    saveQuotes();
    showRandomQuote();
}

// Export quotes to JSON file
function exportQuotes() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = 'quotes.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Import quotes from JSON file
function importQuotes(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            
            // Validate the imported data
            if (!Array.isArray(importedQuotes) {
                throw new Error('Invalid format: Expected an array of quotes');
            }
            
            // Merge quotes (avoid duplicates)
            const newQuotes = importedQuotes.filter(newQuote => 
                !quotes.some(existingQuote => 
                    existingQuote.text === newQuote.text && 
                    existingQuote.category === newQuote.category
                )
            );
            
            quotes = [...quotes, ...newQuotes];
            saveQuotes();
            populateCategories();
            showRandomQuote();
            
            alert(`Successfully imported ${newQuotes.length} new quotes!`);
        } catch (error) {
            alert(`Error importing quotes: ${error.message}`);
            console.error('Import error:', error);
        }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
}

// Simulate server sync
async function syncWithServer() {
    try {
        updateSyncStatus('syncing', 'Syncing with server...');
        
        // Simulate server response with a mock API
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
        const serverData = await response.json();
        
        // Simulated server quotes (in a real app, this would come from the API)
        const serverQuotes = [
            { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "Perseverance" },
            { text: "The way to get started is to quit talking and begin doing.", category: "Action" }
        ];
        
        // Conflict resolution: Server data takes precedence
        const serverTexts = serverQuotes.map(q => q.text);
        quotes = quotes.filter(q => !serverTexts.includes(q.text));
        
        // Add server quotes
        quotes = [...quotes, ...serverQuotes];
        saveQuotes();
        
        // Update UI
        populateCategories();
        showRandomQuote();
        
        updateSyncStatus('synced', 'Data synced successfully!');
    } catch (error) {
        console.error('Sync error:', error);
        updateSyncStatus('error', 'Sync failed. Working offline.');
    }
}

// Update sync status display
function updateSyncStatus(status, message) {
    syncStatus.textContent = message;
    syncStatus.className = 'sync-status';
    
    if (status === 'syncing') {
        syncStatus.classList.add('syncing');
    } else if (status === 'synced') {
        syncStatus.classList.add('synced');
    } else if (status === 'error') {
        syncStatus.classList.add('error');
    }
}

// Start periodic syncing
function startSync() {
    // Initial sync
    syncWithServer();
    
    // Sync every 2 minutes
    syncInterval = setInterval(syncWithServer, 120000);
}

// Setup event listeners
function setupEventListeners() {
    newQuoteBtn.addEventListener('click', showRandomQuote);
    addQuoteBtn.addEventListener('click', addQuote);
    categoryFilter.addEventListener('change', filterQuotes);
    exportBtn.addEventListener('click', exportQuotes);
    importFile.addEventListener('change', importQuotes);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

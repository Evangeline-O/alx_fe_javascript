// Load from localStorage or use default
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Believe in yourself.", category: "Motivation" },
  { text: "Mental health matters.", category: "Mental Health" },
  { text: "Stay positive even in hard times.", category: "Inspiration" },
];

let selectedCategory = localStorage.getItem("selectedCategory") || "all";

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ✅ Show random quote based on selected category
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");

  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = `<p>No quotes in this category yet.</p>`;
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  quoteDisplay.innerHTML = `<p>"${quote.text}"</p><small>- ${quote.category}</small>`;

  // Save last viewed to sessionStorage
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

// ✅ Add new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText && newCategory) {
    quotes.push({ text: newText, category: newCategory });
    saveQuotes();
    populateCategories();
    alert("Quote added!");
    textInput.value = "";
    categoryInput.value = "";
  } else {
    alert("Please fill in both fields.");
  }
}

// ✅ Populate category dropdown dynamically
function populateCategories() {
  const categorySelect = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))];

  categorySelect.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    if (category === selectedCategory) {
      option.selected = true;
    }
    categorySelect.appendChild(option);
  });
}

// ✅ Filter quotes by selected category
function filterQuotes() {
  const categorySelect = document.getElementById("categoryFilter");
  selectedCategory = categorySelect.value;
  localStorage.setItem("selectedCategory", selectedCategory);
  showRandomQuote();
}

// ✅ Form setup for adding quotes + import/export
function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.id = "newQuoteText";
  textInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.onclick = addQuote;

  const exportButton = document.createElement("button");
  exportButton.textContent = "Export Quotes";
  exportButton.onclick = exportToJsonFile;

  const importInput = document.createElement("input");
  importInput.type = "file";
  importInput.accept = ".json";
  importInput.id = "importFile";
  importInput.onchange = importFromJsonFile;

  const categoryFilter = document.createElement("select");
  categoryFilter.id = "categoryFilter";
  categoryFilter.onchange = filterQuotes;

  formContainer.append(textInput, categoryInput, addButton, exportButton, importInput, categoryFilter);
  document.body.appendChild(formContainer);
}

// ✅ JSON Export
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// ✅ JSON Import
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      alert("Quotes imported successfully!");
    } catch (err) {
      alert("Invalid JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ✅ Init
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  createAddQuoteForm();
  populateCategories();
  showRandomQuote();
});

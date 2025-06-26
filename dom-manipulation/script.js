// script.js (Extended with Server Sync and Conflict Resolution + Async/Await + POST Support)

let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Believe in yourself.", category: "Motivation" },
  { text: "Mental health matters.", category: "Mental Health" },
  { text: "Stay positive even in hard times.", category: "Inspiration" },
];

let selectedCategory = localStorage.getItem("selectedCategory") || "all";
const serverEndpoint = "https://jsonplaceholder.typicode.com/posts"; // Fake API

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

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
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");
  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText && newCategory) {
    const newQuote = { text: newText, category: newCategory };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    alert("Quote added!");
    textInput.value = "";
    categoryInput.value = "";
    postQuoteToServer(newQuote);
  } else {
    alert("Please fill in both fields.");
  }
}

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

function filterQuotes() {
  const categorySelect = document.getElementById("categoryFilter");
  selectedCategory = categorySelect.value;
  localStorage.setItem("selectedCategory", selectedCategory);
  showRandomQuote();
}

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

  const syncButton = document.createElement("button");
  syncButton.textContent = "Sync with Server";
  syncButton.onclick = syncWithServer;

  const manualSyncButton = document.createElement("button");
  manualSyncButton.textContent = "Manual Sync (syncQuotes)";
  manualSyncButton.onclick = syncQuotes;

  formContainer.append(
    textInput,
    categoryInput,
    addButton,
    exportButton,
    importInput,
    categoryFilter,
    syncButton,
    manualSyncButton
  );
  document.body.appendChild(formContainer);
}

function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

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

async function fetchQuotesFromServer() {
  try {
    const response = await fetch(serverEndpoint);
    const data = await response.json();
    const serverQuotes = data.slice(0, 3).map(post => ({
      text: post.title,
      category: "Server"
    }));
    quotes = mergeQuotes(serverQuotes, quotes);
    saveQuotes();
    populateCategories();
    alert("Quotes synced with server!");
  } catch (error) {
    console.error("Failed to sync with server:", error);
  }
}

async function postQuoteToServer(quote) {
  try {
    const response = await fetch(serverEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quote)
    });
    const result = await response.json();
    console.log("Quote posted to server:", result);
  } catch (error) {
    console.error("Error posting quote to server:", error);
  }
}

function mergeQuotes(serverQuotes, localQuotes) {
  const allTexts = new Set(localQuotes.map(q => q.text));
  const merged = [...localQuotes];
  serverQuotes.forEach(sq => {
    if (!allTexts.has(sq.text)) {
      merged.push(sq);
    }
  });
  return merged;
}

function syncWithServer() {
  fetchQuotesFromServer();
}

function syncQuotes() {
  console.log("syncQuotes triggered");
  syncWithServer();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  createAddQuoteForm();
  populateCategories();
  showRandomQuote();
  setInterval(fetchQuotesFromServer, 60000);
});

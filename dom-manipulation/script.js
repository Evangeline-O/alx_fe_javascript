// Quotes array with text and category properties
let quotes = [
  { text: "Believe in yourself.", category: "Motivation" },
  { text: "Mental health matters.", category: "Mental Health" },
  { text: "Stay positive even in hard times.", category: "Inspiration" },
];

// ✅ Function name updated to "showRandomQuote"
// ✅ Uses innerHTML
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<p>"${quote.text}"</p><small>- ${quote.category}</small>`;
}

// Function to add a new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText && newCategory) {
    quotes.push({ text: newText, category: newCategory });
    alert("Quote added successfully!");
    textInput.value = "";
    categoryInput.value = "";
  } else {
    alert("Please fill in both quote and category.");
  }
}

// ✅ Event listener calls showRandomQuote
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

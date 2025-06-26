// Array to store quotes
let quotes = [
  { text: "Believe in yourself.", category: "Motivation" },
  { text: "Stay curious and keep learning.", category: "Education" },
  { text: "Your mental health matters.", category: "Well-being" },
  { text: "Code like a girl and lead like a boss!", category: "Tech" }
];

// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = `<p>"${quote.text}"</p><small>- ${quote.category}</small>`;
}

// Function to add a new quote
function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value.trim();
  const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

  if (quoteText === "" || quoteCategory === "") {
    alert("Please fill in both the quote and category.");
    return;
  }

  quotes.push({ text: quoteText, category: quoteCategory });
  alert("Quote added successfully!");

  // Clear input fields
  document.getElementById('newQuoteText').value = "";
  document.getElementById('newQuoteCategory').value = "";
}

// Event listener for showing a random quote
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Show a quote when the page loads
window.addEventListener('DOMContentLoaded', showRandomQuote);

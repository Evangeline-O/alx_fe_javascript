// Step 1: Define the quotes array
const quotes = [
  { text: "Believe in yourself.", category: "Motivation" },
  { text: "Stay curious and keep learning.", category: "Education" },
  { text: "Your mental health matters.", category: "Well-being" },
  { text: "Code like a girl and lead like a boss!", category: "Tech" }
];

// Step 2: Create displayRandomQuote function
function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = `<p>"${quote.text}"</p><small>- ${quote.category}</small>`;
}

// Step 3: Create addQuote function
function addQuote() {
  const newText = document.getElementById('newQuoteText').value.trim();
  const newCategory = document.getElementById('newQuoteCategory').value.trim();

  if (newText === "" || newCategory === "") {
    alert("Please fill in both fields.");
    return;
  }

  quotes.push({ text: newText, category: newCategory });

  alert("New quote added successfully!");
  document.getElementById('newQuoteText').value = "";
  document.getElementById('newQuoteCategory').value = "";
}

// Step 4: Add event listener to button
document.getElementById('newQuote').addEventListener('click', displayRandomQuote);

// Optional: Show a random quote on load
window.addEventListener('DOMContentLoaded', displayRandomQuote);

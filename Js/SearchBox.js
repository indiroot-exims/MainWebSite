// List of products with their names and corresponding URLs
const products = [
    { name: "Banana Powder", url: "BananaPowder.html" },
    { name: "Moringa Powder", url: "MoringaPowder.html" },
    { name: "Amla Powder", url: "Amlapowder.html" },
    { name: "Beatroot Powder", url: "BeatrootPowder.html" },
    { name: "Lemongrass Powder", url: "Lemongrass.html" },
    { name: "Neem Powder", url: "NeemPowder.html" },
{ name: "Wheatgrass Powder", url: "WheatgrassPowder.html" },
    
    // Add more products and URLs as needed
  ];
  
  // Function to toggle between the search icon and input field
  function toggleSearchBox() {
    const searchBox = document.getElementById("searchProduct");
    const searchIcon = document.getElementById("search-icon");
  
    // If search box is not expanded, expand it
    if (searchBox.style.display === "none" || searchBox.style.opacity === "0") {
      searchBox.style.display = "block"; // Make the input visible
      setTimeout(() => {
        searchBox.classList.add("expanded"); // Smooth expand the input field
      }, 10);
      
      searchIcon.style.display = "none"; // Hide the search icon when input is visible
    } else {
      searchBox.classList.remove("expanded"); // Smooth collapse the input field
      setTimeout(() => {
        searchBox.style.display = "none"; // Hide the input
        searchIcon.style.display = "block"; // Show the search icon again
      }, 300); // Wait for the transition to finish
    }
  }
  
  // Function to filter products based on user input
  function searchProducts() {
    const query = document.getElementById("searchProduct").value.trim().toLowerCase();
    
    if (query.length < 3) {
      document.getElementById("search-results").style.display = "none"; // Hide dropdown if less than 3 characters
      return;
    }
    
    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(query));
  
    const resultsList = document.getElementById("search-results");
    
    if (filteredProducts.length > 0) {
      // Display the filtered products in the dropdown
      resultsList.innerHTML = ""; // Clear any previous results
  
      filteredProducts.forEach(product => {
        const listItem = document.createElement("li");
        listItem.classList.add("list-group-item");
        listItem.textContent = product.name;
        listItem.style.cursor = "pointer";
        
        // Add click event to navigate to the product page
        listItem.addEventListener("click", () => {
          window.location.href = product.url; // Redirect to the product's URL
        });
  
        resultsList.appendChild(listItem);
      });
      
      resultsList.style.display = "block"; // Show the dropdown
    } else {
      // If no matches, hide the dropdown
      resultsList.style.display = "none";
    }
  }
  
  // Hide the dropdown when clicking outside
  document.addEventListener("click", function(event) {
    if (!event.target.closest('.search-container')) {
      document.getElementById("search-results").style.display = "none";
      document.getElementById("searchProduct").style.display = "none";
      document.getElementById("search-icon").style.display = "block";
    }
  });

  

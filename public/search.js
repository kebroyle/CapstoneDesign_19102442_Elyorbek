// JavaScript code for searching products (simulated data)

const products = [
    { name: "Pizza", price: 49.99, image: "Pizza.jpg" },
    { name: "Italian Pizza", price: 29.99, image: "Pizza.jpg" },
    { name: "CheesePizza", price: 39.99, image: "Pizza.jpg" },
    { name: "hamburger", price: 59.99, image: "hamburger.jpg" },
    { name: "hamburger", price: 19.99, image: "hamburger.jpg" },
    { name: "hamburger", price: 19.99, image: "hamburger.jpg" },
    { name: "hamburger", price: 19.99, image: "hamburger.jpg" },
    { name: "hamburger", price: 19.99, image: "hamburger.jpg" },
    { name: "hamburger", price: 19.99, image: "hamburger.jpg" },
    { name: "hamburger", price: 19.99, image: "hamburger.jpg" },
    { name: "hamburger", price: 19.99, image: "hamburger.jpg" },
    { name: "hamburger", price: 19.99, image: "hamburger.jpg" },
    { name: "hamburger", price: 19.99, image: "hamburger.jpg" },
    { name: "hamburger", price: 19.99, image: "hamburger.jpg" },
    { name: "hamburger", price: 19.99, image: "hamburger.jpg" },
    { name: "hamburger", price: 19.99, image: "hamburger.jpg" },
    { name: "hamburger", price: 19.99, image: "hamburger.jpg" },
    { name: "hamburger", price: 19.99, image: "hamburger.jpg" },
    { name: "hamburger", price: 19.99, image: "hamburger.jpg" }
];

document.getElementById("search-button").addEventListener("click", () => {
    const searchQuery = document.getElementById("search-input").value.toLowerCase();
    const resultsContainer = document.getElementById("results-container");
    resultsContainer.innerHTML = "";

    products.forEach(product => {
        if (product.name.toLowerCase().includes(searchQuery)) {
            const productElement = document.createElement("div");
            productElement.className = "product";
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>dd
                <p>Price: $${product.price}</p>
            `;
            resultsContainer.appendChild(productElement);
        }
    });
});

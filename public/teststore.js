// JavaScript code to simulate adding products to the cart

const addToCartButtons = document.querySelectorAll(".add-to-cart");

addToCartButtons.forEach(button => {
    button.addEventListener("click", () => {
        alert("Product added to cart. Continue shopping or proceed to checkout.");
    });
});

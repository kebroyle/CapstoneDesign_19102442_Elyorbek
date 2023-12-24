// JavaScript to handle form submission and image upload
document.getElementById('productForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(document.getElementById('productForm'));
    const imageFile = document.getElementById('product_image').files[0];
    formData.append('product_image', imageFile);

    // Here you can perform actions like sending the data to the server via fetch or AJAX
    // For this example, let's log the form data including the image to the console
    for (const pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }
});

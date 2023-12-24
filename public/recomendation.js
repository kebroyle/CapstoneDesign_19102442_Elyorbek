// Sample data for recommendations
const recommendations = {
    "Technology": ["Smartphones", "Laptops", "Gadgets", "Drones"],
    "Books": ["Fiction", "Non-fiction", "Science Fiction", "Mystery"],
    "Food": ["Recipes", "Restaurants", "Cuisines", "Healthy Eating"],
    // Add more categories and recommendations as needed
};

function search() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.trim();

    if (searchTerm === '') {
        return; // If the search input is empty, do nothing
    }

    displayRecommendations(recommendations[searchTerm]);
}

function displayRecommendations(items) {
    const recommendationList = document.getElementById('recommendationList');
    recommendationList.innerHTML = ''; // Clear the list before displaying new recommendations

    if (items && items.length > 0) {
        items.forEach(item => {
            const recommendationItem = document.createElement('div');
            recommendationItem.classList.add('recommendation-item');
            recommendationItem.innerText = item;
            recommendationList.appendChild(recommendationItem);
        });
    } else {
        recommendationList.innerHTML = 'No recommendations found.';
    }
}

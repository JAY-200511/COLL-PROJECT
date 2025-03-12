document.getElementById("foodForm").addEventListener("submit", function(event) {
    event.preventDefault();
    let name = document.getElementById("foodName").value;
    let price = document.getElementById("foodPrice").value;
    let category = document.getElementById("foodCategory").value;
    let file = document.getElementById("foodImage").files[0];

    if (!file) {
        alert("Please select an image!");
        return;
    }

    let reader = new FileReader();
    reader.onload = function(e) {
        let foodItem = {
            name: name,
            price: price,
            category: category,
            image: e.target.result
        };

        let foodItems = JSON.parse(localStorage.getItem("foodItems")) || [];
        foodItems.push(foodItem);
        localStorage.setItem("foodItems", JSON.stringify(foodItems));

        let foodList = document.getElementById("foodList");
        foodList.innerHTML += `
            <div class="food-card">
                <img src="${e.target.result}" alt="${name}" class="food-image">
                <h3>${name}</h3>
                <p>₹${price}</p>
                <p>${category}</p>
                <div class="counter-container">
                    <button onclick="decreaseQuantity(this)">-</button>
                    <span class="quantity">1</span>
                    <button onclick="increaseQuantity(this)">+</button>
                </div>
                <button onclick="removeFoodItem(this)" class="remove-btn">Remove</button>
            </div>
        `;
        updateFoodCounter();
    };
    reader.readAsDataURL(file);
});

// Load existing food items
window.addEventListener('load', function() {
    let foodItems = JSON.parse(localStorage.getItem("foodItems")) || [];
    let foodList = document.getElementById("foodList");
    foodItems.forEach(item => {
        foodList.innerHTML += `
            <div class="food-card">
                <img src="${item.image}" alt="${item.name}" class="food-image">
                <h3>${item.name}</h3>
                <p>₹${item.price}</p>
                <p>${item.category}</p>
                <button onclick="removeFoodItem(this)" class="remove-btn">Remove</button>
            </div>
        `;
    });
    updateFoodCounter();
});

function removeFoodItem(button) {
    let foodCard = button.closest('.food-card');
    let foodName = foodCard.querySelector('h3').textContent;
    let foodItems = JSON.parse(localStorage.getItem("foodItems")) || [];
    foodItems = foodItems.filter(item => item.name !== foodName);
    localStorage.setItem("foodItems", JSON.stringify(foodItems));
    foodCard.remove();
    updateFoodCounter();
}

function updateFoodCounter() {
    const foodList = JSON.parse(localStorage.getItem("foodItems")) || [];
    document.getElementById("foodCounter").innerText = `Total Food Items: ${foodList.length}`;
}
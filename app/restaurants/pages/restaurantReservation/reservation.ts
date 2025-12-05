import { RestaurantService } from "../../services/restaurant.service";
import { Meal } from "../../models/meal.model";

const restaurantService = new RestaurantService;

function loadMeals(restaurantId: string) {
    restaurantService.getById(restaurantId)
        .then(result => {
            showMeals(result.meals);
        })
        .catch(error => {
            console.error("Error:", error);
        })
}

function showMeals(meals: Meal[]): void {
    const container = document.getElementById("meals");
    container.innerHTML = "";

    meals.forEach(meal => {
        const card = document.createElement("div");
        card.classList.add("meal-card");

        const img = document.createElement("img");
        img.src = meal.imageUrl;
        img.alt = meal.name;

        const name = document.createElement("h4");
        name.textContent = meal.name;

        const price = document.createElement("p");
        price.textContent = `Price: ${meal.price} €`;

        card.appendChild(img);
        card.appendChild(name);
        card.appendChild(price);
        container.appendChild(card);
    });
}
function initializeData() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const restaurantId = urlParams.get('id');
    const reservationButton = document.querySelector("#restaurantReservation") as HTMLButtonElement;

    loadMeals(restaurantId);
     reservationButton.addEventListener("click", () => {
        window.location.href = `../restaurantReservationForm/restaurantReservationForm.html?id=${restaurantId}`;
    });
}

document.addEventListener("DOMContentLoaded", initializeData);
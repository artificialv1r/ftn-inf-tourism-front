import { RestaurantService } from "../../services/restaurant.service";
import { Restaurant } from "../../models/restaurant.model";

const restaurantService = new RestaurantService;
let page: number = 1;
let totalCount = 0;
const pageSizeSelect = document.querySelector("#pageSize") as HTMLSelectElement;
const orderBy = document.querySelector("#orderBy") as HTMLSelectElement;
const orderDirection = document.querySelector("#orderDirection") as HTMLSelectElement;
const nextBtn = document.querySelector("#nextPage") as HTMLButtonElement;
const prevBtn = document.querySelector("#prevPage") as HTMLButtonElement;
const currentPage = document.querySelector("#currentPage") as HTMLElement;

function loadRestaurants() {
    const pageSize = pageSizeSelect.value;
    restaurantService.getPaged(0, page, Number(pageSize), orderBy.value, orderDirection.value)
    .then(result => {
            const restaurants = result.data;
            totalCount = result.totalCount;
            displeyRestaurants(restaurants);
            updateButtons(totalCount);
        })
}


function displeyRestaurants(restaurants: Restaurant[]): void {
    const container = document.getElementById("restaurants");
    container.innerHTML = "";
    restaurants.forEach(restaurant => {
        const card = document.createElement("div");
        card.classList.add("restaurant-card");

        const img = document.createElement("img");
        img.src = restaurant.imageUrl;
        img.classList.add("restaurant-image");

        const button = document.createElement("button");
        button.classList.add("see-more");
        button.textContent = "See more";
        button.addEventListener("click", () => window.location.href = `../restaurantReservation/reservation.html?id=${restaurant.id}`);

        const content = document.createElement("div");
        content.classList.add("restaurant-content");
        content.innerHTML = `
                <h3>${restaurant.name}</h3>
                <p>${restaurant.description}</p>
                <p id="guest">Max Guests: ${restaurant.capacity}</p>
            `;

        card.appendChild(img);
        card.appendChild(content);
        card.appendChild(button);
        container.appendChild(card);
    });
}

function updateButtons(totalCount:number): void {
    const totalPages = Math.ceil(totalCount / Number(pageSizeSelect.value));

    currentPage.textContent = page.toString();

    prevBtn.disabled = page <= 1;
    nextBtn.disabled = page >= totalPages;
}

function initializeData(): void {
    nextBtn.addEventListener("click", () => {
        page++;
        loadRestaurants();
    });
    prevBtn.addEventListener("click", () => {
        if (page > 1) {
            page--;
            loadRestaurants();
        }
    });
    pageSizeSelect.addEventListener("change", () => {
        page = 1;
        loadRestaurants();
    });
    orderBy.addEventListener("change", () => {
        page = 1;
        loadRestaurants();
    });
    orderDirection.addEventListener("change", () =>{
        page = 1;
        loadRestaurants();
    });
    loadRestaurants();
}

document.addEventListener("DOMContentLoaded", initializeData);
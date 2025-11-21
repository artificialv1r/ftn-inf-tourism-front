import { RestaurantFormData } from "../../models/restaurantForm.model";
import { RestaurantService } from "../../services/restaurant.service";
import { MealForm } from "../../models/mealForm.model";
import { Restaurant } from "../../models/restaurant.model";
import { Meal } from "../../models/meal.model";

const restaurantService = new RestaurantService;

function submit(id: string): void {
    const rola = localStorage.getItem('role');
    if (rola == "vlasnik") {
        const name = (document.querySelector('#name') as HTMLInputElement).value
        const description = (document.querySelector('#description') as HTMLInputElement).value
        const capacity = parseInt((document.querySelector('#capacity') as HTMLInputElement).value)
        const imageUrl = (document.querySelector('#imageUrl') as HTMLInputElement).value
        const latitude = parseFloat((document.querySelector('#latitude') as HTMLInputElement).value)
        const longitude = parseFloat((document.querySelector('#longitude') as HTMLInputElement).value)
        const ownerId = Number(localStorage.getItem('id'));


        if (!name || !description || !capacity || !imageUrl || !latitude || !longitude) {
            alert("All fields are required!");
            return
        }

        const formData: RestaurantFormData = { name, description, capacity, imageUrl, latitude, longitude, ownerId }
        if (id) {
            restaurantService.update(id, formData)
                .then(() => {
                    window.location.href = '/index.html'
                }).catch(error => {
                    console.error(error.status, error.text);
                })
        } else {
            restaurantService.add(formData)
                .then(() => {
                    window.location.href = '/restaurants/pages/restaurant/restaurant.html'
                }).catch(error => {
                    console.error(error.status, error.text)
                })
        }
    }
}
function showMeals(id: string, meals: Meal[]): void {
    const mealsContainer = document.querySelector("#active-meals") as HTMLElement;
    mealsContainer.innerHTML = "";
    meals.forEach(meal => {
        const container = document.createElement('div');
        container.classList.add("meal-container");
        const imageSection = document.createElement('div');
        imageSection.className = "image-section";
        const detailSection = document.createElement('div');
        detailSection.className = "detail-section";
        const image = document.createElement('img');
        image.src = meal.imageUrl;
        imageSection.appendChild(image);

        const title = document.createElement('h3');
        title.textContent = meal.name;

        const price = document.createElement('p');
        price.textContent = meal.price.toString();

        const ingredients = document.createElement('p');
        ingredients.textContent = meal.ingredients;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Obrisi';
        deleteButton.onclick = function () {
            restaurantService.deleteMeal(Number(id), meal.id)
                .then(() => {
                    window.location.reload();
                })
                .catch(error => {
                    console.error(error.status, error.text);
                });
        };
        detailSection.appendChild(title);
        detailSection.appendChild(price);
        detailSection.appendChild(ingredients);
        detailSection.appendChild(deleteButton);
        container.appendChild(imageSection);
        container.appendChild(detailSection);
        mealsContainer.appendChild(container);
    });
}

function AddMeal(id: string): void {
    if (!id) return;

    restaurantService.getById(id).then(restaurant => {
        const order = restaurant.meals.length + 1;
        console.log(order);
        const name = (document.querySelector('#nameMeal') as HTMLInputElement).value;
        const price = parseFloat((document.querySelector('#price') as HTMLInputElement).value);
        const imageUrl = (document.querySelector('#imageMeal') as HTMLInputElement).value;
        const ingredients = (document.querySelector('#ingredients') as HTMLInputElement).value;
        const restaurantId = Number(id);

        if (!name || !price || !imageUrl || !ingredients) {
            alert("All fields are required!");
            return;
        }

        const mealFormData: MealForm = { order, name, price, imageUrl, ingredients, restaurantId };

        restaurantService.createMeal(restaurantId, mealFormData)
            .then(() => window.location.reload())
            .catch(error => console.error(error.status, error.text));
    }).catch(error => console.error(error.status, error.text));
}

function checkPublish(id: string, restaurant: Restaurant): void {
    const publishBtn = document.querySelector("#publish") as HTMLButtonElement
    if (restaurant.imageUrl.length >= 1 && restaurant.meals.length >= 5) {
        publishBtn.disabled = false;
    } else {
        publishBtn.disabled = true;
        restaurant.status = "u pripremi";

        const name = (document.querySelector('#name') as HTMLInputElement).value
        const description = (document.querySelector('#description') as HTMLInputElement).value
        const capacity = parseInt((document.querySelector('#capacity') as HTMLInputElement).value)
        const imageUrl = (document.querySelector('#imageUrl') as HTMLInputElement).value
        const latitude = parseFloat((document.querySelector('#latitude') as HTMLInputElement).value)
        const longitude = parseFloat((document.querySelector('#longitude') as HTMLInputElement).value)
        const status = restaurant.status;
        const ownerId = Number(localStorage.getItem('id'));

        const formData: RestaurantFormData = { name, description, capacity, imageUrl, latitude, longitude, status, ownerId }
        restaurantService.update(id, formData);
    }
}
function publishRestaurant(id: string): void {
    if (id) {
        restaurantService.getById(id)
            .then(restaurant => {
                restaurant.status = "objavljeno";

                const name = (document.querySelector('#name') as HTMLInputElement).value
                const description = (document.querySelector('#description') as HTMLInputElement).value
                const capacity = parseInt((document.querySelector('#capacity') as HTMLInputElement).value)
                const imageUrl = (document.querySelector('#imageUrl') as HTMLInputElement).value
                const latitude = parseFloat((document.querySelector('#latitude') as HTMLInputElement).value)
                const longitude = parseFloat((document.querySelector('#longitude') as HTMLInputElement).value)
                const status = restaurant.status;
                const ownerId = Number(localStorage.getItem('id'));

                const formData: RestaurantFormData = { name, description, capacity, imageUrl, latitude, longitude, status, ownerId }
                restaurantService.update(id, formData)
                    .then(() => {
                        window.location.href = "../restaurant/restaurant.html";
                    })
                    .catch(error => {
                        console.error("Greška pri objavljivanju:", error);
                        alert("Neuspešno objavljivanje restorana.");
                    });
            }).catch(error => {
                console.error(error.status, error.text)
            })
    }
}
function initializeForm(): void {
    const queryString = window.location.search;
    const urlparams = new URLSearchParams(queryString);
    const id = urlparams.get('id');

    const button = document.querySelector("#submitBtn");
    const mealButton = document.querySelector("#addMeal");
    const publishBtn = document.querySelector("#publish");
    if (id) {
        restaurantService.getById(id)
            .then(restaurant => {
                (document.querySelector('#name') as HTMLInputElement).value = restaurant.name;
                (document.querySelector('#description') as HTMLInputElement).value = restaurant.description;
                (document.querySelector('#capacity') as HTMLInputElement).value = restaurant.capacity.toString();
                (document.querySelector('#imageUrl') as HTMLInputElement).value = restaurant.imageUrl;
                (document.querySelector('#latitude') as HTMLInputElement).value = restaurant.latitude.toString();
                (document.querySelector('#longitude') as HTMLInputElement).value = restaurant.longitude.toString();
                showMeals(id, restaurant.meals);
                checkPublish(id, restaurant);
                (document.querySelector('#add-meal') as HTMLElement).classList.remove('hidden');
                (document.querySelector('#active-meals') as HTMLElement).classList.remove('hidden');
                (document.querySelector('#publish') as HTMLElement).classList.remove('hidden');
            })
            .catch(err => console.error("Error loading restaurant meals", err));
    }
    if (button) {
        button.addEventListener("click", () => submit(id));
    }
    if (mealButton) {
        mealButton.addEventListener("click", () => AddMeal(id));
    }
    if (publishBtn) {
        publishBtn.addEventListener("click", () => publishRestaurant(id));
    }
}

document.addEventListener("DOMContentLoaded", initializeForm);
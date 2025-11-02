import { RestaurantFormData } from "../../models/restaurantForm.model";
import { RestaurantService } from "../../services/restaurant.service";

const restaurantService = new RestaurantService;
function submit() {

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

    const formData: RestaurantFormData = { name, description, capacity, imageUrl, latitude, longitude, ownerId}
    const queryString = window.location.search;
    const urlparams = new URLSearchParams(queryString);
    const id = urlparams.get('id');
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
            window.location.href = '/restaurants/pages/restaurants/restaurant.html'
        }).catch(error => {
            console.error(error.status, error.text)
        })
    }}
}
document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector("#submitBtn");
    if (button) {
        button.addEventListener("click", submit)
    }
})
import { RestaurantService } from "../../services/restaurant.service";

const rService = new RestaurantService;

function cancelReservation(restaurantId: number, reservationId: number) {
    rService.deleteReservation(restaurantId, reservationId)
        .then(() => { window.alert("You have successfully canceled your reservation."); })
        .catch((error) =>{
        const spanError = document.getElementById("spanError") as HTMLElement;
        spanError.hidden = false;
        spanError.textContent = error.message;
    });
}
async function showReservationDetailes(restaurantId: string, reservationId: string) {
    try {
        const reservation = await rService.getReservationById(restaurantId, reservationId);
        const restaurant = await rService.getById(restaurantId);

        const touristName = document.getElementById("toristId") as HTMLElement;
        const restaurantName = document.getElementById("restaurantName") as HTMLElement;
        const date = document.getElementById("date") as HTMLElement;
        const meal = document.getElementById("meal") as HTMLElement;
        const guests = document.getElementById("guests") as HTMLElement;

        if (touristName) touristName.textContent = localStorage.getItem("username") || "";
        if (restaurantName) restaurantName.textContent = restaurant.name;
        if (date) date.textContent = reservation.reservationDate;
        if (meal) meal.textContent = reservation.mealType;
        if (guests) guests.textContent = reservation.guestsNumber.toString();

    } catch (errorMessage) {
        console.log(errorMessage);
    }

}

function initializeDate() {
    const queryString = window.location.search;
    const urlparams = new URLSearchParams(queryString);
    const restaurantId = urlparams.get("restaurantId");
    const reservationId = urlparams.get("reservationId");
    showReservationDetailes(restaurantId, reservationId);

    const button = document.getElementById("cancel") as HTMLButtonElement;

    button.addEventListener("click", () => cancelReservation(Number(restaurantId), Number(reservationId)));
}

document.addEventListener("DOMContentLoaded", initializeDate);
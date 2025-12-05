import { RestaurantService } from "../../services/restaurant.service";
import { ReservationFormData } from "../../models/restaurantReservationForm";

const restaurantService = new RestaurantService;

function submit(id: string, avalibleSeats: number): void {
    const dateInput = document.querySelector('#date-input') as HTMLInputElement;
    const date = new Date(dateInput.value);
    const reservationDate = date.toISOString().split('T')[0];

    const mealType = (document.querySelector('#meal-type') as HTMLSelectElement).value
    const guestsNumber = parseInt((document.querySelector('#guests-input') as HTMLInputElement).value)
    const touristId = Number(localStorage.getItem('id'));
    const user = localStorage.getItem('role');
    const restaurantId = Number(id);


    if (!reservationDate || !mealType || !guestsNumber) {
        alert("All fields are required!");
        return
    }

    if (!validateMealTime(mealType, reservationDate)) {
        alert("You cannot reserve this meal today because its time has already passed!")
        return;
    }

    if (!checkAvalibleSeats(avalibleSeats, guestsNumber)) {
        window.alert("Not enough available seats!");
        return;
    }

    if (!(user === "turista")) {
        window.alert("Only tourists can make reservations. Please sign in as a tourist.");
    }

    const formData: ReservationFormData = { reservationDate, mealType, guestsNumber, touristId, restaurantId }
    if (id) {
        restaurantService.createReservation(restaurantId, formData)
            .then((createdReservation) => {
                window.location.href = `/restaurants/pages/reservationConfirmation/reservationConfirmation.html?restaurantId=${restaurantId}&reservationId=${createdReservation.id}`;
            }).catch(error => {
                console.error(error.status, error.text);
            })
    }
}
function validateMealTime(mealType: string, reservationDate: string): boolean {
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    if (reservationDate !== today) return true;
    const currentHour = now.getHours();
    let mealHour = 0;

    if (mealType === "Breakfast 08:00h") {
        mealHour = 8;
    }
    else if (mealType === "Lunch 13:00h") {
        mealHour = 13;
    } else if (mealType === "Dinner 18:00h") {
        mealHour = 18;
    }

    return currentHour < mealHour;
}

function calculateSeats(restaurantId: string): Promise<number> {
    return restaurantService.getReservationsById(restaurantId)
        .then(reservations => {
            let takenSeats = 0;
            reservations.forEach(r => {
                takenSeats += r.guestsNumber

            });
            return takenSeats;
        });
}

function checkAvalibleSeats(avalibleSeats: number, numberOfGuests: number): boolean {
    return avalibleSeats >= numberOfGuests;
}

async function initializeForm(): Promise<void> {
    const queryString = window.location.search;
    const urlparams = new URLSearchParams(queryString);
    const id = urlparams.get('id');

    try {
        const restaurant = await restaurantService.getById(id);
        const takenSeats = await calculateSeats(id);
        const freeSeats = restaurant.capacity - takenSeats;

        //postavljamo da se moze izabrati samo datum u buducnosti
        const dateInput = document.querySelector('#date-input') as HTMLInputElement;
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;

        const button = document.querySelector("#reserve-button");
        if (button) {
            button.addEventListener("click", () => submit(id, freeSeats));
        }

    } catch (error) {
        console.error("Greška pri inicijalizaciji forme:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => initializeForm());
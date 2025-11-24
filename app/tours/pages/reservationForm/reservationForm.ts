import { Reservation } from "../../model/reservation.mode";
import { ReservationService } from "../../service/reservation.service";
import { TourService } from "../../service/tour.service";

const reservationService = new ReservationService()
const tourService = new TourService()

function init(): void {
    const overview = document.querySelector('#overview') as HTMLElement
    const reservationButton = document.querySelector('#reserve-button') as HTMLButtonElement

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const tourId = urlParams.get('tourId');
    const role = localStorage.getItem('role')

    if (tourId) {
        renderTourInfo(tourId)
        displayKeypoints(tourId)
        const guestsInput = document.querySelector('#guests-input') as HTMLInputElement;
        const warning = document.querySelector('#input-warning') as HTMLElement;

        if (role !== "turista") {
            reservationButton.disabled = true;
            return;
        }

        reservationButton.addEventListener("click", () => makeReservation(tourId));

        guestsInput.addEventListener("input", async () => {
            const freeSlots = await checkFreeSlots(tourId);
            const guests = Number(guestsInput.value);
            if (guests <= 0) {
                reservationButton.disabled = true;
                warning.textContent = `Number of guests must be greater than 0`;
            }
            else if (guests > freeSlots) {
                reservationButton.disabled = true;
                warning.textContent = `Not enough free slots`;
            } else {
                reservationButton.disabled = false;

                warning.textContent = "";
            }
        });
    } else {
        overview.innerHTML = ""
    }
}

async function renderTourInfo(tourId: string): Promise<void> {
    try {
        const tour = await tourService.getById(tourId)
        const tourInfo = document.querySelector('#tour-info') as HTMLElement

        const title = document.createElement('h3')
        title.textContent = tour.name

        const description = document.createElement('h4')
        description.textContent = tour.description

        const infoRow = document.createElement('div')
        infoRow.className = "info-row"

        const dateObj = new Date(tour.dateTime);

        const formattedDate = dateObj.toLocaleDateString("sr-RS", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });

        const formattedTime = dateObj.toLocaleTimeString("sr-RS", {
            hour: "2-digit",
            minute: "2-digit"
        });

        const dateElement = document.createElement('p');
        dateElement.textContent = `Date: ${formattedDate}`;

        const timeElement = document.createElement('p');
        timeElement.textContent = `Start: ${formattedTime}`;

        const limit = document.createElement('p')
        limit.textContent = `Limit: ${tour.maxGuests.toString()}`;

        const freeSlots = document.createElement('p')
        const availableSlots = await checkFreeSlots(tourId)

        freeSlots.textContent = `Free Slots: ${availableSlots}`

        infoRow.appendChild(dateElement)
        infoRow.appendChild(timeElement)
        infoRow.appendChild(limit)
        infoRow.appendChild(freeSlots)

        tourInfo.appendChild(title)
        tourInfo.appendChild(description)
        tourInfo.appendChild(infoRow)
    } catch (error) {
        console.error(error)
    }
}

async function checkFreeSlots(tourId: string): Promise<number> {
    let slotsTaken: number = 0;
    try {
        const reservations = await reservationService.getByTourId(tourId);

        reservations.forEach(reservation => {
            slotsTaken += reservation.guests
        })

        const tour = await tourService.getById(tourId)

        return tour.maxGuests - slotsTaken
    } catch (err) {
        console.error(err);
        return 0;
    }
}

function displayKeypoints(tourId: string): void {
    tourService.getById(tourId)
        .then(tour => {
            tour.keyPoints.forEach(kp => {
                const keypoints = document.querySelector('#keypoints-section') as HTMLElement;
                const title = document.createElement('p')
                title.textContent = kp.name;

                keypoints.appendChild(title)
            })
        })
}

function makeReservation(id: string): void {
    const role = localStorage.getItem('role')

    if (role !== 'turista') {
        alert("Only tourists can create reservations!")
        return
    } else {
        const touristId = Number(localStorage.getItem('id'))
        const guests = Number((document.querySelector('#guests-input') as HTMLInputElement).value)
        const tourId = Number(id)
        const reservationFormData: Reservation = { tourId, touristId, guests }
        console.log(reservationFormData)
        if (!tourId || !touristId || !guests) {
            alert("You are missing data to create reservation!")
            return
        }

        reservationService.create(id, reservationFormData)
            .then((createdReservation) => {
                const reservationId = createdReservation.id;

                window.location.href =
                    `../confirmation/confirmation.html?tourId=${id}&reservationId=${reservationId}`;
            }).catch(error => {
                console.error(error.status, error.text);
            })
    }
}

document.addEventListener("DOMContentLoaded", init)
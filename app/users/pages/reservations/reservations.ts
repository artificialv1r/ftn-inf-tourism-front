import { Reservation } from "../../../tours/model/reservation.mode";
import { Tour } from "../../../tours/model/tour.model";
import { ReservationService } from "../../../tours/service/reservation.service";
import { TourService } from "../../../tours/service/tour.service";
import { UserService } from "../../service/user.service";

const userService = new UserService();
const tourService = new TourService();
const reservationService = new ReservationService();

function init(): void {
    const role = localStorage.getItem('role');
    if (role === "turista") {
        fetchMyReservations();
    }

    // Vodic -> njegove ture
    if (role === "vodic") {
        fetchGuideTours();
    }
}

interface ReservationWithTour {
    reservation: Reservation;
    tour: Tour;
}

async function fetchMyReservations(): Promise<void> {
    const touristId = localStorage.getItem('id');

    if (!touristId) {
        console.error('Tourist ID not found in localStorage');
        return;
    }

    const activeTourReservations: ReservationWithTour[] = [];
    const finishedTourReservations: ReservationWithTour[] = [];

    try {
        const reservations = await userService.getByTouristId(touristId);

        for (const r of reservations) {
            if (r.tourId && r.tourId !== null && r.tourId.toString() !== 'null') {
                try {
                    const tour: Tour = await tourService.getById(r.tourId.toString())

                    if (new Date(tour.dateTime) > new Date()) {
                        activeTourReservations.push({ reservation: r, tour })
                    } else {
                        finishedTourReservations.push({ reservation: r, tour })
                    }
                } catch (error) {
                    console.error(`Error fetching tour ${r.tourId}:`, error);
                }
            } else {
                console.warn(`Reservation ${r.id} has invalid tourId:`, r.tourId);
            }
        }

        renderActiveReservations(activeTourReservations);
        renderFinishedReservations(finishedTourReservations);
    } catch (error) {
        console.error('Error fatching data:', error)
    }
}

async function fetchGuideTours(): Promise<void> {
    const guideId = localStorage.getItem('id');

    if (!guideId) {
        console.error("Guide ID not found");
        return;
    }

    try {
        const tours = await tourService.getPaged(guideId);

        const activeTours: Tour[] = [];
        const finishedTours: Tour[] = [];

        const now = new Date();

        for (const t of tours) {
            if (new Date(t.dateTime) > now) {
                activeTours.push(t);
            } else {
                finishedTours.push(t);
            }
        }

        renderGuideActiveTours(activeTours);
        renderGuideFinishedTours(finishedTours);

    } catch (error) {
        console.error('Error fetching guide tours:', error);
    }
}


function renderGuideActiveTours(tours: Tour[]): void {
    const table = document.querySelector('#active-tours tbody');

    if (!table) {
        console.error('Active tours table body not found');
        return;
    }

    table.innerHTML = '';

    if (tours.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 4;
        cell.textContent = 'You currently have no upcoming tours.';
        cell.style.textAlign = 'center';
        row.appendChild(cell);
        table.appendChild(row);
        return;
    }

    for (const tour of tours) {
        const row = document.createElement('tr');

        const name = document.createElement('td');
        name.textContent = tour.name;

        const date = document.createElement('td');
        const time = document.createElement('td');

        const dateObj = new Date(tour.dateTime);

        date.textContent = dateObj.toLocaleDateString("sr-RS");
        time.textContent = dateObj.toLocaleTimeString("sr-RS", {
            hour: "2-digit",
            minute: "2-digit"
        });

        const actionCell = document.createElement('td');
        const viewButton = document.createElement('button');
        viewButton.textContent = "View";

        viewButton.onclick = function () {
            window.location.href = `../../../tours/pages/tourReview/tourReview.html?tourId=${tour.id}`;
        };

        actionCell.appendChild(viewButton);

        row.appendChild(name);
        row.appendChild(date);
        row.appendChild(time);
        row.appendChild(actionCell);

        table.appendChild(row);
    }
}

function renderGuideFinishedTours(tours: Tour[]): void {
    const table = document.querySelector('#finished-tours tbody');

    if (!table) {
        console.error('Finished tours table body not found');
        return;
    }

    table.innerHTML = '';

    if (tours.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 4;
        cell.textContent = 'You have no finished tours.';
        cell.style.textAlign = 'center';
        row.appendChild(cell);
        table.appendChild(row);
        return;
    }

    for (const tour of tours) {
        const row = document.createElement('tr');

        const name = document.createElement('td');
        name.textContent = tour.name;

        const date = document.createElement('td');
        const time = document.createElement('td');

        const dateObj = new Date(tour.dateTime);

        date.textContent = dateObj.toLocaleDateString("sr-RS");
        time.textContent = dateObj.toLocaleTimeString("sr-RS", {
            hour: "2-digit",
            minute: "2-digit"
        });

        const actionCell = document.createElement('td');
        const viewButton = document.createElement('button');
        viewButton.textContent = "View";

        viewButton.onclick = function () {
            window.location.href = `../../../tours/pages/tourReview/tourReview.html?tourId=${tour.id}`;
        };

        actionCell.appendChild(viewButton);

        row.appendChild(name);
        row.appendChild(date);
        row.appendChild(time);
        row.appendChild(actionCell);

        table.appendChild(row);
    }
}


async function renderActiveReservations(reservations: ReservationWithTour[]): Promise<void> {
    const table = document.querySelector('#active-tours tbody');

    if (!table) {
        console.error('Active tours table body not found');
        return;
    }

    table.innerHTML = '';

    if (reservations.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 4;
        cell.textContent = 'No upcoming tours';
        row.appendChild(cell);
        table.appendChild(row);
        return;
    }

    for (const { reservation: r, tour } of reservations) {
        const row = document.createElement('tr');

        const name = document.createElement('td');
        name.textContent = tour.name;

        const date = document.createElement('td')
        const time = document.createElement('td')
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
        dateElement.textContent = `📅 ${formattedDate}`;
        date.appendChild(dateElement);

        const timeElement = document.createElement('p');
        timeElement.textContent = `⏱️ ${formattedTime}`;
        time.appendChild(timeElement)

        const actionCell = document.createElement('td');
        const cancelButton = document.createElement('button');
        cancelButton.textContent = "Cancel";
        cancelButton.addEventListener("click", async () => {
            try {
                await cancelReservation(r.id.toString(), r.tourId.toString());
                await fetchMyReservations();
            } catch (error) {
                console.error('Error canceling reservation:', error);
                alert('Failed to cancel reservation. Please try again.');
            }
        });
        actionCell.appendChild(cancelButton);

        row.appendChild(name)
        row.appendChild(date)
        row.appendChild(time)
        row.appendChild(actionCell)
        table.appendChild(row)
    }
}

async function renderFinishedReservations(reservations: ReservationWithTour[]): Promise<void> {
    const table = document.querySelector('#finished-tours tbody');

    if (!table) {
        console.error('Finished tours table body not found');
        return;
    }

    if (reservations.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 4;
        cell.textContent = 'No finished tours';
        cell.style.textAlign = 'center';
        row.appendChild(cell);
        table.appendChild(row);
        return;
    }

    table.innerHTML = '';
    for (const { reservation: r, tour } of reservations) {
        const row = document.createElement('tr');

        const name = document.createElement('td');
        name.textContent = tour.name;

        const date = document.createElement('td')
        const time = document.createElement('td')
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
        dateElement.textContent = `📅 ${formattedDate}`;
        date.appendChild(dateElement);

        const timeElement = document.createElement('p');
        timeElement.textContent = `⏱️ ${formattedTime}`;
        time.appendChild(timeElement)

        const actionCell = document.createElement('td');
        const rateButton = document.createElement('button');
        rateButton.textContent = "Rate";
        rateButton.onclick = function () {
            window.location.href = `../../../tours/pages/tourReview/tourReview.html?tourId=${tour.id}&reservationId=${r.id}`;
        }

        row.appendChild(name)
        row.appendChild(date)
        row.appendChild(time)
        actionCell.appendChild(rateButton)
        row.appendChild(actionCell)
        table.appendChild(row)
    }
}

async function canCancel(tourId: string): Promise<boolean> {
    try {
        const tour = await tourService.getById(tourId);

        const tourDate = new Date(tour.dateTime).getTime();
        const now = Date.now();

        const hoursDiff = (tourDate - now) / (1000 * 60 * 60);

        return hoursDiff >= 24;
    } catch (error) {
        console.error('Error checking if tour can be canceled:', error);
        return false;
    }
}

async function cancelReservation(reservationId: string, tourId: string): Promise<void> {
    try {
        const isAllowed = await canCancel(tourId);

        if (!isAllowed) {
            alert("You cannot cancel this reservation because the tour starts in less than 24 hours.");
            return;
        }

        const confirmCancel = confirm("Are you sure you want to cancel your reservation?");
        if (!confirmCancel) return;

        await reservationService.delete(tourId, reservationId);

        alert("Reservation successfully canceled.");

        // Refresh the list after cancellation
        await fetchMyReservations();

    } catch (error) {
        console.error('Error canceling reservation:', error);
        alert("Error canceling reservation.");
    }
}

document.addEventListener("DOMContentLoaded", init)
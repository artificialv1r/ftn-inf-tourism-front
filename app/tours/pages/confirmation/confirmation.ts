import { ReservationService } from "../../service/reservation.service";
import { TourService } from "../../service/tour.service";

const reservationService = new ReservationService();
const tourService = new TourService();

function init(): void {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const tourId = urlParams.get('tourId');
    const reservationId = urlParams.get('reservationId')

    displayKeypoints(tourId)

    if (reservationId && tourId) {
        const cancelButton = document.querySelector('#cancel-button') as HTMLButtonElement;

        cancelButton.addEventListener("click", async () => {
            await cancelReservation(reservationId, tourId);
        });
    }
}

function displayKeypoints(tourId: string,): void {
    const keypointList = document.querySelector('table tbody')
    const listTitle = document.querySelector('#tour-name')

    keypointList.innerHTML = "";

    tourService.getById(tourId)
        .then(tour => {
            tour.keyPoints.forEach(kp => {

                listTitle.textContent = tour.name;
                const keypointListElement = document.createElement('div');
                keypointListElement.classList.add('kp-list-element');

                const leftField = document.createElement('div');
                leftField.classList.add('kp-cell');

                const imageSection = document.createElement('div')
                imageSection.className = "image-section"

                const image = document.createElement('img')
                image.src = tour.keyPoints[0].imageUrl;
                image.alt = tour.name;
                imageSection.appendChild(image);

                const leftElement1 = document.createElement('h4');
                leftElement1.textContent = kp.name
                leftField.appendChild(leftElement1);

                const leftElement2 = document.createElement('p')
                leftElement2.textContent = kp.description
                leftField.appendChild(leftElement2)

                keypointListElement.appendChild(imageSection)
                keypointListElement.appendChild(leftField)
                keypointList.appendChild(keypointListElement)
            })
        })
}

async function canCancel(tourId: string): Promise<boolean> {
    const tour = await tourService.getById(tourId);

    const tourDate = new Date(tour.dateTime).getTime();
    const now = Date.now();

    const hoursDiff = (tourDate - now) / (1000 * 60 * 60);

    return hoursDiff >= 24;
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
        window.location.href = "../overview/overview.html";

    } catch (error) {
        console.error(error);
        alert("Error canceling reservation.");
    }
}


document.addEventListener("DOMContentLoaded", init)
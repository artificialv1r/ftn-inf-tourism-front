import { ReservationService } from "../../service/reservation.service";
import { TourService } from "../../service/tour.service";

const tourService = new TourService();
const reservationService = new ReservationService();

const overview = document.querySelector('#overview') as HTMLElement;
const keyPoints = document.querySelector('#keypoints') as HTMLElement;
const tourInfo = document.querySelector('#tour-info') as HTMLElement;

function init(): void {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const tourId = urlParams.get('tourId');

    if (tourId) {
        renderKeypoints(tourId)
        renderTour(tourId)
    }
    else (
        overview.innerHTML = ""
    )
}

function renderKeypoints(tourId: string): void {
    keyPoints.innerHTML = ""

    tourService.getById(tourId)
        .then(tour => {
            tour.keyPoints.forEach(keyPoint => {
                const container = document.createElement('div')
                container.className = "kp-container"

                const imageSection = document.createElement('div')
                imageSection.className = "image-section"

                const detailSection = document.createElement('div')
                detailSection.className = "detail-section"

                const image = document.createElement('img')
                image.src = keyPoint.imageUrl
                image.alt = keyPoint.name

                const title = document.createElement('h3')
                title.textContent = keyPoint.name

                const description = document.createElement('p')
                description.textContent = keyPoint.description

                const location = document.createElement('a')
                location.href = `https://www.google.com/maps/?ll=${keyPoint.latitude},${keyPoint.longitude}`
                location.textContent = "📍 Pogledaj na mapi"

                imageSection.appendChild(image)

                detailSection.appendChild(title)
                detailSection.appendChild(description)
                detailSection.appendChild(location)

                container.appendChild(imageSection)
                container.appendChild(detailSection)

                keyPoints.appendChild(container)
            })
        })
}

async function renderTour(tourId: string): Promise<void> {
    try {
        const tour = await tourService.getById(tourId)

        const title = document.createElement('h3')
        title.textContent = tour.name;

        const description = document.createElement('h4')
        description.textContent = tour.description;

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

        const buttonSpace = document.createElement('div')
        buttonSpace.className = "button-space"
        const reservationButton = document.createElement('button')
        reservationButton.textContent = "Reserve";
        reservationButton.onclick = function () {
            window.location.href = `../reservationForm/reservationForm.html?tourId=${tour.id}`;
        }

        tourInfo.appendChild(title)
        tourInfo.appendChild(description)
        tourInfo.appendChild(dateElement)
        tourInfo.appendChild(timeElement)
        tourInfo.appendChild(limit)
        tourInfo.appendChild(freeSlots)
        buttonSpace.appendChild(reservationButton)
        tourInfo.appendChild(buttonSpace)
    } catch (err) {
        console.error("Error rendering tour:", err);

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

document.addEventListener("DOMContentLoaded", init)
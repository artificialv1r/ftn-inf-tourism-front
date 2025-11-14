import { KeyPointFormData } from "../../model/keypointFormData.model";
import { Tour } from "../../model/tour.model";
import { TourFormData } from "../../model/tourFormData.model";
import { TourService } from "../../service/tour.service";

const tourService = new TourService;

function initializeForm(): void {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');
    const addKeypointSection = document.querySelector('#add-keypoint-section') as HTMLElement;
    const activeKeypointsSection = document.querySelector('#active-keypoints') as HTMLElement;
    addKeypointSection.classList.add('hidden');
    activeKeypointsSection.classList.add('hidden');

    if (id) {
        getTourData(id);
        displayKeypoints(id);
        addKeypointSection.classList.remove('hidden');
        activeKeypointsSection.classList.remove('hidden');
    } else {
        addKeypointSection.style.display = 'none';
        activeKeypointsSection.style.display = 'none';
        const keypointList = document.querySelector('#keypoints-list') as HTMLElement;
        if (keypointList) keypointList.innerHTML = "";
    }

    const button = document.querySelector("#submit")
    if (button) {
        button.addEventListener("click", submit)
    }

    const publishButton = document.querySelector("#publish") as HTMLButtonElement;
    if (publishButton) {
        publishButton.addEventListener("click", publishTour);
    }

    const addKPButton = document.querySelector("#addKP");
    if (addKPButton) {
        addKPButton.addEventListener("click", handleAddKeyPoint);
    }
}

function submit(): void {
    const name = (document.querySelector('#name') as HTMLInputElement).value
    const description = (document.querySelector('#description') as HTMLInputElement).value
    const dateTime = (document.querySelector('#dateTime') as HTMLInputElement).value;
    const maxGuests = Number((document.querySelector('#maxGuests') as HTMLInputElement).value)
    const status = "u pripremi"
    const guideId = Number(localStorage.getItem('id'))
    const role = localStorage.getItem('role')

    if (role !== "vodic" || !role) {
        alert("Only guide can add new tour.")
        return
    }

    if (!name || !description || !dateTime || !maxGuests) {
        alert("All fields are required!");
        return
    }

    const formData: TourFormData = { name, description, dateTime, maxGuests, status, guideId }

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const tourId = Number(urlParams.get('id'));

    if (tourId) {
        updateTour(tourId.toString(), formData)
    } else {
        addTour(formData)
    }
}

// Pomocne funkcije:
function getTourData(id: string): void {
    tourService.getById(id)
        .then(tour => {
            (document.querySelector('#name') as HTMLInputElement).value = tour.name;
            (document.querySelector('#description') as HTMLInputElement).value = tour.description;
            (document.querySelector('#dateTime') as HTMLInputElement).value = tour.dateTime?.slice(0, 16) || '';
            (document.querySelector('#maxGuests') as HTMLInputElement).value = tour.maxGuests.toString();

            updatePublishButtonStatus(tour);

        }).catch(error => {
            console.error("Greška prilikom učitavanja ture:", error);
        })
}

function updateTour(id: string, formData: TourFormData): void {
    tourService.update(id, formData)
        .then(() => {
            window.location.href = `../../../tours/pages/tour/tour.html`
        }).catch(error => {
            console.error(error.status, error.text);
        })
}

function addTour(formData: TourFormData): void {
    tourService.add(formData)
        // Kada se Promise razreši uspešno, vraćamo se na glavnu stranicu
        .then(() => {
            window.location.href = `../../../tours/pages/tour/tour.html`
        })
        // Kada se Promise razreši neuspešno, ispisujemo grešku
        .catch(error => {
            console.error(error.status, error.message)
        })
}

function displayKeypoints(tourId: string,): void {
    const keypointList = document.querySelector('#keypoints-list')
    keypointList.innerHTML = "";

    tourService.getById(tourId)
        .then(tour => {
            tour.keyPoints.forEach(kp => {
                const keypointListElement = document.createElement('div');
                keypointListElement.classList.add('kp-list-element');

                const leftField = document.createElement('div');
                leftField.classList.add('kp-cell');

                const rightField = document.createElement('div');
                rightField.classList.add('kp-cell');

                const leftElement1 = document.createElement('h4');
                leftElement1.textContent = kp.name
                leftField.appendChild(leftElement1);

                const leftElement2 = document.createElement('p')
                leftElement2.textContent = kp.description
                leftField.appendChild(leftElement2)

                const removeBtn = document.createElement('button')
                removeBtn.textContent = "Remove"

                removeBtn.onclick = function () {
                    tourService.deleteKeyPoint(tourId.toString(), kp.id
                        .toString())
                        .then(() => {
                            // Proveri da li treba promeniti status ture nakon brisanja
                            return tourService.getById(tourId);
                        })
                        .then(updatedTour => {
                            // Ako je tura bila objavljena, ali sada ne ispunjava uslove, vrati u pripremu
                            if (updatedTour.status === "objavljeno" &&
                                (updatedTour.keyPoints.length < 2 || updatedTour.description.length < 250)) {
                                const tourUpdate: TourFormData = {
                                    name: updatedTour.name,
                                    description: updatedTour.description,
                                    dateTime: updatedTour.dateTime,
                                    maxGuests: updatedTour.maxGuests,
                                    status: "u pripremi",
                                    guideId: updatedTour.guideId
                                };
                                return tourService.update(tourId, tourUpdate);
                            }
                        })
                        .then(() => {
                            window.location.reload();
                        })
                        .catch(error => {
                            console.error(error.status, error.text);
                        });
                }

                rightField.appendChild(removeBtn)

                keypointListElement.appendChild(leftField)
                keypointListElement.appendChild(rightField)
                keypointList.appendChild(keypointListElement)
                updatePublishButtonStatus(tour);
            })
        })
}

function publishTour(): void {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const tourId = urlParams.get('id');
    tourService.getById(tourId)
        .then(tour => {
            // Proveri da li su ispunjeni uslovi
            if (tour.keyPoints.length >= 2 && tour.description.length >= 250) {
                const updatedTour: TourFormData = {
                    name: tour.name,
                    description: tour.description,
                    dateTime: tour.dateTime,
                    maxGuests: tour.maxGuests,
                    status: "objavljeno",
                    guideId: tour.guideId
                };

                tourService.update(tourId, updatedTour)
                    .then(() => {
                        alert("Tour successfully published!");
                        window.location.href = `../../../tours/pages/tour/tour.html`
                    })
                    .catch(error => {
                        console.error("Error publishing tour:", error);
                        alert("Failed to publish tour.");
                    });
            } else {
                alert("Tour must have at least 2 keypoints and description of at least 250 characters!");
            }
        })
        .catch(error => {
            console.error("Error fetching tour:", error);
        });
}

function updatePublishButtonStatus(tour: Tour): void {
    const publishButton = document.querySelector("#publish") as HTMLButtonElement;
    if (!publishButton) return;

    const hasEnoughKeypoints = tour.keyPoints.length >= 2;
    const hasEnoughDescription = tour.description.length >= 250;
    const canPublish = hasEnoughKeypoints && hasEnoughDescription;

    if (tour.status === "objavljeno") {
        publishButton.hidden = true;
    } else {
        publishButton.hidden = false;
        publishButton.disabled = !canPublish;
    }
}

function handleAddKeyPoint() {
    const keyPointName = (document.querySelector('#keypoint-name') as HTMLInputElement).value;
    const keyPointImageUrl = (document.querySelector('#keypoint-image') as HTMLInputElement).value;
    const keyPointLatitude = Number((document.querySelector('#keypoint-latitude') as HTMLInputElement).value);
    const keyPointLongitude = Number((document.querySelector('#keypoint-longitude') as HTMLInputElement).value);
    const keypointDescription = (document.querySelector('#keypoint-description') as HTMLInputElement).value;

    if (!keyPointName || !keypointDescription || !keyPointImageUrl) {
        alert("All keypoint fields are required!");
        return;
    }

    const id = new URLSearchParams(window.location.search);
    const tourId = id.get("id");

    if (!tourId) {
        alert("Tour ID missing. Cannot add keypoint.");
        return;
    }

    tourService.getById(tourId)
        .then(tour => {

            const order = tour.keyPoints.length + 1;

            const kpData: KeyPointFormData = {
                order,
                name: keyPointName,
                description: keypointDescription,
                imageUrl: keyPointImageUrl,
                latitude: keyPointLatitude,
                longitude: keyPointLongitude,
                tourId: Number(tourId)
            };

            return tourService.createKeyPoint(tourId, kpData);
        })
        .then(() => {
            window.location.reload();
        })
        .catch(err => {
            console.error("Failed to add keypoint:", err);
        });
}

document.addEventListener("DOMContentLoaded", initializeForm)
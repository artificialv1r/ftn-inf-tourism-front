import { TourFormData } from "../../model/tourFormData.model";
import { TourService } from "../../service/tour.service";

const tourService = new TourService;

function initializeForm(): void {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');
    if (id) {
        tourService.getById(id)
            .then(tour => {
                (document.querySelector('#name') as HTMLInputElement).value = tour.name;
                (document.querySelector('#description') as HTMLInputElement).value = tour.description;
                (document.querySelector('#dateTime') as HTMLInputElement).value = tour.dateTime
                    ? new Date(tour.dateTime).toISOString().split('T')[0]
                    : '';
                (document.querySelector('#maxGuests') as HTMLInputElement).value = tour.maxGuests.toString();
            }).catch(error => {
                console.error(error.status, error.text)
            })
    }


    const button = document.querySelector("#submit")
    if (button) {
        button.addEventListener("click", submit)
    }
}

function submit(): void {
    const name = (document.querySelector('#name') as HTMLInputElement).value
    const description = (document.querySelector('#description') as HTMLInputElement).value
    const date = (document.querySelector('#dateTime') as HTMLInputElement).value
    const dateTime = new Date(date)
    const maxGuests = Number((document.querySelector('#maxGuests') as HTMLInputElement).value)
    const status = "u pripremi"
    const guideId = Number(localStorage.getItem('id'))
    const role = localStorage.getItem('role')

    if (role !== "vodic" || !role) {
        alert("Only guide can add new tour.")
        return
    }

    if (!name || !description || isNaN(dateTime.getTime()) || !maxGuests) {
        alert("All fields are required!");
        return
    }

    const formData: TourFormData = { name, description, dateTime, maxGuests, status, guideId }

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');
    if (id) {
        tourService.update(id, formData)
            .then(() => {
                window.location.href = `../../../tours/pages/tour/tour.html`
            }).catch(error => {
                console.error(error.status, error.text);
            })
    } else {
        tourService.add(formData)
            // Kada se Promise razreši uspešno, vraćamo se na glavnu stranicu
            .then(() => {
                window.location.href = '../index.html'
            })
            // Kada se Promise razreši neuspešno, ispisujemo grešku
            .catch(error => {
                console.error(error.status, error.message)
            })
    }
}

document.addEventListener("DOMContentLoaded", initializeForm)
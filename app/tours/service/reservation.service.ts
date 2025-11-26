import { Reservation } from "../model/reservation.mode";

export class ReservationService {
    private apiUrl: string

    constructor() {
        this.apiUrl = 'http://localhost:5105/api/tours'
    }

    getByTourId(tourId: string): Promise<Reservation[]> {
        return fetch(`${this.apiUrl}/${tourId}/reservations`)
            .then(response => {

                if (!response.ok) {
                    return response.text().then(errorMessage => {
                        throw { status: response.status, message: errorMessage }
                    })
                }
                return response.json()
            })
            .then((reservations: Reservation[]) => {
                return reservations;
            })
            .catch(error => {
                console.error('Error:', error.status)
                throw error
            });
    }

    create(tourId: string, formData: Reservation): Promise<Reservation> {
        return fetch(`${this.apiUrl}/${tourId}/reservations`, {

            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errorMessage => {
                        throw { status: response.status, message: errorMessage }
                    })
                }
                return response.json()
            })
            .then((reservation: Reservation) => {
                return reservation
            })
            .catch(error => {
                console.error('Error:', error.status)
                throw error
            })
    }

    delete(tourId: string, reservationId: string): Promise<void> {
        return fetch(`${this.apiUrl}/${tourId}/reservations/${reservationId}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errorMessage => {
                        throw { status: response.status, message: errorMessage }
                    })
                }
            })
            .catch(error => {
                console.error('Error:', error.status)
                throw error
            });
    }
}
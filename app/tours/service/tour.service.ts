import { Tour } from "../model/tour.model";
import { TourFormData } from "../model/tourFormData.model";

export class TourService {
    private apiUrl: string;

    constructor() {
        this.apiUrl = 'http://localhost:5105/api/tours'
    }

    getPaged(guideId: string): Promise<Tour[]> {
        return fetch(`${this.apiUrl}?guideId=${guideId}`)
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errorMessage => {
                        throw { status: response.status, message: errorMessage }
                    })
                }
                return response.json()
            })
            .then((tours: Tour[]) => {
                return tours;
            })
            .catch(error => {
                console.error('Error:', error.status)
                throw error
            });
    }

    getById(id: string): Promise<Tour> {
        return fetch(`${this.apiUrl}/${id}`)
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errorMessage => {
                        throw { status: response.status, message: errorMessage }
                    })
                }
                return response.json();
            }).then((tour: Tour) => {
                return tour;
            }).catch(error => {
                console.error('Error:', error.status)
                throw error
            });
    }

    add(formData: TourFormData): Promise<Tour> {
        return fetch(this.apiUrl, {
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
            .then((tour: Tour) => {
                return tour
            })
            .catch(error => {
                console.error('Error:', error.status)
                throw error
            })
    }

    update(id: string, formData: TourFormData): Promise<Tour> {
        return fetch(`${this.apiUrl}/${id}`, {
            method: 'PUT',
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
            .then((tour: Tour) => {
                return tour;
            })
            .catch(error => {
                console.error('Error:', error.status)
                throw error
            });
    }

    deleteTour(tourId: string): Promise<void> {
        return fetch(`${this.apiUrl}/${tourId}`, { method: 'DELETE' })
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
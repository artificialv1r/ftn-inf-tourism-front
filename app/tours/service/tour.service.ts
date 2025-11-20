import { Tour } from "../model/tour.model";
import { TourFormData } from "../model/tourFormData.model";
import { KeyPoint } from "../model/keypoint.model";
import { KeyPointFormData } from "../model/keypointFormData.model";

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

    getAll(page: number, pageSize: number, orderBy: string, orderDirection: string): Promise<{ data: Tour[], totalCount: number }> {
        return fetch(`${this.apiUrl}?guideId=0&page=${page}&pageSize=${pageSize}&orderBy=${orderBy}&orderDirection=${orderDirection}`)
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errorMessage => {
                        throw { status: response.status, message: errorMessage }
                    })
                }
                return response.json()
            })
            .then((resp: { data: Tour[], totalCount: number }) => {
                return resp;
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

    // Key Point services:

    createKeyPoint(tourId: string, formData: KeyPointFormData) {
        return fetch(`${this.apiUrl}/${tourId}/key-points`, {
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
            .then((keyPoint: KeyPoint) => {
                return keyPoint
            })
            .catch(error => {
                console.error('Error:', error.status)
                throw error
            })
    }

    deleteKeyPoint(tourId: string, kpId: string) {
        return fetch(`${this.apiUrl}/${tourId}/key-points/${kpId}`, { method: 'DELETE' })
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
import { Restaurant } from "../models/restaurant.model";
import { RestaurantFormData } from "../models/restaurantForm.model";
import { Meal } from "../models/meal.model";
import { MealForm } from "../models/mealForm.model";
import { ReservationFormData } from "../models/restaurantReservationForm";
import { Reservation } from "../models/reservation";

export class RestaurantService {
    private apiUrl: string;

    constructor() {
        this.apiUrl = "http://localhost:5105/api/restaurants"
    }

    getPaged(ownerId: number, page: number, pageSize: number, orderBy: string, orderDirection: string): Promise<{ data: Restaurant[], totalCount: number }> {
        return fetch(`${this.apiUrl}?ownerId=${ownerId}&page=${page}&pageSize=${pageSize}&orderBy=${orderBy}&orderDirection=${orderDirection}`)
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errorMessage => {
                        throw { status: response.status, message: errorMessage }
                    });
                }
                return response.json();
            }).then((result) => {
                return {
                    data: result.data,
                    totalCount: result.totalCount
                };
            })
            .catch(error => {
                console.error('Error:', error.status)
                throw error
            });
    }
    getByOwner(ownerId: string): Promise<Restaurant[]> {
        return fetch(`${this.apiUrl}?ownerId=${ownerId}`)
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errorMessage => {
                        throw { status: response.status, message: errorMessage }
                    })
                }
                return response.json()
            })
            .then((restaurant: Restaurant[]) => {
                return restaurant;
            })
            .catch(error => {
                console.error('Error:', error.status)
                throw error
            });
    }
    add(formData: RestaurantFormData): Promise<Restaurant> {
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
            .then((restaurant: Restaurant) => {
                return restaurant;
            })
            .catch(error => {
                console.error('Error:', error.status)
                throw error
            });
    }
    getById(id: string): Promise<Restaurant> {
        return fetch(`${this.apiUrl}/${id}`)
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errorMessage => {
                        throw { status: response.status, message: errorMessage }
                    })
                }
                return response.json()
            })
            .then((restaurant: Restaurant) => {
                return restaurant;
            })
            .catch(error => {
                console.error('Error:', error.status)
                throw error
            });
    }
    getReservationsById(id: string): Promise<Reservation[]> {
        return fetch(`${this.apiUrl}/${id}/reservations`)
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
    update(id: string, formData: RestaurantFormData): Promise<Restaurant> {
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
            .then((restaurant: Restaurant) => {
                return restaurant;
            })
            .catch(error => {
                console.error('Error:', error.status)
                throw error
            });
    }
    deleteRestaurant(restaurantId: string): Promise<void> {
        return fetch(`${this.apiUrl}/${restaurantId}`, { method: 'Delete' })
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

    createMeal(restaurantId: number, mealFormData: MealForm): Promise<Meal> {
        const mealapiUrl = `http://localhost:5105/api/restaurants/${restaurantId}/meals`
        return fetch(mealapiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mealFormData)
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errorMessage => {
                        throw { status: response.status, message: errorMessage }
                    })
                }
                return response.json()
            })
            .then((meal: Meal) => {
                return meal;
            })
            .catch(error => {
                console.error('Error:', error.status)
                throw error
            });
    }
    deleteMeal(restaurantId: number, mealId: number): Promise<void> {
        return fetch(`http://localhost:5105/api/restaurants/${restaurantId}/meals/${mealId}`, { method: 'Delete' })
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
    
    createReservation(restaurantId: number, reservationFormData: ReservationFormData): Promise<Reservation> {
        const reservationapiUrl = `http://localhost:5105/api/restaurants/${restaurantId}/reservations`
        return fetch(reservationapiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reservationFormData)
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
                return reservation;
            })
            .catch(error => {
                console.error('Error:', error.status)
                throw error
            });
    }
    deleteReservation(restaurantId: number, reservationId: number): Promise<void> {
        return fetch(`http://localhost:5105/api/restaurants/${restaurantId}/reservations/${reservationId}`, { method: 'Delete' })
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
    getReservationById(id: string, idReservation:string): Promise<Reservation> {
        return fetch(`${this.apiUrl}/${id}/reservations/${idReservation}`)
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errorMessage => {
                        throw { status: response.status, message: errorMessage }
                    })
                }
                return response.json()
            })
            .then((reservations: Reservation) => {
                return reservations;
            })
            .catch(error => {
                console.error('Error:', error.status)
                throw error
            });
    }
}

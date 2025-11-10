import { Restaurant } from "../models/restaurant.model";
import { RestaurantFormData } from "../models/restaurantForm.model";


export class RestaurantService {
    private apiUrl: string;

    constructor() {
        this.apiUrl = "http://localhost:5105/api/restaurants"
    }
    getPaged(ownerId: string): Promise<Restaurant[]> {
        return fetch(`${this.apiUrl}?ownerId=${ownerId}`)
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errorMessage => {
                        throw { status: response.status, message: errorMessage }
                    })
                }
                return response.json()
            })
            .then((tours: Restaurant[]) => {
                return tours;
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
}
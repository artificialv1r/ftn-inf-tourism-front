import { Restaurant } from "../models/restaurant.model";
import { RestaurantFormData } from "../models/restaurantForm.model";
import { Meal } from "../models/meal.model";
import { MealForm } from "../models/mealForm.model";

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
    deleteMeal(restaurantId:number, mealId:number):Promise<void>{
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
}

import { Reservation } from "../../tours/model/reservation.mode";
import { User } from "../model/user.model";


export class UserService {
    private apiUrl: string;

    constructor() {
        this.apiUrl = 'http://localhost:5105/api/users';
    }

    login(username: string, password: string): Promise<User> {
        const url = `${this.apiUrl}/login`;

        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text); });
                }
                return response.json();
            })
            .then((user: User) => {
                return user;
            })
            .catch(error => {
                console.error('Login error:', error.message);
                throw error;
            });
    }

    getByTouristId(touristId: string): Promise<Reservation[]> {
        return fetch(`${this.apiUrl}/${touristId}/reservations`)
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
}
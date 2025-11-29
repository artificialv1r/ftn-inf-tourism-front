import { TourReview } from "../model/tourReview.model";

export class TourReviewService {
    private apiUrl: string;

    constructor() {
        this.apiUrl = 'http://localhost:5105/api/tours'
    }

    getByTourId(tourId: string): Promise<TourReview[]> {
        return fetch(`${this.apiUrl}/${tourId}/reviews`)
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errorMessage => {
                        throw { status: response.status, message: errorMessage }
                    })
                }
                return response.json()
            }).then((reviews: TourReview[]) => {
                return reviews;
            })
            .catch(error => {
                console.error('Error:', error.status)
                throw error
            });
    }

    create(tourId: string, reviwData: TourReview): Promise<TourReview> {
        return fetch(`${this.apiUrl}/${tourId}/reviews`, {

            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reviwData)
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errorMessage => {
                        throw { status: response.status, message: errorMessage }
                    })
                }
                return response.json()
            })
            .then((review: TourReview) => {
                return review
            })
            .catch(error => {
                console.error('Error:', error.status)
                throw error
            })
    }

}
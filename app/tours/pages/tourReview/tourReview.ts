import { TourReview } from "../../model/tourReview.model";
import { TourReviewService } from "../../service/review.service";
import { TourService } from "../../service/tour.service";

const tourService = new TourService();
const tourReviewService = new TourReviewService();

async function init(): Promise<void> {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const tourId = urlParams.get('tourId');
    const role = localStorage.getItem('role')
    const rateSection = document.querySelector('#rate-section')
    const averageGrade = document.querySelector('#average')

    if (!tourId) {
        console.error('Tour ID not found in URL parameters');
        alert('Invalid tour. Missing tour ID.');
        return;
    }

    displayKeypoints(tourId)

    if (role === "turista") {

        const touristId = localStorage.getItem("id");
        const reservationId = urlParams.get("reservationId");

        if (touristId && reservationId) {
            const alreadyReviewed = await hasReviewed(
                tourId,
                parseInt(touristId),
                parseInt(reservationId)
            );

            if (alreadyReviewed && rateSection) {
                rateSection.classList.add("hidden");
            } else if (rateSection) {
                rateSection.classList.remove("hidden");
                averageGrade.classList.add("hidden");
            }
        }

        fetchReviews(tourId);
        setupSubmitButton(tourId);
    }
    else if (role === "vodic") {
        if (rateSection) {
            rateSection.classList.add('hidden');
            averageGrade.classList.remove('hidden')
        }

        fetchAllReviews(tourId);
    } else {
        if (rateSection) {
            rateSection.classList.add('hidden');
        }
        // Gosti vide samo 3 najnovije ocene
        fetchReviews(tourId);
    }
}

function displayKeypoints(tourId: string,): void {
    const keypointList = document.querySelector('table tbody')
    const listTitle = document.querySelector('#tour-name')

    if (!keypointList) {
        console.error('Keypoint list element not found');
        return;
    }

    keypointList.innerHTML = "";

    tourService.getById(tourId)
        .then(tour => {
            if (!tour.keyPoints || tour.keyPoints.length === 0) {
                keypointList.innerHTML = '<tr><td>No key points available for this tour.</td></tr>';
                return;
            }

            if (listTitle) {
                listTitle.textContent = tour.name;
            }
            tour.keyPoints.forEach(kp => {

                listTitle.textContent = tour.name;
                const keypointListElement = document.createElement('div');
                keypointListElement.classList.add('kp-list-element');

                const leftField = document.createElement('div');
                leftField.classList.add('kp-cell');

                const imageSection = document.createElement('div')
                imageSection.className = "image-section"

                const image = document.createElement('img')
                image.src = tour.keyPoints[0].imageUrl;
                image.alt = tour.name;
                imageSection.appendChild(image);

                const leftElement1 = document.createElement('h4');
                leftElement1.textContent = kp.name
                leftField.appendChild(leftElement1);

                const leftElement2 = document.createElement('p')
                leftElement2.textContent = kp.description
                leftField.appendChild(leftElement2)

                keypointListElement.appendChild(imageSection)
                keypointListElement.appendChild(leftField)
                keypointList.appendChild(keypointListElement)
            })
        })
}

async function fetchReviews(tourId: string): Promise<void> {
    try {
        const reviews = await tourReviewService.getByTourId(tourId);

        const recentReviews = reviews
            .sort((a, b) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return dateB - dateA;
            })
            .slice(0, 3);

        renderRecentReviews(recentReviews);
    }
    catch (error) {
        console.error('Error fatching data:', error)
    }
}

async function fetchAllReviews(tourId: string): Promise<void> {
    try {
        const reviews = await tourReviewService.getByTourId(tourId);
        const recentReviews = reviews
            .sort((a, b) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return dateB - dateA;
            })

        renderRecentReviews(recentReviews);
        renderAvg(recentReviews)
    }
    catch (error) {
        console.error('Error fatching data:', error)
    }
}

function renderRecentReviews(reviews: TourReview[]): void {
    const tourReviews = document.querySelector('#tour-reviews');

    if (!tourReviews) {
        console.error('Tour reviews container not found');
        return;
    }

    tourReviews.innerHTML = '';

    if (reviews.length === 0) {
        tourReviews.innerHTML = '<p>No reviews yet.</p>';
        return;
    }

    reviews.forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'review-item';

        const stars = '⭐ '.repeat(review.grade) + '★ '.repeat(5 - review.grade);

        reviewElement.innerHTML = `
        
            <div class="review-header">
                <div class="review-author">Anonymous</div>
                
                <div class="review-date">${new Date(review.createdAt).toLocaleDateString('sr-RS')}</div>
                </div>
                <div class="review-rating">${stars}</div>
            <div class="review-comment">${review.comment}</div>
        `;
        tourReviews.appendChild(reviewElement);
    });
}

function renderAvg(reviews: TourReview[]): void {
    const avgSection = document.querySelector('#average');

    if (!avgSection) {
        console.error('Average section not found');
        return;
    }

    const textSection = document.createElement('div')
    textSection.className = "avg-grade"

    const avgGrade = calculateAvg(reviews)
    const content = document.createElement('p')
    content.textContent = `Avg: ${avgGrade}`


    textSection.appendChild(content)
    avgSection.appendChild(textSection)
}

function setupSubmitButton(tourId: string): void {
    const submitButton = document.getElementById('submit-button') as HTMLButtonElement;
    const ratingSelect = document.getElementById('rate') as HTMLSelectElement;
    const commentTextarea = document.getElementById('opinion') as HTMLTextAreaElement;
    const rateSection = document.querySelector('#rate-section');

    if (!submitButton) {
        console.error('Submit button not found');
        return;
    }

    submitButton.addEventListener('click', async () => {
        const rating = parseInt(ratingSelect.value);
        const comment = commentTextarea.value.trim();

        if (!rating || rating < 1 || rating > 5) {
            alert('Please select a valid rating');
            return;
        }

        const touristId = localStorage.getItem('id');
        if (!touristId) {
            alert('You must be logged in to leave a review');
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const reservationId = urlParams.get('reservationId');

        if (!reservationId) {
            alert('Reservation ID not found. Cannot submit review.');
            return;
        }

        try {
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';

            const reviewData: TourReview = {
                touristId: parseInt(touristId),
                reservationId: parseInt(reservationId),
                grade: rating,
                comment: comment,
                createdAt: new Date().toISOString()
            };

            await tourReviewService.create(tourId, reviewData);

            alert('Thank you for your review!');

            ratingSelect.value = '5';
            commentTextarea.value = '';

            if (rateSection) {
                rateSection.classList.add('hidden');
            }

            await fetchReviews(tourId);

        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review. Please try again.');
        }
    });
}

async function hasReviewed(tourId: string, touristId: number, reservationId: number): Promise<boolean> {
    try {
        const reviews = await tourReviewService.getByTourId(tourId);
        return reviews.some(r => r.touristId === touristId && r.reservationId === reservationId);
    } catch (error) {
        console.error("Error checking existing review:", error);
        return false;
    }
}


function calculateAvg(reviews: TourReview[]): number {
    let sum = 0;

    for (const r of reviews) {
        sum += r.grade
    }

    const avg = sum / reviews.length;
    return Math.round(avg * 100) / 100;
}

document.addEventListener("DOMContentLoaded", init)
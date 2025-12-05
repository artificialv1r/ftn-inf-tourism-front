export interface TourReview {
    id?: number;
    touristId: number;
    reservationId: number;
    grade: number;
    comment?: string;
    createdAt: string;
}
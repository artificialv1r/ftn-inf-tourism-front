export interface Reservation {
    id?: number;
    tourId: number;
    touristId: number;
    guests: number;
    createdAt?: string;
}
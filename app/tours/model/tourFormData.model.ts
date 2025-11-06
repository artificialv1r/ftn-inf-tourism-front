export interface TourFormData {
    id?: number;
    name: string;
    description: string;
    dateTime: Date;
    maxGuests: number;
    status?: string;
    guideId: number;
}
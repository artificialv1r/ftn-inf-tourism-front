import { KeyPoint } from "./keypoint.model";

export interface Tour {
    id: number;
    name: string;
    description: string;
    dateTime: string;
    maxGuests: number;
    status: string;
    guideId?: number;
    keyPoints?: KeyPoint[];
}
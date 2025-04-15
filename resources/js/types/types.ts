export interface UserInterface {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    created_at: Date;
    updated_at: Date;
}

export interface CategoriesInterface {
    id: number;
    name: string;
    description: string;
}

export interface MarkerInterface {
    id: number;
    name: string;
    description: string;
    category_id?: number;
    category_name?: string;
    latitude: number;
    longitude: number;
}

export interface MarkerCoordinatesInterface {
    latitude: number;
    longitude: number;
}

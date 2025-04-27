export interface UserInterface {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    created_at: Date;
    updated_at: Date;
}

export interface CoordinatesInterface {
    latitude: number;
    longitude: number;
}

export interface CategoriesInterface {
    id: number;
    name: string;
    description: string;
}

export interface LineCategoryInterface extends CategoriesInterface {
    color: string;
}

export interface MarkerInterface extends CoordinatesInterface {
    id: number;
    name: string;
    description: string;
    category_id?: number;
    category_name?: string;
}

export interface LineInterface {
    id: number;
    name: string;
    description: string;
    category_id?: number;
    category_name?: string;
    coordinates: [number, number][];
    color: string;
}

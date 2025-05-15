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

export interface CategoryWithColorInterface extends CategoriesInterface {
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
    coordinates: [number, number][];
    category_id?: number;
    category_name?: string;
    color: string;
}

export interface RectangleInterface extends LineInterface {}

export interface PolygonInterface extends LineInterface {}

export interface CircleInterface extends MarkerInterface {
    color: string;
    radius: number;
}

export interface tutorialProps {
    description: string;
    image: string;
}

export interface StreetInterface {
    id: number;
    paths: string;
    desa_id: number;
    kode_ruas: string;
    nama_ruas: string;
    panjang: number;
    lebar: number;
    eksisting_id: number;
    kondisi_id: number;
    jenisjalan_id: number;
    keterangan: string;
}

export interface StreetWithCoordinatesInterface extends StreetInterface {
    coordinates: [number, number][];
}

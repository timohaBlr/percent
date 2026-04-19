export type Log = {
    id: string;
    length: 3 | 4 | 6; // meters
    diameter: number; // mm
};

export type Board = {
    id: string;
    thickness: number; // mm
    width: number; // mm
    length: 3 | 4 | 6; // meters
    quantity: number;
};
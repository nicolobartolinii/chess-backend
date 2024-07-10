export const GAME_CREATE_COST: number = 0.45;
export const GAME_MOVE_COST: number = 0.0125;
export const GAME_WIN_PRIZE: number = 1;
export const GAME_ABANDON_PENALTY: number = -0.5;
export const AVAILABLE_LOCATIONS: string[] = [
    "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8",
    "B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8",
    "C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8",
    "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8",
    "E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8",
    "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8",
    "G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8",
    "H1", "H2", "H3", "H4", "H5", "H6", "H7", "H8"
];
export type PieceKey = 'P' | 'N' | 'B' | 'R' | 'Q' | 'K' | 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export const PIECES: Record<PieceKey, string> = {
    "P": "White Pawn",
    "N": "White Knight",
    "B": "White Bishop",
    "R": "White Rook",
    "Q": "White Queen",
    "K": "White King",
    "p": "Black Pawn",
    "n": "Black Knight",
    "b": "Black Bishop",
    "r": "Black Rook",
    "q": "Black Queen",
    "k": "Black King"
};
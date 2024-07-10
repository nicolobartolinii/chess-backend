'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert('Players', [
            {
                email: 'prova@prova.it',
                password: await bcrypt.hash('prova', 10),
                role: 1,
                points: 0,
                tokens: 10,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                email: 'franco@giovanni.it',
                password: await bcrypt.hash('franco', 10),
                role: 0,
                points: 5,
                tokens: 10,
                createdAt: new Date(),
                updatedAt: new Date()
            }], {});

        await queryInterface.bulkInsert('Games', [
            {
                game_id: 1,
                game_status: 'ACTIVE',
                game_configuration: JSON.stringify({
                    "moves": {
                        "E1": ["E2"],
                        "D1": ["E2", "F3", "G4", "H5"],
                        "F1": ["E2", "D3", "C4", "B5", "A6"],
                        "B1": ["C3", "A3"],
                        "G1": ["H3", "F3", "E2"],
                        "A2": ["A3", "A4"],
                        "B2": ["B3", "B4"],
                        "C2": ["C3", "C4"],
                        "D2": ["D3", "D4"],
                        "F2": ["F3", "F4"],
                        "G2": ["G3", "G4"],
                        "H2": ["H3", "H4"],
                        "E4": ["E5"]
                    },
                    "pieces": {
                        "E1": "K",
                        "D1": "Q",
                        "A1": "R",
                        "H1": "R",
                        "C1": "B",
                        "F1": "B",
                        "B1": "N",
                        "G1": "N",
                        "A2": "P",
                        "B2": "P",
                        "C2": "P",
                        "D2": "P",
                        "F2": "P",
                        "G2": "P",
                        "H2": "P",
                        "E8": "k",
                        "D8": "q",
                        "A8": "r",
                        "H8": "r",
                        "C8": "b",
                        "F8": "b",
                        "B8": "n",
                        "A7": "p",
                        "B7": "p",
                        "C7": "p",
                        "D7": "p",
                        "E7": "p",
                        "F7": "p",
                        "G7": "p",
                        "H7": "p",
                        "E4": "P",
                        "F6": "n"
                    },
                    "turn": "white",
                    "isFinished": false,
                    "check": false,
                    "checkMate": false,
                    "castling": {"whiteShort": true, "blackShort": true, "whiteLong": true, "blackLong": true},
                    "enPassant": null,
                    "halfMove": 1,
                    "fullMove": 2
                }),
                number_of_moves: 2,
                start_date: new Date('2024-07-10T07:56:28.806Z'),
                end_date: null,
                player_1_id: 2,
                player_2_id: null,
                AI_difficulty: 'MONKEY',
                winner_id: null
            },
            {
                game_id: 2,
                game_status: 'FINISHED',
                game_configuration: JSON.stringify({
                    "moves": {},
                    "pieces": {
                        "E1": "K",
                        "A1": "R",
                        "H1": "R",
                        "C1": "B",
                        "B1": "N",
                        "A2": "P",
                        "B2": "P",
                        "C2": "P",
                        "D2": "P",
                        "F2": "P",
                        "G2": "P",
                        "H2": "P",
                        "A8": "r",
                        "H8": "r",
                        "C8": "b",
                        "B8": "n",
                        "G8": "n",
                        "A7": "p",
                        "B7": "p",
                        "C7": "p",
                        "D7": "p",
                        "G7": "p",
                        "H7": "p",
                        "E4": "P",
                        "E5": "p",
                        "C4": "B",
                        "H4": "q",
                        "D8": "k",
                        "F3": "N",
                        "B6": "b",
                        "F8": "Q"
                    },
                    "turn": "black",
                    "isFinished": true,
                    "check": true,
                    "checkMate": true,
                    "castling": {"whiteShort": true, "blackShort": false, "whiteLong": true, "blackLong": false},
                    "enPassant": null,
                    "halfMove": 4,
                    "fullMove": 6
                }),
                number_of_moves: 11,
                start_date: new Date('2024-07-10T08:26:51.998Z'),
                end_date: new Date('2024-07-10T08:34:40.092Z'),
                player_1_id: 2,
                player_2_id: 1,
                AI_difficulty: null,
                winner_id: 2
            }
        ], {});

        await queryInterface.bulkInsert('Moves', [
            {
                player_id: 2,
                game_id: 1,
                move_number: 1,
                from_position: 'E2',
                to_position: 'E4',
                configuration_after: JSON.stringify({
                    "turn": "black",
                    "check": false,
                    "moves": {
                        "A7": [
                            "A6",
                            "A5"
                        ],
                        "B7": [
                            "B6",
                            "B5"
                        ],
                        "B8": [
                            "A6",
                            "C6"
                        ],
                        "C7": [
                            "C6",
                            "C5"
                        ],
                        "D7": [
                            "D6",
                            "D5"
                        ],
                        "E7": [
                            "E6",
                            "E5"
                        ],
                        "F7": [
                            "F6",
                            "F5"
                        ],
                        "G7": [
                            "G6",
                            "G5"
                        ],
                        "G8": [
                            "F6",
                            "H6"
                        ],
                        "H7": [
                            "H6",
                            "H5"
                        ]
                    },
                    "pieces": {
                        "A1": "R",
                        "A2": "P",
                        "A7": "p",
                        "A8": "r",
                        "B1": "N",
                        "B2": "P",
                        "B7": "p",
                        "B8": "n",
                        "C1": "B",
                        "C2": "P",
                        "C7": "p",
                        "C8": "b",
                        "D1": "Q",
                        "D2": "P",
                        "D7": "p",
                        "D8": "q",
                        "E1": "K",
                        "E4": "P",
                        "E7": "p",
                        "E8": "k",
                        "F1": "B",
                        "F2": "P",
                        "F7": "p",
                        "F8": "b",
                        "G1": "N",
                        "G2": "P",
                        "G7": "p",
                        "G8": "n",
                        "H1": "R",
                        "H2": "P",
                        "H7": "p",
                        "H8": "r"
                    },
                    "castling": {
                        "blackLong": true,
                        "whiteLong": true,
                        "blackShort": true,
                        "whiteShort": true
                    },
                    "fullMove": 1,
                    "halfMove": 0,
                    "checkMate": false,
                    "enPassant": "E3",
                    "isFinished": false
                }),
                is_ai_move: false,
                piece: 'White Pawn',
                createdAt: new Date('2024-07-10T07:56:37.736Z'),
                updatedAt: new Date('2024-07-10T07:56:37.736Z')
            },
            {
                player_id: null,
                game_id: 1,
                move_number: 2,
                from_position: 'G8',
                to_position: 'F6',
                configuration_after: JSON.stringify({
                    "turn": "white",
                    "check": false,
                    "moves": {
                        "A2": [
                            "A3",
                            "A4"
                        ],
                        "B1": [
                            "C3",
                            "A3"
                        ],
                        "B2": [
                            "B3",
                            "B4"
                        ],
                        "C2": [
                            "C3",
                            "C4"
                        ],
                        "D1": [
                            "E2",
                            "F3",
                            "G4",
                            "H5"
                        ],
                        "D2": [
                            "D3",
                            "D4"
                        ],
                        "E1": [
                            "E2"
                        ],
                        "E4": [
                            "E5"
                        ],
                        "F1": [
                            "E2",
                            "D3",
                            "C4",
                            "B5",
                            "A6"
                        ],
                        "F2": [
                            "F3",
                            "F4"
                        ],
                        "G1": [
                            "H3",
                            "F3",
                            "E2"
                        ],
                        "G2": [
                            "G3",
                            "G4"
                        ],
                        "H2": [
                            "H3",
                            "H4"
                        ]
                    },
                    "pieces": {
                        "A1": "R",
                        "A2": "P",
                        "A7": "p",
                        "A8": "r",
                        "B1": "N",
                        "B2": "P",
                        "B7": "p",
                        "B8": "n",
                        "C1": "B",
                        "C2": "P",
                        "C7": "p",
                        "C8": "b",
                        "D1": "Q",
                        "D2": "P",
                        "D7": "p",
                        "D8": "q",
                        "E1": "K",
                        "E4": "P",
                        "E7": "p",
                        "E8": "k",
                        "F1": "B",
                        "F2": "P",
                        "F6": "n",
                        "F7": "p",
                        "F8": "b",
                        "G1": "N",
                        "G2": "P",
                        "G7": "p",
                        "H1": "R",
                        "H2": "P",
                        "H7": "p",
                        "H8": "r"
                    },
                    "castling": {
                        "blackLong": true,
                        "whiteLong": true,
                        "blackShort": true,
                        "whiteShort": true
                    },
                    "fullMove": 2,
                    "halfMove": 1,
                    "checkMate": false,
                    "enPassant": null,
                    "isFinished": false
                }),
                is_ai_move: true,
                piece: 'Black Knight',
                createdAt: new Date('2024-07-10T07:56:37.745Z'),
                updatedAt: new Date('2024-07-10T07:56:37.745Z')
            },
            {
                player_id: 2,
                game_id: 2,
                move_number: 1,
                from_position: 'E2',
                to_position: 'E4',
                configuration_after: JSON.stringify({
                    "turn": "black",
                    "check": false,
                    "moves": {
                        "A7": [
                            "A6",
                            "A5"
                        ],
                        "B7": [
                            "B6",
                            "B5"
                        ],
                        "B8": [
                            "A6",
                            "C6"
                        ],
                        "C7": [
                            "C6",
                            "C5"
                        ],
                        "D7": [
                            "D6",
                            "D5"
                        ],
                        "E7": [
                            "E6",
                            "E5"
                        ],
                        "F7": [
                            "F6",
                            "F5"
                        ],
                        "G7": [
                            "G6",
                            "G5"
                        ],
                        "G8": [
                            "F6",
                            "H6"
                        ],
                        "H7": [
                            "H6",
                            "H5"
                        ]
                    },
                    "pieces": {
                        "A1": "R",
                        "A2": "P",
                        "A7": "p",
                        "A8": "r",
                        "B1": "N",
                        "B2": "P",
                        "B7": "p",
                        "B8": "n",
                        "C1": "B",
                        "C2": "P",
                        "C7": "p",
                        "C8": "b",
                        "D1": "Q",
                        "D2": "P",
                        "D7": "p",
                        "D8": "q",
                        "E1": "K",
                        "E4": "P",
                        "E7": "p",
                        "E8": "k",
                        "F1": "B",
                        "F2": "P",
                        "F7": "p",
                        "F8": "b",
                        "G1": "N",
                        "G2": "P",
                        "G7": "p",
                        "G8": "n",
                        "H1": "R",
                        "H2": "P",
                        "H7": "p",
                        "H8": "r"
                    },
                    "castling": {
                        "blackLong": true,
                        "whiteLong": true,
                        "blackShort": true,
                        "whiteShort": true
                    },
                    "fullMove": 1,
                    "halfMove": 0,
                    "checkMate": false,
                    "enPassant": "E3",
                    "isFinished": false
                }),
                is_ai_move: false,
                piece: 'White Pawn',
                createdAt: new Date('2024-07-10T08:28:18.071Z'),
                updatedAt: new Date('2024-07-10T08:28:18.071Z')
            },
            {
                player_id: 1,
                game_id: 2,
                move_number: 2,
                from_position: 'E7',
                to_position: 'E5',
                configuration_after: JSON.stringify({
                    "turn": "white",
                    "check": false,
                    "moves": {
                        "A2": [
                            "A3",
                            "A4"
                        ],
                        "B1": [
                            "C3",
                            "A3"
                        ],
                        "B2": [
                            "B3",
                            "B4"
                        ],
                        "C2": [
                            "C3",
                            "C4"
                        ],
                        "D1": [
                            "E2",
                            "F3",
                            "G4",
                            "H5"
                        ],
                        "D2": [
                            "D3",
                            "D4"
                        ],
                        "E1": [
                            "E2"
                        ],
                        "F1": [
                            "E2",
                            "D3",
                            "C4",
                            "B5",
                            "A6"
                        ],
                        "F2": [
                            "F3",
                            "F4"
                        ],
                        "G1": [
                            "H3",
                            "F3",
                            "E2"
                        ],
                        "G2": [
                            "G3",
                            "G4"
                        ],
                        "H2": [
                            "H3",
                            "H4"
                        ]
                    },
                    "pieces": {
                        "A1": "R",
                        "A2": "P",
                        "A7": "p",
                        "A8": "r",
                        "B1": "N",
                        "B2": "P",
                        "B7": "p",
                        "B8": "n",
                        "C1": "B",
                        "C2": "P",
                        "C7": "p",
                        "C8": "b",
                        "D1": "Q",
                        "D2": "P",
                        "D7": "p",
                        "D8": "q",
                        "E1": "K",
                        "E4": "P",
                        "E5": "p",
                        "E8": "k",
                        "F1": "B",
                        "F2": "P",
                        "F7": "p",
                        "F8": "b",
                        "G1": "N",
                        "G2": "P",
                        "G7": "p",
                        "G8": "n",
                        "H1": "R",
                        "H2": "P",
                        "H7": "p",
                        "H8": "r"
                    },
                    "castling": {
                        "blackLong": true,
                        "whiteLong": true,
                        "blackShort": true,
                        "whiteShort": true
                    },
                    "fullMove": 2,
                    "halfMove": 0,
                    "checkMate": false,
                    "enPassant": "E6",
                    "isFinished": false
                }),
                is_ai_move: false,
                piece: 'Black Pawn',
                createdAt: new Date('2024-07-10T08:28:45.252Z'),
                updatedAt: new Date('2024-07-10T08:28:45.252Z')
            },
            {
                player_id: 2,
                game_id: 2,
                move_number: 3,
                from_position: 'F1',
                to_position: 'C4',
                configuration_after: JSON.stringify({
                    "turn": "black",
                    "check": false,
                    "moves": {
                        "A7": [
                            "A6",
                            "A5"
                        ],
                        "B7": [
                            "B6",
                            "B5"
                        ],
                        "B8": [
                            "A6",
                            "C6"
                        ],
                        "C7": [
                            "C6",
                            "C5"
                        ],
                        "D7": [
                            "D6",
                            "D5"
                        ],
                        "D8": [
                            "E7",
                            "F6",
                            "G5",
                            "H4"
                        ],
                        "E8": [
                            "E7"
                        ],
                        "F7": [
                            "F6",
                            "F5"
                        ],
                        "F8": [
                            "E7",
                            "D6",
                            "C5",
                            "B4",
                            "A3"
                        ],
                        "G7": [
                            "G6",
                            "G5"
                        ],
                        "G8": [
                            "E7",
                            "F6",
                            "H6"
                        ],
                        "H7": [
                            "H6",
                            "H5"
                        ]
                    },
                    "pieces": {
                        "A1": "R",
                        "A2": "P",
                        "A7": "p",
                        "A8": "r",
                        "B1": "N",
                        "B2": "P",
                        "B7": "p",
                        "B8": "n",
                        "C1": "B",
                        "C2": "P",
                        "C4": "B",
                        "C7": "p",
                        "C8": "b",
                        "D1": "Q",
                        "D2": "P",
                        "D7": "p",
                        "D8": "q",
                        "E1": "K",
                        "E4": "P",
                        "E5": "p",
                        "E8": "k",
                        "F2": "P",
                        "F7": "p",
                        "F8": "b",
                        "G1": "N",
                        "G2": "P",
                        "G7": "p",
                        "G8": "n",
                        "H1": "R",
                        "H2": "P",
                        "H7": "p",
                        "H8": "r"
                    },
                    "castling": {
                        "blackLong": true,
                        "whiteLong": true,
                        "blackShort": true,
                        "whiteShort": true
                    },
                    "fullMove": 2,
                    "halfMove": 1,
                    "checkMate": false,
                    "enPassant": null,
                    "isFinished": false
                }),
                is_ai_move: false,
                piece: 'White Bishop',
                createdAt: new Date('2024-07-10T08:29:12.441Z'),
                updatedAt: new Date('2024-07-10T08:29:12.441Z')
            },
            {
                player_id: 1,
                game_id: 2,
                move_number: 4,
                from_position: 'F8',
                to_position: 'C5',
                configuration_after: JSON.stringify({
                    "turn": "white",
                    "check": false,
                    "moves": {
                        "A2": [
                            "A3",
                            "A4"
                        ],
                        "B1": [
                            "C3",
                            "A3"
                        ],
                        "B2": [
                            "B3",
                            "B4"
                        ],
                        "C2": [
                            "C3"
                        ],
                        "C4": [
                            "B5",
                            "A6",
                            "D5",
                            "E6",
                            "F7",
                            "B3",
                            "D3",
                            "E2",
                            "F1"
                        ],
                        "D1": [
                            "E2",
                            "F3",
                            "G4",
                            "H5"
                        ],
                        "D2": [
                            "D3",
                            "D4"
                        ],
                        "E1": [
                            "E2",
                            "F1"
                        ],
                        "F2": [
                            "F3",
                            "F4"
                        ],
                        "G1": [
                            "H3",
                            "F3",
                            "E2"
                        ],
                        "G2": [
                            "G3",
                            "G4"
                        ],
                        "H2": [
                            "H3",
                            "H4"
                        ]
                    },
                    "pieces": {
                        "A1": "R",
                        "A2": "P",
                        "A7": "p",
                        "A8": "r",
                        "B1": "N",
                        "B2": "P",
                        "B7": "p",
                        "B8": "n",
                        "C1": "B",
                        "C2": "P",
                        "C4": "B",
                        "C5": "b",
                        "C7": "p",
                        "C8": "b",
                        "D1": "Q",
                        "D2": "P",
                        "D7": "p",
                        "D8": "q",
                        "E1": "K",
                        "E4": "P",
                        "E5": "p",
                        "E8": "k",
                        "F2": "P",
                        "F7": "p",
                        "G1": "N",
                        "G2": "P",
                        "G7": "p",
                        "G8": "n",
                        "H1": "R",
                        "H2": "P",
                        "H7": "p",
                        "H8": "r"
                    },
                    "castling": {
                        "blackLong": true,
                        "whiteLong": true,
                        "blackShort": true,
                        "whiteShort": true
                    },
                    "fullMove": 3,
                    "halfMove": 2,
                    "checkMate": false,
                    "enPassant": null,
                    "isFinished": false
                }),
                is_ai_move: false,
                piece: 'Black Bishop',
                createdAt: new Date('2024-07-10T08:29:31.323Z'),
                updatedAt: new Date('2024-07-10T08:29:31.323Z')
            },
            {
                player_id: 2,
                game_id: 2,
                move_number: 5,
                from_position: 'D1',
                to_position: 'H5',
                configuration_after: JSON.stringify({
                    "turn": "black",
                    "check": false,
                    "moves": {
                        "A7": [
                            "A6",
                            "A5"
                        ],
                        "B7": [
                            "B6",
                            "B5"
                        ],
                        "B8": [
                            "A6",
                            "C6"
                        ],
                        "C5": [
                            "B6",
                            "D6",
                            "E7",
                            "F8",
                            "B4",
                            "A3",
                            "D4",
                            "E3",
                            "F2"
                        ],
                        "C7": [
                            "C6"
                        ],
                        "D7": [
                            "D6",
                            "D5"
                        ],
                        "D8": [
                            "E7",
                            "F6",
                            "G5",
                            "H4"
                        ],
                        "E8": [
                            "F8",
                            "E7"
                        ],
                        "G7": [
                            "G6",
                            "G5"
                        ],
                        "G8": [
                            "E7",
                            "F6",
                            "H6"
                        ],
                        "H7": [
                            "H6"
                        ]
                    },
                    "pieces": {
                        "A1": "R",
                        "A2": "P",
                        "A7": "p",
                        "A8": "r",
                        "B1": "N",
                        "B2": "P",
                        "B7": "p",
                        "B8": "n",
                        "C1": "B",
                        "C2": "P",
                        "C4": "B",
                        "C5": "b",
                        "C7": "p",
                        "C8": "b",
                        "D2": "P",
                        "D7": "p",
                        "D8": "q",
                        "E1": "K",
                        "E4": "P",
                        "E5": "p",
                        "E8": "k",
                        "F2": "P",
                        "F7": "p",
                        "G1": "N",
                        "G2": "P",
                        "G7": "p",
                        "G8": "n",
                        "H1": "R",
                        "H2": "P",
                        "H5": "Q",
                        "H7": "p",
                        "H8": "r"
                    },
                    "castling": {
                        "blackLong": true,
                        "whiteLong": true,
                        "blackShort": true,
                        "whiteShort": true
                    },
                    "fullMove": 3,
                    "halfMove": 3,
                    "checkMate": false,
                    "enPassant": null,
                    "isFinished": false
                }),
                is_ai_move: false,
                piece: 'White Queen',
                createdAt: new Date('2024-07-10T08:29:52.062Z'),
                updatedAt: new Date('2024-07-10T08:29:52.062Z')
            },
            {
                player_id: 1,
                game_id: 2,
                move_number: 6,
                from_position: 'D8',
                to_position: 'H4',
                configuration_after: JSON.stringify({
                    "turn": "white",
                    "check": false,
                    "moves": {
                        "A2": [
                            "A3",
                            "A4"
                        ],
                        "B1": [
                            "C3",
                            "A3"
                        ],
                        "B2": [
                            "B3",
                            "B4"
                        ],
                        "C2": [
                            "C3"
                        ],
                        "C4": [
                            "B5",
                            "A6",
                            "D5",
                            "E6",
                            "F7",
                            "B3",
                            "D3",
                            "E2",
                            "F1"
                        ],
                        "D2": [
                            "D3",
                            "D4"
                        ],
                        "E1": [
                            "E2",
                            "F1",
                            "D1"
                        ],
                        "G1": [
                            "H3",
                            "F3",
                            "E2"
                        ],
                        "G2": [
                            "G3",
                            "G4"
                        ],
                        "H2": [
                            "H3"
                        ],
                        "H5": [
                            "H6",
                            "H7",
                            "H4",
                            "G5",
                            "F5",
                            "E5",
                            "G6",
                            "F7",
                            "G4",
                            "F3",
                            "E2",
                            "D1"
                        ]
                    },
                    "pieces": {
                        "A1": "R",
                        "A2": "P",
                        "A7": "p",
                        "A8": "r",
                        "B1": "N",
                        "B2": "P",
                        "B7": "p",
                        "B8": "n",
                        "C1": "B",
                        "C2": "P",
                        "C4": "B",
                        "C5": "b",
                        "C7": "p",
                        "C8": "b",
                        "D2": "P",
                        "D7": "p",
                        "E1": "K",
                        "E4": "P",
                        "E5": "p",
                        "E8": "k",
                        "F2": "P",
                        "F7": "p",
                        "G1": "N",
                        "G2": "P",
                        "G7": "p",
                        "G8": "n",
                        "H1": "R",
                        "H2": "P",
                        "H4": "q",
                        "H5": "Q",
                        "H7": "p",
                        "H8": "r"
                    },
                    "castling": {
                        "blackLong": true,
                        "whiteLong": true,
                        "blackShort": true,
                        "whiteShort": true
                    },
                    "fullMove": 4,
                    "halfMove": 4,
                    "checkMate": false,
                    "enPassant": null,
                    "isFinished": false
                }),
                is_ai_move: false,
                piece: 'Black Queen',
                createdAt: new Date('2024-07-10T08:31:02.231Z'),
                updatedAt: new Date('2024-07-10T08:31:02.231Z')
            },
            {
                player_id: 2,
                game_id: 2,
                move_number: 7,
                from_position: 'H5',
                to_position: 'F7',
                configuration_after: JSON.stringify({
                    "turn": "black",
                    "check": true,
                    "moves": {
                        "E8": [
                            "D8"
                        ]
                    },
                    "pieces": {
                        "A1": "R",
                        "A2": "P",
                        "A7": "p",
                        "A8": "r",
                        "B1": "N",
                        "B2": "P",
                        "B7": "p",
                        "B8": "n",
                        "C1": "B",
                        "C2": "P",
                        "C4": "B",
                        "C5": "b",
                        "C7": "p",
                        "C8": "b",
                        "D2": "P",
                        "D7": "p",
                        "E1": "K",
                        "E4": "P",
                        "E5": "p",
                        "E8": "k",
                        "F2": "P",
                        "F7": "Q",
                        "G1": "N",
                        "G2": "P",
                        "G7": "p",
                        "G8": "n",
                        "H1": "R",
                        "H2": "P",
                        "H4": "q",
                        "H7": "p",
                        "H8": "r"
                    },
                    "castling": {
                        "blackLong": true,
                        "whiteLong": true,
                        "blackShort": true,
                        "whiteShort": true
                    },
                    "fullMove": 4,
                    "halfMove": 0,
                    "checkMate": false,
                    "enPassant": null,
                    "isFinished": false
                }),
                is_ai_move: false,
                piece: 'White Queen',
                createdAt: new Date('2024-07-10T08:32:31.976Z'),
                updatedAt: new Date('2024-07-10T08:32:31.976Z')
            },
            {
                player_id: 1,
                game_id: 2,
                move_number: 8,
                from_position: 'E8',
                to_position: 'D8',
                configuration_after: JSON.stringify({
                    "turn": "white",
                    "check": false,
                    "moves": {
                        "A2": [
                            "A3",
                            "A4"
                        ],
                        "B1": [
                            "C3",
                            "A3"
                        ],
                        "B2": [
                            "B3",
                            "B4"
                        ],
                        "C2": [
                            "C3"
                        ],
                        "C4": [
                            "B5",
                            "A6",
                            "D5",
                            "E6",
                            "B3",
                            "D3",
                            "E2",
                            "F1"
                        ],
                        "D2": [
                            "D3",
                            "D4"
                        ],
                        "E1": [
                            "E2",
                            "F1",
                            "D1"
                        ],
                        "F7": [
                            "F8",
                            "F6",
                            "F5",
                            "F4",
                            "F3",
                            "G7",
                            "E7",
                            "D7",
                            "E8",
                            "G8",
                            "E6",
                            "D5",
                            "G6",
                            "H5"
                        ],
                        "G1": [
                            "H3",
                            "F3",
                            "E2"
                        ],
                        "G2": [
                            "G3",
                            "G4"
                        ],
                        "H2": [
                            "H3"
                        ]
                    },
                    "pieces": {
                        "A1": "R",
                        "A2": "P",
                        "A7": "p",
                        "A8": "r",
                        "B1": "N",
                        "B2": "P",
                        "B7": "p",
                        "B8": "n",
                        "C1": "B",
                        "C2": "P",
                        "C4": "B",
                        "C5": "b",
                        "C7": "p",
                        "C8": "b",
                        "D2": "P",
                        "D7": "p",
                        "D8": "k",
                        "E1": "K",
                        "E4": "P",
                        "E5": "p",
                        "F2": "P",
                        "F7": "Q",
                        "G1": "N",
                        "G2": "P",
                        "G7": "p",
                        "G8": "n",
                        "H1": "R",
                        "H2": "P",
                        "H4": "q",
                        "H7": "p",
                        "H8": "r"
                    },
                    "castling": {
                        "blackLong": false,
                        "whiteLong": true,
                        "blackShort": false,
                        "whiteShort": true
                    },
                    "fullMove": 5,
                    "halfMove": 1,
                    "checkMate": false,
                    "enPassant": null,
                    "isFinished": false
                }),
                is_ai_move: false,
                piece: 'Black King',
                createdAt: new Date('2024-07-10T08:33:23.165Z'),
                updatedAt: new Date('2024-07-10T08:33:23.165Z')
            },
            {
                player_id: 2,
                game_id: 2,
                move_number: 9,
                from_position: 'G1',
                to_position: 'F3',
                configuration_after: JSON.stringify({
                    "turn": "black",
                    "check": false,
                    "moves": {
                        "A7": [
                            "A6",
                            "A5"
                        ],
                        "B7": [
                            "B6",
                            "B5"
                        ],
                        "B8": [
                            "A6",
                            "C6"
                        ],
                        "C5": [
                            "B6",
                            "D6",
                            "E7",
                            "F8",
                            "B4",
                            "A3",
                            "D4",
                            "E3",
                            "F2"
                        ],
                        "C7": [
                            "C6"
                        ],
                        "D7": [
                            "D6",
                            "D5"
                        ],
                        "G7": [
                            "G6",
                            "G5"
                        ],
                        "G8": [
                            "E7",
                            "F6",
                            "H6"
                        ],
                        "H4": [
                            "H5",
                            "H6",
                            "H3",
                            "H2",
                            "G4",
                            "F4",
                            "E4",
                            "G5",
                            "F6",
                            "E7",
                            "G3",
                            "F2"
                        ],
                        "H7": [
                            "H6",
                            "H5"
                        ]
                    },
                    "pieces": {
                        "A1": "R",
                        "A2": "P",
                        "A7": "p",
                        "A8": "r",
                        "B1": "N",
                        "B2": "P",
                        "B7": "p",
                        "B8": "n",
                        "C1": "B",
                        "C2": "P",
                        "C4": "B",
                        "C5": "b",
                        "C7": "p",
                        "C8": "b",
                        "D2": "P",
                        "D7": "p",
                        "D8": "k",
                        "E1": "K",
                        "E4": "P",
                        "E5": "p",
                        "F2": "P",
                        "F3": "N",
                        "F7": "Q",
                        "G2": "P",
                        "G7": "p",
                        "G8": "n",
                        "H1": "R",
                        "H2": "P",
                        "H4": "q",
                        "H7": "p",
                        "H8": "r"
                    },
                    "castling": {
                        "blackLong": false,
                        "whiteLong": true,
                        "blackShort": false,
                        "whiteShort": true
                    },
                    "fullMove": 5,
                    "halfMove": 2,
                    "checkMate": false,
                    "enPassant": null,
                    "isFinished": false
                }),
                is_ai_move: false,
                piece: 'White Knight',
                createdAt: new Date('2024-07-10T08:33:41.872Z'),
                updatedAt: new Date('2024-07-10T08:33:41.872Z')
            },
            {
                player_id: 1,
                game_id: 2,
                move_number: 10,
                from_position: 'C5',
                to_position: 'B6',
                configuration_after: JSON.stringify({
                    "turn": "white",
                    "check": false,
                    "moves": {
                        "A2": [
                            "A3",
                            "A4"
                        ],
                        "B1": [
                            "C3",
                            "A3"
                        ],
                        "B2": [
                            "B3",
                            "B4"
                        ],
                        "C2": [
                            "C3"
                        ],
                        "C4": [
                            "B5",
                            "A6",
                            "D5",
                            "E6",
                            "B3",
                            "D3",
                            "E2",
                            "F1"
                        ],
                        "D2": [
                            "D3",
                            "D4"
                        ],
                        "E1": [
                            "E2",
                            "F1",
                            "D1",
                            "G1"
                        ],
                        "F3": [
                            "G5",
                            "H4",
                            "E5",
                            "D4",
                            "G1"
                        ],
                        "F7": [
                            "F8",
                            "F6",
                            "F5",
                            "F4",
                            "G7",
                            "E7",
                            "D7",
                            "E8",
                            "G8",
                            "E6",
                            "D5",
                            "G6",
                            "H5"
                        ],
                        "G2": [
                            "G3",
                            "G4"
                        ],
                        "H1": [
                            "G1",
                            "F1"
                        ],
                        "H2": [
                            "H3"
                        ]
                    },
                    "pieces": {
                        "A1": "R",
                        "A2": "P",
                        "A7": "p",
                        "A8": "r",
                        "B1": "N",
                        "B2": "P",
                        "B6": "b",
                        "B7": "p",
                        "B8": "n",
                        "C1": "B",
                        "C2": "P",
                        "C4": "B",
                        "C7": "p",
                        "C8": "b",
                        "D2": "P",
                        "D7": "p",
                        "D8": "k",
                        "E1": "K",
                        "E4": "P",
                        "E5": "p",
                        "F2": "P",
                        "F3": "N",
                        "F7": "Q",
                        "G2": "P",
                        "G7": "p",
                        "G8": "n",
                        "H1": "R",
                        "H2": "P",
                        "H4": "q",
                        "H7": "p",
                        "H8": "r"
                    },
                    "castling": {
                        "blackLong": false,
                        "whiteLong": true,
                        "blackShort": false,
                        "whiteShort": true
                    },
                    "fullMove": 6,
                    "halfMove": 3,
                    "checkMate": false,
                    "enPassant": null,
                    "isFinished": false
                }),
                is_ai_move: false,
                piece: 'Black Bishop',
                createdAt: new Date('2024-07-10T08:34:19.174Z'),
                updatedAt: new Date('2024-07-10T08:34:19.174Z')
            },
            {
                player_id: 2,
                game_id: 2,
                move_number: 11,
                from_position: 'F7',
                to_position: 'F8',
                configuration_after: JSON.stringify({
                    "turn": "black",
                    "check": true,
                    "moves": {},
                    "pieces": {
                        "A1": "R",
                        "A2": "P",
                        "A7": "p",
                        "A8": "r",
                        "B1": "N",
                        "B2": "P",
                        "B6": "b",
                        "B7": "p",
                        "B8": "n",
                        "C1": "B",
                        "C2": "P",
                        "C4": "B",
                        "C7": "p",
                        "C8": "b",
                        "D2": "P",
                        "D7": "p",
                        "D8": "k",
                        "E1": "K",
                        "E4": "P",
                        "E5": "p",
                        "F2": "P",
                        "F3": "N",
                        "F8": "Q",
                        "G2": "P",
                        "G7": "p",
                        "G8": "n",
                        "H1": "R",
                        "H2": "P",
                        "H4": "q",
                        "H7": "p",
                        "H8": "r"
                    },
                    "castling": {
                        "blackLong": false,
                        "whiteLong": true,
                        "blackShort": false,
                        "whiteShort": true
                    },
                    "fullMove": 6,
                    "halfMove": 4,
                    "checkMate": true,
                    "enPassant": null,
                    "isFinished": true
                }),
                is_ai_move: false,
                piece: 'White Queen',
                createdAt: new Date('2024-07-10T08:34:40.083Z'),
                updatedAt: new Date('2024-07-10T08:34:40.083Z')
            }
        ], {});
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('Players', null, {});
        await queryInterface.bulkDelete('Games', null, {});
        await queryInterface.bulkDelete('Moves', null, {});
    }
};

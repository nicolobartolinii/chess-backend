import {Player} from "./player";
import {Game} from "./game";
import {Move} from "./move";
import {Role} from "../utils/roles";

export async function seed(players: boolean, games: boolean, moves: boolean) {
    if (players) {
        await seedPlayers();
    }
    if (games) {
        await seedGames();
    }
    if (moves) {
        await seedMoves();
    }
}

async function seedPlayers() {
    await Player.sync({force: true})
        .then(() => {
            console.log('Table Players created successfully!');
        })
        .catch((error) => {
            console.error('Error during table creation:', error);
        });

    await Player.create({
        email: 'prova@prova.it',
        role: Role.PLAYER,
        points: 0,
        tokens: 0
    })
        .then(() => {
            console.log('Player 1 seeded successfully!');
        })
        .catch((error) => {
            console.error('Error during table creation:', error);
        });

    await Player.create({
        email: 'franco@giovanni.it',
        role: Role.ADMIN,
        points: 0,
        tokens: 0
    })
        .then(() => {
            console.log('Player 2 seeded successfully!');
        })
        .catch((error) => {
            console.error('Error during table creation:', error);
        });
}

async function seedGames() {
    await Game.sync({force: true})
        .then(() => {
            console.log('Table Games created successfully!');
        })
        .catch((error) => {
            console.error('Error during table creation:', error);
        });

    await Game.create({
        game_status: 'IN_PROGRESS',
        game_configuration: {
            board: {
                a: ['b', 'w', 'b', 'w', 'b', 'w', 'b', 'w'],
                b: ['w', 'b', 'w', 'b', 'w', 'b', 'w', 'b'],
                c: ['b', 'w', 'b', 'w', 'b', 'w', 'b', 'w'],
                d: ['w', 'b', 'w', 'b', 'w', 'b', 'w', 'b']
            }
        },
        start_date: new Date(),
        end_date: null,
        player_1_id: 1,
        player_2_id: 2,
        AI_difficulty: null,
        winner_id: null
    })
        .then(() => {
            console.log('Game 1 seeded successfully!');
        })
        .catch((error) => {
            console.error('Error during table creation:', error);
        });
}

async function seedMoves() {
    await Move.sync({force: true})
        .then(() => {
            console.log('Table Moves created successfully!');
        })
        .catch((error) => {
            console.error('Error during table creation:', error);
        });

    await Move.create({
        player_id: 1,
        game_id: 1,
        move_number: 1,
        from_position: 'b3',
        to_position: 'c4',
        configuration_after: {
            board: {
                a: ['b', 'w', 'b', 'w', 'b', 'w', 'b', 'w'],
                b: ['w', 'b', 'w', 'b', 'w', 'b', 'w', 'b'],
                c: ['b', 'w', 'b', 'b', 'b', 'w', 'b', 'w'],
                d: ['w', 'b', 'w', 'b', 'w', 'b', 'w', 'b']
            }
        }
    })
        .then(() => {
            console.log('Move 1 seeded successfully!');
        })
        .catch((error) => {
            console.error('Error during table creation:', error);
        });
}
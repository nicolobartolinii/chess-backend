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
                game_status: 'ACTIVE',
                game_configuration: JSON.stringify({
                    board: {
                        a: ['b', 'w', 'b', 'w', 'b', 'w', 'b', 'w'],
                        b: ['w', 'b', 'w', 'b', 'w', 'b', 'w', 'b'],
                        c: ['b', 'w', 'b', 'w', 'b', 'w', 'b', 'w'],
                        d: ['w', 'b', 'w', 'b', 'w', 'b', 'w', 'b']
                    }
                }),
                number_of_moves: 0,
                start_date: new Date(),
                end_date: null,
                player_1_id: 1,
                player_2_id: 2,
                AI_difficulty: null,
                winner_id: null
            },
            {
                game_status: 'FINISHED',
                game_configuration: JSON.stringify({
                    board: {
                        a: ['b', 'w', 'b', 'w', 'b', 'w', 'b', 'w'],
                        b: ['w', 'b', 'w', 'b', 'w', 'b', 'w', 'b'],
                        c: ['b', 'w', 'b', 'w', 'b', 'w', 'b', 'w'],
                        d: ['w', 'b', 'w', 'b', 'w', 'b', 'w', 'b']
                    }
                }),
                number_of_moves: 15,
                start_date: new Date(),
                end_date: null,
                player_1_id: 1,
                player_2_id: null,
                AI_difficulty: "prova",
                winner_id: 1
            }], {});

        await queryInterface.bulkInsert('Moves', [
            {
                player_id: 1,
                game_id: 1,
                move_number: 1,
                from_position: 'b3',
                to_position: 'c4',
                configuration_after: JSON.stringify({
                    board: {
                        a: ['b', 'w', 'b', 'w', 'b', 'w', 'b', 'w'],
                        b: ['w', 'b', 'w', 'b', 'w', 'b', 'w', 'b'],
                        c: ['b', 'w', 'b', 'w', 'b', 'w', 'b', 'w'],
                        d: ['w', 'b', 'w', 'b', 'w', 'b', 'w', 'b']
                    }
                })
            },
            {
                player_id: 1,
                game_id: 2,
                move_number: 1,
                from_position: 'b3',
                to_position: 'c4',
                configuration_after: JSON.stringify({
                    board: {
                        a: ['b', 'w', 'b', 'w', 'b', 'w', 'b', 'w'],
                        b: ['w', 'b', 'w', 'b', 'w', 'b', 'w', 'b'],
                        c: ['b', 'w', 'b', 'w', 'b', 'w', 'b', 'w'],
                        d: ['w', 'b', 'w', 'b', 'w', 'b', 'w', 'b']
                    }
                })
            }], {});
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('Players', null, {});
        await queryInterface.bulkDelete('Games', null, {});
        await queryInterface.bulkDelete('Moves', null, {});
    }
};

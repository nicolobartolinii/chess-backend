'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Players', [
            {
                email: 'prova@prova.it',
                role: 1,
                points: 0,
                tokens: 0,
                createdAt: new Date(),
                updatedAt: new Date()

            },
            {
                email: 'franco@giovanni.it',
                role: 0,
                points: 5,
                tokens: 0,
                createdAt: new Date(),
                updatedAt: new Date()

            }], {});

        await queryInterface.bulkInsert('Games', [
            {
                game_status: 'IN_PROGRESS',
                game_configuration: JSON.stringify({
                    board: {
                        a: ['b', 'w', 'b', 'w', 'b', 'w', 'b', 'w'],
                        b: ['w', 'b', 'w', 'b', 'w', 'b', 'w', 'b'],
                        c: ['b', 'w', 'b', 'w', 'b', 'w', 'b', 'w'],
                        d: ['w', 'b', 'w', 'b', 'w', 'b', 'w', 'b']
                    }
                }),
                start_date: new Date(),
                end_date: null,
                player_1_id: 1,
                player_2_id: 2,
                AI_difficulty: null,
                winner_id: null
            },
            {
                game_status: 'IN_PROGRESS',
                game_configuration: JSON.stringify({
                    board: {
                        a: ['b', 'w', 'b', 'w', 'b', 'w', 'b', 'w'],
                        b: ['w', 'b', 'w', 'b', 'w', 'b', 'w', 'b'],
                        c: ['b', 'w', 'b', 'w', 'b', 'w', 'b', 'w'],
                        d: ['w', 'b', 'w', 'b', 'w', 'b', 'w', 'b']
                    }
                }),
                start_date: new Date(),
                end_date: null,
                player_1_id: 1,
                player_2_id: null,
                AI_difficulty: "prova",
                winner_id: null
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

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Players', null, {});
        await queryInterface.bulkDelete('Games', null, {});
        await queryInterface.bulkDelete('Moves', null, {});
    }
};

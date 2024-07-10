'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Players', {
            player_id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            username: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            role: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            points: {
                type: Sequelize.DECIMAL(10, 4),
                allowNull: false,
                defaultValue: 0
            },
            tokens: {
                type: Sequelize.DECIMAL(10, 4),
                allowNull: false,
                defaultValue: 0
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        await queryInterface.createTable('Games', {
            game_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            game_status: {
                type: Sequelize.STRING,
                allowNull: false
            },
            game_configuration: {
                type: Sequelize.JSON,
                allowNull: false
            },
            number_of_moves: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            start_date: {
                type: Sequelize.DATE,
                allowNull: false
            },
            end_date: {
                type: Sequelize.DATE,
                allowNull: true
            },
            player_1_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "Players",
                    key: 'player_id'
                }
            },
            player_2_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: "Players",
                    key: 'player_id'
                }
            },
            AI_difficulty: {
                type: Sequelize.STRING,
                allowNull: true
            },
            winner_id: {
                type: Sequelize.INTEGER,
                allowNull: true
            }
        });

        await queryInterface.createTable('Moves', {
            player_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references:{
                    model: "Players",
                    key: 'player_id'
                }
            },
            game_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references:{
                    model: "Games",
                    key: 'game_id'
                }
            },
            move_number: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            from_position: {
                type: Sequelize.STRING,
                allowNull: true
            },
            to_position: {
                type: Sequelize.STRING,
                allowNull: true
            },
            configuration_after: {
                type: Sequelize.JSONB,
                allowNull: false
            },
            piece: {
                type: Sequelize.STRING,
                allowNull: true
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('Players', {force: true});
        await queryInterface.dropTable('Games', {force: true});
        await queryInterface.dropTable('Moves', {force: true});
    }
};

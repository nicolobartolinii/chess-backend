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
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            role: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false
            },
            points: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            tokens: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
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
                type: Sequelize.UUID,
                allowNull: true
            }
        });

        await queryInterface.createTable('Moves', {
            player_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "Players",
                    key: 'player_id'
                }
            },
            game_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
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
                allowNull: false
            },
            to_position: {
                type: Sequelize.STRING,
                allowNull: false
            },
            configuration_after: {
                type: Sequelize.JSON,
                allowNull: false
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Players');
        await queryInterface.dropTable('Games');
        await queryInterface.dropTable('Moves');
    }
};

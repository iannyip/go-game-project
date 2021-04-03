module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userList = [
      {
        name: "yettie",
        password: "nsMAC8cgG",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "tybi",
        password: "tybipassword",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "kai",
        password: "kaipassword",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    await queryInterface.bulkInsert("users", userList);

    const gameList = [
      {
        game_state: "{}",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    await queryInterface.bulkInsert("games", gameList);

    const gameUserList = [
      {
        game_id: 1,
        user_id: 1,
        colour: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        game_id: 1,
        user_id: 2,
        colour: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    await queryInterface.bulkInsert("game_users", gameUserList);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("users", null, {});
    await queryInterface.bulkDelete("games", null, {});
    await queryInterface.bulkDelete("game_users", null, {});
  },
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userList = [
      {
        name: 'yettie',
        password: 'nsMAC8cgG',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'tybi',
        password: 'tybipassword',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'kai',
        password: 'kaipassword',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    await queryInterface.bulkInsert('users', userList);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};

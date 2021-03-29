export default function initUsersController(db) {
  const index = async (request, response) => {
    try {
      const users = await db.User.findAll();
      users.forEach((user) => {
        console.log(`${user.id}: ${user.name}`);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    index,
  };
}

export default function initGameModel(sequelize, DataTypes) {
  return sequelize.define(
    "game",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      gameState: {
        allowNull: false,
        type: DataTypes.JSON,
      },
      players: {
        type: DataTypes.JSON,
      },
      status: {
        type: DataTypes.TEXT,
        defaultValue: "Ongoing",
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    { underscored: true }
  );
}

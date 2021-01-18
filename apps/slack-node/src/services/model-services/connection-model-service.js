const { Connection } = require('../../db/models');

const getConnectionByUserId = async (userId) => {
  try {
    const connection = await Connection.findOne({ where: { userId } });
    return connection;
  } catch (err) {
    console.error(err);
  }
};

const createConnection = async (attributes) => {
  const { userId, token } = attributes;
  try {
    const connection = await Connection.create({
      token,
      userId,
    });
    return connection;
  } catch (err) {
    console.error(err);
  }
};

const updateConnection = async (connectionId, updates) => {
  const { userId, token } = updates;
  try {
    const connection = await Connection.update(
      { userId, token },
      {
        where: {
          id: connectionId,
        },
      }
    );
    return connection;
  } catch (err) {
    console.error(err);
  }
};

const deleteConnection = async (connectionId) => {
  try {
    const tokenToDelete = await Connection.findByPk(connectionId);
    const id = tokenToDelete.id;
    await tokenToDelete.destroy();
    return id;
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  getConnectionByUserId,
  createConnection,
  updateConnection,
  deleteConnection,
};

const { Connection } = require('../../db/models');

/**
 * Retrieve a Github connection based on a monday user ID. 
 * @returns A Github OAuth token associated with the user.
 */
const getConnectionByUserId = async (userId) => {
  try {
    const connection = await Connection.findOne({ where: { userId } });
    return connection;
  } catch (err) {
    console.error(err);
  }
};

/**
 * Create a Connection record in the DB.
 * A connection defines a relation between a monday user and their Github credentials. 
 */
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

/**
 * Update an existing Connection. 
 */
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

/**
 * Delete a connection.
 */
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

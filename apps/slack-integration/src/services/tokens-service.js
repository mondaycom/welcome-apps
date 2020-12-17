const { Tokens } = require('../db/models');

const storeToken = async (token, userId) => {
  try {
    const storedToken = await Tokens.create({
      token,
      userId
    });
    return storedToken.dataValues.id;
  } catch (err) {
    console.log(err);
  }
};

const removeTokenByUserId = async userId => {
  try {
    const tokenToDelete = await Tokens.findOne({ where: { userId } });
    const id = tokenToDelete.dataValues.id;
    await tokenToDelete.destroy();
    return id;
  } catch (err) {
    console.log(err);
  }
};

const getTokenByUserId = async userId => {
  try {
    const token = await Tokens.findOne({ where: { userId } });
    return token.dataValues.token;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getTokenByUserId,
  storeToken,
  removeTokenByUserId
};

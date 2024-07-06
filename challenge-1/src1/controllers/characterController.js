const Character = require('../models/character');
const { constants } = require('../constants');

const createCharacter = async (req, res, next) => {
  try {
    const character = new Character(req.body);
    const savedCharacter = await character.save();
    res.status(201).json(savedCharacter);
  } catch (error) {
    res.status(constants.SERVER_ERROR);
    next(error);
  }
};

const getCharacters = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const characters = await Character.find()
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Character.countDocuments();
    res.json({ total, page, limit, characters });
  } catch (error) {
    res.status(constants.SERVER_ERROR);
    next(error);
  }
};

const getCharacterById = async (req, res, next) => {
  try {
    const character = await Character.findById(req.params.id);
    if (!character) {
      res.status(constants.NOT_FOUND);
      throw new Error('Character not found');
    }
    res.json(character);
  } catch (error) {
    next(error);
  }
};

const updateCharacter = async (req, res, next) => {
  try {
    const character = await Character.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!character) {
      res.status(constants.NOT_FOUND);
      throw new Error('Character not found');
    }
    res.json(character);
  } catch (error) {
    next(error);
  }
};

const deleteCharacter = async (req, res, next) => {
  try {
    const character = await Character.findByIdAndDelete(req.params.id);
    if (!character) {
      res.status(constants.NOT_FOUND);
      throw new Error('Character not found');
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCharacter,
  getCharacters,
  getCharacterById,
  updateCharacter,
  deleteCharacter,
};

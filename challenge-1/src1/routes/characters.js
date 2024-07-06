const express = require('express');
const { validateCharacter } = require('../middleware/validation');
const characterController = require('../controllers/characterController');

const router = express.Router();

// Create a new character
router.post('/', validateCharacter, characterController.createCharacter);

// Get all characters with pagination
router.get('/', characterController.getCharacters);

// Get a character by ID
router.get('/:id', characterController.getCharacterById);

// Update a character
router.put('/:id', validateCharacter, characterController.updateCharacter);

// Delete a character
router.delete('/:id', characterController.deleteCharacter);

module.exports = router;

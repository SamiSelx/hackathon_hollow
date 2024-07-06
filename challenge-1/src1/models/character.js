const mongoose = require("mongoose");

const characterSchema = mongoose.Schema (
    {
        name: { type: String, required: true },
        class: { type: String, required: true },
        level: { type: Number, required: true, min: 1, default: 1 },
        skills: [String]  ,
        inventory: [String]  ,
        health: { type: Number, required: true, min: 0, 
            default: 100 },
    
    }
); 

const Character = mongoose.model('Character', characterSchema);

module.exports = Character;
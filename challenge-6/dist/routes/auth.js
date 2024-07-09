"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../google_form_project/controllers/authController");
const router = express_1.default.Router();
router.route('/sign-up')
    .get((req, res) => {
    res.status(301).render('auth/signup');
})
    .post(authController_1.Register);
router.route('/login')
    .get((req, res) => {
    console.log('request came');
    res.status(301).render('auth/login');
})
    .post(authController_1.Login);
exports.default = router;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = exports.Register = void 0;
const genToken_1 = require("../utils/genToken");
const bcrypt_1 = __importDefault(require("bcrypt"));
const credentatilsCheck_1 = require("../utils/credentatilsCheck");
const db_server_1 = require("../utils/db.server");
const Register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(401).send("email and password are required");
    }
    try {
        const user = yield db_server_1.db.user.findFirst({
            where: {
                email
            }
        });
        if (user) {
            res.status(401).send('user already exists with this email');
        }
        const strengthP = (0, credentatilsCheck_1.checkPasswordStrength)(password);
        const salt = yield bcrypt_1.default.genSalt();
        const hashedP = yield bcrypt_1.default.hash(password, salt);
        const newUser = yield db_server_1.db.user.create({
            data: {
                email,
                password: hashedP
            }
        });
        const token = (0, genToken_1.generateAcessToken)(newUser.id);
        res.cookie('jwt', token, { httpOnly: false });
        res.redirect('/');
    }
    catch (error) {
        console.log(error);
    }
});
exports.Register = Register;
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log('request came');
    try {
        if (!(0, credentatilsCheck_1.isEmailValid)(email)) {
            throw new Error('invalid email');
        }
        const user = yield db_server_1.db.user.findFirst({
            where: {
                email
            }
        });
        if (!user) {
            throw new Error('email not found');
        }
        const auth = yield bcrypt_1.default.compare(password, user.password);
        if (!auth) {
            throw new Error('invalid password');
        }
        else {
            const token = (0, genToken_1.generateAcessToken)(user.id);
            res.cookie('jwt', token);
            res.status(201).json({ success: true, userId: user.id });
        }
    }
    catch (error) {
        res.status(401).send(error);
        console.log(error);
    }
});
exports.Login = Login;

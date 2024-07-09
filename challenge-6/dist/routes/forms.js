"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const genToken_1 = require("../utils/genToken");
const formsControllers_1 = require("../google_form_project/controllers/formsControllers");
const router = express_1.default.Router();
router.route('/my-forms')
    .get(genToken_1.isAuth, formsControllers_1.getForms);
exports.default = router;
router.route('/create')
    .get(formsControllers_1.getCreateForm)
    .post(genToken_1.isAuth, formsControllers_1.createForm);

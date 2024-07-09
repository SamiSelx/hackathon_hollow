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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getForms = getForms;
exports.createForm = createForm;
exports.getCreateForm = getCreateForm;
const db_server_1 = require("../../utils/db.server");
const client_1 = require("@prisma/client");
// Function to get user forms
function getForms(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(req.userId);
        try {
            const userId = req.userId;
            if (!userId) {
                throw new Error(`user id isn't found user isn't authenticated`);
            }
            const myForms = yield db_server_1.db.form.findMany({
                where: {
                    userId,
                },
            });
            console.log(myForms);
        }
        catch (error) {
            // Handle errors appropriately
        }
        res.render("myforms");
    });
}
// Function to validate and cast data to JSON (if necessary)
function validateAndCastToJson(data) {
    if (typeof data === "string") {
        try {
            return JSON.parse(data); // Parse and cast if string
        }
        catch (error) {
            console.log(data);
            console.log("Invalid options format. Must be a valid JSON string.");
            return null; // Handle invalid JSON by returning null for options
        }
    }
    else if (data === null) {
        return null; // Allow null for options
    }
    else {
        console.error("Invalid options type. Must be a string or null.");
        return null; // Handle invalid types by returning null for options
    }
}
// Function to create a form
function createForm(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const title = req.body.title;
        const ownerId = req.userId;
        const questions = req.body.questions;
        console.log('Request data:', { title, ownerId, questions });
        try {
            if (title && ownerId && questions) {
                const form = yield db_server_1.db.form.create({
                    data: {
                        title,
                        userId: ownerId,
                    },
                });
                console.log('Form created:', form.id);
                for (let i = 0; i < questions.length; i++) {
                    if (form) {
                        const Qtype = questions[i].answerType;
                        console.log(Qtype);
                        let type;
                        switch (Qtype) {
                            case 'text':
                                type = client_1.QuestionType.TEXT;
                                yield db_server_1.db.question.create({
                                    data: {
                                        formId: form.id,
                                        type: type,
                                        text: questions[i].text,
                                        correctAnswer: questions[i].correctAnswer,
                                        options: questions[i]
                                        // No options for text type
                                    },
                                });
                                break;
                            case 'single-choice':
                                type = client_1.QuestionType.SINGLE_CHOICE;
                                const singleChoiceOptions = validateAndCastToJson(questions[i].options);
                                yield db_server_1.db.question.create({
                                    data: {
                                        formId: form.id,
                                        type: type,
                                        text: questions[i].text,
                                        correctAnswer: questions[i].correctAnswer,
                                        options: singleChoiceOptions, // Use validated options
                                    },
                                });
                                break;
                            case 'multi-choice':
                                type = client_1.QuestionType.MULTI_CHOICE;
                                const multiChoiceOptions = validateAndCastToJson(questions[i].options);
                                yield db_server_1.db.question.create({
                                    data: {
                                        formId: form.id,
                                        type: type,
                                        text: questions[i].text,
                                        correctAnswer: questions[i].correctAnswer,
                                        options: multiChoiceOptions, // Use validated options
                                    },
                                });
                                break;
                            default:
                                throw new Error(`Unsupported question type: ${Qtype}`);
                        }
                        console.log('Question created:', questions[i]);
                    }
                    else {
                        throw new Error('Form was not created.');
                    }
                }
                res.status(201).json({ message: "Form created successfully" });
            }
            else {
                res.status(400).json({ error: 'Invalid form data' });
            }
        }
        catch (error) {
            console.error('Error creating form:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
}
function getCreateForm(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('rendring');
        res.status(201).render('forms/create');
    });
}

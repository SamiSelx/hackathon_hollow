import { Request, Response } from "express";
import { db } from "../../utils/db.server";
import { config } from "dotenv";
import { QuestionType } from "@prisma/client";
import { JsonObject } from "@prisma/client/runtime/library";
import { json } from "stream/consumers";

// Type definitions for forms, users, questions, and form responses
type Forms = {
  id?: number;
  title: string;
  userId: number;
  questions?: Question[];
  reponses?: formResponse[];
};

type User = {
  id: number;
  email?: string;
  password?: string;
};

type Question = {
  answerType: string;
  id?: number;
  formId?: number;
  asnwerType: QuestionType|string;
  text: string;
  correctAnswer: string;
  options: JsonObject ; // Allow options to be null
};

type formResponse = {
  id: number;
  userId: number;
  formId: number;
  answer: string[];
};

// Type for request with optional userId property
type MyRequest<T> = Request<T> & { userId?: number };

// Function to get user forms
async function getForms<T>(req: MyRequest<T>, res: Response) {
  console.log(req.userId);
  try {
    const userId: number | undefined = req.userId;
    if (!userId) {
      throw new Error(`user id isn't found user isn't authenticated`);
    }

    const myForms: Forms[] | undefined = await db.form.findMany({
      where: {
        userId,
      },
    });

    console.log(myForms);
  } catch (error: any) {
    // Handle errors appropriately
  }
  res.render("myforms");
}

// Function to validate and cast data to JSON (if necessary)
function validateAndCastToJson(data: any): JsonObject | null {
  if (typeof data === "string") {
    try {
      return JSON.parse(data) as JsonObject; // Parse and cast if string
    } catch (error) {
      console.log(data)
      console.log("Invalid options format. Must be a valid JSON string.");
      return null; // Handle invalid JSON by returning null for options
    }
  } else if (data === null) {
    return null; // Allow null for options
  } else {
    console.error("Invalid options type. Must be a string or null.");
    return null; // Handle invalid types by returning null for options
  }
}

// Function to create a form
async function createForm<T>(req: MyRequest<T>, res: Response) {
  const title: string | undefined = req.body.title;
  const ownerId: number | undefined = req.userId;
  const questions: Question[] | undefined = req.body.questions;

  console.log('Request data:', { title, ownerId, questions });

  try {
    if (title && ownerId && questions) {
      const form = await db.form.create({
        data: {
          title,
          userId: ownerId,
        },
      });
      console.log('Form created:', form.id);

      for (let i = 0; i < questions.length; i++) {
        if (form) {
          const Qtype: string = questions[i].answerType
          console.log(Qtype)
          let type: QuestionType;

          switch (Qtype) {
            case 'text':
              type = QuestionType.TEXT;
              await db.question.create({
                data: {
                  formId: form.id,
                  type: type as QuestionType,
                  text: questions[i].text,
                  correctAnswer: questions[i].correctAnswer,
                  options:questions[i] as JsonObject
                   // No options for text type
                },
              });
              break;
            case 'single-choice':
              type = QuestionType.SINGLE_CHOICE;
              const singleChoiceOptions = validateAndCastToJson(questions[i].options);
              await db.question.create({
                data: {
                  formId: form.id,
                  type: type as QuestionType,
                  text: questions[i].text,
                  correctAnswer: questions[i].correctAnswer,
                  options: singleChoiceOptions as JsonObject, // Use validated options
                },
              });
              break;
            case 'multi-choice':
              type = QuestionType.MULTI_CHOICE;
              const multiChoiceOptions = validateAndCastToJson(questions[i].options);
              await db.question.create({
                data: {
                  formId: form.id,
                  type: type as QuestionType,
                  text: questions[i].text,
                  correctAnswer: questions[i].correctAnswer,
                  options: multiChoiceOptions as JsonObject, // Use validated options
                },
              });
              break;
            default:
              throw new Error(`Unsupported question type: ${Qtype}`);
          }

          console.log('Question created:', questions[i]);
        } else {
          throw new Error('Form was not created.');
        }
      }

      res.status(201).json({ message: "Form created successfully" });
    } else {
      res.status(400).json({ error: 'Invalid form data' });
    }
  } catch (error: any) {
    console.error('Error creating form:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getCreateForm<T>(req:MyRequest<T>,res:Response) {
    console.log('rendring')
     res.status(201).render('forms/create')
}

// Export the getForms function
export { getForms, createForm,getCreateForm };

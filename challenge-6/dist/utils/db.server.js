"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const client_1 = require("@prisma/client");
let db;
if (!global.__db) {
    global.__db = new client_1.PrismaClient();
}
exports.db = db = global.__db;

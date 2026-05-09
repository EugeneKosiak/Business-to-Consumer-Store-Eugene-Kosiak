"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = exports.createClient = void 0;
var client_1 = require("@prisma/client");
var web_1 = require("@repo/env/web");
var createClient = function () {
    if (global.prisma) {
        return global.prisma;
    }
    var URL = web_1.env.DATABASE_URL;
    var prisma = new client_1.PrismaClient({
        datasourceUrl: URL,
    });
    console.log("Connected to database");
    console.log(URL);
    global.prisma = prisma;
    return prisma;
};
exports.createClient = createClient;
exports.client = {
    get db() {
        return (0, exports.createClient)();
    },
};

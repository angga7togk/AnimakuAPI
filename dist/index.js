"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Animasu_1 = __importDefault(require("./provider/default/Animasu"));
exports.default = {
    animasu: new Animasu_1.default(),
};
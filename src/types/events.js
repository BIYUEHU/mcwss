"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventDataMinecraftBaseSchema = void 0;
const tsukiko_1 = __importDefault(require("tsukiko"));
const const_1 = require("../const");
exports.eventDataMinecraftBaseSchema = tsukiko_1.default.Object({
    body: tsukiko_1.default.Object({}),
    header: tsukiko_1.default.Object({
        eventName: tsukiko_1.default.Custom((val) => typeof val === 'string' && const_1.ALL_EVENTS.includes(val)),
        messagePurpose: tsukiko_1.default.String(),
        version: tsukiko_1.default.Number()
    })
});

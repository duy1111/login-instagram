"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSMS = void 0;
const axios_1 = __importDefault(require("axios"));
const KEY = process.env.MITTO_API_KEY;
const sendSMS = async (data) => {
    const { text, to } = data;
    const options = {
        method: "POST",
        url: "https://rest.mittoapi.net/sms",
        headers: {
            "Content-Type": "application/json",
            "X-Mitto-API-Key": KEY,
        },
        data: {
            from: "asd",
            to: `${to}`,
            text,
        },
    };
    try {
        const response = await axios_1.default.request(options);
        return true;
    }
    catch (error) {
        console.error(`==============================================================================`
            .yellow);
        console.error(`${error}`.red);
        console.error(`==============================================================================`
            .yellow);
        return false;
    }
};
exports.sendSMS = sendSMS;

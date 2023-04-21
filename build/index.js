"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var routes_1 = __importDefault(require("./routes"));
var dietBotRoutes = new routes_1.default();
dietBotRoutes.getFoodReport();
dietBotRoutes.answerOnFoodReport();
dietBotRoutes.setTimesOfPhysicalPunishment();
dietBotRoutes.checkChangingMyRights();
dietBotRoutes.addedToChat();
dietBotRoutes.joinedToChat();
console.log('Started');

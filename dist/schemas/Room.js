"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var RoomSchema = new mongoose_1.default.Schema({
    name: String,
    users: [{
            ref: "User",
            type: mongoose_1.default.SchemaTypes.ObjectId
        }],
    messages: [{
            sender: {
                ref: "User",
                type: mongoose_1.default.SchemaTypes.ObjectId
            },
            content: String
        }],
    thumbnail: String
});
exports.default = mongoose_1.default.model("Room", RoomSchema);

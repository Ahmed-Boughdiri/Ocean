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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var schemas_1 = require("../schemas");
var multer_1 = __importDefault(require("multer"));
var uuid_1 = require("uuid");
var utils_1 = require("../utils");
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                cb(null, "uploads/");
                return [2 /*return*/];
            });
        });
    },
    filename: function (req, file, cb) {
        cb(null, uuid_1.v4() + "." + file.mimetype.split('/')[1]);
    }
});
var upload = multer_1.default({ storage: storage }).single("thumbnail");
var route = express_1.default.Router();
route.post("/get", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, error, rooms, result, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                token = req.body.token;
                return [4 /*yield*/, utils_1.verifyToken(token)];
            case 1:
                error = (_a.sent()).error;
                if (error)
                    return [2 /*return*/, res.status(400).send({
                            error: error
                        })];
                return [4 /*yield*/, schemas_1.Room.find().populate("users")];
            case 2:
                rooms = _a.sent();
                if (!rooms)
                    return [2 /*return*/, res.status(200).send({
                            rooms: []
                        })];
                result = rooms.map(function (room) { return ({
                    name: room.name,
                    users: room.users.map(function (user) { return ({
                        name: user.name,
                        email: user.email,
                        id: user._id,
                        thumbnail: user.thumbnail
                    }); }),
                    messages: room.messages,
                    thumbnail: room.thumbnail,
                    id: room._id
                }); });
                return [2 /*return*/, res.status(200).send({
                        rooms: result
                    })];
            case 3:
                err_1 = _a.sent();
                return [2 /*return*/, res.status(500).send({
                        error: "An Error Has Occured Please Try Again Later"
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); });
route.post("/create", upload, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, userID, token, error, user, room, err_2;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 4, , 5]);
                _a = req.body, name_1 = _a.name, userID = _a.userID, token = _a.token;
                if (!name_1)
                    return [2 /*return*/, res.status(400).send({
                            error: "Room Name Needs To Be Provided"
                        })];
                if (!userID)
                    return [2 /*return*/, res.status(400).send({
                            error: "User ID Needs To Be Provided"
                        })];
                return [4 /*yield*/, utils_1.verifyToken(token)];
            case 1:
                error = (_d.sent()).error;
                if (error)
                    return [2 /*return*/, res.status(400).send({
                            error: error
                        })];
                return [4 /*yield*/, schemas_1.User.findById(userID)];
            case 2:
                user = _d.sent();
                if (!user)
                    return [2 /*return*/, res.status(400).send({
                            error: "Invalid User ID"
                        })];
                room = new schemas_1.Room({
                    name: name_1,
                    messages: [],
                    users: [
                        userID
                    ],
                    thumbnail: ((_b = req.file) === null || _b === void 0 ? void 0 : _b.path) || "uploads/conversation.png"
                });
                return [4 /*yield*/, room.save()];
            case 3:
                _d.sent();
                return [2 /*return*/, res.status(201).send({
                        name: name_1,
                        id: room.id,
                        users: [
                            {
                                name: user.name,
                                email: user.email,
                                id: user._id
                            }
                        ],
                        thumbnail: ((_c = req.file) === null || _c === void 0 ? void 0 : _c.path) || "uploads/conversation.png",
                        messages: []
                    })];
            case 4:
                err_2 = _d.sent();
                return [2 /*return*/, res.status(500).send({
                        error: "An Error Has Occured Please Try Again"
                    })];
            case 5: return [2 /*return*/];
        }
    });
}); });
route.post("/messages/get", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, token, roomID, error, room, result, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, token = _a.token, roomID = _a.roomID;
                return [4 /*yield*/, utils_1.verifyToken(token)];
            case 1:
                error = (_b.sent()).error;
                if (error)
                    return [2 /*return*/, res.status(400).send({
                            error: "Invalid Token"
                        })];
                if (!roomID)
                    return [2 /*return*/, res.status(400).send({
                            error: "Room ID Needs To Be Provided"
                        })];
                return [4 /*yield*/, schemas_1.Room.findById(roomID).populate("users")];
            case 2:
                room = _b.sent();
                if (!room)
                    return [2 /*return*/, res.status(400).send({
                            error: "Invalid Room ID"
                        })];
                return [4 /*yield*/, Promise.all(room.messages.map(function (message) { return __awaiter(void 0, void 0, void 0, function () {
                        var sender;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, schemas_1.User.findById(message.sender)];
                                case 1:
                                    sender = _a.sent();
                                    if (!sender)
                                        return [2 /*return*/, {}];
                                    return [2 /*return*/, {
                                            content: message.content,
                                            sender: {
                                                name: sender.name,
                                                email: sender.email,
                                                id: sender._id
                                            }
                                        }];
                            }
                        });
                    }); }))];
            case 3:
                result = _b.sent();
                return [2 /*return*/, res.status(200).send({
                        messages: result
                    })];
            case 4:
                err_3 = _b.sent();
                return [2 /*return*/, res.status(500).send({
                        error: "An Error Has Occured Please Try Again"
                    })];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = route;

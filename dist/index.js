"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var express_1 = __importStar(require("express"));
var path_1 = __importDefault(require("path"));
var socket_io_1 = require("socket.io");
var http_1 = __importDefault(require("http"));
var mongoose_1 = __importDefault(require("mongoose"));
var dotenv_1 = __importDefault(require("dotenv"));
var routes_1 = require("./routes");
var schemas_1 = require("./schemas");
dotenv_1.default.config();
// SETTING UP THE EXPRESS SERVER
var app = (0, express_1.default)();
var server = http_1.default.createServer(app);
var PORT = 5000;
app.use((0, express_1.json)({ limit: "50mb" }));
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.get("/", function (req, res) {
    return res.sendFile(path_1.default.join((__dirname), "../public/index.html"));
});
app.get("/signup/", function (req, res) {
    return res.sendFile(path_1.default.join((__dirname), "../public/signup.html"));
});
app.get("/login", function (req, res) {
    return res.sendFile(path_1.default.join(__dirname, "../public/login.html"));
});
server.listen(process.env.PORT || PORT, function () { return console.log("SERVER RUNNING ON PORT ".concat(PORT, "...")); });
// CONNECTING TO THE DATABASE
mongoose_1.default.connect("mongodb+srv://".concat(process.env.DB_USER, ":").concat(process.env.DB_PASSWORD, "@cluster0.rimnobs.mongodb.net/?retryWrites=true&w=majority"), {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function () { return console.log("DB CONNECTED ..."); });
// SETTING UP THE SOCKET SERVER
var io = new socket_io_1.Server(server);
io.on("connection", function (socket) {
    socket.on("join-room", function (roomID) {
        socket.join(roomID);
    });
    socket.on("chat-message", function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var sender, senderName, room, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, schemas_1.User.findById(data.senderID)];
                case 1:
                    sender = _a.sent();
                    senderName = "";
                    if (!sender)
                        senderName = "Unknown";
                    else
                        senderName = sender.name;
                    return [4 /*yield*/, schemas_1.Room.findById(data.room)];
                case 2:
                    room = _a.sent();
                    if (!room)
                        throw Error("Invalid Room ID");
                    return [4 /*yield*/, schemas_1.Room.updateOne({
                            _id: data.room
                        }, {
                            $addToSet: {
                                messages: {
                                    sender: data.senderID,
                                    content: data.message
                                }
                            }
                        })];
                case 3:
                    _a.sent();
                    socket.to(data.room).emit("sent-message", {
                        msg: data.message,
                        sender: senderName
                    });
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    throw err_1;
                case 5: return [2 /*return*/];
            }
        });
    }); });
});
// ROUTES
app.use("/user/", routes_1.handleUserAuth);
app.use("/rooms/", routes_1.rooms);
app.use("/users/", routes_1.users);

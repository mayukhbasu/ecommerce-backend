"use strict";
// src/index.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const redis_1 = __importDefault(require("redis"));
const auth_1 = __importDefault(require("./routes/auth"));
const app = (0, express_1.default)();
const PORT = 3000;
const RedisStore = (0, connect_redis_1.default)(express_session_1.default);
const redisClient = redis_1.default.createClient();
app.use((0, express_session_1.default)({
    store: new RedisStore({ client: redisClient }),
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    }
}));
mongoose_1.default.connect('mongodb://localhost:27017/registration', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
});
app.use(express_1.default.json());
app.use('/auth', auth_1.default);
app.listen(PORT, () => {
    console.log(`User Service started on port ${PORT}`);
});
exports.default = app;

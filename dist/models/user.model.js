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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_interface_1 = require("../interfaces/user/user.interface");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userSchema = new mongoose_1.default.Schema({
    registrationType: {
        type: String,
        enum: ["email", "phone"],
    },
    verificationCode: {
        type: String,
    },
    passwordResetExpires: {
        type: Date,
    },
    passwordResetVerified: {
        type: Boolean,
        default: false,
    },
    name: {
        type: String,
        default: "",
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    password: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
        default: "default.png",
    },
    revinue: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        enum: [
            "rootAdmin",
            "adminA",
            "adminB",
            "adminC",
            "subAdmin",
            "user",
            "guest",
        ],
        default: user_interface_1.Role.USER,
    },
    orders: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Order",
        },
    ],
    addressesList: [
        {
            id: { type: mongoose_1.default.Schema.Types.ObjectId },
            city: String,
            area: String,
            address: String,
            postalCode: String,
        },
    ],
    favourite: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "Product",
        },
    ],
    changePasswordAt: {
        type: Date,
        default: Date.now(),
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
userSchema.pre("save", function (next) {
    if (this.password && this.isModified("password")) {
        // const salt = bcrypt.genSaltSync(10);
        const salt = +process.env.BCRYPT_SALT;
        this.password = bcrypt_1.default.hashSync(this.password, salt);
    }
    next();
});
userSchema.virtual("imageUrl").get(function () {
    return `${process.env.APP_URL}/uploads/${this.image}`;
});
userSchema.methods.comparePassword = function (password) {
    if (!password)
        return false;
    return bcrypt_1.default.compareSync(password, this.password);
};
userSchema.methods.createToken = function () {
    const JWT_SECRET = process.env.JWT_SECRET;
    const JWT_EXPIRE = process.env.JWT_EXPIRE;
    return jsonwebtoken_1.default.sign({ _id: this._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};
userSchema.methods.createGuestToken = function () {
    const JWT_SECRET = process.env.JWT_SECRET;
    const JWT_EXPIRE_GUEST = process.env.JWT_EXPIRE_GUEST;
    return jsonwebtoken_1.default.sign({ _id: this._id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRE_GUEST,
    });
};
exports.User = mongoose_1.default.model("User", userSchema);

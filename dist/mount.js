"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_router_1 = __importDefault(require("./routes/auth.router"));
const user_router_1 = __importDefault(require("./routes/user.router"));
const router = (0, express_1.Router)();
/*
allowedTo(
  Role.RootAdmin,
  Role.AdminA,
  Role.AdminB,
  Role.AdminC,
  Role.SubAdmin,
  Role.USER
),
*/
router.use("/users", user_router_1.default);
router.use("/auth", auth_router_1.default);
exports.default = router;

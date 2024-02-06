"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOneItemById = exports.updateOneItemById = exports.createNewItem = exports.getOneItemById = exports.getAllItems = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const http_status_codes_1 = require("http-status-codes");
const status_enum_1 = require("../interfaces/status/status.enum");
const ApiFeatures_1 = require("../utils/ApiFeatures");
// @desc    Get All Items
// @route   GET /api/v1/......
// @access  Public
const getAllItems = (Model, populate = [""]) => (0, express_async_handler_1.default)(async (req, res, next) => {
    //  1- find all data
    const query = req.query;
    const mongoQuery = Model.find({});
    const { data, paginationResult } = await new ApiFeatures_1.ApiFeatures(mongoQuery, query)
        .populate()
        .filter()
        .limitFields()
        .search()
        .sort()
        .paginate();
    // 3- get features
    if (data.length === 0) {
        return next(new ApiError_1.default({
            en: "not found",
            ar: "لا يوجد اي نتيجة"
        }, http_status_codes_1.StatusCodes.NOT_FOUND));
    }
    // 5- send response
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: status_enum_1.Status.SUCCESS,
        results: data.length,
        paginationResult,
        data: data,
        success_en: "found successfully",
        success_ar: "تم العثور بنجاح",
    });
});
exports.getAllItems = getAllItems;
// @desc    Get Specific Item By Id
// @route   GET /api/v1/......
// @access  Public
const getOneItemById = (Model, populate = [""]) => (0, express_async_handler_1.default)(async (req, res, next) => {
    // 1- get id of item from params
    const { id } = req.params;
    // 2- find document from mongooseDB
    let query = Model.findById(id);
    // 3- get document
    const document = (populate === null || populate === void 0 ? void 0 : populate.length) > 0 && populate[0] !== ""
        ? await query.populate(populate)
        : await query;
    // 4- check if document not found
    if (!document) {
        return next(new ApiError_1.default({
            en: `Not Found Any Result For This Id: ${id}`,
            ar: `${id} : id لا يوجد اي نتيجة بهذا باستخدم`,
        }, http_status_codes_1.StatusCodes.NOT_FOUND));
    }
    // 5- send response
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: status_enum_1.Status.SUCCESS,
        data: document,
        success_en: "found successfully",
        success_ar: "تم العثور بنجاح",
    });
});
exports.getOneItemById = getOneItemById;
// @desc    Create New Item
// @route   POST /api/v1/......
// @access  Private
const createNewItem = (Model) => (0, express_async_handler_1.default)(async (req, res, next) => {
    // 1- take data from request body
    const data = req.body;
    // 2- create new document in mongooseDB
    const document = await Model.create(data);
    // 3- send response
    res.status(http_status_codes_1.StatusCodes.CREATED).json({
        status: status_enum_1.Status.SUCCESS,
        data: document,
        success_en: "created successfully",
        success_ar: "تم الانشاء بنجاح",
    });
});
exports.createNewItem = createNewItem;
// @desc    Update Specific Item
// @route   PUT    /api/v1/.....
// @access  Private
const updateOneItemById = (Model, populate = [""]) => (0, express_async_handler_1.default)(async (req, res, next) => {
    // 1- get id for item from params
    const { id } = req.params;
    // 2- find item and update in mongooseDB
    const query = Model.findByIdAndUpdate(id, req.body, {
        new: true,
    });
    // 3- get document
    const document = (populate === null || populate === void 0 ? void 0 : populate.length) > 0 && populate[0] !== ""
        ? await query.populate(populate)
        : await query;
    // 3- check if document not found
    if (!document) {
        return next(new ApiError_1.default({
            en: `Not Found Any Result For This Id ${id}`,
            ar: `${id}لا يوجداي نتيجة لهذا`,
        }, http_status_codes_1.StatusCodes.NOT_FOUND));
    }
    // 4- save update
    document.save();
    // 5- send response
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: status_enum_1.Status.SUCCESS,
        data: document,
        success_en: "updated successfully",
        success_ar: "تم التعديل بنجاح",
    });
});
exports.updateOneItemById = updateOneItemById;
// @desc    Delete Specific Item
// @route   DELETE    /api/v1/.....
// @access  Private
const deleteOneItemById = (Model) => (0, express_async_handler_1.default)(async (req, res, next) => {
    // 1- get id for item from params
    const { id } = req.params;
    // 2- find item and delete in mongooseDB
    const document = await Model.findByIdAndDelete(id);
    // 3- check if item deleted
    if (!document) {
        return next(new ApiError_1.default({
            en: `Not Found Any Result For This Id ${id}`,
            ar: `${id}لا يوجداي نتيجة لهذا`,
        }, http_status_codes_1.StatusCodes.NOT_FOUND));
    }
    // 4- send response
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: status_enum_1.Status.SUCCESS,
        success_en: "deleted successfully",
        success_ar: "تم الحذف بنجاح",
    });
});
exports.deleteOneItemById = deleteOneItemById;

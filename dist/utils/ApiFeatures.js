"use strict";
// import { Document, FilterQuery, Query } from "mongoose";
// import { IQuery } from "./../interfaces/factory/factory.interface";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiFeatures = void 0;
class ApiFeatures {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
        this.paginationResult = { totalPages: 0, page: 0, limit: 0 };
        this.data = [];
    }
    sort() {
        var _a, _b;
        const sort = ((_b = (_a = this.queryString) === null || _a === void 0 ? void 0 : _a.sort) === null || _b === void 0 ? void 0 : _b.split(",").join(" ")) || "-createdAt";
        this.mongooseQuery.sort(sort);
        return this;
    }
    filter() {
        const queryObj = Object.assign({}, this.queryString);
        const excludedFields = [
            "sort",
            "limit",
            "page",
            "fields",
            "keyword",
            "populate",
        ];
        excludedFields.forEach((el) => delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt|eq|ne|in|nin)\b/g, (match) => `$${match}`);
        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
        return this;
    }
    search() {
        const { keyword } = this.queryString;
        if (keyword) {
            const keywordObj = {
                $or: Object.keys(keyword).map((key) => {
                    if (typeof keyword[key] === "string") {
                        return {
                            [key]: { $regex: keyword[key], $options: "i" },
                        };
                    }
                    const keys = keyword[key].map((value) => ({
                        [key]: { $regex: value, $options: "i" },
                    }));
                    return { $or: keys };
                }),
            };
            this.mongooseQuery = this.mongooseQuery.find(keywordObj);
        }
        return this;
    }
    limitFields() {
        const { fields } = this.queryString;
        if (fields) {
            const fieldsBy = fields.split(",").join(" ");
            this.mongooseQuery = this.mongooseQuery.select(fieldsBy);
        }
        return this;
    }
    populate() {
        var _a, _b;
        const populate = (_b = (_a = this.queryString) === null || _a === void 0 ? void 0 : _a.populate) === null || _b === void 0 ? void 0 : _b.split(",").join(" ");
        if (populate) {
            this.mongooseQuery = this.mongooseQuery.populate(populate);
        }
        return this;
    }
    async paginate() {
        const { limit, page } = this.queryString;
        const pageNumber = page ? +page : 1;
        const limitNumber = limit ? +limit : 10;
        const skip = (pageNumber - 1) * limitNumber;
        const countQuery = this.mongooseQuery.model.find(Object.assign({}, this.mongooseQuery.getQuery()));
        const total = await countQuery.countDocuments();
        const totalPages = Math.ceil(total / limitNumber);
        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limitNumber);
        this.paginationResult = {
            totalPages,
            page: pageNumber,
            limit: limitNumber,
        };
        this.data = await this.mongooseQuery;
        return this;
    }
}
exports.ApiFeatures = ApiFeatures;

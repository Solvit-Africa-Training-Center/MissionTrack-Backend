import { stat } from "fs";
import Joi from "joi";

export const companySchema = Joi.object({
    id: Joi.string().uuid().required(),
    companyName: Joi.string().min(2).max(100).required(),
    companyEmail: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    state: Joi.string().valid('active', 'inactive').default('null'),
    companyContact: Joi.string().min(10).max(15).required(),
    proofDocument:Joi.string().required(),
    approveComment:Joi.string().allow(''),
    status: Joi.string().valid('pending', 'approved', 'rejected').default('pending'),
    province: Joi.string().max(100).required(),
    district: Joi.string().max(100).required(),
    sector: Joi.string().max(100).required(),
    createdAt: Joi.date().default(Date.now),
    updatedAt: Joi.date().default(Date.now),
    deletedAt: Joi.date().allow(null)
});
import Joi from "joi";

export const companySchema = Joi.object({
    companyName: Joi.string().min(2).max(100).required(),
    companyEmail: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    state: Joi.string().valid('active', 'blocked','trial').default('trial'),
    companyContact: Joi.string().min(10).max(15).required(),
    proofDocument:Joi.string(),
    approveComment:Joi.string().allow(''),
    status: Joi.string().valid('pending', 'approved', 'rejected').default('pending'),
    province: Joi.string().max(100).required(),
    district: Joi.string().max(100).required(),
    sector: Joi.string().max(100).required(),
    phoneNumber:Joi.string().min(10).max(15).required(),
    fullName:Joi.string().min(3).required(),
    email:Joi.string().email().required(),
    createdAt: Joi.date().default(Date.now),
    updatedAt: Joi.date().default(Date.now),
    deletedAt: Joi.date().allow(null)
});

export const updateCompanySchema = Joi.object({
    companyName: Joi.string().min(2).max(100),
    companyEmail: Joi.string().email(),
    companyContact: Joi.string().min(10).max(15),
    proofDocument:Joi.string(),
    province: Joi.string().max(100),
    district: Joi.string().max(100),
    sector: Joi.string().max(100),
    updatedAt: Joi.date().default(Date.now),
    deletedAt: Joi.date().allow(null)
});

export const blockUnblockCompanySchema=Joi.object({
    state:Joi.string().valid('active','blocked').required(),
    comment:Joi.string().min(5).required()
})

export const approveRejectCompanySchema=Joi.object({
    status:Joi.string().valid('approved','rejected').required(),
    comment:Joi.string().min(5).required()
})
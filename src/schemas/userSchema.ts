import joi from "joi";


export const addUserSchema=joi.object({
    fullName:joi.string().min(3).required(),
    email:joi.string().email().required(),
    password:joi.string().min(6).required(),
    phoneNumber:joi.string().min(10).max(15).required(),
    role:joi.string().valid("admin","employee","manager","finance_manager").required(),
    department:joi.string().min(2).required()
});

export const updateUserSchema=joi.object({
    fullName:joi.string().min(3),
    email:joi.string().email(),
    password:joi.string(),
    phoneNumber:joi.string(),
    role:joi.string().valid("admin","employee","manager","finance_manager"),
    department:joi.string().min(2)
})

export const loginUserSchema=joi.object({
    email:joi.string().email().required(),
    password:joi.string().min(5).required()
})
import joi from "joi";


export const addMissionSchema=joi.object({
    title:joi.string().min(3).required(),
    description:joi.string().min(10).required(),
    location:joi.string().min(2).required(),
    jobPosition:joi.string().min(2).required(),
    status:joi.string().valid("pending","rejected","manager_approved","financial_approved","completed").required()
});

export const updateMissionSchema=joi.object({
    title:joi.string().min(3),
    description:joi.string().min(10),
    location:joi.string().min(2),
    jobPosition:joi.string().min(2),
    status:joi.string().valid("pending","rejected","manager_approved","financial_approved","completed")
})


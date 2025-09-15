import joi from "joi";


export const addMissionSchema=joi.object({
    fullName:joi.string().min(3).required(),
    mission:joi.string().min(3).required(),
    missionDescription:joi.string().min(10).required(),
    location:joi.string().min(2).required(),
    jobPosition:joi.string().min(2).required(),
    startDate:joi.date().required(),
    endDate:joi.date().greater(joi.ref('startDate')).required()
});

export const updateMissionSchema=joi.object({
    mission:joi.string().min(3),
    missionDescription:joi.string().min(10),
    location:joi.string().min(2),
    jobPosition:joi.string().min(2),
    status:joi.string().valid("pending","rejected","manager_approved","financial_approved","completed")
})


import Joi from "joi";

export const createActionSchema=Joi.object({
    missionId:Joi.string().uuid().required(),
    actorId:Joi.string().uuid().required(),
    action:Joi.string().valid("Approve","Reject","Update","Cancel").required(),
    comment:Joi.string().optional().allow(null,''),
});
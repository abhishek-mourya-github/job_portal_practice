const Joi = require('joi');

// validation while register the user
const validateRegistration = (data) => {
    const schema = Joi.object({
        username : Joi.string().min(3).max(20).required(),
        email : Joi.string().email().lowercase().required(),
        password : Joi.string().min(6).required(),
        role : Joi.string().required(),
    })
    return schema.validate(data);
}

// validation while login the user
const validateLogin = (data) => {
    const schema = Joi.object({
        username : Joi.string().min(3).max(20).required(),
        password : Joi.string().min(6).required(),
    })
      return schema.validate(data);
}

// validation while posting the job
const validateJobPosting = (data) => {
    const schema = Joi.object({
        title : Joi.string().trim().required().min(1),
        description : Joi.string().required(),
        company : Joi.string().required(),
        location : Joi.string().required(),
        salary : Joi.string(),
        jobType : Joi.string(),
        skillsRequired: Joi.array().items(Joi.string()).required(),
        uniqueIdentifier : Joi.string()
    })
    return schema.validate(data)
}

// validation while applying for job
const validateApplyingOnJob = (data) => {
    const schema = Joi.object({
        job : Joi.string().required(),
    })
    return schema.validate(data)
}

module.exports = {validateRegistration, validateLogin,validateJobPosting, validateApplyingOnJob};
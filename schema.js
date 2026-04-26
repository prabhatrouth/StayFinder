const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow("", null),
    image: Joi.any(),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required(),

    // 🔥 OPTIONAL FOR UPDATE
    category: Joi.string().optional(),

    lat: Joi.number().optional(),
    lng: Joi.number().optional()
  }).required()
});
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	points: { type: Number, default: 10 },
	verified: { type: Boolean, default: false },
	books: [{ type: String }],
	referralCode: {
		type: String,
		unique: true,
		required: true,
	  },
	referredBy: {
		type: String,
		default: null,
	  },
	  deviceId: {
		type: String,
		required: true,
		unique: true // optional, but helpful
	  }
	  
});

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
		expiresIn: "7d",
	});
	return token;
};

const User = mongoose.model("user", userSchema);

const validate = (data) => {
	const schema = Joi.object({
		firstName: Joi.string().required().label("First Name"),
		lastName: Joi.string().required().label("Last Name"),
		email: Joi.string().email().required().label("Email"),
		password: passwordComplexity().required().label("Password"),
		referredBy: Joi.string()
		.length(8)
		.optional()
		.allow(null, "")
		.label("Referral Code"),
		deviceId: Joi.string().required().label("Device ID"),
	});
	return schema.validate(data);
};

module.exports = { User, validate };
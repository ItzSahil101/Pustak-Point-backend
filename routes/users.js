const router = require("express").Router();
const { User, validate } = require("../models/userModel");
const Token = require("../models/token");
const crypto = require("crypto");
const sendEmail = require("../controllers/sendEmail");
const bcrypt = require("bcrypt");
const genRefer = require("../controllers/generateRefer");

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    // Check if user with this email already exists
    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res.status(409).send({ message: "User with given email already exists!" });

    // Check if deviceId is already registered
    const existingDevice = await User.findOne({ deviceId: req.body.deviceId });
    if (existingDevice)
      return res.status(403).send({ message: "Account already created from this device." });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    user = new User({
      ...req.body,
      password: hashPassword,
      referralCode: genRefer(req.body.email),
      referredBy: req.body.referredBy || null,
    });

    if (user.referredBy) {
      const referrer = await User.findOne({ referralCode: user.referredBy });
      if (referrer) {
        referrer.points += 5;
        await referrer.save();
      }
    }

    await user.save();

    const token = new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    });
    await token.save();

    const url = `${process.env.BASE_URL}users/${user.id}/verify/${token.token}`;
    await sendEmail(user.email, "Verify Email", url);

    res.status(201).send({ message: "An Email sent to your account. Please verify." });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});


router.get("/:id/verify/:token/", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "Invalid link" });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ message: "Invalid link" });

    await User.updateOne({ _id: user._id }, { verified: true });
    await token.remove();

    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;

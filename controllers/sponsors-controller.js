require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { generatDefaultError } = require("../helpers/common");
const bcrypt = require("bcrypt");
const generator = require("generate-password");
const {
  sendSponsorNewAccountDetails,
} = require("../helpers/emailer/sponsors-new-account");

const prisma = new PrismaClient();

exports.createNewSponsor = async (req, res, next) => {
  try {
    const { firstName, lastName, emailAddress, mobileNumber, company } =
      req.body;

    const _password = await generator.generate({
      length: 10,
      numbers: true,
      lowercase: true,
      uppercase: true,
      symbols: false,
    });

    const _hashedPassword = await bcrypt.hash(_password, 12);

    const _sponsor = await prisma.sponsor.create({
      data: {
        firstName,
        lastName,
        emailAddress,
        mobileNumber,
        password: _hashedPassword,
        company,
      },
    });

    // send email with new password
    await sendSponsorNewAccountDetails(
      _sponsor.firstName,
      _sponsor.lastName,
      _sponsor.emailAddress,
      _password
    );

    res.status(200).send({ msg: "Sponsor account created successfully" });
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};

/**
 * TODO
 *
 * - Get all emails
 * - Get all active members
 * - Get all wolfsburg Members
 * - Send email option
 */

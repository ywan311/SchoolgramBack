import { prisma } from "../../../../generated/prisma-client"
// import { crypto } from "crypto"

const crypto = require("crypto");

export default {
  Mutation: {
    createAccount: async (_, args) => {
      const {
        username,
        email,
        firstName = "",
        lastName = "",
        bio = "",
        password = "",
        salt = ""
      } = args;
      const exists = await prisma.$exists.user({
        OR: [
          {
            username
          },
          { email }
        ]
      });
      if (exists) {
        throw Error("This username / email is already taken");
      } else {
        console.log("Success");
      }
      crypto.randomBytes(32, function (err, buffer) {
 
          crypto.pbkdf2(
            password,
            buffer.toString("base64"),
            10000,
            64,
            "sha512",
            async (err, hashed) => {
                let pwhashed = hashed.toString("base64");
                let salted = buffer.toString("base64");
                await prisma.createUser({
                  username,
                  email,
                  firstName,
                  lastName,
                  bio,
                  password: pwhashed,
                  salt: salted,
                });
              }
            )
      })
      return true;
    }   
  }
};
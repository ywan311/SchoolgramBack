import {
  generateSecret,
  sendSecretMail
} from "../../../utils";
import {
  prisma
} from "../../../../generated/prisma-client";

const crypto = require("crypto");

export default {
  Mutation: {
    requestSecret: async (_, args) => {
      const {
        email,
        password,
        
      } = args;
      const loginSecret = generateSecret();
      const user = await prisma.user({
        email
      });
      const regacysalt = user.salt
      console.log(regacysalt);

      const pwChecked = crypto.pbkdf2(
         password,
         regacysalt,
         10000,
         64,
         "sha512",
        async (err, hashed) => {
          let checked;
          let pwhashed = hashed.toString("base64");
          console.log(pwhashed);
          console.log(user.password)
           if (user.password === pwhashed) {
                await sendSecretMail(email, loginSecret);
            await prisma.updateUser({
              data: {
                loginSecret
              },
              where: {
                email
              }
            });
            checked= true;
            return checked;
          }else{
            throw Error("비밀번호가 맞지 않습니다.");
            checked=false;
            return checked;
          }
          return checked;
         }
       )

          console.log(pwChecked);
          if(pwChecked)
          return true;
          else
          return false;
      }
    }
  };
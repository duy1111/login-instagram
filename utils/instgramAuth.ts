import passport from "passport";
import { Strategy as InstagramStrategy, Profile } from "passport-instagram";
import { StatusCodes } from "http-status-codes";
import ApiError from "./ApiError";
import { User } from "../models/user.model";
import dotenv from "dotenv";

dotenv.config({ path: "../config/config.env" });

export const instagramPassport=passport.use(
  new InstagramStrategy(
    {
      clientID: `${process.env.INSTAGRAM_APP_ID}`,
      clientSecret: `${process.env.INSTAGRAM_APP_SECRET}`,
      callbackURL: `${process.env.APP_URL}/api/v1/auth/instagram/callback`,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: (error: any, user?: any, info?: any) => void
    ) => {
      try {
        if (!profile) {
          return done(
            new ApiError(
              {
                en: "Instagram authentication failed",
                ar: "فشل المصادقة من أنستجرام",
              },
              StatusCodes.BAD_REQUEST
            )
          );
        }

        const existingUser = await User.findOne({
          email: profile.emails?.[0]?.value,
        });

        if (existingUser) {
          console.log("user is: ", existingUser);
          const token = existingUser.createToken();
          return done(null, { user: existingUser, token });
        }

        // User doesn't exist, create a new user
        const newUser = new User({
          email: profile.emails?.[0]?.value,
          name: profile.displayName,
          password: profile.id, // You may want to handle this differently
          image: profile.photos?.[0]?.value,
          registrationType: "email",
        });

        const user = await newUser.save();
        return done(null, { user, token: user.createToken() });
      } catch (error: any) {
        throw new ApiError(
          { en: error.message, ar: error.message },
          StatusCodes.BAD_REQUEST
        );
      }
    }
  )
);

import passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { StatusCodes } from 'http-status-codes';
import ApiError from './ApiError';
import { User} from '../models/user.model';
import dotenv from "dotenv";
dotenv.config({ path: "../config/config.env" });

export const twitterPassport = passport.use(
  new TwitterStrategy(
    {
      consumerKey: `0F7UEYXsDJmGnbf3R5ZAQMy9G`,
      consumerSecret: `yYvtfgozfGd03TFPpUPI44IsCo1nOg4WGziIZ0GHXOfPpBjBzD`,
      //accessToken: '1716813998698659840-nxausr07bUgEpiVtfivEwsosQpIgXk',
      //accessTokenSecret: 'vCJi4VgEX9CFVl9z4Gnh5A2foURWol1X7ADS35rgr1zL7',
      callbackURL: `${process.env.APP_URL}/api/v1/auth/twitter/callback`,
    },
    async ( token, tokenSecret, profile, done) => {
      try {
        if(!profile) {
          return new ApiError({
            en: 'Twitter authentication failed',
            ar: 'فشل المصادقة من تويتر'
          }, StatusCodes.BAD_REQUEST);
        }
        const existingUser = await User.findOne({ email: profile.emails?.[0]?.value });

        if (existingUser) {
          console.log('user is: ', existingUser)
          const token = existingUser.createToken();
          return done(null,{user: existingUser, token});
        }

        // User doesn't exist, create a new user
        const newUser = new User({
          email: profile.emails?.[0]?.value,
          name: profile.displayName,
          password: profile.id, // You may want to handle this differently
          image: profile.photos?.[0]?.value,
          registrationType: 'email',
        });

        const user = await newUser.save();
        return done(null,{user, token: user.createToken()}) ;
      } catch (error:any) {
        throw new ApiError({ en: error.message, ar: error.message }, StatusCodes.BAD_REQUEST);
      }
      
    }
  )
);

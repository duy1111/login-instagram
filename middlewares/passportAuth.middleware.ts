import {googlePassport} from '../utils/googleAuth';
import { facebookPassport } from '../utils/facebookAuth';
import { twitterPassport } from '../utils/twitterAuth';
import { instagramPassport } from '../utils/instgramAuth';


export const authenticateWithGoogle = googlePassport.authenticate('google', { scope: ['profile', 'email'] });

export const authenticateWithFacebook = facebookPassport.authenticate('facebook', { scope: ['profile', 'email'] });

export const authenticateWithInstagram = instagramPassport.authenticate('instagram', { scope: ['profile', 'email'] });

export const authenticateWithTwitter = twitterPassport.authenticate('twitter', { scope: ['profile', 'email'] });

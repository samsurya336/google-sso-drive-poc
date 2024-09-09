import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
const GOOGLE_CLIENT_ID = '';
const GOOGLE_CLIENT_SECRET = '';
//initialize 
passport.use(
  new GoogleStrategy(
    {

      clientID: GOOGLE_CLIENT_ID, // google client id
      clientSecret: GOOGLE_CLIENT_SECRET, // google client secret
      // the callback url added while creating the Google auth app on the console
      callbackURL: "http://localhost:6001/api/auth/google/callback", 
      passReqToCallback: true,
      accessType: 'offline', // This is required to get a refresh token
      prompt: 'consent', // This forces the consent screen to be shown, which is necessary for the refresh token
    },

// returns the authenticated email profile
 async function (request, accessToken, refreshToken, profile, done) {
  console.log('accessToken :: ', accessToken)
  console.log('refreshToken :: ', refreshToken)
  console.log('profile :: ', profile)
 // you can write some algorithms here based on your application models and all
 // an example - not related to this application

/*
   const exist = await User.findOne({ email: profile["emails"][0].value });
   if (!exist) {
        await User.create({
        email: profile["emails"][0].value,
          fullName: profile["displayName"],
          avatar: profile["photos"][0].value,
          username: profile["name"]["givenName"],
          verified: true,
        });
      }
    const user = await User.findOne({ email: profile["emails"][0].value });
 return done(null, user);
*/
     return done(null, profile);
    }
  )
);

// function to serialize a user/profile object into the session
passport.serializeUser(function (user, done) {
  done(null, user);
});

// function to deserialize a user/profile object into the session
passport.deserializeUser(function (user, done) {
  done(null, user);
});
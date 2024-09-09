import { Router } from "express";
import passport from "passport";
const authRoutes = Router();

authRoutes.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile", "https://www.googleapis.com/auth/drive"],
  })
);

// Call back route
authRoutes.get(
  "/google/callback",
  passport.authenticate("google", {
    access_type: "offline",
    scope: ["email", "profile", "https://www.googleapis.com/auth/drive"],
  }),
  (req, res) => {
    console.log('/google/callback', res.user);
    if (!req.user) {
      res.status(400).json({ error: "Authentication failed" });
    }

    // const payload = JSON.stringify({
    //   type: 'authorized_user',
    //   client_id: GOOGLE_CLIENT_ID,
    //   client_secret: GOOGLE_CLIENT_SECRET,
    //   refresh_token: client.credentials.refresh_token,
    // });
    // return user details
    res.status(200).json(req.user);
  }
);

export default authRoutes;
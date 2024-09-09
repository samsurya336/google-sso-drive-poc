import express from 'express';
import authRoutes from './feature/auth/auth.routes.js';
import passport from "passport";
import session from "express-session";
import "./feature/auth/strategy/google-oAuth.strategy.js";
import driveRoutes from './feature/google-drive/google-drive.routes.js';

const app = express();
// TEST
// a middleware to access json data
app.use(express.json());

// use the session middleware
app.use(
  session({
    secret: '1234560987', // session secret
    resave: false,
    saveUninitialized: false,
  })
);

// initialize passport and session
app.use(passport.initialize());
app.use(passport.session());

// Mount routes
app.get("/", (_, res) => {
  res.send(`Yeah I'm alive 🚀`);
});

app.use("/api/auth", authRoutes);
app.use("/api/drive", driveRoutes);


// Start the server
const port = process.env.PORT || 6001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
import env from "./env";

import asyncHandler from "express-async-handler";
import cookieParser from "cookie-parser";
import passport from "passport";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import nextApp from "next";

import Bugsnag from '@bugsnag/js'
import BugsnagPluginExpress from '@bugsnag/plugin-express'

import * as helpers from "./handlers/helpers";
import * as links from "./handlers/links";
import * as auth from "./handlers/auth";
import routes from "./routes";
import { stream } from "./config/winston";

import "./cron";
import "./passport";

const port = env.PORT;
const app = nextApp({ dir: "./client", dev: env.isDev });
const handle = app.getRequestHandler();

Bugsnag.start({
  apiKey: env.BUGSNAG_API_KEY,
  plugins: [BugsnagPluginExpress],
  releaseStage: env.BUGSNAG_RELEASE_STAGE
})

app.prepare().then(async () => {
  const server = express();
  const middleware = Bugsnag.getPlugin('express')

  // Bugsnag: Capture errors in downstream middleware
  if (middleware) server.use(middleware.requestHandler)

  server.set("trust proxy", true);

  if (env.isDev) {
    server.use(morgan("combined", { stream }));
  }

  server.use(helmet({ contentSecurityPolicy: true }));
  server.use(cookieParser());
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
  server.use(passport.initialize());
  server.use(express.static("static"));
  server.use(helpers.ip);

  server.use(asyncHandler(links.redirectCustomDomain));

  server.use("/api/v2", routes);

  server.get(
    "/reset-password/:resetPasswordToken?",
    asyncHandler(auth.resetPassword),
    (req, res) => app.render(req, res, "/reset-password", { token: req.token })
  );

  server.get(
    "/verify-email/:changeEmailToken",
    asyncHandler(auth.changeEmail),
    (req, res) => app.render(req, res, "/verify-email", { token: req.token })
  );

  server.get(
    "/verify/:verificationToken?",
    asyncHandler(auth.verify),
    (req, res) => app.render(req, res, "/verify", { token: req.token })
  );

  server.get("/:id", asyncHandler(links.redirect(app)));

  // Bugsnag: This handles any errors that Express catches
  if (middleware) server.use(middleware.errorHandler)

  // Error handler
  server.use(helpers.error);

  // Handler everything else by Next.js
  server.get("*", (req, res) => handle(req, res));

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});

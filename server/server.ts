import env from "./env";

import asyncHandler from "express-async-handler";
import cookieParser from "cookie-parser";
import passport from "passport";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import Bugsnag from '@bugsnag/js'
import BugsnagPluginExpress from '@bugsnag/plugin-express'

import * as helpers from "./handlers/helpers";
import * as links from "./handlers/links";
import routes from "./routes";
import { stream } from "./config/winston";

import "./cron";
import "./passport";

const port = env.PORT;

Bugsnag.start({
  apiKey: env.BUGSNAG_API_KEY,
  plugins: [BugsnagPluginExpress],
  releaseStage: env.BUGSNAG_RELEASE_STAGE
})

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

  server.get("/:id", asyncHandler(links.redirect));

  // Bugsnag: This handles any errors that Express catches
  if (middleware) server.use(middleware.errorHandler)

  // Error handler
  server.use(helpers.error);

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });

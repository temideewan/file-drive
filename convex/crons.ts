import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";
const crons = cronJobs();

crons.monthly(
  "delete old files marked for deletion",
  { day: 27, minuteUTC: 0, hourUTC: 1 }, // every minute
  internal.files.deleteAllFiles
);

export default crons;

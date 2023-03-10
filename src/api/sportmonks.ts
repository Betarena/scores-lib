import { FIXTURE_STATUS_TYPES } from "../../types/sportmonks";

export const FIXTURE_NOT_START_OPT: FIXTURE_STATUS_TYPES[] = [
  "CANCL",
  "POSTP",
  "INT",
  "NS",
  "TBA",
  "SUSP",
];
export const FIXTURE_NO_VOTES_OPT: FIXTURE_STATUS_TYPES[] = [
  "FT",
  "AET",
  "FT_PEN",
  "CANCL",
  "POSTP",
  "INT",
  "ABAN",
  "SUSP",
  "AWARDED",
  "WO",
];
export const FIXTURE_LIVE_TIME_OPT: FIXTURE_STATUS_TYPES[] = [
  "LIVE",
  "HT",
  "ET",
  "BREAK",
  "PEN_LIVE",
];
export const FIXTURE_FULL_TIME_OPT: FIXTURE_STATUS_TYPES[] = [
  "FT",
  "AET",
  "FT_PEN",
];
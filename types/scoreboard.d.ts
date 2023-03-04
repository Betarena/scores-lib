//#region IMPORTS
// <imports-go-here>

import {
  B_H_HF,
  B_H_HF_AG,
  B_H_SFL,
  B_H_SFSD,
  B_H_SFST,
  B_H_ST,
  DataStats,
  Round,
  ScoreboardTranslations,
  Scores,
  ScoresTournamentsUrls,
  Time
} from "./hasura"

//#endregion IMPORTS

//#region FINAL TARGET DATA DECLARATIONS

/**
 * ==========================================
 * FINAL DATA OBJECTS
 * ========================================== 
*/

// IMPORTANT [DO NOT REMOVE] NAMING:
// NOTE: please follow the following naming structure:
// NOTE: B_<type-shortcode-for-target-data>_<type-target-data-type>
// ----
// For example: for the Livescores-V2 widget data declaration target:
// -> EX: (long) Betarena_LivescoresV2_Translations => (final) B_LS2_T
// -> EX: (long) Betarena_LivescoresV2_Data => (final) B_LS2_D
// ----
// export interface B_LS2_T { ...
// export interface B_LS2_D { ...

// <declarations-go-here>

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface B_FS_T 
  extends ScoreboardTranslations {
  lang?: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface B_FS_D 
  extends SF_Info {
  // empty
}

//#endregion FINAL TARGET DATA DECLARATIONS

//#region HASURA TARGET [QUERY] DECLARATIONS

/**
 * ==========================================
 * HASURA DB TYPES [QUERIES]
 * ========================================== 
*/

// IMPORTANT [DO NOT REMOVE] NAMING:
// NOTE: please follow the following naming structure:
// NOTE: B_H_<type-shortcode-for-target-data>_Q
// ----
// For example: for the Livescores-V2 widget data (query) declaration target:
// -> EX: (long) Betarena_Hasura_HistoricFixtures_LivescoresV2_Query => (final) B_H_HF_LSV2_Q
// -> EX: (long) Betarena_Hasura_SurgicalJson_Scores_Football_Leagues => (final) B_H_SJ_SFL
// ----
// export interface B_H_HF_LSV2_Q { ...
// export interface B_H_SJ_SFL { ...

// <declarations-go-here>

export interface B_H_SJ_HF 
  extends B_H_HF {
  stats_j?:            DataStats
  localteam_id_j?:     number
  visitorteam_id_j?:   number
  time_j?:             Time
  round_j?:            Round
  scores_j?:           Scores
  localteam_short_code_j?: string
  visitorteam_short_code_j?: string
}

export interface B_H_SJ_SFL 
  extends B_H_SFL {
  image_path_j?:       string
}

export interface B_H_FS_Q {
  scores_football_seasons_details: B_H_SFSD[]
  scores_tournaments:              B_H_ST[]
  historic_fixtures_aggregate:     B_H_HF_AG
  historic_fixtures:               B_H_SJ_HF[]
  // NOTE: league-img
  scores_football_leagues:         B_H_SJ_SFL[]
  // NOTE: translations
  scores_fixture_scoreboard_translations: B_H_SFST[]
}

//#endregion HASURA TARGET [QUERY] DECLARATIONS

//#region CUSTOM - [ONE-OFF] [SPECIFIC] DECLARATIONS

/**
 * ==========================================
 * CUSTOM TYPES
 * ==========================================
*/

// IMPORTANT [DO NOT REMOVE] NAMING:
// NOTE: please follow the following naming structure:
// ----
// NOTE: <type-shortcode-for-target-data>_C_<type-target-data-type>
// For example: for the Livescores-V2 widget data declaration target:
// -> EX: LivescoresV2_Cache_League => (final) LS2_C_League
// -> EX: LivescoresV2_Cache_FixtureDateGroup => (final) LS2_C_FixtureDateGroup
// ----
// export interface LS2_C_League { ...
// export interface LS2_C_FixtureDateGroup { ...

// <declarations-go-here>

export interface SF_Info {
  id?: number
  teams?: {
    home: SF_Team
    away: SF_Team
  }
  league_logo?: string
  league_urls?: ScoresTournamentsUrls
  // NOTE: Scoreboard Before the match (fixture_scoreboard);
  name?:   string                 // [hasura] Tournament name (Link) | scores_tournaments/urls
  round?:  number                 // [hasura] historic_fixtures/round_name
  home_team_name?: string         // [hasura] historic_fixtures/home_team_name
  home_team_logo?: string         // [hasura] historic_fixtures/home_team_logo
  home_team_short_code?: string   
  away_team_name?: string         // [hasura] historic_fixtures/away_team_name
  away_team_logo?: string         // [hasura] historic_fixtures/away_team_logo
  away_team_short_code?: string
  counter?: string                // [] (Just available 24 hours before the match)
  fixture_time?: string           // [hasura] historic_fixtures/time
  _1x2?: SF_Odds  // [firebase] https://betarena-rv-6b382.firebaseio.com/odds
  _1x2_link?: string              // [sportbook-cache] sportsbook_details/data
  // NOTE: Scoreboard during the match;
  score?: string                  // [firebase] Live Score Now Firebase
  minute?: number                 // [firebase] Live Score Now Firebase
  // NOTE: Scoreboard after the match;
  score_post?: SF_Scores // [hasura] JSON($path) historic_fixtures/data/scores
  status?: string                 // [hasura] historic_fixtures/status
  post_date?: string              // [hasura] historic_fixtures/time
} export interface SF_Team {
  name?: string
  score?: number
} export interface SF_Odds {
  home?: number | string
  draw?: number | string
  away?: number | string
} export interface SF_Scores {
  ht_score?: string
  et_score?: string
  ps_score?: string
}

//#endregion CUSTOM - [ONE-OFF] [SPECIFIC] DECLARATIONS
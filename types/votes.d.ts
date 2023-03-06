//#region IMPORTS
// <imports-go-here>

import { B_H_HF, B_H_SFVT, B_H_SGT, B_H_WFMV, FixtureVotesTranslations, WidgetsNoDataAvailable } from "./hasura";

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

export interface B_VOT_T 
  extends FixtureVotesTranslations, 
  WidgetsNoDataAvailable {
  lang?: string
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

export interface B_H_VOT_SJ_HF 
  extends B_H_HF {
  status_j?: string
}

export interface B_H_VOT_Q {
  historic_fixtures?:            B_H_VOT_SJ_HF[];
  widget_featured_match_votes?:  B_H_WFMV[]
  // NOTE: translations
  scores_general_translations?:  B_H_SGT[]
  scores_fixture_voting_translations?: B_H_SFVT[]
}

export interface B_H_VOT_M {
  update_widget_featured_match_votes_by_pk: B_H_WFMV;
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

export interface VOT_Fixture {
  time?:           string
  home_team_logo?: string
  away_team_logo?: string
  match_votes?:    B_H_WFMV
  _1x2?:           VOT_Odds
  probabilities?:  VOT_Odds
} export interface VOT_Odds {
  home?: number | string
  draw?: number | string
  away?: number | string
}

//#endregion CUSTOM - [ONE-OFF] [SPECIFIC] DECLARATIONS
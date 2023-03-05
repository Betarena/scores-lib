//#region IMPORTS
// <imports-go-here>
//#endregion IMPORTS

import { B_H_HF, B_H_HF_AG, B_H_SFSD, B_H_SFST_2, B_H_SGT, FixtureStatsTranslations, StatsDatum, WidgetsNoDataAvailable } from "./hasura"

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
export interface B_ST_T 
  extends FixtureStatsTranslations, 
  WidgetsNoDataAvailable {
  lang?: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface B_ST_D 
  extends ST_Fixture {
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

export interface B_H_ST_SJ_HF 
  extends B_H_HF {
  localteam_id_j?:      number
  visitorteam_id_j?:    number
  stats_j?:             StatsDatum[]
  status_j?:            string
}

export interface B_H_ST_Q {
  scores_football_seasons_details: B_H_SFSD[]
  historic_fixtures_aggregate:     B_H_HF_AG
  historic_fixtures:               B_H_ST_SJ_HF[]
  // NOTE: translations
  scores_general_translations?:    B_H_SGT[]
  scores_fixture_stats_translations: B_H_SFST_2[]
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

export interface ST_Fixture {
  // NOTE:IMPORTANT The fixture_statistics widget is only available once the fixture starts. 
  // NOTE:IMPORTANT If there are fixtures without statistics, the widget should not be shown.

  id?:          number
  status?:      string
  home?:        ST_Incident_Team  // [custom] home-team
  away?:        ST_Incident_Team  // [custom] away-team
  stats?:       StatsDatum[]  // [hasura] stats

  // NOTE: DURING the fixture:
  // NOTE: Frebase endpoint
  // livescore_now/stats/data

  // NOTE: AFTER the fixture is ended:
  // NOTE: Hasura endpoint Prod:
  // historic_fixtures/stats/data
  
} export interface ST_Incident_Team {
  team_name?:     string
  team_logo?:     string
  team_id?:       number
}

//#endregion CUSTOM - [ONE-OFF] [SPECIFIC] DECLARATIONS
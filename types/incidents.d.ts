//#region IMPORTS
// <imports-go-here>

import { B_H_HF, B_H_HF_AG, B_H_SFSD, B_H_SGT, B_H_SIT, EventsDatum, IncidentsTranslations, Scores, WidgetsNoDataAvailable } from "./hasura"

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
export interface B_INC_T
  extends IncidentsTranslations, 
  WidgetsNoDataAvailable {
  lang?: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface B_INC_D
  extends INC_Fixture {
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

export interface B_H_INC_SJ_HF 
  extends B_H_HF {
  localteam_id_j?:      number
  visitorteam_id_j?:    number
  status_j?:            string
  events_j?:            EventsDatum[]
  scores_j?:            Scores
}

export interface B_H_INC_Q {
  scores_football_seasons_details: B_H_SFSD[]
  historic_fixtures_aggregate:     B_H_HF_AG
  historic_fixtures:               B_H_INC_SJ_HF[]
  // NOTE: translations
  scores_general_translations?:    B_H_SGT[]
  scores_incidents_translations:   B_H_SIT[]
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

export interface INC_Fixture
  extends EventsDatum {
  // NOTE:IMPORTANT The fixture_incident widget is only available once the fixture starts. 
  // NOTE:IMPORTANT If there are fixtures without incidents, the widget should not be shown.

  id?:          number
  status?:      string
  score_post?:  INC_Scorebaord_Scores // [hasura] JSON($path) historic_fixtures/data/scores
  home?:        INC_Team  // home-team events-only
  away?:        INC_Team  // away-team events-only
  events?:      EventsDatum[]

  // NOTE: DURING the fixture:
  // NOTE: Frebase endpoint
  // livescore_now/events/data

  // NOTE: AFTER the fixture is ended:
  // NOTE: Hasura endpoint Prod:
  // historic_fixtures/events/data
} export interface INC_Team {
  team_name?:     string
  team_logo?:     string
  team_id?:       number
} export interface INC_Scorebaord_Scores {
  ht_score?: string
  ft_score?: string
  et_score?: string
  ps_score?: string
}

//#endregion CUSTOM - [ONE-OFF] [SPECIFIC] DECLARATIONS
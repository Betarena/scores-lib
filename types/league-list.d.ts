//#region IMPORTS
// <imports-go-here>
//#endregion IMPORTS

import { B_H_LFC, B_H_SGT, B_H_SLL, B_H_SLLT, B_H_ST, ScoresTournamentsUrls } from "./hasura"

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

export interface B_LEGL_D {
  // [GEO]
  geo?: string
  // [ℹ] TOP 7 leagues for [THIS GEO]
  top_geo_leagues?: {
    country_id?:     number
    country_name?:   string
    image_path?:     string
    league_id?:      number
    league_name?:    string
    logo_path?:      string
    type?:           string
    urls?:          ScoresTournamentsUrls
  }[]
  // [ℹ] ALL LEAGUES
  all_leagues_list?: {
    country_id?:     number
    country_name?:   string
    image_path?:     string
    league_id?:      number
    league_name?:    string
    logo_path?:      string
    type?:           string
    urls?:          ScoresTournamentsUrls
  }[]
}

export interface B_LEGL_T {
  lang?: string
  translations?: {
    search_form?:          string
    top_leagues?:          string
    leagues_by_country?:   string
    widget_title?:         string
    competitions_results?: string
    countries_results?:    string
    full_list?:            string
    no_results?:           string
    hide?:                 string
  }
  all_leagues_list?: {
    country_id:       number
    country_name:     string
    image_path:       string
    league_id:        number
    league_name:      string
    logo_path:        string
    type:             string
    urls?:            ScoresTournamentsUrls
  }[]
  unique_county_list?: {
    country_id:       number
    country_name:     string
    image_path:       string
  }[]
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

export interface B_H_LEGL_Q {
  scores_league_list:                B_H_SLL[]
  leagues_filtered_country:          B_H_LFC[]
  scores_leagues_list_translations:  B_H_SLLT[]
  scores_tournaments:                B_H_ST[]
  scores_general_translations:       B_H_SGT[]
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

//#endregion CUSTOM - [ONE-OFF] [SPECIFIC] DECLARATIONS
//#region IMPORTS
// <imports-go-here>
//#endregion IMPORTS

import { B_H_HF, B_H_HF_AG, B_H_LM, B_H_SET, B_H_SFC, B_H_SH, B_H_SSF, B_H_SSH, B_H_SST, B_H_ST, Urls } from "./hasura"

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

export interface B_SAP_HP_T 
  extends B_H_SSH {
  lang?:         string
  hreflang?:     B_H_SH[]
} 

export interface B_SAP_TP_T
  extends B_H_SST {
  lang?:         string
  hreflang?:     B_H_SH[]
}

export interface B_SAP_TP_D {
  url?:            string
  lang?:           string
  data?:           B_H_ST
  alternate_data?: B_H_ST[]
}

export interface B_SAP_FP_T
  extends B_H_SSF {
  lang?:         string
  hreflang?:     B_H_SH[]
}

export interface B_SAP_FP_D {
  league_id?:      number
  data?:           Fixtures_Page_Data
  alternate_data?: Urls
} export interface Fixtures_Page_Data {
  sport_typ?:       string;   // (breadcrumbs & URL) [translations]
  country_id?:      number;   // (breadcrumbs) = "league": { "data": { "country_id": 6783} = scores_football_countries = scores_general_translations = countries 
  league_name?:     string;   // (breadcrumbs)
  // status?: string          // (Definition if the fixture is visible or not)
  // sport: string            // historic_fixtures / sport
  widgets?:         string[]  // (The widgets that will be loaded on this fixtures section) = scores_widgets_list
  home_team_name?:  string    // historic_fixtures / home_team_name
  away_team_name?:  string    // historic_fixtures / away_team_name
  id?:              number    // historic_fixtures / id
  fixture_day?:     string    // historic_fixtures / fixture_day
  venue_name?:      string    // historic_fixtures / "venue": {"data": { "name": "Stadiumi Liri Ballabani"}
  venue_city?:      string    // = historic_fixtures / "venue": {"data": { "city": "Burreli"}
}

export interface B_SAP_D1 {
  country_id?: number
  translations?: { [key: string]: string }
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

export interface B_H_SAP_SJ_HF 
  extends B_H_HF {
  venue_name_j?:     string
  venue_city_j?:     string
  country_id_j?:     number
}

export interface B_H_SAP_Q {
  scores_hreflang:            B_H_SH[]
  scores_seo_homepage:        B_H_SSH[]
  scores_seo_tournaments:     B_H_SST[]
  scores_tournaments:         B_H_ST[]

  historic_fixtures_aggregate: B_H_HF_AG
  historic_fixtures:           B_H_SAP_SJ_HF[]

  links_map_aggregate:        B_H_HF_AG
  links_map:                  B_H_LM[]
    
  scores_endpoints_translations: B_H_SET[]
  scores_football_countries:  B_H_SFC[]
  scores_seo_fixtures:        B_H_SSF[]
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
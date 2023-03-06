//#region IMPORTS
// <imports-go-here>

import { B_H_SD, B_H_SFL, B_H_SFSD, B_H_SGT, B_H_ST, B_H_SWLIT, B_H_SWTAT, B_H_WLIT, ScoresFootballLeaguesSeasonElement, WidgetLeagueInfo2Data, WidgetsNoDataAvailable, WidgetTournamentAboutData } from "./hasura"
import { B_SPT_D } from "./sportbook"

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

export interface B_LEG_T {
  lang: string
  country: string
  name: string
}

export interface B_LEG_D {
  url: string
  lang: string
  data: LEG_Info
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

export interface B_H_LEG_Q {
  scores_tournaments:                           B_H_ST[]
  scores_football_seasons_details:              B_H_SFSD[]
  scores_football_leagues:                      B_H_SFL[]
  sportsbook_details:                           B_H_SD[]
  scores_widget_league_info_translations:       B_H_SWLIT[]
  widget_league_info_translations:              B_H_WLIT[]
  scores_widget_tournament_about_translations:  B_H_SWTAT[]
  scores_general_translations:                  B_H_SGT[]
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

export interface LEG_Info {
  name:                   string    // name =               endpoint: scores_football_leagues          | column: "name"
  country:                string    // country =            endpoint: scores_football_leagues          | column: "country" (Replace by the correct translation using the general translation endpoint: "scores_general_translations"
  image_path:             string    // image_path =         endpoint: scores_football_leagues          | column: "data"
  // betting_site_logo?:  string    // betting_site_logo =  endpoint: sportsbook_details               | column: "data" (link with no-follow)
  // beting_cta_link?:    string    // beting_cta_link =    endpoint: sportsbook_details               | column: "data" (link with no-follow)
  country_logo?:          string    // country_logo =       endpoint: scores_football_leagues          | column: "country" (image_path)
  // [🢃] many
  seasons:                LEG_SeasonData[]
  translation:            LEG__Translations
  sportbook_detail?:      B_SPT_D
  seo_content?:           string
} export interface LEG__Translations 
  extends WidgetLeagueInfo2Data,
  WidgetTournamentAboutData, 
  WidgetsNoDataAvailable {
  stats?:     string;
  teams?:     string;
  content?:   string;
  overview?:  string;
  following?: string;
} export interface LEG_SeasonData 
  extends ScoresFootballLeaguesSeasonElement {
  // default extend [?]                // seasons =            endpoint: scores_football_leagues         | column: "seasons"
  number_of_clubs:  number | string    // number_of_clubs =    endpoint: scores_football_seasons_details | column: "data_stats"
  start_date:       Date               // start_date =         endpoint: scores_football_seasons_details | column: "start_date"
  end_date:         Date               // end_date =           endpoint: scores_football_seasons_details | column: "end_date"
  // [ℹ] extension of league_info_2 (extra)
  goals?:           number             // goals =              endpoint: scores_football_seasons_details | column: "number_of_goals"
  avg_goals?:       number             // avg_goals =          endpoint: scores_football_seasons_details | column: "goals_scored": {"all": 1.45},"
  win_p?:           number             // win_p =              endpoint: scores_football_seasons_details | column: "win_percentage": { "all": 35.23}"
  avg_player_r?:    number             // avg_player_r =       endpoint: scores_football_seasons_details | column: "avg_player_rating"
}

//#endregion CUSTOM - [ONE-OFF] [SPECIFIC] DECLARATIONS
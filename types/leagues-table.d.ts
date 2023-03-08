//#region IMPORTS
// <imports-go-here>
//#endregion IMPORTS

import { B_H_CCLSP, B_H_LFC, B_H_SFL, B_H_SFS, B_H_SFT, B_H_SSHWT } from "./hasura"

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

export interface B_LEGT_D {
  lang?: string
  top_leagues_table_data?: LEGT_Table[]
}

export interface B_LEGT_T {
  top_leagues_table_data?: LEGT_Table[]
  translations?: LEGT_Translation
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

export interface B_H_LEGT_Q {
  leagues_filtered_country: B_H_LFC[]
  color_codes_league_standings_positions: B_H_CCLSP[]
  scores_standings_home_widget_translations: B_H_SSHWT[]
  scores_football_leagues: B_H_SFL[]
  scores_football_standings: B_H_SFS[]    
  scores_football_teams: B_H_SFT[]
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


export interface LEGT_Table {
  season_league_id?: string
  season_league_name?: string
  season_league_logo?: string
  season_league_teams?: Array < LEGT_Team >
} export interface LEGT_Team {
  position?: number
  team_logo?:  string
  team_name?: string
  games_played?: string
  points?: string
  color_code?: string
}

export interface LEGT_Translation {
  lang: string
  games: string
  points: string
  title: string
}

//#endregion CUSTOM - [ONE-OFF] [SPECIFIC] DECLARATIONS
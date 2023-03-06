//#region IMPORTS
// <imports-go-here>

import { B_H_CCLSP, B_H_SFL, B_H_SFS, B_H_SFSH, B_H_SFT, B_H_SGT, B_H_STS, B_H_STSH, B_H_SWST, ScoresTournamentsType, WidgetsNoDataAvailable } from "./hasura"

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
export interface B_STA_T 
  extends B_H_SWST { 
  no_data_t?: WidgetsNoDataAvailable
}

export interface B_STA_D {
  league_id?:  number
  seasons?:    STA_Season[]
  comp_typ?:   ScoresTournamentsType
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

export interface B_H_STA_Q {
  scores_football_leagues:              B_H_SFL[]
  scores_football_standings:            B_H_SFS[]    
  scores_football_standings_history:    B_H_SFSH[]
  scores_football_teams:                   B_H_SFT[]
  scores_team_statistics:                  B_H_STS[]
  scores_team_statistics_history:           B_H_STSH[]
  scores_widget_standings_translations:     B_H_SWST[]
  color_codes_league_standings_positions:   B_H_CCLSP[]
  scores_general_translations:              B_H_SGT[]
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

export interface STA_Season {
  season_id?:    number
  total?:        STA_Team[]
  home?:         STA_Team[]
  away?:         STA_Team[]
  group?:        boolean
  // group-based-standings types
  group_standings?: STA_Groups[]
} export interface STA_Groups {
  group_name?:   string
  group_round?:  number
  total?:        STA_Team[]
  home?:         STA_Team[]
  away?:         STA_Team[]
} export interface STA_Team {
  team_logo:     string          // >? based on history (constant)
  team_name:     string          // >? based on history (constant)
  color_code:    string          
  position?:     number          // scores_football_standings |"position" if older seasons = scores_football_standings_history
                                 // scores_football_standings |"home +""points" - Use points to determine teams position. If older seasons = scores_football_standings_history
                                 // scores_football_standings |"away +""points" - Use points to determine teams position. If older seasons = scores_football_standings_history
                                  
  points?:       number          // scores_football_standings | "overall" + "points" if older seasons = scores_football_standings_history
                                 // scores_football_standings | "home" + "points" if older seasons = scores_football_standings_history
                                 // scores_football_standings | "away" + "points" if older seasons = scores_football_standings_history

  games_played?: number          // scores_football_standings | "round_name" if older seasons = scores_football_standings_history
                                 // scores_football_standings | "away" + "games_played" if older seasons = scores_football_standings_history
                                 // scores_football_standings | "away" + "games_played" if older seasons = scores_football_standings_history

  won?:          number          // scores_football_standings |  "overall" + "won" if older seasons = scores_football_standings_history
                                 // scores_football_standings | "home" + "won" if older seasons = scores_football_standings_history
                                 // scores_football_standings | "away" + "won" if older seasons = scores_football_standings_history

  draw?:         number          // scores_football_standings |  "overall" + "draw" if older seasons = scores_football_standings_history
                                 // scores_football_standings | "home" + "draw" if older seasons = scores_football_standings_history
                                 // scores_football_standings | "away" + "draw" if older seasons = scores_football_standings_history

  lost?:         number          // scores_football_standings |  "overall" + "lost" if older seasons = scores_football_standings_history
                                 // scores_football_standings | "home" + "lost" if older seasons = scores_football_standings_history
                                 // scores_football_standings | "away" + "lost" if older seasons = scores_football_standings_history

  gs?:           number          // scores_football_standings |  "overall" + "goals_scored" if older seasons = scores_football_standings_history
                                 // scores_football_standings | "home" + "goals_scored" if older seasons = scores_football_standings_history
                                 // scores_football_standings | "away" + "goals_scored" if older seasons = scores_football_standings_history

  ga?:           number          // scores_football_standings |  "overall" + "goals_against" if older seasons = scores_football_standings_history
                                 // Goals Against = scores_football_standings | "home" + "goals_against" if older seasons = scores_football_standings_history
                                 // scores_football_standings | "away" + "goals_against" if older seasons = scores_football_standings_history

  gavg?:         number          // scores_team_statistics    |  "total" or if older seasons = scores_team_statistics_history
                                 // Goal Average = scores_team_statistics |"home" or if older seasons = scores_team_statistics_history
                                 // scores_team_statistics |"away" or if older seasons = scores_team_statistics_history

  cavg?:         number          // scores_team_statistics    |  "avg_corners" or if older seasons = scores_team_statistics_history
                                 // home: ❌
                                 // away: ❌

  ycavg?:        number           // scores_team_statistics    |  "yellow_cards_average" or if older seasons = scores_team_statistics_history (How this data point is populated on this task: https://github.com/Betarena/scores/issues/379)
                                 // home: ❌
                                 // away: ❌

  ov15?:         number          // scores_team_statistics    |  "goal_line > 1_5" or if older seasons = scores_team_statistics_history
                                 // home: ❌ 
                                 // away: ❌

  ov25?:         number          // scores_team_statistics    |  "goal_line > 2_5" or if older seasons = scores_team_statistics_history
                                 // home: ❌
                                 // away: ❌

  winP?:         number          // scores_team_statistics    |  (How this data is populated on this task: https://github.com/Betarena/scores/issues/380)

  rf?:           string          // scores_football_standings if older seasons = scores_football_standings_history
                                 // home: ❌
                                 // away: ❌
}

//#endregion CUSTOM - [ONE-OFF] [SPECIFIC] DECLARATIONS
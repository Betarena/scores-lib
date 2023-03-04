//#region IMPORTS
// <imports-go-here>
//#endregion IMPORTS

import { B_H_PPT, B_H_SFC, B_H_SFL, B_H_SFP, B_H_SFSD, B_H_SFSD_AG, B_H_SFT, B_H_SGT, B_H_SWTPT, TopPlayersData, WidgetsNoDataAvailable } from "./hasura"

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
// export interface REDIS_CACHE_SINGLE_tournaments_top_player_widget_t_data_response extends BETARENA_HASURA_player_positions_translations 
// { }

export interface B_TP_T 
  extends TopPlayersData {
  lang?:          string
  pos_t?:         { [key: string]: string }
  pl_view_opt?:   string[]
  no_data_t?:     WidgetsNoDataAvailable
}

export interface B_TP_D {
  league_id?:  number
  seasons?:    TP_Season_Top_Player[]
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

export interface B_H_TP_Q {
  // NOTE: (data)
  // [#1]
  scores_football_seasons_details_aggregate:  B_H_SFSD_AG
  scores_football_seasons_details:            B_H_SFSD[]
  // [#2]
  scores_football_leagues:                    B_H_SFL[]
  scores_football_teams:                      B_H_SFT[]
  scores_football_countries:                  B_H_SFC[] // [❓] unecessary
  scores_football_players:                    B_H_SFP[]
  // NOTE: (translations)
  scores_widget_top_players_translations:     B_H_SWTPT[]
  player_positions_translations:              B_H_PPT[]
  scores_general_translations:                B_H_SGT[]
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

export interface TP_Season_Top_Player {
  season_id?:                 number
  top_players_rating?:        TP_ratings[]  
  top_players_goals?:         TP_goalscorers[]
  top_players_assists?:       TP_assits[]
  top_players_total_shots?:   TP_total_shots[]
} export interface TP_Main {
  rank?:           number            // [ℹ] rank         = ordered descendent
  avatar?:         string            // [ℹ] avatar       = scores_football_players         | "data:image_path"
  team_logo?:      string            // [ℹ] team logo    = scores_football_teams           | "data:team.data.logo_path"
  player_name?:    string            // [ℹ] player name  = scores_football_players         | "data:common_name"
  position?:       number            // [ℹ] position     = scores_football_players         | "data:position_id" (Use the endpoint: player_positions_translations)
} export interface TP_ratings 
  extends TP_Main {
  rating?:         number            // [ℹ] rating       = scores_football_seasons_details | "squad:rating"
} export interface TP_goalscorers 
  extends TP_Main {
  goals?:          number            // [ℹ] goals        = scores_football_seasons_details | "goalscorers:goals"
} export interface TP_assits 
  extends TP_Main {
  assists?:        number            // [ℹ] assists      = scores_football_seasons_details | "assistscorers:assists"
} export interface TP_total_shots
  extends TP_Main {
  total_shots?:    number            // [ℹ] total shots  = scores_football_seasons_details | "squad:shots_total"
}

//#endregion CUSTOM - [ONE-OFF] [SPECIFIC] DECLARATIONS
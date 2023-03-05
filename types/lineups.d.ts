//#region IMPORTS
// <imports-go-here>

import { BenchDatum, B_H_HF, B_H_HF_AG, B_H_PPT, B_H_SFLT, B_H_SFP, B_H_SFSD, B_H_SGT, EventsDatum, FixtureLineupTranslations, Formations, HistFixturesTeamsRating, HistFixtures_Substitue, LocalCoachData, WidgetsNoDataAvailable } from "./hasura";

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
export interface B_LIN_T 
  extends WidgetsNoDataAvailable, 
  FixtureLineupTranslations {
  lang?: string
  // [ℹ] for completion
  position?: { [key: string]: string };
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface B_LIN_D 
  extends LIN_Fixture {
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

export interface B_H_LIN_SJ_HF 
  extends B_H_HF {
  localteam_id_j?:     number
  visitorteam_id_j?:   number
  lineup_j?:           BenchDatum[]
  bench_j?:            BenchDatum[]
  formations_j?:       Formations
  substitutions_j?:    HistFixtures_Substitue[]
  home_coach_j?:       LocalCoachData
  away_coach_j?:       LocalCoachData
  events_j?:           EventsDatum[]
  localteam_short_code_j?:    string
  visitorteam_short_code_j?:  string
  status_j?:           string
}

export interface B_H_LIN_SJ_SFP 
  extends B_H_SFP {
  image_path_j?:     string
}

export interface B_H_LIN_Q {
  scores_football_seasons_details?: B_H_SFSD[]
  historic_fixtures_aggregate?:     B_H_HF_AG
  historic_fixtures?:               B_H_LIN_SJ_HF[]
  scores_football_players?:         B_H_LIN_SJ_SFP[]
  // NOTE: translations
  player_positions_translations?:   B_H_PPT[]
  scores_general_translations?:     B_H_SGT[]
  scores_fixture_lineup_translations?: B_H_SFLT[]
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

export interface LIN_Fixture {
  id?:     number
  status?: string

  // NOTE: Starting Lineups Before Match (fixture_lineups):
  home?: LIN_Team_Lineup
  away?: LIN_Team_Lineup

  // NOTE: Starting Lineups During the Match:
  // NOTE: LIVE DATA FROM FIREBASE
  // NOTE: Only this data is in Real Time, on every event the data needs to be compared 
  // NOTE: with the existing one and added the correspondent symbols.
  // NOTE: Endpoint: livescore_now

  events?: EventsDatum[]
  team_ratings?: HistFixturesTeamsRating

  // NOTE: Starting Lineups After the Match:
  sub_icon?: string          // Sub icon (minute of the sub) : historic_fixtures/events

} export interface LIN_Team_Lineup {
  team_name?:     string
  team_logo?:     string
  team_short_code?:  string
  team_rating?:   number | null
  coach_name?:    string
  coach_avatar?:  string
  lineup?:        LIN_Player[]  // historic_fixtures/lineup/data*
  bench?:         LIN_Player[]  // historic_fixtures/bench/data*
  formation?:     string
  substitutions?: LIN_Sub_Player[]
} export interface LIN_Player extends BenchDatum {
  player_avatar?:  string                 // [hasura] scores_football_players/data/image_path
  rating?:         string                 // [hasura | firebase] player rating - post-match
  events?:         LIN_Player_Events  // [custom-inject] individual player-associated events
  // [default included]
  // player_id?:      number
  // player_name?:    string
  // number?:         number 
  // position?:       string
  // formation_position?: string,
} export interface LIN_Player_Events {
  injured?:       boolean | null
  yeallow_card?:  number | null
  red_card?:      number | null
  goals?:         number | null
  substitution?:  EventsDatum
} export interface LIN_Sub_Player extends HistFixtures_Substitue {
  player_avatar_in?:    string    // scores_football_players/data/image_path
  player_avatar_out?:   string    // scores_football_players/data/image_path
  rating?:              string    // [hasura | firebase] player rating - post-match [?]
}

//#endregion CUSTOM - [ONE-OFF] [SPECIFIC] DECLARATIONS
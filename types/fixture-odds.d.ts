//#region IMPORTS
// <imports-go-here>

import type {
  B_H_HF, B_H_HF_AG,
  B_H_SD,
  B_H_SFSD,
  B_H_SGT,
  B_H_SLFT,
  B_H_SWFFOT,
  DataStats,
  FixturesOddsTranslations,
  MediaLinkWelcome,
  Round,
  Scores,
  Time,
  Urls,
  Weekdays,
  WelcomeMonths,
  WidgetsNoDataAvailable
} from "./hasura";
import { FIXTURE_STATUS_TYPES } from "./sportmonks";

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
// For example: for the Livescores-V2 widget data declaration target:
// -> EX: (long) Betarena_LivescoresV2_Translations => (final) B_LS2_T
// -> EX: (long) Betarena_LivescoresV2_Data => (final) B_LS2_D
// ----
// export interface B_LS2_T { ...
// export interface B_LS2_D { ...

// <declarations-go-here>

export interface B_FO_D {
  league_id?: number
  seasons?: FO_Season[]
}

export interface B_FO_T
  extends FixturesOddsTranslations, 
  WelcomeMonths, 
  Weekdays, 
  WidgetsNoDataAvailable {
  lang?: string
  status_abv?: StatusAbv;
} export interface StatusAbv {
  PEN_LIVE?: string;
  AET?:      string;
  BREAK?:    string;
  FT_PEN?:   string;
  POSTP?:    string;
  SUSP?:     string;
  TBA?:      string;
  WO?:       string;
  AU?:       string;
  HT?:       string;
  FT?:       string;
  CANCL?:    string;
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
// For example: for the Livescores-V2 widget data (query) declaration target:
// -> EX: (long) Betarena_Hasura_HistoricFixtures_LivescoresV2_Query => (final) B_H_HF_LSV2_Q
// -> EX: (long) Betarena_Hasura_SurgicalJson_Scores_Football_Leagues => (final) B_H_SJ_SFL
// ----
// export interface B_H_HF_LSV2_Q { ...
// export interface B_H_SJ_SFL { ...

// <declarations-go-here>

export interface B_H_SJ_HF
  extends B_H_HF {
  stats_j?:            DataStats
  localteam_id_j?:     number
  visitorteam_id_j?:   number
  round_j?:            Round
  time_j?:             Time
  scores_j?:           Scores
  stage_id_j:          number
}

export interface B_H_HF_FO_Q {
  // NOTE: (data)
  historic_fixtures:                                        B_H_SJ_HF[]
  historic_fixtures_aggregate:                              B_H_HF_AG
  scores_football_seasons_details:                          B_H_SFSD[]
  // NOTE: (translations)
  scores_widget_football_fixtures_odds_translations:        B_H_SWFFOT[]
  scores_general_translations:                              B_H_SGT[]
  scores_livescore_football_translations:                   B_H_SLFT[]
  sportsbook_details:                                       B_H_SD[]
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
// NOTE: <type-shortcode-for-target-data>_C_<type-target-data-type>
// For example: for the Livescores-V2 widget data declaration target:
// -> EX: LivescoresV2_Cache_League => (final) LS2_C_League
// -> EX: LivescoresV2_Cache_FixtureDateGroup => (final) LS2_C_FixtureDateGroup
// ----
// export interface LS2_C_League { ...
// export interface LS2_C_FixtureDateGroup { ...

// <declarations-go-here>

export interface FO_Season {
  season_id?: number
  rounds?:    FO_Rounds_Data[]
  weeks?:     FO_Weeks_Data[]
  fixtures?:  FO_Main[]
} export interface FO_Rounds_Data {
  name?:      string
  type?:      'round' | 'advanced'
  s_date?:    string
  e_date?:    string
  stage_id?:  number
  value?:     number
} export interface FO_Weeks_Data {
  name:   string
  s_date: string
  e_date: string
} export interface FO_Main {
  id:           number
  round:        number      // Rounds and weeks = scores_football_seasons_details + round_data + scores_general_translations
  // week:         number      // Rounds and weeks = scores_football_seasons_details + round_data + scores_general_translations
  fixture_time: string      // Day and Month = historic_fixtures + "league_id" + "time" +  scores_general_translations (Filter fixtures between dates or rounds to get fixtures day information, varies depending on the computer date and time of the end user) 
                            // [❓] whats the: historic_fixtures + "league_id" FOR ?
  
  fixture_date: string      // Fixture Date = historic_fixtures + "time" (Varies depending on the computer date and time of the end user)

  minute:  number           // live option, from firebase (non-cache-based)  // Fixture Live Time Information (Status LIVE) = livescore_now  + ""minute": 13,"
                            // [❓] should be real-time [?] as in, without the user refreshing the app will autamtically show the fixture data is LIVE
  status: FIXTURE_STATUS_TYPES
  teams: {
    home: FO_Team
    away: FO_Team
  }

  tip_link:     string                // Tip = tip_link_wp + scores_general_translations
  fixture_link: Urls                  // Fixture Link = fixture_link_wp NOTE: now official-new FIXTURE-LINKS
  media_link:   MediaLinkWelcome[]    // media_link = historic_fixtures + media_link + "video_link"
  bet_icon?:    string                // Betting Site Icon = sportsbook_details (GEO or forced header option)
                                      // [❔] only 1 betting site at the moment for all fixtures of X GEO (design is wrong)

  // [ℹ] extra-real-time-odds
  live_odds?:   FO_LiveOdds
} export interface FO_Team {
  name:      string   // Team Names = historic_fixtures + "home_team_name" + "away_team_name"
  score:     number   // Score = historic_fixtures + "ft_score" [❓] what is this field [complex property]
  red_cards: number   // Red Cards = historic_fixtures + "cards"
} export interface FO_LiveOdds {
  home: FO_LiveOdds_Single
  away: FO_LiveOdds_Single
  draw: FO_LiveOdds_Single

} export interface FO_LiveOdds_Single {
  betting_site_icon_link?:   string
  register_link?:            string
  value?:                    number
}

//#endregion CUSTOM - [ONE-OFF] [SPECIFIC] DECLARATIONS
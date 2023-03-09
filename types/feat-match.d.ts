//#region IMPORTS
// <imports-go-here>

import { FIREBASE_SelectedFixture_LiveOdds_Response } from "./firebase";
import { B_H_ST, ScoresTournamentsUrls } from "./hasura";

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

export interface B_FEATM_D {
	away_team_logo?: string;
	away_team_name?: string;
	country_flag?: string;
	fixture_day?: Date; // timeStamp
	home_team_logo?: string;
	home_team_name?: string;
	id?: number; // fixture-id
	inserted_at?: Date; // timeStamp
	league_name?: string;
	probabilities?: {
		home?: string;
		away?: string;
		draw?: string;
	};
	round_name?: string;
	status?: string;
	time?: Date;  // timeStamp
	tvstations?: Array< FEATM_Tv_Station >; // array-of-TvStations
	valuebets?: FEATM_ValueBet; // array-of-value-bets
	live_odds?: FIREBASE_SelectedFixture_LiveOdds_Response; // live-odds-data
	match_votes?: FEATM_MatchVotes;
	best_players?: FEATM_BestPlayers_Data;
	// translation?: Array<TranslationsResponse>;
	selected_data?: FEATM_SelectedFixutre;
  league_id?: number;
  urls?: ScoresTournamentsUrls;
}

export interface B_FEATM_T
  extends FEATM_TranslationsResponse {
  lang?: string;
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

export interface B_H_FEATM_Q {
	widget_featured_match_selection: FEATM_SelectedFixutre[]
  scores_tournaments: B_H_ST[]
  week_fixtures: B_FEATM_D[];
  widget_featured_match_best_player: FEATM_BestPlayers_Data[];
  widget_featured_match_votes: FEATM_MatchVotes[];
  update_widget_featured_match_votes: FEATM_MatchVotes[];

  week_fixtures_by_pk: B_FEATM_D;
	widget_featured_match_best_player_by_pk: FEATM_BestPlayers_Data;
	widget_featured_match_votes_by_pk: FEATM_MatchVotes;
	update_widget_featured_match_votes_by_pk: FEATM_MatchVotes;
  
	widget_featured_match_translations: FEATM_TranslationsResponse[];
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

export interface FEATM_Tv_Station {
	link: string;
	img: string;
	Name: string;
	alt: string;
}

export interface FEATM_ValueBet {
	fair_odd?: string;
	stake?: number;
	bet?: string;
	is_value?: boolean;
	odd?: number;
	bookmaker?: string;
	image?: string;
	link?: string;
}

export interface FEATM_MatchVotes {
	match_id: number;
	vote_draw_x: number;
	vote_win_local: number;
	vote_win_visitor: number;
}

export interface FEATM_SelectedFixutre {
	date: string;
	fixture_id: number;
	game_start: string;
	lang: string;
}

export interface FEATM_BestPlayers_Data {
	fixture_id: number;
	game_start_date: string;
	local_team_player_1: string;
	local_team_player_1_appearances: number;
	local_team_player_1_assists: number;
	local_team_player_1_goals: number;
	local_team_player_1_image_path: string;
	local_team_player_2: string;
	local_team_player_2_appearances: number;
	local_team_player_2_assists: number;
	local_team_player_2_goals: number;
	local_team_player_2_image_path: string;
	local_team_rating_player_1: number;
	local_team_rating_player_2: number;
	visitor_team_player_1: string;
	visitor_team_player_1_appearances: number;
	visitor_team_player_1_assists: number;
	visitor_team_player_1_goals: number;
	visitor_team_player_1_image_path: string;
	visitor_team_player_2: string;
	visitor_team_player_2_appearances: number;
	visitor_team_player_2_assists: number;
	visitor_team_player_2_goals: number;
	visitor_team_player_2_image_path: string;
	visitor_team_rating_player_1: number;
	visitor_team_rating_player_2: number;
}

export interface FEATM_TranslationsResponse {
  assists?: string;
  bookmaker?: string;
  bet?: string;
  fair_odds?: string;
  goals?: string;
  home_win?: string;
  lang?: string;
  market?: string;
  market_name?: string;
  market_type?: string;
  matches?: string;
  odds?: string;
  place_bet?: string;
  player?: string;
  players?: string;
  stake?: string;
  rating?: string;
  probability?: string;
  streams?: string;
  type?: string;
  value_bet?: string;
  vote?: string;
  winnings?: string;
  widget_title?: string;
  place_holder?: {
    no_matches:  string
    info:        string
  }
}

export interface FEATM_LiveScoreIcon {
	country:{ [key: string]: FEATM_LiveScoreBookIcon };
}

export interface FEATM_LiveScoreBookIcon {
	alt:string;
	icon:string;
	icon2:string;
	iso:string;
	link:string;	
}

export interface FEATM_LiveScoreGame {
	id: number;
	league_id: number;
	league: string;
	localteam: string;
	visitorteam: string; 
	localteam_score:string;
	visitorteam_score:string;
	minute: string;
	flag: string;
	starting_at: string;
	status: string;
	starting_at_ts: number;
	medias: number;
	links:string[];
	tips:string[];
	cards:FEATM_LiveScoreCard[];

}

export interface FEATM_LiveScoreLeague {
	id: number;
	name:string;
	flag:string;
	games:FEATM_LiveScoreLeagueGame[];
	order:{ [key: string]: number };
	
}

export interface FEATM_LiveScoreCard {
	team_name:string;	
}
export interface FEATM_DayName {
	name:string;
	day:number;
	sel:number;
	table:string;
}

export interface FEATM_LiveScoreLeagueGame {
	id: number;
	localteam: string;
	visitorteam: string;
	localScore: string;
	visitorScore: string;
	minute: string;
	hour: string;
	status: string;
	medias: number;
	links:string[];
	tips:string[];
	homeCards:number;
	visitorCards:number;
	starting_at_ts:number;
}

//#endregion CUSTOM - [ONE-OFF] [SPECIFIC] DECLARATIONS
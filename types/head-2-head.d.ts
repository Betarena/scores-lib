//#region IMPORTS
// <imports-go-here>

import { B_H_FH2H, B_H_HF, B_H_SFH2HT, B_H_SFT, B_H_SGT, h2h_Translations, WidgetsNoDataAvailable } from "./hasura";

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
export interface B_H2H_T
	extends h2h_Translations,
		WidgetsNoDataAvailable {
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

export interface B_H_H2H_SJ_HF
	extends B_H_HF {
	localteam_id_j?: number;
	visitorteam_id_j?: number;
}

export interface B_H_H2H_Q {
	historic_fixtures?: B_H_H2H_SJ_HF[];
	football_h2h?: B_H_FH2H[];
	scores_football_teams?: B_H_SFT[];
	// NOTE: translations
	scores_general_translations?: B_H_SGT[];
	scores_fixtures_h2h_translations?: B_H_SFH2HT[];
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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface H2H_Fixture {
	id?: number | null;
	data?: B_H_FH2H;
	teams_data?: H2H_Fixture_Teams_Data[];
	corner_avg?: number;
	last_5_data_urls?: B_H_HF[];
}
export interface H2H_Fixture_Teams_Data {
	team_name?: string;
	team_logo?: string;
	team_short?: string;
	team_id?: number;
}

//#endregion CUSTOM - [ONE-OFF] [SPECIFIC] DECLARATIONS
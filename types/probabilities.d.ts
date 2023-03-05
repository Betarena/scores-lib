//#region IMPORTS
// <imports-go-here>
//#endregion IMPORTS

import { B_H_HF, B_H_SFPT, B_H_SGT, FixtureProbabilitiesDataTranslation, Probabilities, WidgetsNoDataAvailable } from "./hasura";

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
export interface B_PR_T
	extends FixtureProbabilitiesDataTranslation,
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

export interface B_H_PR_SJ_HF
	extends B_H_HF {
	status_j?: string;
}

export interface B_H_PR_Q {
	// NOTE: data
	historic_fixtures?: B_H_PR_SJ_HF[];
	// NOTE: translations
	scores_general_translations?: B_H_SGT[];
	scores_fixture_probabilities_translations?: B_H_SFPT[];
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
export interface PR_Fixture {
	id?: number | null;
	time?: string;
	probabilites?: Probabilities | null;
	odds?: PR_Odds | null;
}
export interface PR_Odds {
	_1x2?: {
		home?: number | string;
		draw?: number | string;
		away?: number | string;
	};
	btts?: number | string;
	over_2_5?: number | string;
}

//#endregion CUSTOM - [ONE-OFF] [SPECIFIC] DECLARATIONS
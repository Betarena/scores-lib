//#region IMPORTS
// <imports-go-here>
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

export interface B_TGOL_D {
  lang?: string
  top_geo_goalscorer_players?: TGOL_Goalscorer[]
}

// export interface  Cache_Goalscorers_General_Lang_Ready {
//   top_geo_goalscorer_players: Single_Goalscorer[]
//   translations: Single_Goalscorer_Translations[]
// }

export interface B_TGOL_T {
  top_geo_goalscorer_players: {
    common_name?: string
  }[]
  translations: TGOL_Translations
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

export interface B_H_TGOL_Q {
  scores_best_goalscorers: {
    common_name: string
    goals: number
    image_path: string
    league_id: number
    logo_path: string
    position: string
  }[]
  scores_best_goalscorers_translations: {
    lang: string
    translations: {
      goals: string
      odds: string
      best_goal_scorers: string
      player: string
      show_more_players: string
      show_less_players: string
    }
  }[]
  player_positions_translations: {
    lang: string
    position: {
      "1": string
      "2": string
      "3": string
      "4": string
      "5": string
    }
  }[]
  leagues_filtered_country: {
    lang: string
    leagues: {
        league_id: number
    }[]
  }[]
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

export interface TGOL_Goalscorer {
  common_name?: string
  goals?: number
  image_path?: string
  league_id?: number
  logo_path?: string
  position?: string
  pos_num?: number
}

export interface TGOL_Translations {
  lang?: string
  positions_translations?: {
    "1": string
    "2": string
    "3": string
    "4": string
    "5": string
  }
  widget_translations?: {
    goals: string
    odds: string
    best_goal_scorers: string
    player: string
    show_more_players: string
    show_less_players: string
  }
}

//#endregion CUSTOM - [ONE-OFF] [SPECIFIC] DECLARATIONS
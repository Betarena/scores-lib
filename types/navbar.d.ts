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

export interface B_NAV_T {
  lang?: string
  // [ℹ] ⬇️ languages available
  langArray?: string[]
  // [ℹ] ⬇️ bottom row header info
  scores_header_translations?: NAV_Translation;
  // [ℹ] ⬇️ translated links
  scores_header_links?: NAV_Links;
  // [ℹ] ⬇️ translated terms
  scores_header_fixtures_information?: NAV_Sports_Info;
  // [ℹ] ⬇️ platform alert messages
  scores_top_bar_messages?: NAV_Top_Bar_Messages;
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

export interface B_H_NAV_Q {
  scores_hreflang: {
    hreflang: string
    link: string
  }[]
  scores_header_translations: Array < NAV_Translation > ;
  scores_header_links: Array < NAV_Links > ;
  scores_header_fixtures_information: Array < NAV_Sports_Info > ;
  scores_top_bar_messages: Array < NAV_Top_Bar_Messages >;
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

export interface NAV_Translation {
  lang: string;
  betting_tips_link: string;
  bookmakers: string;
  bookmakers_countries: Array < Array < string >> ;
  content_platform_link: string;
  odds: string;
  odds_type: Array < string > ;
  sign_in: string;
  sports: Array < Array < string >> ;
  theme: string;
  theme_options: Array < Array < string >> ;
  homepage: string;
  more_sports: string;
  sports_list: string;
}

export interface NAV_Links {
  lang: string;
  betting_tips: string;
  latest_news: string;
}

export interface NAV_Sports_Info {
  lang: string
  football: number
  other_sports: Array < Array < string >> 
}

export interface NAV_Top_Bar_Messages {
  lang: string
  status: string
  message: string
}

//#endregion CUSTOM - [ONE-OFF] [SPECIFIC] DECLARATIONS
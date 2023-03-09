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

export interface FinalFeaturedSiteResponseDB {
	site_data_array: Array<FeaturedSite>; // contains the array of `FeaturedSite` data from the website
	site_data_array_length: number; // lenght of the array with the number of featured sites
	title: string; // contains the `geo-locational` title name of the widget
	show_more_less: string[]; // show more less widget data translations [0] = 'showMore', [1] = 'showLess'
}

export interface B_FEATB_T {
  lang?: string
  translations?: {
    register_cta: string
    show_more_less: Array < string >
    title: string
    widget_title: string
  }
}

export interface FeaturedSite {
  position?: number            // ... featured betting site position in the board
  image?: string               // ... featured image of betting site (large-top-3) URL
  stars?: string               // ... rating given to the featured betting site
  bonus?: string               // ... bonus prize money of the featured betting site;
  bonus_code?: string          // ... bonus code INFO;
  bonus_description?: string   // ... featured betting site dsctiption referral condition
  register_link?: string       // ... `call-to-action` link for the featured betting site;
  review_link?: string         // ... `link_for_review`
  title?: string               // ... name of the featured betting site
  information?: string         // ... INFO
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

export interface B_H_FEATB_Q {
  scores_featured_betting_sites_translations: {
    lang: string
    translations: {
      register_cta: string
      show_more_less: Array < string >
      title: string
      widget_title: string
    }
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

export interface Scores_Featured_Betting_Sites_Data {
  scores_featured_betting_sites_translations: {
    lang: string
    translations: {
      register_cta: string
      show_more_less: Array < string >
      title: string
      widget_title: string
    }
    site_data_array: Array < FeaturedSite >
  }[]
}

export interface All_SportBook_Details_Data_Translation {
  lang: string
  translations: {
    register_cta: string
    show_more_less: Array < string >
    title: string
    widget_title: string
  }
}

export interface All_SportBook_Details_Data {
  lang?: string
  // translations: {
  //     lang: string
  //     translations: {
  //         register_cta: string
  //         show_more_less: Array < string >
  //         title: string
  //         widget_title: string
  //     }
  // }[]
  data?: FeaturedSite[]
}

export interface LiveScore_SEO_Game{
  tips?: { [key: string]: {
          link: string
  }};
  localteam?:string;
  visitorteam?:string;
  links?: { [key: string]: string;}
}

export interface LiveScore_SEO_Game_Scoped_Lang{
  tip?: string;
  localteam?:string;
  visitorteam?:string;
  link?: string;
}

//#endregion CUSTOM - [ONE-OFF] [SPECIFIC] DECLARATIONS
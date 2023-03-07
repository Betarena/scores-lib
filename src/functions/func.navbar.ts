//#region IMPORTS
// <⬇️-add-imports-below-⬇️>

import { GraphQLClient } from "graphql-request";
import type { B_H_NAV_Q, B_NAV_T } from "../../types/navbar";
import { B_C_NAV_M_Q_T } from "../graphql/query.navbar.js";

//#endregion IMPORTS

//#region [METHODS]
// <⬇️-add-methods-below-⬇️>

// ==================
// 📌 TRANSLATION METHODS [below]
// ==================

/**
 * @description [QUERY] method for getting
 * translation data for the Lineups Fixtures (widget);
 * NOTE: uses newest implementation of SINGLE and MULTI langauge
 * data retrival from Hasura DB with the use of langArray[];
 * @todo needs revision of the WRAPPER use-case
 * @version 3.0
 * @param {GraphQLClient} initGrapQLClient 
 * @param {string[]} langArray 
 * @returns Promise < B_H_NAV_Q >
 */
export async function NAV_M_get_widget_translations (
  initGrapQLClient: GraphQLClient,
  langArray: string[]
): Promise < B_H_NAV_Q > {

  const QUERY_VARIABLES: { 
    langArray: string[]
  } = {
    langArray
  }

  // const t0 = performance.now();
  // const queryName = "REDIS_CACHE_FIXTURE_PROBABILITIES_1";

  const response: B_H_NAV_Q = await initGrapQLClient.request (
    B_C_NAV_M_Q_T,
    QUERY_VARIABLES
  );
  
  // const t1 = performance.now();
  // logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response;
}

/**
 * @description [MAIN] method for generating a MAP
 * of target supplied translations for the 
 * Lineups Fixtures (widget);
 * NOTE: can generate for a SINGLE or MULTI langauges, depending 
 * on the ones that are supplied;
 * @version 3.0
 * @param {B_H_NAV_Q} data - data recieved from the Hasura DB
 * @param {string[]} langArray - array of target languages
 * @returns Promise < Map <string, B_NAV_T> >
 */
export async function NAV_M_translations_main (
  data: B_H_NAV_Q,
  langArray: string[]
): Promise < Map <string, B_NAV_T> > {
  
  const fix_odds_translation_map = new Map <string, B_NAV_T> ()
  
  for (const lang_ of langArray) {

    const object: B_NAV_T = {};
    object.lang = lang_;
    object.langArray = langArray;

    const objectT1 = data.scores_header_fixtures_information
      .find(({ lang }) => lang === lang_)

    const objectT2 = data.scores_header_links
      .find(({ lang }) => lang === lang_)

    const objectT3 = data.scores_header_translations
      .find(({ lang }) => lang === lang_)
  
    const objectT4 = data.scores_top_bar_messages
      .find(({ lang }) => lang === lang_)

    const MERGED_OBJECT_T = {
      ...object,
      scores_header_fixtures_information: objectT1,
      scores_header_links: objectT2,
      scores_header_translations: objectT3,
      scores_top_bar_messages: objectT4
    }
    fix_odds_translation_map.set(lang_, MERGED_OBJECT_T)
  }

  return fix_odds_translation_map
}

//#endregion METHODS]
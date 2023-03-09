//#region IMPORTS
// <⬇️-add-imports-below-⬇️>

import { GraphQLClient } from "graphql-request";
import { B_FEATB_T, B_H_FEATB_Q } from "../../types/feat-betsite";
import { B_C_FEATB_M_Q_T } from "../graphql/query.feat-betsite.js";

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
 * @returns Promise < B_H_FEATB_Q >
 */
export async function FEATB_H_get_widget_translations (
  initGrapQLClient: GraphQLClient,
  langArray: string[]
): Promise < B_H_FEATB_Q > {

  const QUERY_VARIABLES: { 
    langArray: string[]
  } = {
    langArray
  }

  // const t0 = performance.now();
  // const queryName = "REDIS_CACHE_FIXTURE_PROBABILITIES_1";

  const response: B_H_FEATB_Q = await initGrapQLClient.request (
    B_C_FEATB_M_Q_T,
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
 * @param {B_H_FEATB_Q} data - data recieved from the Hasura DB
 * @param {string[]} langArray - array of target languages
 * @returns Promise < Map <string, B_FEATB_T> >
 */
export async function FEATB_H_translations_main (
  data: B_H_FEATB_Q,
  langArray: string[]
): Promise < Map <string, B_FEATB_T> > {
  
  const fix_odds_translation_map = new Map <string, B_FEATB_T> ()
  
  for (const lang_ of langArray) {

    const object: B_FEATB_T = {};
    object.lang = lang_;

    const objectT1 = data.scores_featured_betting_sites_translations
      .find(({ lang }) => lang === lang_)

    const MERGED_OBJECT_T = {
      ...object,
      ...objectT1
    }
    fix_odds_translation_map.set(lang_, MERGED_OBJECT_T)
  }

  return fix_odds_translation_map
}

//#endregion METHODS]
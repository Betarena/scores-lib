//#region IMPORTS
// <⬇️-add-imports-below-⬇️>

import { GraphQLClient } from "graphql-request";
import type { B_H_SEB_Q, B_SEB_DT } from "../../types/seo-block";
import { B_C_SEB_M_Q_D0 } from "../graphql/query.seo-block.js";

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
 * @returns Promise < B_H_SEB_Q >
 */
export async function SEB_M_get_widget_translations (
  initGrapQLClient: GraphQLClient,
  langArray: string[]
): Promise < B_H_SEB_Q > {

  const QUERY_VARIABLES: { 
    langArray: string[]
  } = {
    langArray
  }

  // const t0 = performance.now();
  // const queryName = "REDIS_CACHE_FIXTURE_PROBABILITIES_1";

  const response: B_H_SEB_Q = await initGrapQLClient.request (
    B_C_SEB_M_Q_D0,
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
 * @param {B_H_SEB_Q} data - data recieved from the Hasura DB
 * @param {string[]} langArray - array of target languages
 * @returns Promise < Map <string, B_SEB_DT> >
 */
export async function SEB_M_translations_main (
  data: B_H_SEB_Q,
  langArray: string[]
): Promise < Map <string, B_SEB_DT> > {
  
  const fix_odds_translation_map = new Map <string, B_SEB_DT> ()
  
  for (const lang_ of langArray) {

    const object: B_SEB_DT = {};
    object.lang = lang_;

    const objectT1 = data.scores_seo_block_homepage
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
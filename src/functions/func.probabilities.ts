//#region IMPORTS
// <⬇️-add-imports-below-⬇️>

import { GraphQLClient } from "graphql-request";
import { B_H_PR_Q, B_H_PR_SJ_HF, B_PR_T } from "../../types/probabilities";
import { B_C_PROB_F_Q_D0, B_C_PROB_F_Q_T } from "../graphql/query.probabilities";

//#endregion IMPORTS

//#region [METHODS]
// <⬇️-add-methods-below-⬇️>

// ==================
// 📌 MAIN DATA METHODS [below]
// ==================

/**
 * @description [QUERY] method obtaining target
 * fixture probabilities data for Probabilities Fixture (widget);
 * @version 0.5
 * @todo need revision on the implementation FOR-ALL fixtures in the cache (missing)
 * @param {GraphQLClient} initGrapQLClient - a grqphQl connection instance
 * @param {number} fixture_id - of the target fixture-id data is required
 * @returns Promise < B_H_PR_SJ_HF[] >
 */
export async function PR_F_get_target_fixture(
  initGrapQLClient: GraphQLClient,
	fixture_id: number
): Promise < B_H_PR_SJ_HF[] > {

  // [ℹ] obtain target historic_fixtures [fixture_id]
  // const queryName =	'REDIS_CACHE_FIXTURE_PROBABILITIES_0';
  // const t0 = performance.now();

  const VARIABLES = {
    fixture_id
  };

  const response: B_H_PR_Q = await initGrapQLClient.request(
    B_C_PROB_F_Q_D0,
    VARIABLES
  );

  // const t1 = performance.now();
  // logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response.historic_fixtures;
}

// ==================
// 📌 TRANSLATION METHODS [below]
// ==================

/**
 * @description [QUERY] method for getting
 * translation data for the Probability Fixtures (widget);
 * NOTE: uses newest implementation of SINGLE and MULTI langauge
 * data retrival from Hasura DB with the use of langArray[];
 * @todo needs revision of the WRAPPER use-case
 * @version 3.0
 * @param {GraphQLClient} initGrapQLClient 
 * @param {string[]} langArray 
 * @returns Promise < B_H_PR_Q >
 */
export async function PR_F_get_widget_translations (
  initGrapQLClient: GraphQLClient,
  langArray: string[]
): Promise < B_H_PR_Q > {

  const QUERY_VARIABLES: { 
    langArray: string[]
  } = {
    langArray
  }

  // const t0 = performance.now();
  // const queryName = "REDIS_CACHE_FIXTURE_PROBABILITIES_1";

  const response: B_H_PR_Q = await initGrapQLClient.request (
    B_C_PROB_F_Q_T,
    QUERY_VARIABLES
  );
  
  // const t1 = performance.now();
  // logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response;
}

/**
 * @description [MAIN] method for generating a MAP
 * of target supplied translations for the 
 * Probabilities Fixtures (widget);
 * NOTE: can generate for a SINGLE or MULTI langauges, depending 
 * on the ones that are supplied;
 * @version 3.0
 * @param {B_H_PR_Q} data - data recieved from the Hasura DB
 * @param {string[]} langArray - array of target languages
 * @returns Promise < Map <string, B_PR_T> >
 */
export async function PR_F_translations_main (
  data: B_H_PR_Q,
  langArray: string[]
): Promise < Map <string, B_PR_T> > {
  
  const fix_odds_translation_map = new Map <string, B_PR_T> ()
  
  for (const lang_ of langArray) {

    const object: B_PR_T = {};
    object.lang = lang_;

    const objectFixOdds = data.scores_fixture_probabilities_translations
    .find(({ lang }) => 
      lang === lang_
    );
    const objectFixGeneralTranslation = data.scores_general_translations
    .find(({ lang }) => 
      lang === lang_
    );
    const MERGED_OBJECT_T = {
      ...object,
      ...objectFixOdds?.data,
      ...objectFixGeneralTranslation?.widgets_no_data_available
    };
    fix_odds_translation_map.set(lang_, MERGED_OBJECT_T)
  }

  return fix_odds_translation_map
}

//#endregion METHODS]

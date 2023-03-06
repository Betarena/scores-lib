//#region IMPORTS
// <⬇️-add-imports-below-⬇️>

import { GraphQLClient } from "graphql-request";
import { B_H2H_T, B_H_H2H_Q, B_H_H2H_SJ_HF } from "../../types/head-2-head";
import { B_C_H2H_F_Q_D0, B_C_H2H_F_Q_D2, B_C_H2H_F_Q_T } from "../graphql/query.head-2-head.js";

//#endregion IMPORTS

//#region [METHODS]
// <⬇️-add-methods-below-⬇️>

/**
 * @description [QUERY] method for Head-2-Head Fixture -
 * target FIXTURE-DATA;
 * @param {number} fixture_id
 * @returns Promise < B_H_H2H_SJ_HF[] >
 */
export async function H2H_F_get_target_fixture(
  initGrapQLClient: GraphQLClient,
	fixture_id: number
): Promise < B_H_H2H_SJ_HF[] > {

	// [ℹ] obtain target historic_fixtures [fixture_id]

	// const t0 = performance.now();
	// const queryName =	'BETARENA_CACHE_SCOREBOARD_ODDS_DATA_3';

	const VARIABLES = {
		fixture_id
	};
	const response: B_H_H2H_Q = await initGrapQLClient.request(
    B_C_H2H_F_Q_D0,
    VARIABLES
  );

	// const t1 = performance.now();
	// logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

	return response.historic_fixtures;
}

/**
 * @description [QUERY] method for Head-2-Head Fixture -
 * target FIXTURE-DATA;
 * @param {string} team_ids
 * @param {number[]} team_ids_arr
 * @returns Promise < B_H_H2H_Q >
 */
export async function H2H_F_get_target_h2h(
  initGrapQLClient: GraphQLClient,
	team_ids: string,
	team_ids_arr: number[]
): Promise < B_H_H2H_Q > {

	// [ℹ] obtain target historic_fixtures [fixture_id]

	// const t0 = performance.now();
	// const queryName =	'BETARENA_CACHE_SCOREBOARD_ODDS_DATA_3';

	const VARIABLES = {
		team_ids,
		team_ids_arr
	};
	const response: B_H_H2H_Q = await initGrapQLClient.request(
    B_C_H2H_F_Q_D0,
    VARIABLES
  );

	// const t1 = performance.now();
	// logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

	return response;
}

/**
 * @description [QUERY] method for Head-2-Head Fixture -
 * target FIXTURE-DATA;
 * @param {number} fixture_id
 * @returns Promise < B_H_H2H_SJ_HF[] >
 */
export async function H2H_F_get_target_past_fixtures(
  initGrapQLClient: GraphQLClient,
	fixture_id: number[]
): Promise < B_H_H2H_SJ_HF[] > {

	// [ℹ] obtain target historic_fixtures [fixture_id]

	// const t0 = performance.now();
	// const queryName =	'BETARENA_CACHE_SCOREBOARD_ODDS_DATA_3';

	const VARIABLES = {
		fixture_id
	};
	const response: B_H_H2H_Q = await initGrapQLClient.request(
    B_C_H2H_F_Q_D2,
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
 * translation data for the Head2Head Fixtures (widget);
 * NOTE: uses newest implementation of SINGLE and MULTI langauge
 * data retrival from Hasura DB with the use of langArray[];
 * @todo needs revision of the WRAPPER use-case
 * @version 3.0
 * @param {GraphQLClient} initGrapQLClient 
 * @param {string[]} langArray 
 * @returns Promise < B_H_H2H_Q >
 */
export async function H2H_F_get_widget_translations (
  initGrapQLClient: GraphQLClient,
  langArray: string[]
): Promise < B_H_H2H_Q > {

  const QUERY_VARIABLES: { 
    langArray: string[]
  } = {
    langArray
  }

  // const t0 = performance.now();
  // const queryName = "REDIS_CACHE_FIXTURE_PROBABILITIES_1";

  const response: B_H_H2H_Q = await initGrapQLClient.request (
    B_C_H2H_F_Q_T,
    QUERY_VARIABLES
  );
  
  // const t1 = performance.now();
  // logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response;
}

/**
 * @description [MAIN] method for generating a MAP
 * of target supplied translations for the 
 * Incidents Fixtures (widget);
 * NOTE: can generate for a SINGLE or MULTI langauges, depending 
 * on the ones that are supplied;
 * @version 3.0
 * @param {B_H_H2H_Q} data - data recieved from the Hasura DB
 * @param {string[]} langArray - array of target languages
 * @returns Promise < Map <string, B_H2H_T> >
 */
export async function H2H_F_translations_main (
  data: B_H_H2H_Q,
  langArray: string[]
): Promise < Map <string, B_H2H_T> > {
  
  const fix_odds_translation_map = new Map <string, B_H2H_T> ()
  
  for (const lang_ of langArray) {

    const object: B_H2H_T = {};
    object.lang = lang_;

    const objectFixOdds = data.scores_fixtures_h2h_translations
    .find(({ lang }) =>
      lang === lang_
    );

    const objectFixGeneralTranslation = data.scores_general_translations
    .find(({ lang }) => 
      lang === lang_
    );

    const MERGED_OBJECT_T = {
      ...object,
      ...objectFixOdds?.translations,
      ...objectFixGeneralTranslation?.widgets_no_data_available
    };

    fix_odds_translation_map.set(lang_, MERGED_OBJECT_T)
  }

  return fix_odds_translation_map
}

//#endregion METHODS]
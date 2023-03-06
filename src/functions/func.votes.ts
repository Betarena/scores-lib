//#region IMPORTS
// <⬇️-add-imports-below-⬇️>

import { GraphQLClient } from "graphql-request";
import { B_H_VOT_Q, B_H_VOT_SJ_HF, B_VOT_T, VOT_Fixture } from "../../types/votes";
import { B_C_VOT_F_Q_D1, B_C_VOT_F_Q_T } from "../graphql/query.votes";

//#endregion IMPORTS

//#region [METHODS]
// <⬇️-add-methods-below-⬇️>

/**
 * @description [MAIN] - compiles the data and process it
 * ready to be utilized and cached/displayed;
 * @param {B_H_VOT_SJ_HF[]} fixturesArray 
 * @returns Promise < VOT_Fixture[] >
 */
export async function VOT_F_data_main (
  fixturesArray: B_H_VOT_SJ_HF[]
): Promise < VOT_Fixture[] > {

  const cache_data_arr: VOT_Fixture[] = []

  for (const value of fixturesArray) {

    const home_team_logo = value?.home_team_logo || null;
    const away_team_logo = value?.away_team_logo;

    const fixture_object: VOT_Fixture = {
      home_team_logo,
      away_team_logo
    };

    cache_data_arr.push(fixture_object)
  }

  return cache_data_arr;
}

/**
 * @description [QUERY] method for Incidents Fixture -
 * target FIXTURE-DATA;
 * @param {number} fixture_id
 * @returns Promise < B_H_VOT_SJ_HF[] >
 */
export async function VOT_F_get_target_fixture(
  initGrapQLClient: GraphQLClient,
	fixture_id: number
): Promise < B_H_VOT_SJ_HF[] > {

	// [ℹ] obtain target historic_fixtures [fixture_id]

	// const t0 = performance.now();
	// const queryName =	'BETARENA_CACHE_SCOREBOARD_ODDS_DATA_3';

	const VARIABLES = {
		fixture_id
	};
	const response: B_H_VOT_Q = await initGrapQLClient.request(
    B_C_VOT_F_Q_D1,
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
 * translation data for the Lineups Fixtures (widget);
 * NOTE: uses newest implementation of SINGLE and MULTI langauge
 * data retrival from Hasura DB with the use of langArray[];
 * @todo needs revision of the WRAPPER use-case
 * @version 3.0
 * @param {GraphQLClient} initGrapQLClient 
 * @param {string[]} langArray 
 * @returns Promise < B_H_VOT_Q >
 */
export async function VOT_F_get_widget_translations (
  initGrapQLClient: GraphQLClient,
  langArray: string[]
): Promise < B_H_VOT_Q > {

  const QUERY_VARIABLES: { 
    langArray: string[]
  } = {
    langArray
  }

  // const t0 = performance.now();
  // const queryName = "REDIS_CACHE_FIXTURE_PROBABILITIES_1";

  const response: B_H_VOT_Q = await initGrapQLClient.request (
    B_C_VOT_F_Q_T,
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
 * @param {B_H_VOT_Q} data - data recieved from the Hasura DB
 * @param {string[]} langArray - array of target languages
 * @returns Promise < Map <string, B_VOT_T> >
 */
export async function VOT_F_translations_main (
  data: B_H_VOT_Q,
  langArray: string[]
): Promise < Map <string, B_VOT_T> > {
  
  const fix_odds_translation_map = new Map <string, B_VOT_T> ()
  
  for (const lang_ of langArray) {

    const object: B_VOT_T = {};
    object.lang = lang_;

    const objectFixAbout = data.scores_fixture_voting_translations
      .find(({ lang }) => lang === lang_)

    const objectFixGeneralTranslation = data.scores_general_translations
      .find(({ lang }) => lang === lang_)

    const MERGED_OBJECT_T = {
      ...object, 
      ...objectFixAbout?.translations,
      ...objectFixGeneralTranslation?.widgets_no_data_available
    }
    fix_odds_translation_map.set(lang_, MERGED_OBJECT_T)
  }

  return fix_odds_translation_map
}

//#endregion METHODS]
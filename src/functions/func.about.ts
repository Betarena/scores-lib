//#region IMPORTS
// <⬇️-add-imports-below-⬇️>

import { GraphQLClient } from "graphql-request";
import { ABT_Fixture, B_ABT_T, B_H_ABT_Q } from "../../types/about";
import { B_H_HF } from "../../types/hasura";
import { B_C_ABT_F_Q_D0, B_C_ABT_F_Q_D1, B_C_ABT_F_Q_T } from "../graphql/query.about.js";

//#endregion IMPORTS

//#region [METHODS]
// <⬇️-add-methods-below-⬇️>

/**
 * @description obtain target historic_fixtures;
 * obtain target season_id's;
 * @param {GraphQLClient} initGrapQLClient
 * @param {number[]} seasonIdsArr 
 * @returns Promise < B_H_HF[] >
 */
export async function ABT_F_get_target_historic_fixtures (
  initGrapQLClient: GraphQLClient,
  seasonIdsArr: number[]
): Promise < B_H_HF[] > {

  const limit = 1000;
  let offset = 0;
  let total_limit;

  let h_fixtures_arr: B_H_HF[] = [] 
  let counter = 0

  // [ℹ] obtain target historic_fixtures
  // const queryName = "REDIS_CACHE_FIXTURE_STATISTICS_DATA_1";
  // t0 = performance.now();

  // eslint-disable-next-line no-constant-condition
  while (true) {

    const VARIABLES = {
      limit: limit,
      offset: offset,
      seasonIds: seasonIdsArr
    }
    
    const response: B_H_ABT_Q = await initGrapQLClient.request (
      B_C_ABT_F_Q_D0,
      VARIABLES
    );

    h_fixtures_arr = h_fixtures_arr.concat(response.historic_fixtures)

    // [ℹ] exit loop
    if (offset >= total_limit) {
      // [🐛] debug
      // if (dev) console.log(`exiting loop`)
      // logs.push(`total limit: ${total_limit}`)
      // logs.push(`fixtures gathered: ${h_fixtures_arr.length}`)
      // logs.push(`exiting loop after ${counter} iterations`)
      break;
    }

    total_limit = response.historic_fixtures_aggregate.aggregate.totalCount;
    offset += limit;
    counter++
  }
  
  // t1 = performance.now();
  // logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  // [🐛] debug
  // FIXME: some duplicates [?]
  /*
    const mainArrIds = []
    for (const i of h_fixtures_arr) {
      mainArrIds.push(i.id)
    }
    const duplicates = mainArrIds.filter((e, i, a) => a.indexOf(e) !== i) // [2, 4]
    logs.push(`duplicates: ${duplicates.length}`)

    if (dev) {
      const data = JSON.stringify(duplicates, null, 4)
      await fs.writeFile(`./datalog/duplicates_local_main.json`, data);
    }
  */

  return h_fixtures_arr;
}

/**
 * @description [HELPER] generate Historic-Fixtures
 * map from supplied data;
 * @param {B_H_HF[]} h_fixtures_arr 
 * @returns Promise < Map <number, B_H_HF> >
 */
export async function ABT_F_generate_historic_fixtures_map (
  h_fixtures_arr: B_H_HF[]
): Promise < Map <number, B_H_HF> > {

  const historic_fixtures_map = new Map <number, B_H_HF>()

  // [ℹ] conversion to hashmap
  // t0 = performance.now();
  
  for (const h_fixture of h_fixtures_arr) {
    historic_fixtures_map.set(h_fixture.id, h_fixture);
  }

  // t1 = performance.now();
  // logs.push(`historic_fixtures_map generated with size: ${historic_fixtures_map.size}`)
  // logs.push(`Hashmap conversion completed in: ${(t1 - t0) / 1000} sec`);

  return historic_fixtures_map;
}

/**
 * @description [MAIN] - compiles the data and process it
 * ready to be utilized and cached/displayed;
 * @param {Map <number, B_H_HF>} historic_fixtures_map 
 * @param {string[]} langArray 
 * @returns Promise < Map <string, ABT_Fixture> >
 */
export async function ABT_F_data_main (
  historic_fixtures_map: Map <number, B_H_HF>,
  langArray: string[]
): Promise < Map <string, ABT_Fixture> > {

  const cache_data_arr = new Map <string, ABT_Fixture>()

  for (const [id, data] of historic_fixtures_map.entries()) {
    for (const lang_ of langArray) {
      
      const _id = id + "_" + lang_

      const data_point_root = 
        lang_ == "en"
            ? "seo_fixtures"
            : "seo_fixtures_" + lang_

      if (data[data_point_root] == undefined) {
        continue;
      }

      const fixture_object: ABT_Fixture = {
        seo_data: data[data_point_root]
      }
      
      cache_data_arr.set(_id, fixture_object)
    }
  }

  return cache_data_arr;
}

/**
 * @description [QUERY] method for About Fixture -
 * target FIXTURE-DATA;
 * @param {number} fixture_id
 * @returns Promise < B_H_HF[] >
 */
export async function ABT_F_get_target_fixture(
  initGrapQLClient: GraphQLClient,
	fixture_id: number
): Promise < B_H_HF[] > {

	// [ℹ] obtain target historic_fixtures [fixture_id]

	// const t0 = performance.now();
	// const queryName =	'BETARENA_CACHE_SCOREBOARD_ODDS_DATA_3';

	const VARIABLES = {
		fixture_id
	};
	const response: B_H_ABT_Q = await initGrapQLClient.request(
    B_C_ABT_F_Q_D1,
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
 * @returns Promise < B_H_ABT_Q >
 */
export async function ABT_F_get_widget_translations (
  initGrapQLClient: GraphQLClient,
  langArray: string[]
): Promise < B_H_ABT_Q > {

  const QUERY_VARIABLES: { 
    langArray: string[]
  } = {
    langArray
  }

  // const t0 = performance.now();
  // const queryName = "REDIS_CACHE_FIXTURE_PROBABILITIES_1";

  const response: B_H_ABT_Q = await initGrapQLClient.request (
    B_C_ABT_F_Q_T,
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
 * @param {B_H_ABT_Q} data - data recieved from the Hasura DB
 * @param {string[]} langArray - array of target languages
 * @returns Promise < Map <string, B_ABT_T> >
 */
export async function ABT_F_translations_main (
  data: B_H_ABT_Q,
  langArray: string[]
): Promise < Map <string, B_ABT_T> > {
  
  const fix_odds_translation_map = new Map <string, B_ABT_T> ()
  
  for (const lang_ of langArray) {

    const object: B_ABT_T = {};
    object.lang = lang_;

    const objectFixAbout = data.scores_fixture_about_translations
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
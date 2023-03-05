//#region IMPORTS
// <⬇️-add-imports-below-⬇️>

import { GraphQLClient } from "graphql-request";
import { B_CONT_T, B_H_CONT_Q } from "../../types/content";
import { B_H_EC, B_H_HF } from "../../types/hasura";
import { B_C_CONT_F_Q_D0, B_C_CONT_F_Q_D1, B_C_CONT_F_Q_D2, B_C_CONT_F_Q_T } from "../graphql/query.content";

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
export async function CONT_F_get_target_historic_fixtures (
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
    
    const response: B_H_CONT_Q = await initGrapQLClient.request (
      B_C_CONT_F_Q_D0,
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
 * @description obtain target historic_fixtures;
 * obtain target season_id's;
 * @param {GraphQLClient} initGrapQLClient
 * @param {number[]} fixtureIds 
 * @returns Promise < B_H_EC[] >
 */
export async function CONT_F_get_target_external_content (
  initGrapQLClient: GraphQLClient,
  fixtureIds: number[]
): Promise < B_H_EC[] > {

  const limit = 1000;
  let offset = 0;
  let total_limit;

  let external_content_arr: B_H_EC[] = [] 
  let counter = 0

  // [ℹ] obtain target historic_fixtures
  // const queryName = "REDIS_CACHE_FIXTURE_STATISTICS_DATA_1";
  // t0 = performance.now();

  // eslint-disable-next-line no-constant-condition
  while (true) {

    const VARIABLES = {
      limit: limit,
      offset: offset,
      gameIds: fixtureIds
    }
    const response: B_H_CONT_Q = await initGrapQLClient.request (
      B_C_CONT_F_Q_D1,
      VARIABLES
    );

    external_content_arr = external_content_arr.concat(response.external_content)

    // [ℹ] exit loop
    if (offset >= total_limit) {
      // [🐛] debug
      // if (dev) console.log(`exiting loop`)
      // logs.push(`total limit: ${total_limit}`)
      // logs.push(`fixtures gathered: ${h_fixtures_arr.length}`)
      // logs.push(`exiting loop after ${counter} iterations`)
      break;
    }

    total_limit = response.external_content_aggregate.aggregate.totalCount;
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

  return external_content_arr;
}

/**
 * @description [HELPER] generate Historic-Fixtures
 * map from supplied data;
 * @param {B_H_EC[]} data 
 * @returns Promise < Map <string, B_H_EC[]> > >
 */
export async function CONT_F_generate_historic_fixtures_map (
  data: B_H_EC[]
): Promise < Map <string, B_H_EC[]> > {

  const map = new Map <string, B_H_EC[]>()

  // [ℹ] conversion to hashmap
  // t0 = performance.now();
  
  for (const content of data) {
    const id = content?.gameid + "_" + content?.lang
    // [ℹ] validation check of "key" in map existance
    if (map.has(id)) {
      const exist_arr = map.get(id)
      exist_arr.push(content)
      map.set(id, exist_arr)
    }
    // [ℹ] initialize "content" array
    else {
      const init_arr = []
      init_arr.push(content)
      map.set(id, init_arr);
    }
  }

  // t1 = performance.now();
  // logs.push(`Map generated with size: ${map.size}`)
  // logs.push(`Hashmap conversion completed in: ${(t1 - t0) / 1000} sec`);

  return map;
}

/**
 * @description [QUERY] method for Incidents Fixture -
 * target EXTERNAL CONTENT;
 * @param {number} fixture_id
 * @param {string} lang
 * @returns Promise < B_H_EC[] >
 */
export async function CONT_F_get_target_fixture(
  initGrapQLClient: GraphQLClient,
	fixture_id: number,
	lang: string
): Promise < B_H_EC[] > {

	// [ℹ] obtain target historic_fixtures [fixture_id]

	// const t0 = performance.now();
	// const queryName =	'BETARENA_CACHE_SCOREBOARD_ODDS_DATA_3';

	const VARIABLES = {
		gameId: fixture_id,
		lang
	};
	const response: B_H_CONT_Q = await initGrapQLClient.request(
    B_C_CONT_F_Q_D2,
    VARIABLES
  );

	// const t1 = performance.now();
	// logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

	return response.external_content;
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
 * @returns Promise < B_H_CONT_Q >
 */
export async function CONT_F_get_widget_translations (
  initGrapQLClient: GraphQLClient,
  langArray: string[]
): Promise < B_H_CONT_Q > {

  const QUERY_VARIABLES: { 
    langArray: string[]
  } = {
    langArray
  }

  // const t0 = performance.now();
  // const queryName = "REDIS_CACHE_FIXTURE_PROBABILITIES_1";

  const response: B_H_CONT_Q = await initGrapQLClient.request (
    B_C_CONT_F_Q_T,
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
 * @param {B_H_CONT_Q} data - data recieved from the Hasura DB
 * @param {string[]} langArray - array of target languages
 * @returns Promise < Map <string, B_CONT_T> >
 */
export async function CONT_F_translations_main (
  data: B_H_CONT_Q,
  langArray: string[]
): Promise < Map <string, B_CONT_T> > {
  
  const fix_odds_translation_map = new Map <string, B_CONT_T> ()
  
  for (const lang_ of langArray) {

    const object: B_CONT_T = {};
    object.lang = lang_;

    const objectFixAbout = data.scores_fixtures_content_translations
      .find(({ lang }) => lang === lang_)

    const objectFixGeneralTranslation = data.scores_general_translations
      .find(({ lang }) => lang === lang_)

    const MERGED_OBJECT_T = {
      ...object, 
      ...objectFixAbout?.translations,
      ...objectFixGeneralTranslation?.months,
      ...objectFixGeneralTranslation?.widgets_no_data_available
    }
    fix_odds_translation_map.set(lang_, MERGED_OBJECT_T)
  }

  return fix_odds_translation_map
}

//#endregion METHODS]
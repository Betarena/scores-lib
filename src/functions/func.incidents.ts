//#region IMPORTS
// <⬇️-add-imports-below-⬇️>

import { GraphQLClient } from "graphql-request";
import { B_H_HF } from "../../types/hasura";
import { B_H_INC_Q, B_H_INC_SJ_HF, B_INC_T, INC_Fixture, INC_Team } from "../../types/incidents";
import { B_C_INC_F_Q_D0, B_C_INC_F_Q_D1, B_C_INC_F_Q_T } from "../graphql/query.incidents.js";

//#endregion IMPORTS

//#region [METHODS]
// <⬇️-add-methods-below-⬇️>

// ==================
// 📌 MAIN DATA METHODS [below]
// ==================

/**
 * @description obtain target historic_fixtures;
 * obtain target season_id's;
 * @param {GraphQLClient} initGrapQLClient
 * @param {number[]} seasonIdsArr 
 * @returns Promise < B_H_INC_SJ_HF[] >
 */
export async function INC_F_get_target_historic_fixtures (
  initGrapQLClient: GraphQLClient,
  seasonIdsArr: number[]
): Promise < B_H_INC_SJ_HF[] > {

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
    
    const response: B_H_INC_Q = await initGrapQLClient.request (
      B_C_INC_F_Q_D0,
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
 * @param {B_H_INC_SJ_HF[]} h_fixtures_arr 
 * @returns Promise < Map <number, B_H_INC_SJ_HF> >
 */
export async function INC_F_generate_historic_fixtures_map (
  h_fixtures_arr: B_H_INC_SJ_HF[]
): Promise < Map <number, B_H_INC_SJ_HF> > {

  const historic_fixtures_map = new Map <number, B_H_INC_SJ_HF>()

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
 * @param {Map <number, B_H_INC_SJ_HF>} historic_fixtures_map 
 * @returns Promise < INC_Fixture[] >
 */
export async function INC_F_data_main (
  historic_fixtures_map: Map <number, B_H_INC_SJ_HF>
): Promise < INC_Fixture[] > {

  const cache_data_arr: INC_Fixture[] = []

  for (const [key, value] of historic_fixtures_map.entries()) {

    const fixture_id = value?.id;
    const status = value?.status_j;
    const events = 
      value?.events_j == undefined
        ? []
        : value?.events_j.sort((a, b) => parseFloat(b.minute.toString()) - parseFloat(a.minute.toString()));

    // [ℹ] home-team
    const home_team_id = value?.localteam_id_j;
    const home_team_name = value?.home_team_name || null;
    const home_team_logo = value?.home_team_logo || null; 

    // [ℹ] away-team
    const away_team_id = value?.visitorteam_id_j;
    const away_team_name = value?.away_team_name;
    const away_team_logo = value?.away_team_logo;

    const ht_score = value?.scores_j?.ht_score;
    const ft_score = value?.scores_j?.ft_score;
    const et_score = value?.scores_j?.et_score;
    const ps_score = value?.scores_j?.ps_score;

    const home_team_obj: INC_Team = {
      team_name: home_team_name || null,
      team_logo: home_team_logo || null,
      team_id: home_team_id
    }

    const away_team_obj: INC_Team = {
      team_name: away_team_name || null,
      team_logo: away_team_logo || null,
      team_id: away_team_id
    }

    // [ℹ] generate [final] fixture object
    const fixture_object: INC_Fixture = {
      id:               fixture_id || null,
      status:           status,
      score_post: {
        ht_score:       ht_score || null,
        ft_score:       ft_score || null,
        et_score:       et_score || null,
        ps_score:       ps_score || null
      },
      events:           events,
      home:             home_team_obj,
      away:             away_team_obj
    }

    cache_data_arr.push(fixture_object)
  }

  return cache_data_arr;
}

/**
 * @description [QUERY] method for Incidents Fixture -
 * target FIXTURE-DATA;
 * @param {number} fixture_id
 * @returns Promise < B_H_INC_SJ_HF[] >
 */
export async function INC_F_get_target_fixture(
  initGrapQLClient: GraphQLClient,
	fixture_id: number
): Promise < B_H_INC_SJ_HF[] > {

	// [ℹ] obtain target historic_fixtures [fixture_id]

	// const t0 = performance.now();
	// const queryName =	'BETARENA_CACHE_SCOREBOARD_ODDS_DATA_3';

	const VARIABLES = {
		fixture_id
	};
	const response: B_H_INC_Q = await initGrapQLClient.request(
    B_C_INC_F_Q_D1,
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
 * translation data for the Incidents Fixtures (widget);
 * NOTE: uses newest implementation of SINGLE and MULTI langauge
 * data retrival from Hasura DB with the use of langArray[];
 * @todo needs revision of the WRAPPER use-case
 * @version 3.0
 * @param {GraphQLClient} initGrapQLClient 
 * @param {string[]} langArray 
 * @returns Promise < B_H_INC_Q >
 */
export async function INC_F_get_widget_translations (
  initGrapQLClient: GraphQLClient,
  langArray: string[]
): Promise < B_H_INC_Q > {

  const QUERY_VARIABLES: { 
    langArray: string[]
  } = {
    langArray
  }

  // const t0 = performance.now();
  // const queryName = "REDIS_CACHE_FIXTURE_PROBABILITIES_1";

  const response: B_H_INC_Q = await initGrapQLClient.request (
    B_C_INC_F_Q_T,
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
 * @param {B_H_INC_Q} data - data recieved from the Hasura DB
 * @param {string[]} langArray - array of target languages
 * @returns Promise < Map <string, B_INC_T> >
 */
export async function INC_F_translations_main (
  data: B_H_INC_Q,
  langArray: string[]
): Promise < Map <string, B_INC_T> > {
  
  const fix_odds_translation_map = new Map <string, B_INC_T> ()
  
  for (const lang_ of langArray) {

    const object: B_INC_T = {};
    object.lang = lang_;

    const objectFixOdds = data.scores_incidents_translations
      .find(({ lang }) => lang === lang_)

    const objectFixGeneralTranslation = data.scores_general_translations
      .find(({ lang }) => lang === lang_)

    const MERGED_OBJECT_T = {
      ...object, 
      ...objectFixOdds?.translations,
      ...objectFixGeneralTranslation?.widgets_no_data_available
    }

    fix_odds_translation_map.set(lang_, MERGED_OBJECT_T)
  }

  return fix_odds_translation_map
}

//#endregion METHODS]
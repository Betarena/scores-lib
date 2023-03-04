//#region IMPORTS
// <⬇️-add-imports-below-⬇️>

import { GraphQLClient } from "graphql-request";
import { B_H_ST } from "../../types/hasura";
import { B_H_FS_Q, B_H_SJ_HF, B_H_SJ_SFL, SF_Info, SF_Team } from "../../types/scoreboard";
import { BETARENA_CACHE_SCOREBOARD_ODDS_DATA_1, BETARENA_CACHE_SCOREBOARD_ODDS_DATA_2, BETARENA_CACHE_SCOREBOARD_ODDS_DATA_3, BETARENA_CACHE_SCOREBOARD_ODDS_DATA_T } from "../graphql/query.scoreboard.js";

//#endregion IMPORTS

//#region [METHODS]
// <⬇️-add-methods-below-⬇️>

/**
 * @description obtain target historic_fixtures;
 * obtain target season_id's;
 * @param {GraphQLClient} initGrapQLClient
 * @param {number[]} seasonIdsArr 
 * @returns Promise < B_H_SJ_HF[] >
 */
export async function B_FS_get_target_historic_fixtures (
  initGrapQLClient: GraphQLClient,
  seasonIdsArr: number[]
): Promise < B_H_SJ_HF[] > {

  const limit = 1000;
  let offset = 0;
  let total_limit;

  let h_fixtures_arr: B_H_SJ_HF[] = [] 
  let counter = 0

  // [ℹ] obtain target historic_fixtures
  // const queryName = "REDIS_CACHE_SCOREBOARD_ODDS_DATA_1";
  // t0 = performance.now();

  // eslint-disable-next-line no-constant-condition
  while (true) {

    const VARIABLES = {
      limit: limit,
      offset: offset,
      seasonIds: seasonIdsArr
    }
    
    const response: B_H_FS_Q = await initGrapQLClient.request (
      BETARENA_CACHE_SCOREBOARD_ODDS_DATA_1,
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
 * @param {B_H_SJ_HF[]} h_fixtures_arr 
 * @returns Promise < Map <number, B_H_SJ_HF> >
 */
export async function B_FS_generate_historic_fixtures_map (
  h_fixtures_arr: B_H_SJ_HF[]
): Promise < Map <number, B_H_SJ_HF> > {

  const historic_fixtures_map = new Map <number, B_H_SJ_HF>()

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
 * @description [QUERY] method - gets target number[]
 * leagues and tournaments-links data;
 * @param {GraphQLClient} initGrapQLClient
 * @param {number[]} league_ids_arr 
 * @returns 
 */
export async function B_FS_get_target_leagues (
  initGrapQLClient: GraphQLClient,
  league_ids_arr: number[]
): Promise < [B_H_SJ_SFL[], B_H_ST[]] > {

  const VARIABLES_1 = {
    league_ids_arr,
    league_ids_arr_2: league_ids_arr
  }
  
  // const t0 = performance.now();
  // const queryName = "REDIS_CACHE_SCOREBOARD_ODDS_DATA_2";

	const response: B_H_FS_Q = await initGrapQLClient.request (
    BETARENA_CACHE_SCOREBOARD_ODDS_DATA_2,
    VARIABLES_1
  );

  // const t1 = performance.now();
  // logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return [
    response.scores_football_leagues, 
    response.scores_tournaments
  ];
}

/**
 * @description [HELPER] method to generate
 * a leagues & tournaments respective MAPs;
 * @param {B_H_SJ_SFL[]} league_arr 
 * @param {B_H_ST[]} tournament_arr 
 * @returns [Map <number, B_H_SJ_SFL>, Map <number, B_H_ST>]
 */
export async function B_FS_generate_leagues_tournaments_map (
  league_arr: B_H_SJ_SFL[],
  tournament_arr: B_H_ST[]
): Promise < [Map <number, B_H_SJ_SFL>, Map <number, B_H_ST>] > {

  const leagues_arr_map = new Map <number, B_H_SJ_SFL>()
  const tournaments_arr_map = new Map <number, B_H_ST>()

  // [ℹ] conversion to hashmap
  // t0 = performance.now();
  
  for (const h_fixture of league_arr) {
    leagues_arr_map.set(h_fixture.id, h_fixture);
  }
  for (const tournament of tournament_arr) {
    tournaments_arr_map.set(tournament?.tournament_id, tournament);
  }
  
  // t1 = performance.now();
  // logs.push(`leagues_arr_map generated with size: ${leagues_arr_map.size}`)
  // logs.push(`Hashmap conversion completed in: ${(t1 - t0) / 1000} sec`);

  return [
    leagues_arr_map,
    tournaments_arr_map
  ];
}

/**
 * @description [MAIN] - compiles the data and process it
 * ready to be utilized and cached/displayed;
 * @param {Map <number, B_H_SJ_HF>} historic_fixtures_map 
 * @param {Map <number, B_H_SJ_SFL>} league_map 
 * @param {Map <number, B_H_ST>} tournaments_map 
 * @returns 
 */
export async function B_FS_compile_data (
  historic_fixtures_map: Map <number, B_H_SJ_HF>,
  league_map: Map <number, B_H_SJ_SFL>,
  tournaments_map: Map <number, B_H_ST>
): Promise < SF_Info[] > {
  
  const cache_data_arr: SF_Info[] = []

  for (const [key, value] of historic_fixtures_map.entries()) {

    // const fix_season_id = value?.data?.season_id;
    const league_id = value?.league_id;
    const fixture_id = value?.id;
    const home_team_id = value?.localteam_id_j;
    const away_team_id = value?.visitorteam_id_j;

    const round = value?.round_j?.data?.name;
    // const fixture_date = value?.fixture_day;
    const fixture_time = value?.time;
    const minutes = value?.time_j?.minute;
    const status = value?.time_j?.status;

    const ht_score = value?.scores_j?.ht_score;
    const et_score = value?.scores_j?.et_score;
    const ps_score = value?.scores_j?.ps_score;

    const urls = 
      tournaments_map.has(league_id) == true
        ? tournaments_map.get(league_id)?.urls
        : null

    const home_team_name = value.home_team_name;
    const home_team_logo = value.home_team_logo;
    const home_team_score = value?.stats_j?.data?.find( ({team_id}) => team_id === home_team_id )?.goals;
    const home_team_short_code = value?.localteam_short_code_j

    const away_team_name = value.away_team_name;
    const away_team_logo = value.away_team_logo;
    const away_team_score = value?.stats_j?.data?.find( ({ team_id }) => team_id === away_team_id )?.goals;
    const away_team_short_code = value?.visitorteam_short_code_j

    const home_team_obj: SF_Team = {
      name: home_team_name,
      score: home_team_score || 0
    }

    const away_team_obj: SF_Team = {
      name: away_team_name,
      score: away_team_score || 0
    }

    // [ℹ] generate [final] fixture object
    const fixture_object: SF_Info = {
      id:               fixture_id || null,
      round:            round || null,
      home_team_name:   home_team_name || null,
      home_team_logo:   home_team_logo || null,
      home_team_short_code: home_team_short_code || home_team_name.slice(0, 3).toUpperCase() || null,
      away_team_name:   away_team_name || null,
      away_team_logo:   away_team_logo || null,
      away_team_short_code: away_team_short_code || away_team_name.slice(0, 3).toUpperCase() || null,
      minute:           minutes || null,
      status:           status || null,             
      fixture_time:     fixture_time || null,
      teams: {
        home:           home_team_obj || null,
        away:           away_team_obj || null
      },
      league_logo:      league_map.get(league_id)?.image_path_j || null,
      league_urls:      urls,
      score_post: {
        ht_score:       ht_score || null,
        et_score:       et_score || null,
        ps_score:       ps_score || null
      }
    }

    cache_data_arr.push(fixture_object)
  }

  return cache_data_arr;
}

/**
 * @description [QUERY] transaltions method for Scoreboard
 * Fixture;
 * @param {GraphQLClient} initGrapQLClient
 * @returns Promise < B_H_FS_Q >
 */
export async function B_SF_get_widget_translations (
  initGrapQLClient: GraphQLClient,
): Promise < B_H_FS_Q > {

  // const t0 = performance.now();
  // const queryName = "REDIS_CACHE_SCOREBOARD_ODDS_DATA_4";
  
  const response: B_H_FS_Q = await initGrapQLClient.request (
    BETARENA_CACHE_SCOREBOARD_ODDS_DATA_T
  );

  // const t1 = performance.now();
  // logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response;
}

/**
 * @description [QUERY] method for Scoreboard Fixture -
 * target FIXTURE-DATA;
 * @param {number} fixture_id
 * @returns Promise < B_H_SJ_HF[] >
 */
export async function B_SF_get_target_fixture(
  initGrapQLClient: GraphQLClient,
	fixture_id: number
): Promise < B_H_SJ_HF[] > {

	// [ℹ] obtain target historic_fixtures [fixture_id]

	// const t0 = performance.now();
	// const queryName =	'BETARENA_CACHE_SCOREBOARD_ODDS_DATA_3';

	const VARIABLES = {
		fixture_id
	};

	const response: B_H_FS_Q = await initGrapQLClient.request(
    BETARENA_CACHE_SCOREBOARD_ODDS_DATA_3,
    VARIABLES
  );

	// const t1 = performance.now();
	// logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

	return response.historic_fixtures;
}

//#endregion METHODS]
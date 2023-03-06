//#region IMPORTS
// <⬇️-add-imports-below-⬇️>

import { GraphQLClient } from "graphql-request";
import { B_H_HF } from "../../types/hasura";
import { B_H_LIN_Q, B_H_LIN_SJ_HF, B_H_LIN_SJ_SFP, B_LIN_T, LIN_Fixture, LIN_Player, LIN_Sub_Player, LIN_Team_Lineup } from "../../types/lineups";
import { B_C_LIN_F_Q_D0, B_C_LIN_F_Q_D1, B_C_LIN_F_Q_D2, B_C_LIN_F_Q_T } from "../graphql/query.lineups.js";

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
export async function LIN_F_get_target_historic_fixtures (
  initGrapQLClient: GraphQLClient,
  seasonIdsArr: number[]
): Promise < B_H_LIN_SJ_HF[] > {

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
    
    const response: B_H_LIN_Q = await initGrapQLClient.request (
      B_C_LIN_F_Q_D0,
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
 * @returns Promise < Map <number, B_H_LIN_SJ_HF> >
 */
export async function LIN_F_generate_historic_fixtures_map (
  h_fixtures_arr: B_H_LIN_SJ_HF[]
): Promise < Map <number, B_H_LIN_SJ_HF> > {

  const historic_fixtures_map = new Map <number, B_H_LIN_SJ_HF>()

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
 * @description [QUERY] method for Scoreboard Fixture -
 * target FIXTURE-DATA;
 * @param {number} fixture_id
 * @returns Promise < B_H_LIN_SJ_SFP[] >
 */
export async function LIN_F_get_target_player_data(
  initGrapQLClient: GraphQLClient,
	playerIdsArr: number[]
): Promise < B_H_LIN_SJ_SFP[] > {

	// [ℹ] obtain target historic_fixtures [fixture_id]

	// const t0 = performance.now();
	// const queryName =	'BETARENA_CACHE_SCOREBOARD_ODDS_DATA_3';

	const VARIABLES = {
    playerIdsArr
  }
	const response: B_H_LIN_Q = await initGrapQLClient.request(
    B_C_LIN_F_Q_D1,
    VARIABLES
  );

	// const t1 = performance.now();
	// logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

	return response.scores_football_players;
}

/**
 * @description [HELPER] generate Players
 * map from supplied data;
 * @param {B_H_SJ_HF[]} players_arr 
 * @returns Promise < Map <number, B_H_LIN_SJ_SFP> >
 */
export async function LIN_F_generate_players_map (
  players_arr: B_H_LIN_SJ_SFP[]
): Promise < Map <number, B_H_LIN_SJ_SFP> > {

  const map = new Map <number, B_H_LIN_SJ_SFP>()

  // [ℹ] conversion to hashmap
  // t0 = performance.now();
  
  for (const h_fixture of players_arr) {
    map.set(h_fixture.player_id, h_fixture);
  }

  // t1 = performance.now();
  // logs.push(`map generated with size: ${map.size}`)
  // logs.push(`Hashmap conversion completed in: ${(t1 - t0) / 1000} sec`);

  return map;
}

/**
 * @description [MAIN] - compiles the data and process it
 * ready to be utilized and cached/displayed;
 * @param {Map <number, B_H_LIN_SJ_HF>} historic_fixtures_map 
 * @returns Promise < LIN_Fixture[] >
 */
export async function LIN_F_data_main (
  historic_fixtures_map: Map <number, B_H_LIN_SJ_HF>,
  players_map:  Map <number, B_H_LIN_SJ_SFP>
): Promise < LIN_Fixture[] > {

  const cache_data_arr: LIN_Fixture[] = []

  for (const [key, value] of historic_fixtures_map.entries()) {

    const fixture_id = value?.id;
    const home_team_id = value?.localteam_id_j;
    const away_team_id = value?.visitorteam_id_j;
    const status = value?.status_j;

    // [ℹ] home-team-vital-info
    const home_team_name = value?.home_team_name || null;
    const home_team_logo = value?.home_team_logo || null;
    const home_team_coach_name = value?.home_coach_j?.fullname || null;
    const home_team_coach_avatar = value?.home_coach_j?.image_path || null;
    const home_team_short_code = value?.localteam_short_code_j;
    // [ℹ] home-team lineup [init]
    const home_team_lineup: LIN_Player[] = 
      value?.lineup_j == null 
      || value?.lineup_j.length == 0
        ? []
        : value?.lineup_j
          .filter(player => player.team_id == home_team_id)    /* filter target HOME_TEAM_ID */
          .map(p => ({
            player_id: p.player_id,
            player_name: players_map.get(p.player_id)?.common_name || p.player_name || null,
            number: p.number,
            position: p.position,
            formation_position: p.formation_position,
            player_avatar: players_map.get(p.player_id)?.image_path_j || null,
            rating: p?.stats?.rating || null,
            events: undefined
          }) /* extract target players */
        )
    ;
    // [ℹ] home-team lineup [data-injection]
    for (const h_player of home_team_lineup) {
      h_player.events = {
        injured: false,
        yeallow_card: null,
        red_card: null,
        goals: null,
        substitution: null
      }
      for (const event of value.events_j) {
        if (h_player.player_id == event.player_id) {
          if (event.type == 'yellowcard') {
            h_player.events.yeallow_card =
              h_player.events.yeallow_card == null
                ? 1
                : h_player.events.yeallow_card + 1
            ;
          }
          if (event.type == 'redcard') {
            h_player.events.red_card = 1;
          }
          if (event.type == 'goal' 
          || event.type == 'own-goal'
          || event.type == 'penalty') {
            h_player.events.goals =
              h_player.events.goals == null
                ? 1
                : h_player.events.goals + 1
            ;
          }
        }
        if (h_player.player_id == event.related_player_id) {
          if (event.injuried) {
            h_player.events.injured = true;
          }
          if (event.type == 'substitution') {
            h_player.events.substitution = event;
          }
        }
      }
    }
    // [ℹ] home-team bench [init]
    const home_team_bench: LIN_Player[] = 
      value?.bench_j == null 
      || value?.bench_j.length == 0
        ? []
        : value?.bench_j
          .filter(player => player.team_id == home_team_id)    /* filter target HOME_TEAM_ID */
          .map(p => ({
            player_id: p.player_id,
            player_name: p.player_name,
            number: p.number,
            position: p.position,
            formation_position: p.formation_position,
            player_avatar: players_map.get(p.player_id)?.image_path_j || null,
            rating: p?.stats?.rating || null,
            events: undefined
          }) /* extract target players */
        )
    ;
    // [ℹ] home-team bench [data-injection]
    for (const h_player of home_team_bench) {
      h_player.events = {
        injured: false,
        yeallow_card: null,
        red_card: null,
        goals: null,
        substitution: null
      }
      for (const event of value.events_j) {
        if (h_player.player_id == event.player_id) {
          if (event.type == 'substitution') {
            h_player.events.substitution = event;
          }
          if (event.type == 'yellowcard') {
            h_player.events.yeallow_card =
              h_player.events.yeallow_card == null
                ? 1
                : h_player.events.yeallow_card + 1
            ;
          }
          if (event.type == 'redcard') {
            h_player.events.red_card = 1;
          }
          if (event.type == 'goal' 
          || event.type == 'own-goal'
          || event.type == 'penalty') {
            h_player.events.goals =
              h_player.events.goals == null
                ? 1
                : h_player.events.goals + 1
            ;
          }
        }
        if (h_player.player_id == event.related_player_id) {
          if (event.injuried) {
            h_player.events.injured = true;
          }
        }
      }
    }
    // [ℹ] home-team substituion-detail event
    const home_team_subs: LIN_Sub_Player[] = 
      value?.substitutions_j == null 
      || value?.substitutions_j.length == 0
        ? []
        : value?.substitutions_j
          .filter(player => parseInt(player?.team_id) == home_team_id)    /* filter target HOME_TEAM_ID */
          .map(p => ({
            player_in_id: p.player_in_id,
            player_out_id: p.player_out_id,
            player_in_name: p.player_in_name,
            player_out_name: p.player_out_name,
            player_avatar_in: players_map.get(p.player_in_id)?.image_path_j || null,
            player_avatar_out: players_map.get(p.player_out_id)?.image_path_j || null
          })
        )
    ;
    
    // [ℹ] away-team
    const away_team_name = value?.away_team_name;
    const away_team_logo = value?.away_team_logo;
    const away_team_coach_name = value?.away_coach_j?.fullname || null;
    const away_team_coach_avatar = value?.away_coach_j?.image_path || null;
    const away_team_short_code = value?.visitorteam_short_code_j;
    // [ℹ] away-team lineup [init]
    const away_team_lineup: LIN_Player[] = 
      value?.lineup_j == null 
      || value?.lineup_j.length == 0
        ? []
        : value?.lineup_j
          .filter(player => player.team_id == away_team_id)    /* filter target AWAY_TEAM_ID */
          .map(p => ({
            player_id: p.player_id,
            player_name: players_map.get(p.player_id)?.common_name || p.player_name || null,
            number: p.number,
            position: p.position,
            formation_position: p.formation_position,
            player_avatar: players_map.get(p.player_id)?.image_path_j || null,
            rating: p?.stats?.rating || null,
            events: undefined
          }) /* extract target players */
        )
    ;
    // [ℹ] away-team lineup [data-injection]
    for (const a_player of away_team_lineup) {
      a_player.events = {
        injured: false,
        yeallow_card: null,
        red_card: null,
        goals: null,
        substitution: null
      }
      for (const event of value.events_j) {
        if (a_player.player_id == event.player_id) {
          if (event.type == 'yellowcard') {
            a_player.events.yeallow_card =
              a_player.events.yeallow_card == null
                ? 1
                : a_player.events.yeallow_card + 1
            ;
          }
          if (event.type == 'redcard') {
            a_player.events.red_card = 1;
          }
          if (event.type == 'goal' 
          || event.type == 'own-goal'
          || event.type == 'penalty') {
            a_player.events.goals =
              a_player.events.goals == null
                ? 1
                : a_player.events.goals + 1
            ;
          }
        }
        if (a_player.player_id == event.related_player_id) {
          if (event.injuried) {
            a_player.events.injured = true;
          }
          if (event.type == 'substitution') {
            a_player.events.substitution = event;
          }
        }
      }
    }
    // [ℹ] away-team bench [init]
    const away_team_bench: LIN_Player[] = 
      value?.bench_j == null 
      || value?.bench_j.length == 0
        ? []
        : value?.bench_j
          .filter(player => player.team_id == away_team_id)    /* filter target AWAY_TEAM_ID */
          .map(p => ({
            player_id: p.player_id,
            player_name: p.player_name,
            number: p.number,
            position: p.position,
            formation_position: p.formation_position,
            player_avatar: players_map.get(p.player_id)?.image_path_j || null,
            rating: p?.stats?.rating || null,
            events: undefined
          }) /* extract target players */
        )
    ;
    // [ℹ] away-team bench [data-injection]
    for (const a_player of away_team_bench) {
      a_player.events = {
        injured: false,
        yeallow_card: null,
        red_card: null,
        goals: null,
        substitution: null
      }
      for (const event of value.events_j) {
        if (a_player.player_id == event.player_id) {
          if (event.type == 'substitution') {
            a_player.events.substitution = event;
          }
          if (event.type == 'yellowcard') {
            a_player.events.yeallow_card =
              a_player.events.yeallow_card == null
                ? 1
                : a_player.events.yeallow_card + 1
            ;
          }
          if (event.type == 'redcard') {
            a_player.events.red_card = 1;
          }
          if (event.type == 'goal' 
          || event.type == 'own-goal'
          || event.type == 'penalty') {
            a_player.events.goals =
              a_player.events.goals == null
                ? 1
                : a_player.events.goals + 1
            ;
          }
        }
        if (a_player.player_id == event.related_player_id) {
          if (event.injuried) {
            a_player.events.injured = true;
          }
        }
      }
    }
    // [ℹ] away-team substituion-detail event
    const away_team_subs: LIN_Sub_Player[] = 
      value?.substitutions_j == null 
      || value?.substitutions_j.length == 0
        ? []
        : value?.substitutions_j
          .filter(player => parseInt(player?.team_id) == away_team_id)    /* filter target AWAY_TEAM_ID */
          .map(p => ({
            player_in_id: p.player_in_id,
            player_out_id: p.player_out_id,
            player_in_name: p.player_in_name,
            player_out_name: p.player_out_name,
            player_avatar_in: players_map.get(p.player_in_id)?.image_path_j || null,
            player_avatar_out: players_map.get(p.player_out_id)?.image_path_j || null
          })
        )
    ;

    const home_team_obj: LIN_Team_Lineup = {
      team_name:      home_team_name,
      team_logo:      home_team_logo,
      team_short_code: home_team_short_code || home_team_name?.slice(0, 3).toUpperCase() || null,
      team_rating:    value?.teams_rating?.home_team || null,
      coach_name:     home_team_coach_name,
      coach_avatar:   home_team_coach_avatar,
      lineup:         home_team_lineup,
      bench:          home_team_bench,
      formation:      value?.formations_j?.localteam_formation,
      substitutions:  home_team_subs
    }

    const away_team_obj: LIN_Team_Lineup = {
      team_name:      away_team_name,
      team_logo:      away_team_logo,
      team_short_code: away_team_short_code || away_team_name?.slice(0, 3).toUpperCase() || null,
      team_rating:    value?.teams_rating?.away_team || null,
      coach_name:     away_team_coach_name,
      coach_avatar:   away_team_coach_avatar,
      lineup:         away_team_lineup,
      bench:          away_team_bench,
      formation:      value?.formations_j?.visitorteam_formation,
      substitutions:  away_team_subs
    }

    // [ℹ] generate [final] fixture object
    const fixture_object: LIN_Fixture = {
      id: fixture_id,
      status: status,
      home: home_team_obj,
      away: away_team_obj,
      events: value?.events_j,
      team_ratings: value?.teams_rating
    }

    cache_data_arr.push(fixture_object)
  }

  return cache_data_arr;
}

/**
 * @description [QUERY] method for Lineups Fixture -
 * target FIXTURE-DATA;
 * @param {number} fixture_id
 * @returns Promise < B_H_LIN_SJ_HF[] >
 */
export async function LIN_F_get_target_fixture(
  initGrapQLClient: GraphQLClient,
	fixture_id: number
): Promise < B_H_LIN_SJ_HF[] > {

	// [ℹ] obtain target historic_fixtures [fixture_id]

	// const t0 = performance.now();
	// const queryName =	'BETARENA_CACHE_SCOREBOARD_ODDS_DATA_3';

	const VARIABLES = {
		fixture_id
	};
	const response: B_H_LIN_Q = await initGrapQLClient.request(
    B_C_LIN_F_Q_D2,
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
 * @returns Promise < B_H_LIN_Q >
 */
export async function LIN_F_get_widget_translations (
  initGrapQLClient: GraphQLClient,
  langArray: string[]
): Promise < B_H_LIN_Q > {

  const QUERY_VARIABLES: { 
    langArray: string[]
  } = {
    langArray
  }

  // const t0 = performance.now();
  // const queryName = "REDIS_CACHE_FIXTURE_PROBABILITIES_1";

  const response: B_H_LIN_Q = await initGrapQLClient.request (
    B_C_LIN_F_Q_T,
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
 * @param {B_H_LIN_Q} data - data recieved from the Hasura DB
 * @param {string[]} langArray - array of target languages
 * @returns Promise < Map <string, B_LIN_T> >
 */
export async function LIN_F_translations_main (
  data: B_H_LIN_Q,
  langArray: string[]
): Promise < Map <string, B_LIN_T> > {
  
  const fix_odds_translation_map = new Map <string, B_LIN_T> ()
  
  for (const lang_ of langArray) {

    const object: B_LIN_T = {};
    object.lang = lang_;

    const objectFixLineupTranslation = data.scores_fixture_lineup_translations
      .find(({ lang }) => lang === lang_)

    const objectFixPlayerPosTranslation = data.player_positions_translations
      .find(({ lang }) => lang === lang_)

    const objectFixGeneralTranslation = data.scores_general_translations
      .find(({ lang }) => lang === lang_)

    const MERGED_OBJECT_T = {
      ...object, 
      ...objectFixLineupTranslation?.translations,
      ...objectFixPlayerPosTranslation?.position,
      ...objectFixGeneralTranslation?.widgets_no_data_available,
    }
    fix_odds_translation_map.set(lang_, MERGED_OBJECT_T)
  }

  return fix_odds_translation_map
}

//#endregion METHODS]
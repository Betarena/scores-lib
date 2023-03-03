//#region IMPORTS

// <⬇️-add-imports-below-⬇️>

import { GraphQLClient } from "graphql-request";
import {
  B_FO_D,
  B_H_HF_FO_Q,
  B_H_SJ_HF,
  FO_Main,
  FO_Rounds_Data,
  FO_Season,
  FO_Team,
  FO_Weeks_Data
} from "../../types/fixture-odds";
import {
  BETARENA_CACHE_FIXTURES_ODDS_DATA_0,
  BETARENA_CACHE_FIXTURES_ODDS_DATA_1,
  BETARENA_CACHE_FIXTURES_ODDS_DATA_2
} from "../graphql/query.fixture-odds.js";

//#endregion IMPORTS

//#region [METHODS]

// <⬇️-add-methods-below-⬇️>

/**
 * @description (helper) method used to breakdown a
 * target season by weeks/rounds;
 * NOTE: updated [20/12/2022]
 * using HIST-FIXTURES DATA for
 * week start-end identification.
 * For rounds - using stages and stage_id
 * data to identify matching fixtures to
 * stages / rounds span;
 * @param {number[]} SEASON_ID
 * @param {B_H_HF_FO_Q} season_details_data
 * @param {Map<number, B_H_SJ_HF>} historic_fixtures_map
 * @returns Promise<Map<number, FO_Season>>
 */
export async function breakdownWeeksAndRounds(
  SEASON_IDS: number[],
  season_details_data: B_H_HF_FO_Q,
  historic_fixtures_map: Map<number, B_H_SJ_HF>
): Promise<Map<number, FO_Season>> {

  const season_week_round_ranges_map = new Map<number, FO_Season>();

  for (const SEASON_ID of SEASON_IDS) {
    
    const t_season = season_details_data.scores_football_seasons_details.find(
      ({ id }) => id === SEASON_ID
    );

    // [ℹ] season does not exist
    if (t_season == undefined) {
      return;
    }

    const season_fixture_arr: B_H_SJ_HF[] = [];
    // [ℹ] get all fixtures[] from this SEASON
    for await (const [, fixture_data] of historic_fixtures_map.entries()) {
      const fixture_season_id = fixture_data?.season_id;
      // [ℹ] validation check
      if (fixture_season_id == t_season?.id) {
        season_fixture_arr.push(fixture_data);
      }
    }

    // [ℹ] order season fixtures by ASC dates
    season_fixture_arr.sort(
      (a, b) =>
        new Date(a.fixture_day).getTime() - new Date(b.fixture_day).getTime()
    );

    // [🐞]
    // if (dev) {
    // 	console.log(
    // 		`SEASON start_date: ${season_fixture_arr[0]?.fixture_day.replace(
    // 			'T00:00:00',
    // 			''
    // 		)}`
    // 	);
    // 	console.log(
    // 		`SEASON end_date: ${season_fixture_arr[
    // 			season_fixture_arr.length - 1
    // 		]?.fixture_day.replace('T00:00:00', '')}`
    // 	);
    // }

    const seasonObj: FO_Season = {};

    // ~~~~~~~~~~~~~~~
    // ROUNDS DATA GENERATION
    // ~~~~~~~~~~~~~~~

    // [ℹ] cherry-pick rounds data correctly
    let mod_rounds: FO_Rounds_Data[] = t_season.round_data.map((d) => ({
      name: d?.name.toString(),
      type: "round",
      s_date: d?.start.toString(),
      e_date: d?.end.toString(),
      stage_id: d?.stage_id,
    }));

    const season_rounds_stage_mod_data: FO_Rounds_Data[] = [];
    // [ℹ] complete rounds generation data based off STAGE_ID
    // [ℹ] using THIS SEASON stage data
    for await (const stage of t_season.stages) {
      // [ℹ] validation check
      const rounds_match_stage = mod_rounds.find(
        ({ stage_id }) => stage_id === stage.id
      );
      if (rounds_match_stage != undefined) {
        // [🐞]
        // if (dev)
        // 	console.log(
        // 		`removing already existing stage_id in MAIN: ${stage.id}`
        // 	);
        continue;
      }
      // [ℹ] get matching stage fixtures
      const stage_fixtures = season_fixture_arr.filter(
        ({ stage_id_j }) => stage_id_j === stage.id
      );
      // [ℹ] validation check
      if (stage_fixtures != undefined) {
        // [ℹ] order season fixtures (stage) by ASC dates
        stage_fixtures.sort(
          (a, b) => Date.parse(a.fixture_day) - Date.parse(b.fixture_day)
        );
        const stage_start_date = stage_fixtures[0]?.fixture_day.replace(
          "T00:00:00",
          ""
        );
        const stage_end_date = stage_fixtures[
          stage_fixtures.length - 1
        ]?.fixture_day.replace("T00:00:00", "");
        // [ℹ] generate stage object in the rounds form
        const stage_obj: FO_Rounds_Data = {
          name: stage?.name,
          type: "advanced",
          s_date: stage_start_date,
          e_date: stage_end_date,
          stage_id: stage?.id,
        };
        // [ℹ] skip rounds without a
        if (stage_obj?.s_date == undefined || stage_obj?.e_date == undefined) {
          continue;
        }
        season_rounds_stage_mod_data.push(stage_obj);
      }
    }

    // [ℹ] merge both rounds and stages data as a single
    // [ℹ] rounds objects-array
    // if (dev)
    // 	console.log(
    // 		`rounds length (pre-merge): ${mod_rounds.length}`
    // 	);
    mod_rounds = mod_rounds.concat(season_rounds_stage_mod_data);
    // if (dev)
    // 	console.log(
    // 		`rounds length (post-merge): ${mod_rounds.length}`
    // 	);

    // [ℹ] order season fixtures by ASC dates
    mod_rounds.sort(
      (a, b) => new Date(a.s_date).getTime() - new Date(b.s_date).getTime()
    );
    let round_count = 1;
    for await (const round_moded of mod_rounds) {
      round_moded.value = round_count;
      round_count++;
    }

    // ~~~~~~~~~~~~~~~
    // WEEKS DATA GENERATION
    // ~~~~~~~~~~~~~~~

    const mod_weeks: FO_Weeks_Data[] = [];

    const season_start = season_fixture_arr[0]?.fixture_day.replace(
      "T00:00:00",
      ""
    );
    const season_end = season_fixture_arr[
      season_fixture_arr.length - 1
    ]?.fixture_day.replace("T00:00:00", "");
    const count_weeks: number = get_weeks_diff(
      new Date(season_start),
      new Date(season_end)
    );

    // [🐞]
    /**
      console.log(`seasonId: ${seasonId}`)
      if (seasonId.toString() == '19740') {
        console.log(`
          season_start: ${season_start}
          season_start v2: ${new Date(season_start)}
          count_weeks: ${count_weeks}
        `)
      }
    */

    for (let index = 0; index < count_weeks + 1; index++) {
      const name = index + 1;
      const s_date = new Date(season_start);
      const e_date = new Date(season_start);

      s_date.setDate(s_date.getDate() + index * 7);
      e_date.setDate(e_date.getDate() + index * 7);

      // [ℹ] hypothetical alternative to get
      // [ℹ] next-month "sunday"
      // const currentMonthDays = new Date(
      //   s_date.getFullYear(),
      //   s_date.getMonth() + 1,
      //   0
      // ).getDate();

      s_date.setDate(s_date.getDate() - s_date.getDay() + 1);
      e_date.setDate(e_date.getDate() - e_date.getDay() + 7);

      mod_weeks.push({
        name: name?.toString(),
        s_date: s_date?.toString(),
        e_date: e_date?.toString(),
      });
    }

    // ~~~~~~~~~~~~~~~
    // END DATA GENERATION
    // ~~~~~~~~~~~~~~~

    seasonObj.rounds = mod_rounds;
    seasonObj.weeks = mod_weeks;
    season_week_round_ranges_map.set(SEASON_ID, seasonObj);

  }

  return season_week_round_ranges_map;
}

/**
 * @description (helper) method that
 * returns the number of weeks between 2 dates;
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns number; of weeks (between 2 dates)
 */
export function get_weeks_diff(
  startDate: Date, 
  endDate: Date
): number {
  const msInWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.round(
    Math.abs(endDate.getTime() - startDate.getTime()) / msInWeek
  );
}

/**
 * @description (helper) method that identifies
 * the weeks in which there are fixtures taking place;
 * Basically looks for "non-empty" weeks with data;
 * @param {FO_Season} target_season
 * @returns Promise < FO_Weeks_Data[] >
 */
export async function identifyFixtureWeeks(
  target_season: FO_Season
): Promise<FO_Weeks_Data[]> {
  const newWeekArr: FO_Weeks_Data[] = [];

  for await (const week of target_season.weeks) {
    const week_start_t = new Date(week.s_date);
    const week_end_t = new Date(week.e_date);

    const fixturesArrMatch = target_season.fixtures.filter(
      ({ fixture_date }) =>
        new Date(fixture_date) >= week_start_t &&
        new Date(fixture_date) <= week_end_t
    );

    // [ℹ] fixtures exist
    if (fixturesArrMatch.length != 0) {
      newWeekArr.push(week);
    }
  }

  // [ℹ] additional array re-structuring
  // [ℹ] validation check for change
  if (newWeekArr.length !== target_season.weeks.length) {
    // [ℹ] re-sort array descending by "name"
    newWeekArr.sort((a, b) => parseInt(a.name) - parseInt(b.name));

    // [ℹ] update "name" (id) in sequntial [1,2,3..]
    // [ℹ] values
    let counter = 1;
    for await (const item of newWeekArr) {
      item.name = counter.toString();
      counter++;
    }
  }

  return newWeekArr;
}

/**
 * @description (helper) data pre-processing;
 * grouping fixtures by league_id's;
 * based in nested season_id's objects;
 * housing fixture_odds objects;
 * @override gather target cache data
 * inject new fixtures data (with cache)
 * merge rounds & weeks data (with each league_id's (sub) season_id)
 * @param {Map<number, B_H_SJ_HF>} historic_fixtures_map
 * @returns Promise < FO_Weeks_Data[] >
 */
export async function fixturesGroupByLeague(
  historic_fixtures_map: Map<number, B_H_SJ_HF>,
  cacheTargetLeagueData?: Map<number, B_FO_D>
): Promise<Map <number, B_FO_D>> {

  let historic_fixtures_by_league = new Map <number, B_FO_D> ()

  // [ℹ] check if overwriting is done;
  if (cacheTargetLeagueData != undefined) {
    console.log('🔥 Overriding')
    historic_fixtures_by_league = cacheTargetLeagueData
  }
  
  for (const [key, value] of historic_fixtures_map.entries()) {

    // [ℹ] shorten URLs
    if (value?.urls != undefined) {
      for (let [lang, url] of Object.entries(value?.urls)) {
        const new_url = url.replace('https://scores.betarena.com', '');
        value.urls[lang] = new_url;
      }
    }

    // historicFixturesMap.set(value.id, value) - re-inserting the SHORTER-URLS val

    const fix_season_id = value?.season_id;
    const league_id = value?.league_id;
    const fixture_id = value?.id;
    const home_team_id = value?.localteam_id_j;
    const away_team_id = value?.visitorteam_id_j;

    const round = value?.round_j?.data?.name;
    const fixture_date = value?.fixture_day;
    const fixture_time = value?.time;
    const minutes = value?.time_j?.minute;
    const status = value?.time_j?.status;

    const tip_link = value?.tip_link_wp
    const media_link = value?.media_link;
    const fixture_link = value?.urls;
    
    const home_team_name = value?.home_team_name;
    const home_red_cards = value?.stats_j?.data?.find( ({ team_id }) => team_id === home_team_id )?.redcards;
    const home_team_score = value?.scores_j?.localteam_score;
    
    const away_team_name = value?.away_team_name;
    const away_red_cards = value?.stats_j?.data?.find( ({ team_id }) => team_id === away_team_id )?.redcards;
    const away_team_score = value?.scores_j?.visitorteam_score;

    const home_team_obj: FO_Team = {
      name: home_team_name,
      score: home_team_score || 0,
      red_cards: home_red_cards || null
    }

    const away_team_obj: FO_Team = {
      name: away_team_name,
      score: away_team_score || 0,
      red_cards: away_red_cards || null
    }

    // [ℹ] generate fixtures_odds object
    const fixtures_odds_object: FO_Main = {
      id:               fixture_id,
      round:            round,
      // week:             2, // FIXME: unecessary, using fixture_date instead
      minute:           minutes,
      status:           status,             
      fixture_time:     fixture_time,
      fixture_date:     fixture_date,
      teams: {
        home:           home_team_obj,
        away:           away_team_obj
      },
      tip_link:         tip_link,
      media_link:       media_link,
      fixture_link:     fixture_link
    }

    // [ℹ] target league exists
    if (historic_fixtures_by_league.has(league_id)) {

      const league_fixtures_obj_arr = historic_fixtures_by_league.get(league_id)

      const target_season = league_fixtures_obj_arr.seasons
        .find (
          ({ season_id }) => 
            season_id === fix_season_id
          )
      ;

      // [ℹ] target season exists
      if (target_season != undefined) {

        // FIXME: can be a tedious and long task
        // FIXME: as it is only applicable to the OVERRIDE (OVERLOAD)
        // FIXME: perhpas restricting to the use of a conditional to make it work is best
        
        // [ℹ] validate fixture existance amongst existing
        const fixture_ids_array: number[] = target_season.fixtures.map(f => f.id)

        if (fixture_ids_array.includes(fixture_id)) {
          for (const fixture of target_season.fixtures) {

            // FIXME: add the check to populate a new "fixture_id"
            // FIXME: if this does not exist in the "fixtures" array in

            if (fixture.id === fixture_id) {
              
              // if (dev) console.log(`fixture_id: ${fixture.id} | before: ${fixture.status}`)

              fixture.round = historic_fixtures_map.get(fixture.id)?.round_j?.data?.name;
              fixture.fixture_date = historic_fixtures_map.get(fixture.id)?.fixture_day;
              fixture.fixture_time = historic_fixtures_map.get(fixture.id)?.time;
              fixture.minute = historic_fixtures_map.get(fixture.id)?.time_j?.minute;
              fixture.status = historic_fixtures_map.get(fixture.id)?.time_j?.status;
              fixture.teams = {
                away: {
                  name: historic_fixtures_map.get(fixture.id)?.away_team_name,
                  red_cards: historic_fixtures_map.get(fixture.id)?.stats_j?.data[1]?.redcards,
                  score: historic_fixtures_map.get(fixture.id)?.scores_j?.visitorteam_score
                },
                home: {
                  name: historic_fixtures_map.get(fixture.id)?.home_team_name,
                  red_cards: historic_fixtures_map.get(fixture.id)?.stats_j?.data[0]?.redcards,
                  score: historic_fixtures_map.get(fixture.id)?.scores_j?.localteam_score
                }
              }
              fixture.tip_link = historic_fixtures_map.get(fixture.id).tip_link_wp
              fixture.fixture_link = historic_fixtures_map.get(fixture.id).urls
              fixture.media_link = historic_fixtures_map.get(fixture.id).media_link

              // if (dev) console.log(`fixture_id: ${fixture.id} | after: ${fixture.status} | expected: ${historicFixturesMap.get(fixture.id)?.time_j?.status}`)
            }
          }
        }
        // [ℹ] else, inject new fixture id
        else {
          target_season.fixtures.push(fixtures_odds_object)
        }
        historic_fixtures_by_league.set(league_id, league_fixtures_obj_arr);

      }
      // [ℹ] no target season, init.
      else {
        const new_league_id_obj: FO_Season = {
          season_id: fix_season_id,
          fixtures: []
        }
        new_league_id_obj.fixtures.push(fixtures_odds_object)
        league_fixtures_obj_arr.seasons.push(new_league_id_obj)
        historic_fixtures_by_league.set(league_id, league_fixtures_obj_arr);
      }

    }
    // [ℹ] no target league_id yet exists
    // [ℹ] initialize MAP with LEAGUE
    else {
      const new_league_id_obj: FO_Season = {
        season_id: fix_season_id,
        fixtures: []
      }
      new_league_id_obj.fixtures.push(fixtures_odds_object)
      const fixtures_season_obj_arr: FO_Season[] = []
      fixtures_season_obj_arr.push(new_league_id_obj)
      const league_parent_obj: B_FO_D = {
        league_id: league_id,
        seasons: fixtures_season_obj_arr
      }
      historic_fixtures_by_league.set(league_id, league_parent_obj);
    }
  }

  return historic_fixtures_by_league
}

/**
 * @description (helper) query for season details
 * extra information;
 * @param {number[]} seasonIdsArr 
 * @returns Promise < B_H_HF_FO_Q >
 */
export async function get_target_season_details (
  initGrapQLClient: GraphQLClient,
  seasonIdsArr: number[]
): Promise < B_H_HF_FO_Q > {

  const VARIABLES_1 = {
    seasonIds: seasonIdsArr
  }
  
  // const t0 = performance.now();
  // const queryName = "REDIS_CACHE_FIXTURES_ODDS_DATA_2";
	const response: B_H_HF_FO_Q = await initGrapQLClient.request (
    BETARENA_CACHE_FIXTURES_ODDS_DATA_2,
    VARIABLES_1
  );
  // const t1 = performance.now();
  // logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response;
}

/**
 * @description obtain target historic_fixtures;
 * obtain target season_id's
 * @param {number[]} seasonIdsArr 
 * @returns Promise < B_H_SJ_HF[] >
 */
export async function get_target_historic_fixtures (
  initGrapQLClient: GraphQLClient,
  seasonIdsArr: number[]
): Promise < B_H_SJ_HF[] > {

  // IMPORTANTNOTE: sometimes requests exceed allowed 60s limit, thus 500 is limit
  const limit = 500;
  let offset = 0;
  let total_limit;

  let h_fixtures_arr: B_H_SJ_HF[] = [] 
  let counter = 0

  // [ℹ] obtain target historic_fixtures
  // const queryName = "REDIS_CACHE_FIXTURES_ODDS_DATA_1";
  // t0 = performance.now();
  // eslint-disable-next-line no-constant-condition
  while (true) {

    const VARIABLES = {
      limit: limit,
      offset: offset,
      seasonIds: seasonIdsArr
    }
    
    const response: B_H_HF_FO_Q = await initGrapQLClient.request (
      BETARENA_CACHE_FIXTURES_ODDS_DATA_1,
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
 * @description
 * @param {B_H_SJ_HF[]} h_fixtures_arr 
 * @returns 
 */
export async function generate_historic_fixtures_map (
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
 * @description (helper) method that merges rounds & weeks data
 * with each league_id's (&-sub) season_id 
 * @param {Map<number, FO_Season[]>} historic_fixtures_by_league 
 * @param {Map<number, FO_Season>} season_week_round_ranges_map 
 */
export async function merge_weeks_rounds_to_league (
  historic_fixtures_by_league: Map<number, B_FO_D>,
  season_week_round_ranges_map: Map<number, FO_Season>
): Promise < Map<number, B_FO_D> >  {
  
  for (const [key, value] of historic_fixtures_by_league.entries()) {

    const newObj: FO_Season[] = [] 

    // [ℹ] cont;
    if (key == null) { 
      console.log(`league_id: ${key}`)
      continue;
    }

    // [ℹ] cont;
    if (value == null || value == undefined) {
      console.log(`key: ${key}`)
      continue;
    }

    // [ℹ] cont;
    if (value?.seasons == undefined || value?.seasons == null) {
      console.log(`league_id: ${key} | season is null`)
      continue;
    }

    for (let season_fix_odds of value.seasons) {

      const seasonId = season_fix_odds.season_id
      const weeks_rounds_data = season_week_round_ranges_map.get(seasonId)

      if (weeks_rounds_data?.weeks == undefined ) {
        console.log(`week value: ${weeks_rounds_data?.weeks}`)
      }
      
      season_fix_odds = {
        season_id: seasonId,
        fixtures: season_fix_odds?.fixtures,
        weeks: weeks_rounds_data?.weeks || [],
        rounds: weeks_rounds_data?.rounds || []
      }

      // [ℹ] remove empty (NaN fixtures num.)
      // [ℹ] target weeks from weeks_list
      const modWeeksData = await identifyFixtureWeeks(season_fix_odds)
      season_fix_odds.weeks = modWeeksData

      newObj.push(season_fix_odds)

      value.seasons = newObj;
    }

    historic_fixtures_by_league.set(key, value)
  }
  
  return historic_fixtures_by_league;
}

/**
 * @description obtain target current season_id's
 * @param {GraphQLClient} initGrapQLClient
 * @returns 
 */
export async function get_current_seasons (
  initGrapQLClient: GraphQLClient,
): Promise < B_H_HF_FO_Q > {

  // const t0 = performance.now();
  // const queryName = "REDIS_CACHE_FIXTURES_ODDS_DATA_0";
  const response: B_H_HF_FO_Q = await initGrapQLClient.request (
    BETARENA_CACHE_FIXTURES_ODDS_DATA_0
  );
  // const t1 = performance.now();
  // logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response;
}
 
//#endregion METHODS]

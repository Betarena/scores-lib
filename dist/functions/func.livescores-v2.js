import { BETARENA_CACHE_LIVESCORES_V2_DATA_0, BETARENA_CACHE_LIVESCORES_V2_DATA_1 } from "../graphql/query.livescores-v2.js";
/**
 * @description [GRAPH-QL] [GET] method for obtaining
 * all historic fixtures occurring on target ISO-string
 * dates on an string[] type;
 * NOTE: takes into account getting target (single) date
 * fixtures data;
 * @returns {Promise< B_H_HF_LSV2_Q >} B_H_HF_LSV2_Q
 */
export async function get_target_date_fixtures(initGrapQLClient, fixture_dates) {
    const VARIABLES = {
        fixture_dates
    };
    // const t0 = performance.now();
    const queryName = "BETARENA_CACHE_LIVESCORES_V2_DATA_0";
    const response = await initGrapQLClient.request(BETARENA_CACHE_LIVESCORES_V2_DATA_0, VARIABLES);
    // const t1 = performance.now();
    // logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);
    return response;
}
/**
 * @description method to generate a Map<string, fixture[]>
 * grouped by fixture-day as the KEY and return;
 * @param {B_H_SJ_HF_LSV2[]} h_fixtures_arr
 * @returns {Promise < Map <string, B_H_SJ_HF_LSV2[]> >} Map <string, B_H_SJ_HF_LSV2[]>
 */
export async function generate_historic_fixtures_day_group_map(h_fixtures_arr) {
    // NOTE: key = string, value = fixture[]
    const historic_fixtures_map = new Map();
    // [ℹ] conversion to hashmap
    // NOTE: (fixture_day, fixture[])
    // t0 = performance.now();
    for (const h_fixture of h_fixtures_arr) {
        // [ℹ] generate fixture (data) object
        const FIXTURE_DATA = {
            id: h_fixture?.id,
            league_id: h_fixture?.league_id,
            status: h_fixture?.status,
            teams: {
                home: {
                    name: h_fixture?.home_team_name,
                    score: h_fixture?.scores_j?.localteam_score
                },
                away: {
                    name: h_fixture?.away_team_name,
                    score: h_fixture?.scores_j?.visitorteam_score
                }
            },
            time: h_fixture?.time,
            fixture_day: h_fixture?.fixture_day,
            urls: h_fixture?.urls,
            tips: h_fixture?.tip_link_wp,
        };
        // [ℹ] add to existing date (group)
        if (historic_fixtures_map.has(h_fixture.fixture_day)) {
            const fixtures_array = historic_fixtures_map.get(h_fixture.fixture_day);
            fixtures_array.push(FIXTURE_DATA);
            historic_fixtures_map.set(h_fixture.fixture_day, fixtures_array);
        }
        // [ℹ] generate new instance of [] fixtures
        else {
            const fixtures_array = [];
            fixtures_array.push(FIXTURE_DATA);
            historic_fixtures_map.set(h_fixture.fixture_day, fixtures_array);
        }
    }
    // t1 = performance.now();
    // logs.push(`historic_fixtures_map generated with size: ${historic_fixtures_map.size}`)
    // logs.push(`Hashmap conversion completed in: ${(t1 - t0) / 1000} sec`);
    return historic_fixtures_map;
}
/**
 * @description [GRAPH-QL] [GET] method for obtaining
 * target leagues data
 * @returns {Promise< B_H_SJ_SFL[] >} B_H_SJ_SFL
 */
export async function get_target_leagues(initGrapQLClient, league_ids_arr) {
    const VARIABLES = {
        league_ids_arr,
        league_ids_arr_2: league_ids_arr
    };
    // const t0 = performance.now();
    const queryName = "BETARENA_CACHE_LIVESCORES_V2_DATA_1";
    const response = await initGrapQLClient.request(BETARENA_CACHE_LIVESCORES_V2_DATA_1, VARIABLES);
    // const t1 = performance.now();
    // logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);
    return [response?.scores_football_leagues, response?.scores_tournaments];
}
/**
 * @description method to generate a Map<string, league[]>
 * grouped by league-id as the KEY and return;
 * @param {LS2_C_League} league_arr
 * @returns {Promise < Map <number, LS2_C_League> >} Map <string, LS2_C_League>
 */
export async function generate_leagues_map(league_arr) {
    const leagues_arr_map = new Map();
    // [ℹ] conversion to hashmap
    // t0 = performance.now();
    for (const league of league_arr) {
        const CUSTOM_OBJECT = {
            id: league?.id,
            league_name: league?.name,
            iso2: league?.country_iso2_j
        };
        leagues_arr_map.set(league.id, CUSTOM_OBJECT);
    }
    // t1 = performance.now();
    // logs.push(`leagues_arr_map generated with size: ${leagues_arr_map.size}`)
    // logs.push(`Hashmap conversion completed in: ${(t1 - t0) / 1000} sec`);
    return leagues_arr_map;
}
/**
 * @description method to generate a Map<string, league[]>
 * by their league-Id as the KEY and return;
 * @param league_arr
 * @returns
 */
export async function generate_tournaments_map(league_arr) {
    const tournaments_arr_map = new Map();
    // [ℹ] conversion to hashmap
    // t0 = performance.now();
    for (const tournament of league_arr) {
        tournaments_arr_map.set(tournament?.tournament_id, tournament);
    }
    // t1 = performance.now();
    // logs.push(`tournaments_arr_map generated with size: ${tournaments_arr_map.size}`)
    // logs.push(`Hashmap conversion completed in: ${(t1 - t0) / 1000} sec`);
    return tournaments_arr_map;
}

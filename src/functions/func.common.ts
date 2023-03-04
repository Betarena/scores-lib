import { GraphQLClient } from "graphql-request";
import { B_H_SFSD } from "../../types/hasura.js";
import { CURRENT_SEASON_IDS, GET_HREFLANG_DATA } from "../graphql/query.common.js";

/**
 * @description [GRAPH-QL] [GET] obtains target platform
 * languages used;
 * @returns {Promise < string[] >} Promise < string[] >
*/
export async function getHrefLang (
  initGrapQLClient: GraphQLClient,
): Promise < string[] > {
  // [ℹ] get the KEY platform translation langs
  const response = await initGrapQLClient.request(GET_HREFLANG_DATA)
  const langArray: string [] = response.scores_hreflang
    .filter(a => a.link)         /* filter for NOT "null" */
    .map(a => a.link)            /* map each LANG */ 
  // [ℹ] push "EN", as not included
  langArray.push('en')
  return langArray;
}

/**
 * @description obtain target current season_id's
 * @param {GraphQLClient} initGrapQLClient
 * @returns Promise < B_H_SFSD[] >
 */
export async function get_current_seasons (
  initGrapQLClient: GraphQLClient,
): Promise < B_H_SFSD[] > {

  // const t0 = performance.now();
  // const queryName = "REDIS_CACHE_FIXTURES_ODDS_DATA_0";
  const response: 
  {
    scores_football_seasons_details: B_H_SFSD[]
  } = await initGrapQLClient.request (
    CURRENT_SEASON_IDS
  );
  // const t1 = performance.now();
  // logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response.scores_football_seasons_details;
}
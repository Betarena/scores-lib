import { GraphQLClient } from "graphql-request";
import { GET_HREFLANG_DATA } from "../graphql/query.common.js";

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
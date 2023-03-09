//#region IMPORTS
// <⬇️-add-imports-below-⬇️>
//#endregion IMPORTS

import { GraphQLClient } from "graphql-request";
import { B_H_TGOL_Q, B_TGOL_D, TGOL_Goalscorer, TGOL_Translations } from "../../types/top-goalscorers";
import { B_C_TGOL_M_Q_D0, B_C_TGOL_M_Q_T } from "../graphql/query.top-goalscorers";

//#region [METHODS]
// <⬇️-add-methods-below-⬇️>

export async function TGOL_H_get_data (
  initGrapQLClient: GraphQLClient
): Promise < any > {
  
  // const t0 = performance.now();
  // const queryName = "REDIS_CACHE_LEAGUE_INFO_DATA_2";

  const response: any = await initGrapQLClient.request(
    B_C_TGOL_M_Q_D0
  );

  // const t1 = performance.now();
  // logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response;
}

export async function TGOL_H_data_main (
  data: B_H_TGOL_Q
): Promise < Map <string, B_TGOL_D> > {

  const map = new Map <string, B_TGOL_D> ()

  for (const geo of data.leagues_filtered_country) {

    const data_object: B_TGOL_D = { }
    data_object.lang = geo.lang
    data_object.top_geo_goalscorer_players = []

    for await (const league of geo.leagues) {
      for (const player of data.scores_best_goalscorers) {

        if (player.league_id.toString() === league.league_id.toString()) {
          // @ts-ignore: Unreachable code error
          data_object.top_geo_goalscorer_players.push(player)
        }

        // [ℹ] ℹ terminating condition;
        if (data_object.top_geo_goalscorer_players != undefined && 
          data_object.top_geo_goalscorer_players.length > 20) {
          break;
        }
      }

      // [ℹ] ℹ terminating condition;
      if (data_object.top_geo_goalscorer_players != undefined && 
        data_object.top_geo_goalscorer_players.length > 20) {
        break;
      }
    }

    // [ℹ] ℹ sort data OBJECT [descending order];
    data_object.top_geo_goalscorer_players.sort((a, b) => b.goals - a.goals);

    let counterPos = 0;

    // [ℹ] ℹ add extra parameter;
    for await (const player of data_object.top_geo_goalscorer_players) {
      counterPos = counterPos + 1;
      player.pos_num = counterPos;
    }

    map.set(geo.lang, data_object);
  }
  
  return map
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
 * @returns Promise < B_H_TGOL_Q >
 */
export async function TGOL_H_get_widget_translations (
  initGrapQLClient: GraphQLClient,
  langArray: string[]
): Promise < B_H_TGOL_Q > {

  const QUERY_VARIABLES: { 
    langArray: string[]
  } = {
    langArray
  }

  // const t0 = performance.now();
  // const queryName = "REDIS_CACHE_FIXTURE_PROBABILITIES_1";

  const response: B_H_TGOL_Q = await initGrapQLClient.request (
    B_C_TGOL_M_Q_T,
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
 * @param {B_H_TGOL_Q} data - data recieved from the Hasura DB
 * @param {string[]} langArray - array of target languages
 * @returns Promise < Map <string, TGOL_Translations> >
 */
export async function TGOL_H_translations_main (
  data: B_H_TGOL_Q,
  langArray: string[]
): Promise < [TGOL_Goalscorer[], Map <string, TGOL_Translations>] > {
  
  const map = new Map <string, TGOL_Translations> ()
  
  // [ℹ] filter and remove unecessary player-data;
  // @ts-ignore: Unreachable code error
  const data1 = data.scores_best_goalscorers
    .map(( { goals, image_path, league_id, logo_path, position, ...rest} ) => {
    return rest;
  });

  for (const lang_ of langArray) {

    const data_object: TGOL_Translations = { }
    data_object.lang = lang_

    const objectT1 = data.player_positions_translations
      .find(({ lang }) => lang === lang_)
      ?.position

    const objectT2 = data.scores_best_goalscorers_translations
      .find(({ lang }) => lang === lang_)
      ?.translations

    const MERGED_OBJECT_T = {
      ...data_object,
      positions_translations: objectT1,
      widget_translations: objectT2
    }
    map.set(lang_, MERGED_OBJECT_T)
  }

  return [
    data1,
    map
  ]
}

//#endregion METHODS]
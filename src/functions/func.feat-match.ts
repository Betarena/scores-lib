//#region IMPORTS
// <⬇️-add-imports-below-⬇️>
//#endregion IMPORTS

import { Database } from "firebase/database"
import { GraphQLClient } from "graphql-request"
import { B_FEATM_D, B_FEATM_T, B_H_FEATM_Q, FEATM_ValueBet } from "../../types/feat-match"
import { FIREBASE_getTargetFixtureOdds, FIREBASE_getTargetGeoSportBookDetails } from "../firebase/firebase.common.js"
import { B_C_FEATM_H_Q_D0, B_C_FEATM_H_Q_D1, B_C_FEATM_H_Q_D2, B_C_FEATM_H_Q_T } from "../graphql/query.feat-match.js"

//#region [METHODS]
// <⬇️-add-methods-below-⬇️>

export async function FEATM_get_featured_match_data (
  initGrapQLClient: GraphQLClient
): Promise < B_H_FEATM_Q > {
  const response = await initGrapQLClient.request(
    B_C_FEATM_H_Q_D0
  )
  return response
}

export async function FEATM_get_fixture_all_data (
  initGrapQLClient: GraphQLClient,
  fixtureIds: number[]
): Promise < B_H_FEATM_Q > {
  const VARIABLES: {
    fixtureIds: number[]
    fixtureIds_2: number[]
  } = {
    fixtureIds,
    fixtureIds_2: fixtureIds
  }
  const response = await initGrapQLClient.request(
    B_C_FEATM_H_Q_D1,
    VARIABLES
  )
  return response
}

export async function FEATM_get_league_all_data (
  initGrapQLClient: GraphQLClient,
  leagueIds: number[]
): Promise < B_H_FEATM_Q > {
  const VARIABLES = {
    leagueIds
  }
  const response = await initGrapQLClient.request(
    B_C_FEATM_H_Q_D2,
    VARIABLES
  )
  return response
}

export async function FEATM_H_data_main (
  db_real_time: Database,
  data: B_H_FEATM_Q
): Promise < Map <string, B_FEATM_D> > {

  try {
    
    const map = new Map <string, B_FEATM_D> ()

    // [ℹ] for each geo-selected fixture;
    for await (const sel_fixture of data?.widget_featured_match_selection) {

      let data_object_main: B_FEATM_D = { }

      // OR

      /*

        let WIDGET_SELECTED_FIXTURE_DATA: FixtureResponse = {
          // [ℹ] contains the final-fixture-response-data;
          away_team_logo: undefined,             
          away_team_name: undefined,
          country_flag: undefined,
          fixture_day: undefined,
          home_team_logo: undefined,
          home_team_name: undefined,
          id: undefined,
          inserted_at: undefined,
          league_name: undefined,
          probabilities: {
              home: undefined,
              away: undefined,
              draw: undefined,
          },
          round_name: undefined,
          status: undefined,
          time: undefined,
          tvstations: undefined,
          valuebets: undefined,
          live_odds: undefined,
          match_votes: undefined,
          best_players: undefined,
          // translation: undefined,
          selected_data: undefined,
          league_id: undefined,
          urls: undefined
        }

      */

      const geo = sel_fixture?.lang
      const _fixture_id = sel_fixture?.fixture_id

      const data_object_1 = data?.widget_featured_match_best_player
        .find(({ fixture_id }) => fixture_id == _fixture_id)

      const data_object_2 = data?.widget_featured_match_votes
        .find(({ match_id }) => match_id == _fixture_id)

      const data_object_3 = data?.week_fixtures
        .find(({ id }) => id == _fixture_id)
      
      const data_object_4 = data?.scores_tournaments
        .find(({ id }) => id == _fixture_id)

      data_object_main.best_players = data_object_1
      data_object_main.match_votes = data_object_2
      data_object_main = {...data_object_main, ...data_object_3}
      data_object_main.urls = data_object_4?.urls || null;
      data_object_main.selected_data = sel_fixture

      // TODO:
        // -> deal with handling of "live-odds" data
      data_object_main.live_odds = await FIREBASE_getTargetFixtureOdds (
        db_real_time,
        sel_fixture
      )

      // TODO:
        // -> deal with handling of "valuebets" data
      if (data_object_main?.valuebets != null) {
        const site_name = data_object_main?.valuebets?.bookmaker
        const valuebets = await FEATM_H_INT_assignValueBetsData (
          db_real_time,
          geo,
          site_name
        )
        data_object_main.valuebets = {
          ...data_object_main.valuebets,
          ...valuebets
        }
      }

      map.set(geo, data_object_main)
    }
  
    return map

  } catch (error) {
    console.error(`❌ ERR: ${error}`)
  }
}

async function FEATM_H_INT_assignValueBetsData (
  db_real_time: Database,
  user_geo: string,
  site_name: string
): Promise < FEATM_ValueBet | null > {

  const sportbook_details: any = await FIREBASE_getTargetGeoSportBookDetails (
    db_real_time,
    user_geo,
    site_name
  )

  // [ℹ] validation (exit);
  if (Object.keys(sportbook_details).length === 0) {
    return null
  }

  const valuebets = {
    image: sportbook_details?.betting_site_info?.image,
    link:  sportbook_details?.betting_site_info?.register_link,
  }

  return valuebets
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
 * @returns Promise < B_H_FEATM_Q >
 */
export async function FEATM_H_get_widget_translations (
  initGrapQLClient: GraphQLClient,
  langArray: string[]
): Promise < B_H_FEATM_Q > {

  const QUERY_VARIABLES: { 
    langArray: string[]
  } = {
    langArray
  }

  // const t0 = performance.now();
  // const queryName = "REDIS_CACHE_FIXTURE_PROBABILITIES_1";

  const response: B_H_FEATM_Q = await initGrapQLClient.request (
    B_C_FEATM_H_Q_T,
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
 * @param {B_H_FEATM_Q} data - data recieved from the Hasura DB
 * @param {string[]} langArray - array of target languages
 * @returns Promise < Map <string, B_FEATM_T> >
 */
export async function FEATM_H_translations_main (
  data: B_H_FEATM_Q,
  langArray: string[]
): Promise < Map <string, B_FEATM_T> > {
  
  const fix_odds_translation_map = new Map <string, B_FEATM_T> ()
  
  for (const lang_ of langArray) {

    const object: B_FEATM_T = {};
    object.lang = lang_;

    const objectT1 = data.widget_featured_match_translations
      .find(({ lang }) => lang === lang_)

    const MERGED_OBJECT_T = {
      ...object,
      ...objectT1
    }
    fix_odds_translation_map.set(lang_, MERGED_OBJECT_T)
  }

  return fix_odds_translation_map
}

//#endregion METHODS]
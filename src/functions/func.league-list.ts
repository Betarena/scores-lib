//#region IMPORTS
// <⬇️-add-imports-below-⬇️>

import { GraphQLClient } from "graphql-request";
import { B_H_SGT, B_H_ST } from "../../types/hasura";
import { B_H_LEGL_Q, B_LEGL_D, B_LEGL_T } from "../../types/league-list";
import { B_C_LEGL_M_Q_D0, B_C_LEGL_M_Q_T } from "../graphql/query.league-list.js";

//#endregion IMPORTS

//#region [METHODS]
// <⬇️-add-methods-below-⬇️>

export async function LEGL_getLeagueListQuery (
  initGrapQLClient: GraphQLClient,
): Promise < B_H_LEGL_Q > {
  
  // const t0 = performance.now();
  // const queryName = "REDIS_CACHE_LEAGUE_LIST_DATA_1";

  const response: B_H_LEGL_Q = await initGrapQLClient.request (
    B_C_LEGL_M_Q_D0
  );

  // const t1 = performance.now();
  // logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response;
}

export async function LEGL_H_data_main (
  response: B_H_LEGL_Q,
  tournament_map: Map< number, B_H_ST >
): Promise < Map< string, B_LEGL_D > > {

  const league_table_geo = new Map< string, B_LEGL_D >();
  
  // [ℹ] for-each country-filtered-league-list,
  for (const geo of response.leagues_filtered_country) {

    const league_object: B_LEGL_D = { }
    league_object.geo = geo.lang
    league_object.all_leagues_list = response.scores_league_list
    league_object.top_geo_leagues = []

    // [ℹ] select [TOP-7] leagues
    for (const geo_league of geo.leagues) {
      for (const league of response.scores_league_list) {

        if (league.league_id.toString() === geo_league.league_id.toString()) {
          league_object.top_geo_leagues.push(league)
        }

        if (league_object.top_geo_leagues.length > 7) {
          console.debug('➤  exiting inner loop', league_object.top_geo_leagues.length)
          break;
        }
      }

      if (league_object.top_geo_leagues.length > 6) {
        console.debug('➤  exiting main loop', league_object.top_geo_leagues.length)
        break;
      }
    }

    // [ℹ] add target tournament/league urls;
    league_object.all_leagues_list.forEach((elem) => {
      const t_league: boolean = tournament_map.has(elem.league_id);
      if (t_league) {
        const t_league = tournament_map.get(elem.league_id);
        elem.urls = t_league.urls
      }
    })
    
    league_table_geo.set(league_object.geo, league_object)
  }
  
  return league_table_geo
}

// ==================
// 📌 TRANSLATION METHODS [below]
// ==================

function compareStrings (
  a,
  b
) {
  // Assuming you want case-insensitive comparison
  a = a.toLowerCase();
  b = b.toLowerCase();
  return (a < b) ? -1 : (a > b) ? 1 : 0;
}

/**
 * @description [QUERY] method for getting
 * translation data for the Lineups Fixtures (widget);
 * NOTE: uses newest implementation of SINGLE and MULTI langauge
 * data retrival from Hasura DB with the use of langArray[];
 * @todo needs revision of the WRAPPER use-case
 * @version 3.0
 * @param {GraphQLClient} initGrapQLClient 
 * @param {string[]} langArray 
 * @returns Promise < B_H_LEGL_Q >
 */
export async function LEGL_H_get_widget_translations (
  initGrapQLClient: GraphQLClient,
  langArray: string[]
): Promise < B_H_LEGL_Q > {

  const QUERY_VARIABLES: { 
    langArray: string[]
  } = {
    langArray
  }

  // const t0 = performance.now();
  // const queryName = "REDIS_CACHE_FIXTURE_PROBABILITIES_1";

  const response: B_H_LEGL_Q = await initGrapQLClient.request (
    B_C_LEGL_M_Q_T,
    QUERY_VARIABLES
  );
  
  // const t1 = performance.now();
  // logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response;
}

export async function LEGL_obtainLeagueListTranslationMap (
  data: B_H_LEGL_Q
): Promise < Map < string, B_H_SGT > > {

  const lang_country_map = new Map < string, B_H_SGT > ()

  // const t0  = performance.now();
  
  for (const t of data.scores_general_translations) {
    lang_country_map.set(t.lang, t)
  }

  // const t1 = performance.now();
  // logs.push(`lang_country_map generated with size: ${lang_country_map.size}`)
  // logs.push(`hashmap conversion completed in: ${(t1 - t0) / 1000} sec`);

  return lang_country_map
}
  
export async function LEGL_obtainLeagueListTournamentsMap (
  data: B_H_LEGL_Q
): Promise < Map < number, B_H_ST > > {

  // const t0  = performance.now();

  const tournament_map = new Map < number, B_H_ST > ()
  for (const t of data.scores_tournaments) {
    tournament_map.set(t.tournament_id, t)
  }
  
  // const t1 = performance.now();
  // logs.push(`tournament_map generated with size: ${tournament_map.size}`)
  // logs.push(`hashmap conversion completed in: ${(t1 - t0) / 1000} sec`);

  return tournament_map
}

/**
 * @description [MAIN] method for generating a MAP
 * of target supplied translations for the 
 * Lineups Fixtures (widget);
 * NOTE: can generate for a SINGLE or MULTI langauges, depending 
 * on the ones that are supplied;
 * @version 3.0
 * @param {B_H_NAV_Q} data - data recieved from the Hasura DB
 * @param {string[]} langArray - array of target languages
 * @returns Promise < Map <string, B_LEGL_T> >
 */
export async function LEGL_H_translations_main (
  response: B_H_LEGL_Q,
  langArray: string[],
  tournament_map: Map< number, B_H_ST >,
  lang_country_map: any
): Promise < Map <string, B_LEGL_T> > {
  
  const map = new Map <string, B_LEGL_T> ()

  // [ℹ] universal [EN] [LIST]
  const pre_unique_county_list = response.scores_league_list
  .filter ((obj, pos, arr) => {
    return arr
      .map(mapObj => mapObj.country_id)
      .indexOf(obj.country_id) == pos;
  });

  for (const lang_m of langArray) {

    const widgetTranslation = response.scores_leagues_list_translations
      .find( ({ lang }) =>  lang === lang_m);

    // [ℹ] validation (continue)
    if (widgetTranslation == undefined) {
      continue
    }

    const data_object: B_LEGL_T = { }
    data_object.lang =                lang_m
    data_object.all_leagues_list =    response.scores_league_list
    data_object.translations =        widgetTranslation.translations
    data_object.unique_county_list =  pre_unique_county_list
      .map (u => ({
      country_id:     u.country_id,
      country_name:   u.country_name,
      image_path:     u.image_path
    }));

    // [ℹ] inject [URLs]
    data_object.all_leagues_list.forEach((elem) => {
      const t_league: boolean = tournament_map.has(elem.league_id);
      if (t_league) {
        const t_league = tournament_map.get(elem.league_id);
        elem.urls = t_league.urls
      }
    })

    // [ℹ] updating translating [COUNTRY_NAME]
    data_object.unique_county_list.forEach ((elem) => {
      const target_country_t: boolean = lang_country_map.has(lang_m);
      if (target_country_t) {
        const target_country_t_data = lang_country_map.get(lang_m);
        const country_name:     string = elem.country_name;

        // [🐛] debug
        // if (country_name == "Azerbaijan") {
        //   console.log(country_name + " " + lang_m + " ");
        //   console.log(target_country_t_data.countries[country_name])
        // }
        
        // const countryObjFinal = Object.assign({}, ...target_country_t_data.countries); 
        // [ℹ] TODO: update to countries[<->] when update on Hasura
        if (target_country_t_data.countries[country_name] !== undefined) {
          elem.country_name = target_country_t_data.countries[country_name]
        }
      }
    })
    // [ℹ] sort descending alphabetical order
    data_object.unique_county_list.sort (function(a, b) {
      return compareStrings(a.country_name, b.country_name);
    })

    map.set(data_object.lang, data_object)
  }
  
  return map
}

//#endregion METHODS]
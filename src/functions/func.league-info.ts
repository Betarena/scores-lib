//#region IMPORTS
// <⬇️-add-imports-below-⬇️>
//#endregion IMPORTS

import { GraphQLClient } from "graphql-request";
import { B_H_LEG_Q, B_LEG_D } from "../../types/league-info";
import { B_C_LEG_T_Q_D0, B_C_LEG_T_Q_D1, B_C_LEG_T_Q_D2 } from "../graphql/query.league-info.js";
import { removeDiacritics } from "../util/util.language.js";

//#region [METHODS]
// <⬇️-add-methods-below-⬇️>

/**
 * @description [QUERY] method for getting
 * translation data for the Complete Standings Data (widget);
 * @version 1.0
 * @param {GraphQLClient} initGrapQLClient 
 * @returns Promise < B_H_LEG_Q >
 */
export async function LEG_T_get_league_data (
  initGrapQLClient: GraphQLClient
): Promise < B_H_LEG_Q > {

  // const t0 = performance.now();
  // const queryName = "REDIS_CACHE_TOURNAMENT_STANDINGS_DATA_0";

	const response: B_H_LEG_Q = await initGrapQLClient.request (
    B_C_LEG_T_Q_D0
  );

  // const t1 = performance.now();
  // logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response;
}

/**
 * @description [MAIN] - compiles the data and process it
 * ready to be utilized and cached/displayed;
 * @param {B_H_LEG_Q} response 
 * @returns Promise < B_LEG_D[] >
 */
export async function LEG_T_data_main (
  response: B_H_LEG_Q
): Promise < B_LEG_D[] > {

  const cache_data_arr: B_LEG_D[] = []

  // NOTE:FIXME: - can be enhnaced further to process
  // data quicker by using MAP 
  // -> takes aroud 450 sec at the moment;

  // [ℹ] generate appropiate URLS
  // [ℹ] per [LANG]
  for (const iterator of response.scores_tournaments) {

    const finalCacheObj: B_LEG_D = {
      lang: undefined,
      url: undefined,
      data: {
        name: undefined,
        country: undefined,
        image_path: undefined,
        country_logo: undefined,
        // betting_site_logo?: undefined,
        // beting_cta_link?: undefined,
        seasons: [],
        translation: undefined,
        seo_content: undefined         
      }
    }

    const tournament_id = iterator.tournament_id;

    const lang: string = removeDiacritics(iterator.lang.toString().toLowerCase()).replace(/\s/g,'-').replace(/\./g, '');
    const sport: string = removeDiacritics(iterator.sport.toString().toLowerCase()).replace(/\s/g,'-').replace(/\./g, '');
    const country: string = removeDiacritics(iterator.country.toString().toLowerCase()).replace(/\s/g,'-').replace(/\./g, '');
    const league_name: string = removeDiacritics(iterator.name.toString().toLowerCase()).replace(/\s/g,'-').replace(/\./g, '');

    // [ℹ] /{lang}/{sport}/{country}/{league_name} OR 
    // [ℹ] /{sport}/{country}/{league_name} 
    // [ℹ] generation URL
    const url = iterator.lang == 'en' 
      ? '/' + sport + '/' + country + '/' + league_name
      : '/' + lang  + '/' + sport + '/' + country + '/' + league_name

    finalCacheObj.url = url;
    finalCacheObj.lang = lang;

    const targetWidgetTranslation = response.scores_widget_league_info_translations
    .find(( { lang } ) => 
      lang === iterator.lang
    ).data
    // [ℹ] league-info-2 widget data
    const leagueInfoWidget2Translations = response.widget_league_info_translations
    .find(( { lang } ) => 
      lang === iterator.lang
    )
    // [ℹ] about-tournament widget data
    const aboutTournamentTranslation = response.scores_widget_tournament_about_translations
    .find(( { lang } ) => 
      lang === iterator.lang
    )
    // [ℹ] no-widget-translations data
    const noWidgetTranslation = response.scores_general_translations
    .find(( { lang } ) => 
      lang === iterator.lang
    )

    finalCacheObj.data.translation = {
      ...targetWidgetTranslation,
      clubs:                 leagueInfoWidget2Translations?.data?.clubs,
      goals:                 leagueInfoWidget2Translations?.data?.goals,
      league_info:           leagueInfoWidget2Translations?.data?.league_info,
      average_goals:         leagueInfoWidget2Translations?.data?.average_goals,
      win_percentage:        leagueInfoWidget2Translations?.data?.win_percentage,
      average_player_rating: leagueInfoWidget2Translations?.data?.average_player_rating,
      about_the_league:      aboutTournamentTranslation?.data?.about_the_league,
      no_info:               noWidgetTranslation?.widgets_no_data_available?.no_info,
      no_info_desc:          noWidgetTranslation?.widgets_no_data_available?.no_info_desc
    }

    // NOTE: using "name" does not work,
    // NOTE: as we are comparing [iterator-name] (translated)
    // NOTE: to the "EN" league name
    // NOTE: so league_id / tournament_id is suffieicent
    const league_target = response.scores_football_leagues
    .find(( { name, id } ) => 
      // name === iterator.name &&
      id === tournament_id
    )
    
    // [🐛] debug
    // if (tournament_id == 462 && iterator.lang == 'pt') {
    //   console.log(`
    //     found it: ${JSON.stringify(finalCacheObj, null, 4)}
    //     leagueInfoWidget2Translations: ${JSON.stringify(leagueInfoWidget2Translations, null, 4)}
    //   `)
    //   break;
    // }

    // [🐛] debug erroneous league_ids
    // FIXME: there appears to be some leagues
    // FIXME: not present in the DB "scores_football_leagues"
    // FIXME: but are present in the "scores_tournaments" [?]
    if (league_target == undefined) {
      console.log(`
        undefined: ${tournament_id}
        url: ${url}
      `)
      continue;
    }

    finalCacheObj.data.image_path = league_target?.data?.logo_path;
    finalCacheObj.data.country_logo = league_target?.country?.image_path;

    finalCacheObj.data.country = iterator?.country;
    finalCacheObj.data.name = iterator?.name;

    finalCacheObj.data.seo_content = iterator?.seo_content;
    finalCacheObj.data.seasons = [] // [ℹ] reset

    // [ℹ] get all seasons for (this) league
    for (const season_main of league_target.seasons) {

      // [ℹ] match target X season from league Z to extra-info-season-data;
      const seasonExtraInfo = response.scores_football_seasons_details.find(( { id } ) => id === season_main.id)

      const num_clubs = seasonExtraInfo?.data_stats === null ? null : seasonExtraInfo?.data_stats?.number_of_clubs
      const start_date = seasonExtraInfo?.start_date
      const end_date = seasonExtraInfo?.end_date

      // [ℹ] league-info-2 widget data
      const num_goals = seasonExtraInfo?.data_stats === null 
        ? null
        : seasonExtraInfo?.data_stats?.number_of_goals
      ;
      const avg_goals = seasonExtraInfo?.data_stats === null 
        ? null
        : seasonExtraInfo?.data_stats?.goals_scored?.all
      ;
      const win_p = seasonExtraInfo?.data_stats === null 
        ? null
        : seasonExtraInfo?.data_stats?.win_percentage?.all
      ;
      const avg_player_r = seasonExtraInfo?.data_stats === null 
        ? null
        : seasonExtraInfo?.data_stats?.avg_player_rating
      ;

      // [ℹ] omit seasons with missing data:
      // if (num_clubs != null && 
      //     start_date != null && 
      //     end_date != null) {

        finalCacheObj.data.seasons.push(
          {
            ...season_main,
            number_of_clubs:  num_clubs,
            start_date:       start_date,
            end_date:         end_date,
            // [ℹ] league-info-2 widget data
            goals:            num_goals,
            avg_goals:        avg_goals,
            win_p:            win_p,
            avg_player_r:     avg_player_r
          }
        )

      // }
    }

    cache_data_arr.push(finalCacheObj)
  }

  return cache_data_arr;
}

/**
 * @description [QUERY] method for getting
 * translation data for the Complete Standings Data (widget);
 * @version 1.0
 * @param {GraphQLClient} initGrapQLClient 
 * @param {string} yesterday_str 
 * @returns Promise < B_H_LEG_Q >
 */
export async function LEG_T_get_finished_season_rounds (
  initGrapQLClient: GraphQLClient,
  _iregex: string
): Promise < B_H_LEG_Q > {
 
  // const t0 = performance.now();
  // const queryName = "REDIS_CACHE_LEAGUE_INFO_DATA_3";

  const VARIABLES = {
    _iregex
  }
  const response: B_H_LEG_Q = await initGrapQLClient.request (
    B_C_LEG_T_Q_D1,
    VARIABLES
  );

  // const t1 = performance.now();
  // logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response;
}


/**
 * @description [QUERY] method for getting
 * translation data for the Complete Standings Data (widget);
 * @version 1.0
 * @param {GraphQLClient} initGrapQLClient 
 * @param {number[]} league_ids_arr 
 * @returns Promise < B_H_LEG_Q >
 */
export async function LEG_T_get_main_league_info_data (
  initGrapQLClient: GraphQLClient,
  league_ids_arr: number[]
): Promise < B_H_LEG_Q > {

  // const t0 = performance.now();
  // const queryName = "REDIS_CACHE_LEAGUE_INFO_DATA_4";

  const VARIABLES = {
    league_ids_arr: league_ids_arr,
    league_ids_arr_2: league_ids_arr
  }
  const response: B_H_LEG_Q = await initGrapQLClient.request (
    B_C_LEG_T_Q_D2,
    VARIABLES
  );

  // const t1 = performance.now();
  // logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response;
}

//#endregion METHODS]
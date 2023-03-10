//#region IMPORTS
// <⬇️-add-imports-below-⬇️>

import { GraphQLClient } from "graphql-request";
import type { B_H_LM } from "../../types/hasura";
import type { B_H_SAP_Q, B_H_SAP_SJ_HF, B_SAP_D1, B_SAP_FP_D, B_SAP_FP_T, B_SAP_HP_T, B_SAP_TP_D, B_SAP_TP_T } from "../../types/seo-pages";
import { B_C_SAP_M_Q_D0, B_C_SAP_M_Q_D1, B_C_SAP_M_Q_D2, B_C_SAP_M_Q_D3 } from "../graphql/query.seo-pages.js";
import { removeDiacritics } from "../util/util.language.js";

//#endregion IMPORTS

//#region [METHODS]
// <⬇️-add-methods-below-⬇️>

// --------

export async function SAP_GL_get_published_fixtures (
  initGrapQLClient: GraphQLClient
): Promise< B_H_SAP_SJ_HF[] > {

  const limit = 50000;
  let offset = 0;
  let total_limit;

  const published_fixtures: B_H_SAP_SJ_HF[] = [];
  let counter = 0;

  // const t0 = performance.now();
  // const queryName = "REDIS_CACHE_PAGES_AND_SEO_FIXTURES_LINKS_0";

  // eslint-disable-next-line no-constant-condition
  while (true) {
    // [🐛] debug
    // console.log(`ℹ variables: ${VARIABLES.limit} ${VARIABLES.offset}`)

    const VARIABLES = {
      limit: limit,
      offset: offset,
    };
    const response: B_H_SAP_Q = await initGrapQLClient.request(
      B_C_SAP_M_Q_D1,
      VARIABLES
    );

    for (const fixture of response.historic_fixtures) {
      published_fixtures.push(fixture);
    }

    // [ℹ] exit loop
    if (offset >= total_limit) {
      // [🐛] debug
      // if (dev) console.log(`exiting loop!`);
      // logs.push(`total limit: ${total_limit}`);
      // logs.push(`fixtures gathered: ${published_fixtures.length}`);
      // logs.push(`exiting loop after ${counter} iterations`);
      break;
    }

    total_limit = response.historic_fixtures_aggregate.aggregate.totalCount;
    offset += limit;
    counter++;

    // IMPORTANTNOTE: - used for DEV
    break;
  }

  // const t1 = performance.now();
  // logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return published_fixtures;
}

export async function SAP_GL_get_links_map (
  initGrapQLClient: GraphQLClient
): Promise< B_H_LM[] > {

  const limit = 50000;
  let offset = 0;
  let total_limit;

  const links_arr: B_H_LM[] = [];
  let counter = 0;

  // const t0 = performance.now();
  // const queryName = "REDIS_CACHE_PAGES_AND_SEO_FIXTURES_LINKS_1";

  // eslint-disable-next-line no-constant-condition
  while (true) {
    // [🐛] debug
    // console.log(`ℹ variables: ${VARIABLES.limit} ${VARIABLES.offset}`)

    const VARIABLES = {
      limit: limit,
      offset: offset,
    };
    const response: B_H_SAP_Q = await initGrapQLClient.request(
      B_C_SAP_M_Q_D2,
      VARIABLES
    );

    for (const links of response.links_map) {
      links_arr.push(links);
    }

    // [ℹ] exit loop
    if (offset >= total_limit) {
      // [🐛] debug
      // if (dev) console.log(`exiting loop!`);
      // logs.push(`total limit: ${total_limit}`);
      // logs.push(`links_arr gathered: ${links_arr.length}`);
      // logs.push(`exiting loop after ${counter} iterations`);
      break;
    }

    total_limit = response.links_map_aggregate.aggregate.totalCount;
    offset += limit;
    counter++;

    // IMPORTANTNOTE: - used for DEV
    break;
  }

  // const t1 = performance.now();
  // logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return links_arr;
}

export async function SAP_GL_get_complete_seo_pages_data (
  initGrapQLClient: GraphQLClient
): Promise < B_H_SAP_Q > {
  
  // const t0 = performance.now();
  // const queryName = "REDIS_CACHE_LEAGUE_INFO_DATA_2";

  const response: any = await initGrapQLClient.request(
    B_C_SAP_M_Q_D0
  );

  // const t1 = performance.now();
  // logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response;
}

export async function SAP_GL_get_target_seo_pages_data (
  initGrapQLClient: GraphQLClient,
  fixture_id: number
): Promise < B_H_SAP_Q > {
  
  // const t0 = performance.now();
  // const queryName = "REDIS_CACHE_LEAGUE_INFO_DATA_2";

  const VARIABLES = {
    fixture_id
  }
  const response: B_H_SAP_Q = await initGrapQLClient.request(
    B_C_SAP_M_Q_D3,
    VARIABLES
  )

  // const t1 = performance.now();
  // logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response;
}

// --------

export async function SAP_GL_generate_page_fixtures (
  data: B_H_SAP_Q
): Promise < Map <number, B_SAP_FP_D> > {

  const map = new Map <number, B_SAP_FP_D> ()

  // [ℹ] iterate over each fixture
  for (const iterator of data.historic_fixtures) {

    // [depreceated] -> domestic ONLY check
    // [new] -> "published" ONLY check - 14/09/2022
    if (iterator?.publish_status == "draft" 
    || iterator?.urls == undefined) {
      continue;
    }

    const fixture_id = iterator?.id;
    const league_id = iterator?.league_id;
    const league_name = iterator?.league_name;

    const finalCacheObj: B_SAP_FP_D = {};

    // [ℹ] for-each available fixture (url), iterate
    // FIXME: why is it iterating over each URL (multiple times per fixture)
    // when neither the KEY/VALUE are being used ? -> can be removed , made just [0] ?
    for (const [key, value] of Object.entries(iterator.urls)) {
      
      // NOTE: surgical structure and logic used (stash)
      /*
        const url_value = value.replace('https://scores.betarena.com', '');
        const lang_ = key
        const country =
          iterator?.country_id_j == undefined
            ? null
            : data?.scores_football_countries.find( ({ id }) => id == iterator?.country_id_j)?.name

        // NOTE: sometimes no-country translation avaialble
        // NOTE: use the default as universal-transaltion
        const country_t =
          country == null ||
          data?.scores_endpoints_translations.find( ({lang}) => lang == lang_)?.countries_translation[country] == undefined
            ? country
            : data?.scores_endpoints_translations.find( ({lang}) => lang == lang_)?.countries_translation[country]

        const sport =
          data?.scores_endpoints_translations.find( ({lang}) => lang == lang_)?.sports_translation['football']
      */

      finalCacheObj.data = {
        id: fixture_id,
        sport_typ: 'football',
        country_id: iterator?.country_id_j,
        league_name: league_name,
        widgets: [],
        home_team_name: iterator?.home_team_name,
        away_team_name: iterator?.away_team_name,
        fixture_day: iterator?.fixture_day,
        venue_city: iterator?.venue_city_j,
        venue_name: iterator?.venue_name_j,
      };
      finalCacheObj.league_id = league_id
      finalCacheObj.alternate_data = iterator?.urls;
    }

    map.set(fixture_id, finalCacheObj)
  }

  return map;
}

export async function SAP_GL_generate_page_tournaments (
  data: B_H_SAP_Q
): Promise < Map <string, B_SAP_TP_D> > {

  const map = new Map <string, B_SAP_TP_D> ()

  // [ℹ] iterate over each tournament
  for (const iterator of data.scores_tournaments) {

    const finalCacheObj: B_SAP_TP_D = { }

    const tournament_id = iterator.tournament_id;

    const lang: string = removeDiacritics(
      iterator.lang.toString().toLowerCase()
    )
    .replace(/\s/g, "-")
    .replace(/\./g, "");
    const sport: string = removeDiacritics(
      iterator.sport.toString().toLowerCase()
    )
    .replace(/\s/g, "-")
    .replace(/\./g, "");
    const country: string = removeDiacritics(
      iterator.country.toString().toLowerCase()
    )
    .replace(/\s/g, "-")
    .replace(/\./g, "");
    const league_name: string = removeDiacritics(
      iterator.name.toString().toLowerCase()
    )
    .replace(/\s/g, "-")
    .replace(/\./g, "");

    
    // [ℹ] [depreceated] domestic ONLY check
    // [ℹ] [new] published ONLY check - 14/09/2022
    if (iterator.status == "draft") {
      continue;
    }

    // [ℹ] /{sport}/{country}/{league_name}
    // [ℹ] /{lang}/{sport}/{country}/{league_name}
    const url =
      iterator.lang == "en"
        ? "/" + sport + "/" + country + "/" + league_name
        : "/" + lang + "/" + sport + "/" + country + "/" + league_name
    ;

    finalCacheObj.lang = lang;
    finalCacheObj.url = url;
    finalCacheObj.data = iterator;

    // [ℹ] identify url alternate-copies (translations)
    finalCacheObj.alternate_data = data.scores_tournaments
    .filter((t) => 
      t.tournament_id === tournament_id
    );

    map.set(url, finalCacheObj)
  }

  return map
}

// -------

export async function SAP_GL_generate_seo_homepage (
  data: B_H_SAP_Q,
  langArray: string[]
): Promise < Map <string, B_SAP_HP_T> > {

  // [ℹ] per [LANG]
  // [ℹ] no-cache-deletion-required

  const map = new Map <string, B_SAP_HP_T> ()

  for (const lang_ of langArray) {

    const data_object: B_SAP_HP_T = { };

    data_object.lang = lang_;

    data_object.main_data = data.scores_seo_homepage
      .find( ({ lang }) => lang_ === lang ).main_data;

    data_object.twitter_card = data.scores_seo_homepage
      .find( ({ lang }) => lang_ === lang ).twitter_card;

    data_object.opengraph = data.scores_seo_homepage.find(
      ({ lang }) => lang_ === lang ).opengraph;

    data_object.hreflang = data.scores_hreflang;

    map.set(lang_, data_object)
  }

  return map;
}

export async function SAP_GL_generate_seo_tournaments (
  data: B_H_SAP_Q,
  langArray: string[]
): Promise < Map <string, B_SAP_HP_T> > {

  // [ℹ] per [LANG]
  // [ℹ] no-cache-deletion-required

  const map = new Map <string, B_SAP_HP_T> ()

  for (const lang_ of langArray) {

    const data_object: B_SAP_TP_T = { };

    data_object.lang = lang_;

    data_object.main_data = data.scores_seo_tournaments
      .find( ({ lang }) => lang_ === lang ).main_data;

    data_object.twitter_card = data.scores_seo_tournaments
      .find( ({ lang }) => lang_ === lang ).twitter_card;

    data_object.opengraph = data.scores_seo_tournaments
      .find( ({ lang }) => lang_ === lang ).opengraph;

    data_object.hreflang = data.scores_hreflang;

    map.set(lang_, data_object)
  }

  return map;
}

export async function SAP_GL_generate_seo_fixtures (
  data: B_H_SAP_Q,
  langArray: string[]
): Promise < Map <string, B_SAP_FP_T> > {

  // [ℹ] per [LANG]
  // [ℹ] no-cache-deletion-required

  const map = new Map <string, B_SAP_FP_T> ()

  for (const lang_ of langArray) {

    const data_object: B_SAP_FP_T = { };

    data_object.lang = lang_;

    data_object.main_data = data.scores_seo_fixtures
      .find( ({ lang }) => lang_ === lang ).main_data;

    data_object.twitter_card = data.scores_seo_fixtures
      .find( ({ lang }) => lang_ === lang ).twitter_card;

    data_object.opengraph = data.scores_seo_fixtures
      .find( ({ lang }) => lang_ === lang ).opengraph;

    data_object.hreflang = data.scores_hreflang;

    map.set(lang_, data_object)
  }

  return map;
}

// --------

export async function SAP_GL_generate_general_translations (
  data: B_H_SAP_Q,
  langArray: string[]
): Promise < [ Map <number, B_SAP_D1>, Map <string, B_SAP_D1> ] > {

  const map = new Map <number, B_SAP_D1> ()
  const map1 = new Map <string, B_SAP_D1> ()

  // [ℹ] generate countires translations
  for (const country of data.scores_football_countries) {

    const country_id = country.id
    const country_name = country.name

    const country_t_object: { 
      [key: string]: string 
    } = { }

    const main_data: B_SAP_D1 = {};
    main_data.country_id = country_id
    main_data.translations = country_t_object

    for (const lang_ of langArray) {
      // NOTE: sometimes no-country translation avaialble
      // use the 'default' as universal-translation
      const country_t =
        country == null 
        || data?.scores_endpoints_translations
          .find(({ lang }) => 
            lang == lang_
          )?.countries_translation[country_name] == undefined
            ? country_name
            : data?.scores_endpoints_translations
              .find(({ lang }) => 
                lang == lang_
              )?.countries_translation[country_name];
      main_data.translations[lang_] = country_t
    }
    map.set(country_id, main_data)
  }

  // [ℹ] generate sports translations
  const sport_t_object: { 
    [key: string]: string 
  } = { }

  for (const lang_ of langArray) {
    const sports_translation = data?.scores_endpoints_translations
      .find(({ lang }) => 
        lang == lang_
      )?.sports_translation["football"];
    sport_t_object[lang_] = sports_translation
    map1.set(lang_, sport_t_object)
  }

  return [
    map,
    map1
  ];
}

//#endregion METHODS]
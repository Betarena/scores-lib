import { gql } from 'graphql-request';
/**
 * @description [GET] GraphQl Query target fixtures
 * occurring (this) week;
 * Cache (TTL:300 Enabled)
 * @param {string AS timestamp!} fixture_dates
 */
export const BETARENA_CACHE_LIVESCORES_V2_DATA_0 = gql `
  query BETARENA_CACHE_LIVESCORES_V2_DATA_0
  (
    $fixture_dates: [timestamp!]
  )
  @cached 
  (ttl: 300)
  {
    historic_fixtures (
      order_by: {
        fixture_day: asc,
        id: asc
      },
      where: {
        fixture_day: {
          _in: $fixture_dates
        },
        publish_status: {
            _eq: "published"
        }
      }
    ) {
      id
      league_id
      fixture_day
      time
      status
      home_team_name
      away_team_name
      urls
      tip_link_wp
      # (nested)
      localteam_id_j: data(path: "$.localteam_id")
      visitorteam_id_j: data(path: "$.visitorteam_id")
      scores_j: data(path: "$.scores")
    }
  }
`;
/**
 * @description [GET] GraphQl Query target fixture-leagues
 * data;
 * Cache (TTL:300 Enabled)
 * @param {string AS timestamp!} fixture_dates
 */
export const BETARENA_CACHE_LIVESCORES_V2_DATA_1 = gql `
  query BETARENA_CACHE_LIVESCORES_V2_DATA_1
  (
    $league_ids_arr: [numeric!],
    $league_ids_arr_2: [Int!]
  ) 
  @cached 
  (ttl: 300)
  {
    scores_football_leagues (
      where: {
        id: {
          _in: $league_ids_arr
        }
      }
    ) {
      id
      name
      # (nested)
      country_iso2_j: data(path: "$.country.data.extra.iso2")
    }
    scores_tournaments (
      where: {
        tournament_id: {
          _in: $league_ids_arr_2
        }
      }
    ) {
      tournament_id
      urls
    }
  }
`;
/**
 * @description [GET] GraphQl Query for Livescore (V2)
 * widget transaltions;
 * Cache (TTL:300 Enabled)
 */
export const BETARENA_CACHE_LIVESCORES_V2_DATA_T = gql `
  query BETARENA_CACHE_LIVESCORES_V2_DATA_T
  @cached 
  (ttl: 300)
  {
    scores_livescore_football_translations {
      lang
      status_abv
      terms
      status
    }
    scores_general_translations {
      lang
      countries
      widgets_no_data_available
      weekdays
      months
    }
  }
`;

// IMPORTANT [DO NOT REMOVE]
// IMPORTANT <UNCOMMENT-ME-WHEN-USING>
import { gql } from 'graphql-request';

//#region [QUERIES]

// IMPORTANT [DO NOT REMOVE] NAMING:
// NOTE: please follow the following naming structure:
// NOTE: BETARENA_CACHE_<type-for-target-data>_DATA_<type-target-data-type/number>
// ----
// For example: for the Livescores-V2 widget data (queries) declaration target:
// -> EX: BETARENA_CACHE_LIVESCORES_V2_DATA_0 (a query)
// -> EX: BETARENA_CACHE_LIVESCORES_V2_DATA_1 (another query)
// -> [etc.]
// -> EX: BETARENA_CACHE_LIVESCORES_V2_DATA_T (a translation query)
// ----
// IMPORTANT [DO NOT REMOVE] STRUCTURE:
// -> take a look at grapqhl/query.livescores-v2.ts as (main) indicator as to how to structure

// <⬇️-type-queries-below-⬇️>

/**
 * @description [GET] GraphQl Query target seasons
 * that are of type "is_current_season";
 * Cache (TTL:300);
 */
export const BETARENA_CACHE_FIXTURES_ODDS_DATA_0 = gql`
  query BETARENA_CACHE_FIXTURES_ODDS_DATA_0 
  @cached 
  (ttl: 300)
  {
    scores_football_seasons_details (
      where: {
        is_current_season: {
          _eq: true
        }
      }
    ) {
      id
    }
  }
`;

/**
 * @description [GET] GraphQl Query get target fixtures
 * (historic_fixtures) that are of type season (is_current_season);
 * WARNING -> Large Query
 * WARNING -> Uses pagination
 * WARNING -> _0 dependent
 * Cache (TTL:300);
 * @param {number} limit
 * @param {number} offset
 * @param {number[]} seasonIds
 */
export const BETARENA_CACHE_FIXTURES_ODDS_DATA_1 = gql`
  query BETARENA_CACHE_FIXTURES_ODDS_DATA_1 
  (
    $limit: Int,
    $offset: Int,
    $seasonIds: [Int!]
  ) 
  @cached 
  (ttl: 300)
  {
    historic_fixtures_aggregate (
      where: {
        season_id: {
          _in: $seasonIds
        }
      }
    ) {
      aggregate {
        totalCount: count
      }
    }
    historic_fixtures (
      order_by: {
        fixture_day: asc,
        id: asc
      },
      limit: $limit,
      offset: $offset,
      where: {
        season_id: {
          _in: $seasonIds
        }
      }
    ) {
      id
      fixture_day
      time
      away_team_name
      home_team_name
      round_name
      season_id
      league_id
      tip_link_wp
      fixture_link_wp
      media_link
      urls
      # [alt V1]
      # data
      # [alt V2]
      stats_j: data(path: "$.stats")
      localteam_id_j: data(path: "$.localteam_id")
      visitorteam_id_j: data(path: "$.visitorteam_id")
      round_j: data(path: "$.round")
      time_j: data(path: "$.time")
      scores_j: data(path: "$.scores")
      stage_id_j: data(path: "$.stage.data.id")
    }
  }
`;

/**
 * @description [GET] GraphQl Query target seasons info
 * that match the ID's from the given number[] array param.
 * NOTE: although the is large, unecessary to paginate as
 * it's limted to target data;
 * Cache (TTL:300);
 * @param {number[]} seasonIds
 */
export const BETARENA_CACHE_FIXTURES_ODDS_DATA_2 = gql`
  query BETARENA_CACHE_FIXTURES_ODDS_DATA_2 
  (
    $seasonIds: [numeric!]
  )
  @cached 
  (ttl: 300)
  {
    scores_football_seasons_details (
      where: {
        id: {
          _in: $seasonIds
        }
      }
    ) {
      id
      league_id
      round_data
      default_data
      stages
    }
  }
`;

/**
 * @description [GET] GraphQl Query for FixtureOdds
 * widget transaltions;
 * Cache (TTL:300 Enabled)
 */
export const BETARENA_CACHE_FIXTURES_ODDS_DATA_T = gql`
  query BETARENA_CACHE_FIXTURES_ODDS_DATA_T 
  @cached 
  (ttl: 300) 
  {
    scores_widget_football_fixtures_odds_translations {
      lang
      translations
    }
    scores_livescore_football_translations {
      lang
      status_abv
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

/**
 * @description [GET] GraphQl Query target fixtures info
 * that match the ID's from the given number[] array param.
 * Cache (TTL:300 Enabled)
 * @param {number[]} fixtureIds
 */
export const BETARENA_CACHE_FIXTURES_ODDS_ST_DATA_1 = gql`
  query BETARENA_CACHE_FIXTURES_ODDS_ST_DATA_1 
  (
    $fixtureIds: [Int!]
  )
  @cached 
  (ttl: 300)
  {
    historic_fixtures (
      where: {
        id: {
          _in: $fixtureIds
        }
      }
    ) {
      id
      fixture_day
      time
      away_team_name
      home_team_name
      round_name
      season_id
      league_id
      tip_link_wp
      fixture_link_wp
      media_link
      urls
      # [alt V1]
      # data
      # [alt V2]
      stats_j: data(path: "$.stats")
      localteam_id_j: data(path: "$.localteam_id")
      visitorteam_id_j: data(path: "$.visitorteam_id")
      round_j: data(path: "$.round")
      time_j: data(path: "$.time")
      scores_j: data(path: "$.scores")
      stage_id_j: data(path: "$.stage.data.id")
    }
  }
`;

/**
 * @description [GET] GraphQl Query target fixtures info
 * that match the ID's from the given (season-id's) number[] array param.
 * Cache (TTL:300 Enabled)
 * @param {number} season_id
 */
export const BETARENA_CACHE_FIXTURES_ODDS_DATA_4 = gql`
  query BETARENA_CACHE_FIXTURES_ODDS_DATA_4 
  (
    $season_id: Int
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
        season_id: {
          _eq: $season_id
        }
      }
    ) {
      id
      fixture_day
      time
      away_team_name
      home_team_name
      round_name
      league_id
      tip_link_wp
      fixture_link_wp
      media_link
      # [alt V1]
      # data
      # [alt V2]
      stats_j: data(path: "$.stats")
      localteam_id_j: data(path: "$.localteam_id")
      visitorteam_id_j: data(path: "$.visitorteam_id")
      round_j: data(path: "$.round")
      time_j: data(path: "$.time")
    }
  }
`;

/**
 * @description [GET] GraphQl Query GET current seasons of TARGET LEAGUE
 * Cache (TTL:300 Enabled)
 * @param {number} league_id
 */
export const BETARENA_CACHE_FIXTURES_ODDS_DATA_5 = gql`
	query BETARENA_CACHE_FIXTURES_ODDS_DATA_5
  (
		$league_id: numeric
	) 
  @cached
  (ttl: 300) 
  {
		scores_football_seasons_details (
			where: {
				is_current_season: {
          _eq: true 
        }
				league_id: { 
          _eq: $league_id 
        }
			}
		) {
			id
		}
	}
`;

//#endregion [QUERIES]
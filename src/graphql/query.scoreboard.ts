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
 * @description [GET] GraphQl Query get target fixtures
 * (historic_fixtures) that are of type season (is_current_season);
 * WARNING -> ⏳ Large Query
 * WARNING -> ✅ Uses pagination
 * Cache (TTL:300);
 * @param {number} limit
 * @param {number} offset
 * @param {number[]} seasonIds
 */
export const BETARENA_CACHE_SCOREBOARD_ODDS_DATA_1 = gql`
  query BETARENA_CACHE_SCOREBOARD_ODDS_DATA_1 
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
      away_team_logo
      home_team_name
      home_team_logo
      round_name
      league_id
      season_id
      # [alt V1]
      # data
      # [alt V2]
      stats_j: data(path: "$.stats")
      localteam_id_j: data(path: "$.localteam_id")
      visitorteam_id_j: data(path: "$.visitorteam_id")
      time_j: data(path: "$.time")
      round_j: data(path: "$.round")
      scores_j: data(path: "$.scores")
      localteam_short_code_j: data(path: "$.localTeam.data.short_code")
      visitorteam_short_code_j: data(path: "$.visitorTeam.data.short_code")
    }
  }
`;

/**
 * @description [GET] GraphQl Query get league-id's
 * for scores_football_leagues & scores_tournaments;
 * Cache (TTL:300);
 * @param {number[]} league_ids_arr
 * @param {number[]} league_ids_arr_2
 */
export const BETARENA_CACHE_SCOREBOARD_ODDS_DATA_2 = gql`
  query BETARENA_CACHE_SCOREBOARD_ODDS_DATA_2 
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
      # [alt V1]
      # data
      # [alt V2]
      image_path_j: data(path: "$.logo_path")
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
 * @description [GET] GraphQl Query for Fixture Scoreboard
 * widget transaltions;
 * Cache (TTL:300 Enabled)
 */
export const BETARENA_CACHE_SCOREBOARD_ODDS_DATA_T = gql`
  query BETARENA_CACHE_SCOREBOARD_ODDS_DATA_T 
  @cached
  (ttl: 300)
  {
    scores_fixture_scoreboard_translations {
      lang
      translations
    }
  }
`;

/** 
 * ====================
 * [ℹ] Surgical Queries
 * ====================
*/

/**
 * @description [GRAPH-QL] for Scoreboard Fixture
 * widget target FIXTURE-ID data;
 * Cache (TTL:300 Enabled)
 * @param {number} fixture_id
 */
export const BETARENA_CACHE_SCOREBOARD_ODDS_DATA_3 = gql`
  query BETARENA_CACHE_SCOREBOARD_ODDS_DATA_3
  (
    $fixture_id: Int!
  ) 
  @cached 
  (ttl: 300)
  {
    historic_fixtures (
      where: {
        id: {
          _eq: $fixture_id
        }
      }
    ) {
      id
      fixture_day
      time
      away_team_name
      away_team_logo
      home_team_name
      home_team_logo
      round_name
      league_id
      season_id
      # [alt V1]
      # data
      # [alt V2]
      stats_j: data(path: "$.stats")
      localteam_id_j: data(path: "$.localteam_id")
      visitorteam_id_j: data(path: "$.visitorteam_id")
      time_j: data(path: "$.time")
      round_j: data(path: "$.round")
      scores_j: data(path: "$.scores")
      localteam_short_code_j: data(path: "$.localTeam.data.short_code")
      visitorteam_short_code_j: data(path: "$.visitorTeam.data.short_code")
    }
  }
`;

//#endregion [QUERIES]
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
export const B_C_INC_F_Q_D0 = gql`
  query B_C_INC_F_Q_D0 
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
      localteam_id_j: data(path: "$.localteam_id")
      visitorteam_id_j: data(path: "$.visitorteam_id")
      events_j:  data(path: "$.events.data")
      status_j: data(path: "$.time.status")
      scores_j: data(path: "$.scores")
    }
  }
`;

/**
 * @description [GET] GraphQl Query for Incidents Fixture
 * widget translations;
 * Cache (TTL:300 Enabled)
 * @version 1.0 - passed as a variable
 * @param {string[]} langArray
 */
export const B_C_INC_F_Q_T = gql`
  query B_C_INC_F_Q_T 
  (
    $langArray: [String!]
  )
  @cached 
  (ttl: 300)  
  {
    scores_incidents_translations (
			where: { 
        lang: {
          _in: $langArray 
        } 
      }
    ) {
      lang
      translations
    }
    scores_general_translations (
			where: { 
        lang: {
          _in: $langArray 
        } 
      }
    ) {
      lang
      widgets_no_data_available
    }
  }
`;

/** 
 * ====================
 * [ℹ] Surgical Queries
 * ====================
*/

export const B_C_INC_F_Q_D1 = gql`
  query B_C_INC_F_Q_D1
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
      localteam_id_j: data(path: "$.localteam_id")
      visitorteam_id_j: data(path: "$.visitorteam_id")
      events_j:  data(path: "$.events.data")
      status_j: data(path: "$.time.status")
      scores_j: data(path: "$.scores")
    }
  }
`;

//#endregion [QUERIES]
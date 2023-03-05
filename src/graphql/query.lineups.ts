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
export const B_C_LIN_F_Q_D0 = gql`
  query B_C_LIN_F_Q_D0 
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
      teams_rating
      # [alt V1]
      # data
      # [alt V2]
      localteam_id_j: data(path: "$.localteam_id")
      visitorteam_id_j: data(path: "$.visitorteam_id")
      lineup_j: data(path: "$.lineup.data")
      bench_j: data(path: "$.bench.data")
      formations_j: data(path: "$.formations")
      substitutions_j: data(path: "$.substitutions.data")
      home_coach_j: data(path: "$.localCoach.data")
      away_coach_j: data(path: "$.visitorCoach.data")
      events_j: data(path: "$.events.data")
      localteam_short_code_j: data(path: "$.localTeam.data.short_code")
      visitorteam_short_code_j: data(path: "$.visitorTeam.data.short_code")
      status_j: data(path: "$.time.status")
    }
  }
`;

/**
 * [ℹ] Tournaments / Top_Players Widget 
 * [ℹ] Surgical (#2)
 * [ℹ] Based on Team_id's & Player_id's
*/
export const B_C_LIN_F_Q_D1 = gql`
  query B_C_LIN_F_Q_D1
  (
    $playerIdsArr: [numeric!]
  )
  @cached 
  (ttl: 300)
  {
    scores_football_players (
      where: {
        player_id: {
          _in: $playerIdsArr
        }
      } 
    ) {
      player_id
      common_name
      image_path_j: data(path: "$.image_path")
    }
  }
`;

/**
 * @description [GET] GraphQl Query for Probabilities Lineupds
 * widget translations;
 * Cache (TTL:300 Enabled)
 * @version 1.0 - passed as a variable
 * @param {string[]} langArray
 */
export const B_C_LIN_F_Q_T = gql`
  query B_C_LIN_F_Q_T 
  (
    $langArray: [String!]
  )
  @cached 
  (ttl: 300)  
  {
    player_positions_translations (
			where: { 
        lang: {
          _in: $langArray 
        } 
      }
    ) {
      lang
      position
    }
    scores_general_translations (
			where: { 
        lang: {
          _in: $langArray 
        } 
      }
    ) {
      lang
      countries
      widgets_no_data_available
      weekdays
      months
    }
    scores_fixture_lineup_translations (
			where: { 
        lang: {
          _in: $langArray 
        } 
      }
    ) {
      lang
      translations
    }
  }
`;

// ====================
// 📌 SURGICAL QUERIES
// ====================

export const B_C_LIN_F_Q_D2 = gql`
  query B_C_LIN_F_Q_D2
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
      teams_rating
      # [alt V1]
      # data
      # [alt V2]
      localteam_id_j: data(path: "$.localteam_id")
      visitorteam_id_j: data(path: "$.visitorteam_id")
      lineup_j:  data(path: "$.lineup.data")
      bench_j: data(path: "$.bench.data")
      formations_j:  data(path: "$.formations")
      substitutions_j: data(path: "$.substitutions.data")
      home_coach_j: data(path: "$.localCoach.data")
      away_coach_j: data(path: "$.visitorCoach.data")
      events_j: data(path: "$.events.data")
      localteam_short_code_j: data(path: "$.localTeam.data.short_code")
      visitorteam_short_code_j: data(path: "$.visitorTeam.data.short_code")
      status_j: data(path: "$.time.status")
    }
  }
`;

//#endregion [QUERIES]
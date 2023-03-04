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
 * @description [GET] GraphQl Query get target season
 * top-goalscores / assits-scores data information;
 * NOTE: that are of type season (is_current_season);
 * WARNING -> ⏳ Large Query
 * WARNING -> ✅ Uses pagination
 * Cache (TTL:300);
 * @param {number} limit
 * @param {number} offset
 * @param {number[]} seasonIds
 */
export const BETARENA_CACHE_TOP_PLAYERS_DATA_0 = gql`
  query BETARENA_CACHE_TOP_PLAYERS_DATA_0 
  (
    $limit: Int, 
    $offset: Int,
    $seasonIds: [numeric!]
  ) 
  @cached 
  (ttl: 300)
  {
    scores_football_seasons_details_aggregate (
      where: {
        id: {
          _in: $seasonIds
        }
      }
    ) {
      aggregate {
        totalCount: count
      }
    }
    scores_football_seasons_details (
      order_by: {
        id: asc
      },
      limit: $limit,
      offset: $offset,
      where: {
        id: {
          _in: $seasonIds
        }
      }
    ) {
      id
      league_id
      goalscorers
      assistscorers
      squad
    }
  }
`

/**
 * @description [GET] GraphQl Query get target
 * data for TEAM-ID's & PLAYER-ID's;
 * WARNING -> ⏳ Large Query
 * WARNING -> ❌ Uses pagination
 * Cache (TTL:300);
 * @param {number[]} teamIds
 * @param {number[]} playerIds
 */
export const BETARENA_CACHE_TOP_PLAYERS_DATA_2 = gql`
  query BETARENA_CACHE_TOP_PLAYERS_DATA_2
  (
    $teamIds: [numeric!],
    $playerIds: [numeric!]
  )
  @cached 
  (ttl: 300)
  {
    scores_football_teams (
      where: {
        id: {
          _in: $teamIds
        }
      } 
    ) {
      data
      id
      name
    }
    scores_football_players (
      where: {
        player_id: {
          _in: $playerIds
        }
      } 
    ) {
      data
      player_id
      common_name
      nationality
    }
  }
`;

/**
 * @description [GET] GraphQl Query for Top Players
 * widget translation;
 * Cache (TTL:300)
 */
export const BETARENA_CACHE_TOP_PLAYERS_DATA_T = gql`
  query BETARENA_CACHE_TOP_PLAYERS_DATA_T
  @cached 
  (ttl: 300) 
  {
    scores_widget_top_players_translations { 
      lang
      data
    }
    player_positions_translations {
      lang
      position
    }
    scores_general_translations {
      lang
      widgets_no_data_available
    }
  }
`;

//#endregion [QUERIES]
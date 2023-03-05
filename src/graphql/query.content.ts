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
export const B_C_CONT_F_Q_D0 = gql`
  query B_C_CONT_F_Q_D0 
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
      league_id
      season_id
    }
  }
`;

/**
 * @description [GET] GraphQl Query get target fixtures
 * (external_content) for target fixture-id's;
 * WARNING -> ⏳ Large Query
 * WARNING -> ✅ Uses pagination
 * Cache (TTL:300);
 * @param {number} limit
 * @param {number} offset
 * @param {number[]} gameIds
 */
export const B_C_CONT_F_Q_D1 = gql`
  query B_C_CONT_F_Q_D1 
  (
    $limit: Int,
    $offset: Int,
    $gameIds: [Int!]
  ) 
  @cached 
  (ttl: 300)
  {
    external_content_aggregate (
      where: {
        gameid: {
          _in: $gameIds
        }
      }
    ) {
      aggregate {
        totalCount: count
      }
    }
    external_content (
      order_by: {
        date: desc,
        id: desc
      },
      limit: $limit,
      offset: $offset,
      where: {
        gameid: {
          _in: $gameIds
        }
      }
    ) {
      id
      source
      title
      lang
      link
      featured_media
      excerpt
      author
      date
      gameid
      category
    }
  }
`;

/**
 * @description [GET] GraphQl Query for Content Fixtures
 * widget translations;
 * Cache (TTL:300 Enabled)
 * @version 1.0 - passed as a variable
 * @param {string[]} langArray
 */
export const B_C_CONT_F_Q_T = gql`
  query B_C_CONT_F_Q_T 
  (
    $langArray: [String!]
  )
  @cached 
  (ttl: 300)  
  {
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
    scores_fixtures_content_translations (
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

export const B_C_CONT_F_Q_D2 = gql`
  query B_C_CONT_F_Q_D2
  (
    $gameId: Int!,
    $lang: String
  ) 
  @cached 
  (ttl: 300)
  {
    external_content (
      order_by: {
        date: desc
      },
      where: {
        gameid: {
          _eq: $gameId
        },
        lang: {
          _eq: $lang
        }
      }
    ) {
      id
      source
      title
      lang
      link
      featured_media
      excerpt
      author
      date
      gameid
      category
    }
  }
`;

//#endregion [QUERIES]
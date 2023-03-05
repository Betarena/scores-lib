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
export const B_C_ABT_F_Q_D0 = gql`
  query B_C_ABT_F_Q_D0 
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
      seo_fixtures
      seo_fixtures_pt
      seo_fixtures_br
      seo_fixtures_es
      seo_fixtures_ro
      seo_fixtures_se
      seo_fixtures_it
      seo_fixtures_fr
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
export const B_C_ABT_F_Q_T = gql`
  query B_C_ABT_F_Q_T 
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
      widgets_no_data_available
    }
    scores_fixture_about_translations (
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

export const B_C_ABT_F_Q_D1 = gql`
  query B_C_ABT_F_Q_D1
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
      league_id
      season_id
      seo_fixtures
      seo_fixtures_pt
      seo_fixtures_br
      seo_fixtures_es
      seo_fixtures_ro
      seo_fixtures_se
      seo_fixtures_it
      seo_fixtures_fr
    }
  }
`;

//#endregion [QUERIES]
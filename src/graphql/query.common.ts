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
 * @description [GET] GraphQl Query ALL available
 * HREF-LANG
 * Cache (TTL:300);
 */
export const GET_HREFLANG_DATA = gql`
  query GET_HREFLANG_DATA 
  @cached
  (ttl: 300) 
  {
    scores_hreflang {
      hreflang
      link
    }
  }
`;

/**
 * @description [GET] GraphQl Query target seasons
 * that are of type "is_current_season";
 * Cache (TTL:300);
 */
export const CURRENT_SEASON_IDS = gql`
  query CURRENT_SEASON_IDS 
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

//#endregion [QUERIES]
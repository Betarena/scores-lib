// IMPORTANT [DO NOT REMOVE]
import { gql } from 'graphql-request'; // IMPORTANT - uncomment

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

// ====================
// 📌 SURGICAL QUERIES
// ====================

/**
 * @description [GET] GraphQl Query for Probabilities Fixture
 * widget transaltions;
 * Cache (TTL:300 Enabled)
 * @version 1.0
 * @param {number[]} fixture_id - passed as a variable
 */
export const B_C_PROB_F_Q_D0 = gql`
	query B_C_PROB_F_Q_D0
  (
		$fixture_id: Int!
	) 
  @cached
  (ttl: 300) {
		historic_fixtures(
			where: { 
        id: { 
          _eq: $fixture_id 
        } 
      }
		) {
			id
			league_id
			season_id
			time
			probabilities
		}
	}
`;

/**
 * @description [GET] GraphQl Query for Probabilities Fixture
 * widget transaltions;
 * Cache (TTL:300 Enabled)
 * @version 1.0 - passed as a variable
 * @param {string[]} lang
 */
export const B_C_PROB_F_Q_T = gql`
	query B_C_PROB_F_Q_T
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
		scores_fixture_probabilities_translations (
			where: { 
        lang: {
          _in: $langArray 
        } 
      }
    ) {
			lang
			data
		}
	}
`;

//#endregion [QUERIES]
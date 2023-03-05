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
 * @description [QUERY] [GET] query to obtain
 * target fixture data;
 * Cache (TTL:300 Enabled)
 * @version 1.0
 * @param {number} fixture_id - passed as a variable
 */
export const B_C_H2H_F_Q_D0 = gql`
	query B_C_H2H_F_Q_D0
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
			time
			# [alt V1]
			# data
			# [alt V2]
			localteam_id_j: data(path: "$.localteam_id")
			visitorteam_id_j: data(path: "$.visitorteam_id")
		}
	}
`;

/**
 * @description [QUERY] [GET] query to obtain
 * target head-2-head data; And teams data;
 * widget transaltions;
 * Cache (TTL:300 Enabled)
 * @version 1.0
 * @param {number[]} team_ids - passed as a variable
 * @param {number[]} team_ids_arr - passed as a variable
 */
export const B_C_H2H_F_Q_D1 = gql`
	query B_C_H2H_F_Q_D1
  (
		$team_ids: String!
		$team_ids_arr: [numeric!]
	) 
  @cached
  (ttl: 300) 
  {
		football_h2h (
			where: { 
        team_ids: { 
          _eq: $team_ids 
        } 
      }
		) {
			team_ids
			data
			last_5_data
			wins_draws
			yellow_cards_avg
			overs
			btts
		}
		scores_football_teams(
			where: { 
        id: { 
          _in: $team_ids_arr 
        } 
      }
		) {
			id
			name
			data
		}
	}
`;

/**
 * @description [QUERY] [GET] query to obtain
 * target fixture-id's data
 * widget transaltions;
 * Cache (TTL:300 Enabled)
 * @version 1.0
 * @param {number[]} fixture_id - passed as a variable
 */
export const B_C_H2H_F_Q_D2  = gql`
	query B_C_H2H_F_Q_D2 
  (
		$fixture_ids: [Int!]
	) 
  @cached
  (ttl: 300) {
		historic_fixtures(
			where: { 
        id: { 
          _in: $fixture_ids 
        } 
      }
		) {
			id
			fixture_day
			time
			season_id
			league_id
			urls
		}
	}
`;

/**
 * @description [GET] GraphQl Query for Head2Head Fixture
 * widget translations;
 * Cache (TTL:300 Enabled)
 * @version 1.0 - passed as a variable
 * @param {string[]} langArray
 */
export const B_C_H2H_F_Q_T = gql`
	query B_C_H2H_F_Q_T
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
		scores_fixtures_h2h_translations (
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

//#endregion [QUERIES]
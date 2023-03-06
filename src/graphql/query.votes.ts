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
 * [ℹ] GET TARGET fixture votes
 * [ℹ] @param {numeric!} match_id - target fixture_id
 * [ℹ] @param {Int!} fixture_id - target fixture_id
*/
export const HASURA_FIXTURE_VOTES_DATA_0 = gql`
  query HASURA_FIXTURE_VOTES_DATA_0 
    (
      $match_id:   numeric!
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
      probabilities
      time
      home_team_logo
      away_team_logo
      status_j: data(path: "$.time.status")
    }

    widget_featured_match_votes (
      where: {
        match_id: {
          _eq: $match_id
        }
      }
    ) {
      match_id
      vote_draw_x
      vote_win_local
      vote_win_visitor
    }
  }
`;

/**
 * [ℹ] MUTATE (UPSERT) fixture votes
 * [ℹ] @param {numeric!} match_id - target fixture_id
 * [ℹ] @param {numeric!} _1_vote - target fixture_id (1-vote)
 * [ℹ] @param {numeric!} _X_vote - target fixture_id (X-vote)
 * [ℹ] @param {numeric!} _2_vote - target fixture_id (2-vote)
*/
export const HASURA_FIXTURE_VOTES_INIT_UPDATE = gql`
	mutation HASURA_FIXTURE_VOTES_INIT_UPDATE (
		$match_id: numeric!
		$_1_vote:  numeric!
		$_X_vote:  numeric!
		$_2_vote:  numeric!
	) {

    # insert initial FIXTURE VOTES if not existsing
    # with on_conflict, update NOTHING
    insert_widget_featured_match_votes (
      on_conflict: {
        constraint: widget_featured_match_votes_pkey, 
        update_columns: [
          # NONE, ignore
        ]
      },
      objects: {
        match_id: $match_id,
        vote_draw_x: 0,
        vote_win_local: 0,
        vote_win_visitor: 0
      }
    ) {
      affected_rows
    }

    # update target FIXTURE VOTES accordingly
		update_widget_featured_match_votes_by_pk (
			pk_columns: {
        match_id: $match_id 
      }
			_inc: { 
        vote_draw_x: $_X_vote, 
        vote_win_local: $_1_vote, 
        vote_win_visitor: $_2_vote 
      }
		) {
			match_id
			vote_draw_x
			vote_win_local
			vote_win_visitor
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
export const B_C_VOT_F_Q_T = gql`
  query B_C_VOT_F_Q_T 
  (
    $langArray: [String!]
  )
  @cached 
  (ttl: 300)  
  {
    scores_fixture_voting_translations (
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

// ====================
// 📌 SURGICAL QUERIES
// ====================

export const B_C_VOT_F_Q_D1 = gql`
  query B_C_VOT_F_Q_D1
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
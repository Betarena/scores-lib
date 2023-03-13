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

export const B_C_STA_T_Q_D0 = gql`
  query B_C_STA_T_Q_D0 
  @cached
  (ttl: 300) 
  {
    scores_football_leagues {
      name
      id
      seasons
      # country
      # season
      # data
    }
    scores_football_standings {
      league_id
      data
      name
      type
      season_id
      multipart
    }
    scores_football_standings_history {
      league_id
      data
      name
      type
      season_id
      multipart
    }
    scores_team_statistics {
      average_goals
      average_yellow_cards
      data
      name
      team_id
      winning_probability
    }
    scores_team_statistics_history {
      average_goals
      average_yellow_cards
      data
      name
      season_id
      team_id
    }
    scores_football_teams {
      data
      id
      name
    }
    # [ℹ] COLOR-CODES
    color_codes_league_standings_positions {
      color_codes
      sports
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
export const B_C_STA_T_Q_T = gql`
  query B_C_STA_T_Q_T 
  (
    $langArray: [String!]
  )
  @cached 
  (ttl: 300)  
  {
    scores_widget_standings_translations (
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

export const B_C_STA_T_Q_D1 = gql`
  query B_C_STA_T_Q_D1
  (
    $leagueIdsArr: [numeric!]
  )
  @cached 
  (ttl: 300)
  {
    scores_football_leagues (
      where: {
        id: {
          _in: $leagueIdsArr
        }
      }
    )
    { # [ℹ] BY LEAGUE ID
      name
      id
      seasons
      # country
      # season
      # data
    }
    scores_football_standings (
      where: {
        league_id: {
          _in: $leagueIdsArr
        }
      }
    )
    { # [ℹ] BY LEAGUE ID
      league_id
      data
      name
      type
      season_id
      multipart
    }
    scores_football_standings_history (
      where: {
        league_id: {
          _in: $leagueIdsArr
        }
      }
    )
    { # [ℹ] BY LEAGUE ID
      league_id
      data
      name
      type
      season_id
      multipart
    }

    # [ℹ] other data
    color_codes_league_standings_positions {
      color_codes
      sports
    }
    
  }
`;

export const B_C_STA_T_Q_D2 = gql`
  query B_C_STA_T_Q_D2
  (
    $teamIdsArr: [numeric!]
  )
  @cached 
  (ttl: 300)
  {
    scores_football_teams (
      where: {
        id: {
          _in: $teamIdsArr
        }
      }
    )
    { # [ℹ] BY TEAM ID
      data
      id
      name
    }
    scores_team_statistics (
      where: {
        team_id: {
          _in: $teamIdsArr
        }
      }
    )
    { # [ℹ] BY TEAM ID
      average_goals
      average_yellow_cards
      data
      name
      team_id
      winning_probability
    }
    scores_team_statistics_history (
      where: {
        team_id: {
          _in: $teamIdsArr
        }
      }
    )
    { # [ℹ] BY TEAM ID
      average_goals
      average_yellow_cards
      data
      name
      season_id
      team_id
    }
  }
`;

//#endregion [QUERIES]
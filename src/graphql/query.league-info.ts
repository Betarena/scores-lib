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
 * [ℹ] Tournaments / Fixtures_Odds Widget (MAIN)
 * [ℹ] League_Info Data
*/
export const B_C_LEG_T_Q_D0 = gql`
  query B_C_LEG_T_Q_D0 
  @cached 
  (ttl: 300) 
  {
    # HREF-LANG => (scores_hreflang) not required;
    # as this WIDGET IS [URL] based;

    # IMPORTANT TOURNAMENTS PAGE WIDGET GENERATION
    scores_tournaments {
      author
      country
      date
      id
      tournament_id
      lang
      name
      sport
      title
      type
      widgets
      seo_content
    }
    scores_football_leagues {
      country
      data
      name
      id
      season
      seasons
    }
    scores_football_seasons_details {
      data_stats
      end_date
      id
      is_current_season
      league_id
      start_date
    }

    # [ℹ] translations
    scores_widget_league_info_translations {
      data
      lang
    }
    widget_league_info_translations {
      lang
      data
    }
    scores_widget_tournament_about_translations {
      lang
      data
    }
    scores_general_translations {
      lang
      widgets_no_data_available
    }
  }
`;

/**
 * [ℹ] ABOUT WIDGET CHECK POPULATION 
 * [ℹ] format date: "yyyy-MM-dd"
*/
export const B_C_LEG_T_Q_D1 = gql`
  query B_C_LEG_T_Q_D1
  (
    $_iregex: String
  )
  @cached 
  (ttl: 300) 
  {
    scores_football_seasons_details (
      where: {
        is_current_season: {
          _eq: true
        }, 
        round_data: {
          _cast: {
            String: {
              _iregex: $_iregex
          }
        }
      }
    }) {
      league_id
    }
  }
`;

export const B_C_LEG_T_Q_D2 = gql`
  query B_C_LEG_T_Q_D2 
  (
    $league_ids_arr: [Int!],
    $league_ids_arr_2: [numeric!]
  )
  @cached 
  (ttl: 300) 
  {
    # HREF-LANG => (scores_hreflang) not required;
    # as this WIDGET IS [URL] based;

    # IMPORTANT TOURNAMENTS PAGE WIDGET GENERATION
    scores_tournaments (
      where: {
        tournament_id: {
          _in: $league_ids_arr
        }
      }
    ) {
      author
      country
      date
      id
      tournament_id
      lang
      name
      sport
      title
      type
      widgets
      seo_content
    }
    scores_football_leagues (
      where: {
        id: {
          _in: $league_ids_arr_2
        }
      }
    ) {
      country
      data
      name
      id
      season
      seasons
    }
    scores_football_seasons_details (
      where: {
        league_id: {
          _in: $league_ids_arr_2
        }
      }
    ) {
      data_stats
      end_date
      id
      is_current_season
      league_id
      start_date
    }

    # [ℹ] translations
    scores_widget_league_info_translations {
      data
      lang
    }
    widget_league_info_translations {
      lang
      data
    }
    scores_widget_tournament_about_translations {
      lang
      data
    }
    scores_general_translations {
      lang
      widgets_no_data_available
    }
  }
`;

//#endregion [QUERIES]
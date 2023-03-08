import { gql } from 'graphql-request';
import { B_H_SD } from '../../types/hasura';

// ======================
// FOR: Leagues Table Data
// TAG: B_C_LEGT_M_Q_<T/D>
// ======================

/**
 * @description [QUERY] - obtains all
 * sportbook-details data for all geo-pos from
 * the Hasura DB;
 * @todo - needs a modified and hybrid approach to
 * handle single request for fallback (frontend)
 * fallbacks
 * @version 1.0
 * @returns {B_H_SD[]} B_H_SD[]
 */
export const B_C_LEGT_M_Q_D0 = gql`
  query B_C_LEGT_M_Q_D0 
  @cached 
  (ttl: 300) 
  {
    leagues_filtered_country {
      lang
      leagues
    }
    scores_standings_home_widget_translations {
      lang
      games
      points
      title
    }
    color_codes_league_standings_positions {
      color_codes
      sports
    }
  }
`;

export const B_C_LEGT_M_Q_D1 = gql`
	query B_C_LEGT_M_Q_D1
  (
    $leagueIds: [numeric!]
  )
  @cached
  (ttl: 300) 
  {
    scores_football_leagues (
      where: {
        id: {
          _in: $leagueIds
        }
      }
    )
    {
      country
      data
      name
      id
      season
      seasons
    }
    scores_football_standings (
      where: {
        league_id: {
          _in: $leagueIds
        }
      }
    )
    {
      league_id
      data
      name
      type
      season_id
      multipart
    }
	}
`;

export const B_C_LEGT_M_Q_D2 = gql`
	query B_C_LEGT_M_Q_D2
  (
    $teamIds: [numeric!]
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
    )
    {
      data
      id
      name
    }
	}
`;
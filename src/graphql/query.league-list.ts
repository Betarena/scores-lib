import { gql } from 'graphql-request';
import { B_H_SD } from '../../types/hasura';

// ======================
// FOR: League List Data
// TAG: B_C_LEGL_M_Q_<T/D>
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
export const B_C_LEGL_M_Q_D0 = gql`
  query B_C_LEGL_M_Q_D0 @cached(ttl: 300) {
    leagues_filtered_country {
      lang
      leagues
    }
    scores_league_list {
      country_id
      country_name
      image_path
      league_id
      league_name
      logo_path
      type
    }    
    scores_tournaments {
      id
      tournament_id
      urls
    }
  }
`;

/**
 * @description [QUERY] obtains all necessary
 * data for an array of languages;
 * Cache (TTL:300 Enabled)
 * @version 1.0 - passed as a variable
 * @param {string[]} langArray
 */
export const B_C_LEGL_M_Q_T = gql`
  query B_C_LEGL_M_Q_T
  (
    $langArray: [String!]
  )
  @cached 
  (ttl: 300) 
  {
    scores_leagues_list_translations (
			where: { 
        lang: {
          _in: $langArray 
        } 
      }
    ) {
      lang # PK
      translations
    }
    scores_general_translations (
			where: { 
        lang: {
          _in: $langArray 
        } 
      }
    ) {
      lang # PK
      countries
    }
  }
`;
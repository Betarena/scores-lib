import { gql } from 'graphql-request';
import { B_H_SD } from '../../types/hasura';

// ======================
// FOR: Top Goalscorer Data
// TAG: B_C_TGOL_M_Q_<T/D>
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
export const B_C_TGOL_M_Q_D0 = gql`
  query B_C_TGOL_M_Q_D0 
  @cached 
  (ttl: 300) 
  {
    scores_best_goalscorers {
      common_name
      goals
      image_path
      league_id
      logo_path
      position
    }
    leagues_filtered_country {
      lang
      leagues
    }
  }
`;

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
export const B_C_TGOL_M_Q_T = gql`
  query B_C_TGOL_M_Q_T
  (
    $langArray: [String!]
  )
  @cached 
  (ttl: 300) 
  {
    scores_best_goalscorers_translations (
			where: { 
        lang: {
          _in: $langArray 
        } 
      }
    ) {
      lang
      translations
    }
    player_positions_translations (
			where: { 
        lang: {
          _in: $langArray 
        } 
      }
    ) {
      lang
      position
    }
  }
`;
import { gql } from 'graphql-request';
import { B_H_SD } from '../../types/hasura';

// ======================
// FOR: Sportbook Data
// TAG: B_C_SPD_M_Q_<T/D>
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
export const B_C_SPD_M_Q_D0 = gql`
  query B_C_SPD_M_Q_D0 
  @cached 
  (ttl: 300) 
  {
    sportsbook_details {
      data
      lang
    }
  }
`;
import { gql } from 'graphql-request';
import { B_H_SD } from '../../types/hasura';

// ======================
// FOR: Authentication Data
// TAG: B_C_AUTH_M_Q_<T/D>
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
export const B_C_AUTH_M_Q_T = gql`
  query B_C_AUTH_M_Q_T 
  (
    $langArray: [String!]
  )
  @cached 
  (ttl: 300) 
  {
    auth_translations(
			where: { 
        lang: { 
          _in: $langArray 
        } 
      }
		) {
			lang
			translation
		}
  }
`;
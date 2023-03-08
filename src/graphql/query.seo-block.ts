import { gql } from 'graphql-request';
import { B_H_SD } from '../../types/hasura';

// ======================
// FOR: SEO Block (widget) Data
// TAG: B_C_SEB_M_Q_<T/D>
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
export const B_C_SEB_M_Q_D0 = gql`
  query B_C_SEB_M_Q_D0 
  (
    $langArray: [String!]
  )
  @cached 
  (ttl: 300) 
  {
    scores_seo_block_homepage (
			where: { 
        lang: {
          _in: $langArray 
        } 
      }
    ) {
      lang
      html
      title
    }
  }
`;
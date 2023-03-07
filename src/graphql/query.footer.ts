import { gql } from 'graphql-request';

// ======================
// IMPORTANT - FOR: Navbar Data
// IMPORTANT - TAG: B_C_NAV_M_Q_<T/D>
// ======================

/**
 * @description [QUERY] obtains all necessary
 * data for an array of languages;
 * Cache (TTL:300 Enabled)
 * @version 1.0 - passed as a variable
 * @param {string[]} langArray
 */
export const B_C_FOT_M_Q_T = gql`
  query B_C_FOT_M_Q_T
  (
    $langArray: [String!]
  )
  @cached 
  (ttl: 300) 
  {
    scores_footer_translations (
			where: { 
        lang: {
          _in: $langArray 
        } 
      }
    ) {
			about_us
			betting_tips
			follow
			lang
			latest_news
			privacy
			subscribe_cta
			subscribe_newsletter
			terms
			type_email
		}
		scores_footer_links (
			where: { 
        lang: {
          _in: $langArray 
        } 
      }
    ) {
			about_us
			betting_tips
			latest_news
			privacy
			lang
			terms
			social_networks
		}
  }
`;
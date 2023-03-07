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
export const B_C_NAV_M_Q_T = gql`
  query B_C_NAV_M_Q_T
  (
    $langArray: [String!]
  )
  @cached 
  (ttl: 300) 
  {
    scores_header_translations (
			where: { 
        lang: {
          _in: $langArray 
        } 
      }
    ) {
			lang # PK
      theme_options
			theme
			sports
			sign_in
			odds_type
			odds
			more_sports
			homepage
			betting_tips_link
			bookmakers
			bookmakers_countries
			content_platform_link
			sports_list
      data
    }
    scores_header_links (
			where: { 
        lang: {
          _in: $langArray 
        } 
      }
    ) {
			lang # PK
			betting_tips
			latest_news
		}
    scores_header_fixtures_information (
			where: { 
        lang: {
          _in: $langArray 
        } 
      }
    ) {
      lang # PK
      football
      other_sports
    }
    scores_top_bar_messages (
			where: { 
        lang: {
          _in: $langArray 
        } 
      }
    ) {
      lang # PK
      status
      message
    }
  }
`;
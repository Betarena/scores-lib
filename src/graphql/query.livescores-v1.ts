// ... import necessary libraries;
import { gql } from 'graphql-request';

/**
 * Description
 * ~~~~~~~~~~~~~
 * ... get ALL of the TRANSLATIONS from the DB
 * for the scores_livescore
 */
 export const GET_LIVESCORES_TRANSLATIONS = gql`
 query GET_LIVESCORES_TRANSLATIONS @cached(ttl: 300) {
	scores_livescore_football_translations {
		status
		status_abv
		terms
		lang
	  }
	}
`;

/**
 * Description
 * ~~~~~~~~~~~~~
 * ... get ALL of the Leagues order
 * for the scores_livescore
 */
 export const GET_LIVESCORES_LEAGUES = gql`
 query GET_LIVESCORES_LEAGUES @cached(ttl: 300) {
	leagues_filtered_country {
	  lang
	  leagues
	}
  }
`;

/**
 * Description
 * ~~~~~~~~~~~~~
 * ... Get Tournament Links
 * 
 */
 export const GET_LIVESCORES_TOURNAMENTS_LINKS = gql`
 query GET_LIVESCORES_TOURNAMENTS_LINKS @cached(ttl: 300) {
	scores_tournaments {
	   tournament_id
	   urls
	}
  }
`;

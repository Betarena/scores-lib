import { gql } from 'graphql-request';

// ======================
// FOR: Featured Match Data
// TAG: B_C_FEATM_H_Q_<T/D>
// ======================

export const B_C_FEATM_H_Q_D0 = gql`
	query B_C_FEATM_H_Q_D0 
  @cached
  (ttl: 300) 
  {
		widget_featured_match_selection {
			lang # PK
			fixture_id	
			date
			game_start
		}
	}
`;

export const B_C_FEATM_H_Q_D1 = gql`
	query B_C_FEATM_H_Q_D1
  (
    $fixtureIds: [Int!], 
    $fixtureIds_2: [numeric!]
  ) 
  @cached
  (ttl: 300) 
  {
		widget_featured_match_best_player (
      where: { 
        fixture_id: {
          _in: $fixtureIds_2 
        } 
      }
    ) {
			fixture_id # PK
			game_start_date
			local_team_player_1
			local_team_player_1_appearances
			local_team_player_1_assists
			local_team_player_1_goals
			local_team_player_1_image_path
			local_team_player_2
			local_team_player_2_appearances
			local_team_player_2_assists
			local_team_player_2_goals
			local_team_player_2_image_path
			local_team_rating_player_1
			local_team_rating_player_2
			visitor_team_player_1
			visitor_team_player_1_appearances
			visitor_team_player_1_assists
			visitor_team_player_1_goals
			visitor_team_player_1_image_path
			visitor_team_player_2
			visitor_team_player_2_appearances
			visitor_team_player_2_assists
			visitor_team_player_2_goals
			visitor_team_player_2_image_path
			visitor_team_rating_player_1
			visitor_team_rating_player_2
		}
		widget_featured_match_votes (
      where: { 
        match_id: {
          _in: $fixtureIds_2 
        } 
      }
    ) {
			match_id # PK
			vote_draw_x
			vote_win_local
			vote_win_visitor
		}
		week_fixtures (
      where: { 
        id: {
          _in: $fixtureIds 
        } 
      }
    ) {
			id # PK
			away_team_logo
			away_team_name
			country_flag
			fixture_day
			home_team_logo
			home_team_name
			inserted_at
			league_name
			probabilities
			round_name
			status
			time
			tvstations
			valuebets
      league_id
		}
	}
`;

export const B_C_FEATM_H_Q_D2 = gql`
  query B_C_FEATM_H_Q_D2 
  (
    $leagueIds: [Int!]
  )
  @cached 
  (ttl: 300) 
  {
    scores_tournaments (
      where: { 
        tournament_id: { 
          _in: $leagueIds
        } 
      }
    ) {
      id
      tournament_id
      urls
    }
  }
`;

export const B_C_FEATM_H_Q_T = gql`
	query B_C_FEATM_H_Q_T 
  @cached
  (ttl: 300) 
  {
		widget_featured_match_translations {
			assists
			bookmaker
			bet
			fair_odds
			goals
			home_win
			lang
			market
			market_name
			market_type
			matches
			odds
			place_bet
			player
			players
			stake
			rating
			probability
			streams
			type
			value_bet
			vote
			winnings
			widget_title
      place_holder
    }
	}
`;
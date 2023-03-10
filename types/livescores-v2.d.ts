import type {
  B_H_HF,
  B_H_LFC,
  B_H_LSF_V2,
  B_H_SFL,
  B_H_SGT,
  B_H_SLFT_V2,
  B_H_ST,
  DataStats,
  Round,
  Scores,
  ScoresTournamentsUrls,
  SLFT_Translation,
  Time,
  Urls
} from "./hasura";
import { FIXTURE_STATUS_TYPES } from "./sportmonks";

/**
 * ==========================================
 * FINAL DATA OBJECTS
 * ========================================== 
*/

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface B_LS2_T 
  extends 
  B_H_SGT,
  SLFT_Translation {
  lang?: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface B_LS2_D {
  fixtures_by_date?: LS2_C_FixtureDateGroup[];
  leagues?: LS2_C_League[];
  leagues_geo_list?: B_H_LFC[]
  leagues_feat_list?: number[]
}

/**
 * ==========================================
 * HASURA DB TYPES [QUERIES]
 * ========================================== 
*/

export interface B_H_SJ_HF_LSV2 
  extends B_H_HF {
  stats_j?:            DataStats
  localteam_id_j?:     number
  visitorteam_id_j?:   number
  time_j?:             Time
  round_j?:            Round
  scores_j?:           Scores
  localteam_short_code_j?: string
  visitorteam_short_code_j?: string
}

export interface B_H_SJ_SFL 
  extends B_H_SFL {
  country_iso2_j: string;
}

export interface B_H_HF_LSV2_Q {
  // NOTE: (data)
  historic_fixtures?: B_H_SJ_HF_LSV2[]
  scores_football_leagues?: B_H_SJ_SFL[]
  scores_tournaments?: B_H_ST[]
  leagues_supported_filter_v2?: B_H_LSF_V2[]
  leagues_filtered_country?: B_H_LFC[]
  // NOTE: (translations)
  scores_livescore_football_translations_v2?: B_H_SLFT_V2[]
  scores_general_translations?: B_H_SGT[]
}

/**
 * ==========================================
 * CUSTOM TYPES
 * ==========================================
*/

export interface LS2_C_League {
  id: number;
  league_name: string;
  iso2: string;
  urls?: ScoresTournamentsUrls;
}

export interface LS2_C_FixtureDateGroup {
  date?: string;
  fixtures?: LS2_C_Fixture[];
} export interface LS2_C_Fixture {
  id?: number                   // [hasura] fixture-id
  league_id?: number            // [hasura] league-id
  fixture_day?: string          // [hasura] fixture_day
  time?: string                 // [hasura] time
  status?: FIXTURE_STATUS_TYPES // [hasura] status
  teams?: {                     // [hasura] fixture-teams
    home: LS2_C_FixtureTeam
    away: LS2_C_FixtureTeam
  }
  urls?: Urls                   // [hasura] urls
  tips?: Urls                   // [hasura] tip_link_wp
  minute?: number

  // minute: string;`
	// medias: number;
	// cards:LiveScoreCard[];

} export interface LS2_C_FixtureTeam {
  name?: string
  score?: number
  red_cards?: number
}
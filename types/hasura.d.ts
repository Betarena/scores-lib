/**
 * NOTE: This file contains all of the HASURA DB
 * NOTE: TypeScript Interfaces (DECLARATIONS)
*/

/**
 * [ℹ] HASURA: [EVENT] update_fixture_sitemap
*/
export interface BETARENA_HASURA_EVENT_update_fixture_sitemap {
  data?:  UpdateFixturesData;
  table?: Table;
} export interface UpdateFixturesData {
  id?:             number;
  publish_status?: string;
  urls?:           Urls;
} export interface Table {
  name?:   string;
  schema?: string;
}

/**
 * [ℹ] HASURA: scores_hreflang (&)
*/
export interface BETARENA_HASURA_scores_hreflang {
  link?:     string
  hreflang?: string
}

/**
 * [ℹ] HASURA: scores_seo_homepage (&)
*/
export interface BETARENA_HASURA_scores_seo_homepage {
  lang:         string
  main_data:    Main_Data
  twitter_card: Twitter_Data
  opengraph:    Opengraph_Data
} interface Main_Data {
  canonical:    string
  noindex:      boolean
  keywords:     string
  nofollow:     boolean
  title:        string
  description:  string
} interface Twitter_Data {
  canonical:    string
  noindex:      boolean
  keywords:     string
  nofollow:     boolean
  title:        string
  description:  string
} interface Opengraph_Data {
  canonical:    string
  noindex:      boolean
  keywords:     string
  nofollow:     boolean
  title:        string
  description:  string
}

/**
 * [ℹ] HASURA: scores_seo_tournaments (&)
*/
export interface BETARENA_HASURA_scores_seo_tournaments {
  lang:         string
  main_data:    Main_Data
  twitter_card: Twitter_Data
  opengraph:    Opengraph_Data
}

/**
 * [ℹ] HASURA: scores_seo_block_homepage (&)
*/
export interface BETARENA_HASURA_scores_seo_block_homepage {
  lang:   string
  html:   string
  title:  string
}

/**
 * [ℹ] HASURA: scores_football_standings (&)
*/
export interface BETARENA_HASURA_scores_football_standings {
  league_id?: number;
  data?:      StandingsHistDatum[];
  name?:      string;
  type?:      ScoresTournamentsType;
  season_id?: number;
  multipart?: boolean;
}

/**
 * [ℹ] HASURA: scores_football_standings_history (&)
*/
export interface BETARENA_HASURA_scores_football_standings_history {
  league_id?: number;
  data?:      StandingsHistDatum[];
  name?:      string;
  type?:      ScoresTournamentsType;
  season_id?: number;
  multipart?: boolean;
} export interface StandingsHistDatum {
  id?:         number;
  name?:       string;
  resource?:   string;
  round_id?:   number;
  stage_id?:   number;
  league_id?:  number;
  season_id?:  number;
  standings?:  PurpleStandingsHist;
  round_name?: number;
  stage_name?: string;
  type?:       string;
} export interface PurpleStandingsHist {
  data?: PurpleDatumHist[];
} export interface PurpleDatumHist {
  away?:        AwayHist;
  home?:        AwayHist;
  total?:       TotalHist;
  points?:      number;
  result?:      null | string;
  status?:      null;
  overall?:     AwayHist;
  team_id?:     number;
  group_id?:    number | null;
  position?:    number;
  round_id?:    number;
  team_name?:   string;
  group_name?:  null | string;
  round_name?:  number;
  recent_form?: string;
  // [inner-group-stage]
  id?:          number;
  name?:        string;
  resource?:    string;
  stage_id?:    number;
  league_id?:   number;
  season_id?:   number;
  standings?:   FluffyStandingsHist;
  stage_name?:  string;
} export interface AwayHist {
  won?:           number;
  draw?:          number;
  lost?:          number;
  points?:        number;
  games_played?:  number;
  goals_scored?:  number;
  goals_against?: number;
} export interface FluffyStandingsHist {
  data?: FluffyDatum[];
} export interface FluffyDatum {
  away?:        AwayHist;
  home?:        AwayHist;
  total?:       TotalHist;
  points?:      number;
  result?:      null | string;
  status?:      null;
  overall?:     AwayHist;
  team_id?:     number;
  group_id?:    number;
  position?:    number;
  round_id?:    number;
  team_name?:   string;
  group_name?:  string;
  round_name?:  number;
  recent_form?: string;
} export interface TotalHist {
  points?:          number;
  goal_difference?: string;
}


/**
 * [ℹ] HASURA: scores_team_statistics (&)
*/
export interface BETARENA_HASURA_scores_team_statistics {
  average_goals?:        AverageGoals;
  average_yellow_cards?: number;
  data?:                 Datum[];
  name?:                 string;
  team_id?:              number;
  winning_probability?:  null;
} export interface AverageGoals {
  away?:  number;
  home?:  number;
  total?: number;
} export interface Datum {
  win?:                            AverageGoals;
  btts?:                           number;
  draw?:                           AverageGoals;
  lost?:                           AverageGoals;
  fouls?:                          number;
  attacks?:                        number;
  tackles?:                        number;
  team_id?:                        number;
  offsides?:                       number;
  redcards?:                       number;
  stage_id?:                       number;
  goal_line?:                      GoalLine;
  goals_for?:                      AverageGoals;
  penalties?:                      Penalties;
  season_id?:                      number;
  avg_corners?:                    string;
  clean_sheet?:                    AverageGoals;
  yellowcards?:                    number;
  goals_against?:                  AverageGoals;
  shots_blocked?:                  number;
  total_corners?:                  number;
  failed_to_score?:                AverageGoals;
  scoring_minutes?:                Minute[];
  shots_on_target?:                number;
  shots_off_target?:               number;
  avg_player_rating?:              number;
  dangerous_attacks?:              number;
  avg_fouls_per_game?:             string;
  avg_first_goal_scored?:          AvgFirstGoal;
  goals_conceded_minutes?:         Minute[];
  avg_first_goal_conceded?:        AvgFirstGoal;
  avg_goals_per_game_scored?:      AverageGoals;
  avg_goals_per_game_conceded?:    AverageGoals;
  avg_player_rating_per_match?:    number;
  avg_shots_on_target_per_game?:   string;
  avg_shots_off_target_per_game?:  string;
  avg_ball_possession_percentage?: string;
} export interface AvgFirstGoal {
  away?:  string;
  home?:  string;
  total?: string;
} export interface GoalLine {
  over?:  { [key: string]: Over };
  under?: { [key: string]: Over };
} export interface Over {
  away?: number;
  home?: number;
} export interface Minute {
  period?: Period[];
} export interface Period {
  count?:      number;
  minute?:     string;
  percentage?: number;
} export interface Penalties {
  scored?:   number;
  awarded?:  number;
  conceded?: number;
}

/**
 * [ℹ] HASURA: scores_team_statistics_history (&)
 * [ℹ] based-of: scores_team_statistics (&)
*/
export interface BETARENA_HASURA_scores_team_statistics_history {
  average_goals?:        AverageGoals;
  average_yellow_cards?: number;
  data?:                 Datum[];
  name?:                 string;
  season_id?:            number;
  team_id?:              number;
}

/**
 * [ℹ] HASURA: scores_widget_standings_translations (&)
*/
export interface BETARENA_HASURA_scores_widget_standings_translations {
  lang?:         string;
  translations?: Translations;
} export interface Translations {
  d?:           string;
  l?:           string;
  w?:           string;
  ga?:          string;
  gf?:          string;
  pld?:         string;
  pts?:         string;
  "1.5+"?:      string;
  "2.5+"?:      string;
  away?:        string;
  cavg?:        string;
  gavg?:        string;
  home?:        string;
  prob?:        string;
  team?:        string;
  yavg?:        string;
  group?:       string;
  table?:       string;
  total?:       string;
  tooltips?:    { [key: string]: Tooltip };
  standings?:   string;
  recent_form?: string;
} export interface Tooltip {
  title?:       string;
  description?: string;
}

/**
 * [ℹ] HASURA: scores_football_teams (&)
*/
export interface B_H_SFT {
  data?: Data;
  id?:   number;
  name?: string;
} export interface Data {
  legacy_id?:         number | null;
  founded?:           number;
  country_id?:        number;
  twitter?:           null | string;
  national_team?:     boolean;
  name?:              string;
  venue_id?:          number;
  id?:                number;
  short_code?:        string;
  is_placeholder?:    boolean;
  current_season_id?: number;
  logo_path?:         string;
}

/**
 * [ℹ] HASURA: color_codes_league_standings_positions (&)
*/
export interface BETARENA_HASURA_color_codes_league_standings_positions {
  color_codes?: ColorCodes;
  sports?:      string;
} export interface ColorCodes {
  Final?:                               string;
  "8th Finals (WC)"?:                   string;
  "8th Finals (CL)"?:                   string;
  "8th Finals (EL)"?:                   string;
  "1st Phase"?:                         string;
  "2nd Phase"?:                         string;
  Promotion?:                           string;
  "Next Round"?:                        string;
  Relegation?:                          string;
  "Play-off":                           string;
  "Semi-finals"?:                       string;
  "Final Series"?:                      string;
  "Promotion Group"?:                   string;
  "Relegation Round"?:                  string;
  "Championship Round"?:                string;
  "Promotion Play-off"?:                string;
  "UEFA Europa League"?:                string;
  "UEFA Europa League (CL)":            string;
  "Possible Relegation"?:               string;
  "Relegation Play-off"?:               string;
  "CONMEBOL Libertadores"?:             string;
  "CONMEBOL Sudamericana"?:             string;
  "Championship Play-off"?:             string;
  "UEFA Champions League"?:             string;
  "UEFA Europa League Qualifiers"?:     string;
  "CONMEBOL Libertadores Qualifiers"?:  string;
  "CONMEBOL Sudamericana Qualifiers"?:  string;
  "UEFA Champions League Qualifiers"?:  string;
  "UEFA Conference League Play-offs"?:  string;
  "UEFA Conference League Qualifiers"?: string;
}

/**
 * [ℹ] HASURA: scores_football_countries (&)
*/
export interface B_H_SFC {
  id?:   number;
  data?: FootballCountriesData;
  name?: string;
} export interface FootballCountriesData {
  id?:         number;
  name?:       string;
  extra?:      FootballCountriesExtra;
  image_path?: string;
} export interface FootballCountriesExtra {
  iso?:          string;
  fifa?:         string;
  flag?:         string;
  iso2?:         string;
  latitude?:     string;
  continent?:    string;
  longitude?:    string;
  sub_region?:   string;
  world_region?: string;
}

/**
 * [ℹ] HASURA: scores_football_players (&)
*/
export interface B_H_SFP {
  data?:        FootballPlayersData;
  player_id?:   number;
  common_name?: string;
  nationality?: string;
} export interface FootballPlayersData {
  height?:       null | string;
  weight?:       null | string;
  team_id?:      number | null;
  fullname?:     string;
  lastname?:     string;
  birthdate?:    string;
  firstname?:    string;
  player_id?:    number;
  birthplace?:   string;
  country_id?:   number;
  image_path?:   string;
  common_name?:  string;
  nationality?:  string;
  position_id?:  number;
  birthcountry?: string;
  display_name?: string;
  team?:         FootballPlayersTeam;
} export interface FootballPlayersTeam {
  data?: FootballPlayersTeamData;
} export interface FootballPlayersTeamData {
  id?:                number;
  name?:              string;
  founded?:           number;
  twitter?:           string;
  venue_id?:          number;
  legacy_id?:         number;
  logo_path?:         string;
  country_id?:        number;
  short_code?:        string;
  national_team?:     boolean;
  is_placeholder?:    boolean;
  current_season_id?: number;
}

/**
 * [ℹ] HASURA: scores_widget_top_players_translations (&)
*/
export interface B_H_SWTPT {
  lang?: string;
  data?: TopPlayersData;
} export interface TopPlayersData {
  goals?:          string;
  player?:         string;
  rating?:         string;
  assists?:        string;
  top_players?:    string;
  total_shots?:    string;
  show_more_less?: string[];
}

/**
 * [ℹ] HASURA: player_positions_translations (&)
*/
export interface B_H_PPT {
  lang?:     string;
  position?: { [key: string]: string };
}

/**
 * [ℹ] HASURA: scores_general_translations (&)
*/
export interface B_H_SGT { 
  lang?:                      string;
  countries?:                 Countries;
  widgets_no_data_available?: WidgetsNoDataAvailable;
  weekdays?:                  Weekdays;
  months?:                    WelcomeMonths;
  cities?:                    null;
  common_expressions?:        CommonExpressions | null;
  players_positions?:         PlayersPositions;
} export interface CommonExpressions {
  show_more?: string;
} export interface Countries {
  USA?:                                            string;
  Chad?:                                           string;
  Cuba?:                                           string;
  Fiji?:                                           string;
  Guam?:                                           string;
  Iran?:                                           string;
  Iraq?:                                           string;
  Laos?:                                           string;
  Mali?:                                           string;
  Niue?:                                           string;
  Oman?:                                           string;
  Peru?:                                           string;
  Togo?:                                           string;
  Aruba?:                                          string;
  Benin?:                                          string;
  Chile?:                                          string;
  China?:                                          string;
  Congo?:                                          string;
  Egypt?:                                          string;
  Gabon?:                                          string;
  Ghana?:                                          string;
  Haiti?:                                          string;
  India?:                                          string;
  Italy?:                                          string;
  Japan?:                                          string;
  Kenya?:                                          string;
  Libya?:                                          string;
  Macao?:                                          string;
  Malta?:                                          string;
  Nauru?:                                          string;
  Nepal?:                                          string;
  Niger?:                                          string;
  Palau?:                                          string;
  Qatar?:                                          string;
  Samoa?:                                          string;
  Spain?:                                          string;
  Sudan?:                                          string;
  Syria?:                                          string;
  Tonga?:                                          string;
  Yemen?:                                          string;
  Angola?:                                         string;
  Belize?:                                         string;
  Bhutan?:                                         string;
  Brazil?:                                         string;
  Canada?:                                         string;
  Cyprus?:                                         string;
  France?:                                         string;
  Gambia?:                                         string;
  Greece?:                                         string;
  Guinea?:                                         string;
  Guyana?:                                         string;
  Israel?:                                         string;
  Jersey?:                                         string;
  Jordan?:                                         string;
  Kosovo?:                                         string;
  Kuwait?:                                         string;
  Latvia?:                                         string;
  Malawi?:                                         string;
  Mexico?:                                         string;
  Monaco?:                                         string;
  Norway?:                                         string;
  Panama?:                                         string;
  Poland?:                                         string;
  Russia?:                                         string;
  Rwanda?:                                         string;
  Serbia?:                                         string;
  Sweden?:                                         string;
  Turkey?:                                         string;
  Tuvalu?:                                         string;
  Uganda?:                                         string;
  Zambia?:                                         string;
  Albania?:                                        string;
  Algeria?:                                        string;
  Andorra?:                                        string;
  Armenia?:                                        string;
  Austria?:                                        string;
  Bahamas?:                                        string;
  Bahrain?:                                        string;
  Belarus?:                                        string;
  Belgium?:                                        string;
  Bermuda?:                                        string;
  Bolivia?:                                        string;
  Burundi?:                                        string;
  Comoros?:                                        string;
  Croatia?:                                        string;
  Czechia?:                                        string;
  Denmark?:                                        string;
  Ecuador?:                                        string;
  England?:                                        string;
  Eritrea?:                                        string;
  Estonia?:                                        string;
  Finland?:                                        string;
  Georgia?:                                        string;
  Germany?:                                        string;
  Grenada?:                                        string;
  Hungary?:                                        string;
  Iceland?:                                        string;
  Ireland?:                                        string;
  Jamaica?:                                        string;
  Lebanon?:                                        string;
  Lesotho?:                                        string;
  Liberia?:                                        string;
  Mayotte?:                                        string;
  Moldova?:                                        string;
  Morocco?:                                        string;
  Myanmar?:                                        string;
  Namibia?:                                        string;
  Nigeria?:                                        string;
  Romania?:                                        string;
  Senegal?:                                        string;
  Somalia?:                                        string;
  Tokelau?:                                        string;
  Tunisia?:                                        string;
  Ukraine?:                                        string;
  Uruguay?:                                        string;
  Vanuatu?:                                        string;
  Vietnam?:                                        string;
  Anguilla?:                                       string;
  Barbados?:                                       string;
  Botswana?:                                       string;
  Bulgaria?:                                       string;
  Cambodia?:                                       string;
  Cameroon?:                                       string;
  Colombia?:                                       string;
  "Congo DR"?:                                     string;
  Djibouti?:                                       string;
  Dominica?:                                       string;
  Ethiopia?:                                       string;
  Guernsey?:                                       string;
  Honduras?:                                       string;
  Kiribati?:                                       string;
  Malaysia?:                                       string;
  Maldives?:                                       string;
  Mongolia?:                                       string;
  Pakistan?:                                       string;
  Paraguay?:                                       string;
  Pitcairn?:                                       string;
  Portugal?:                                       string;
  Réunion?:                                        string;
  Slovakia?:                                       string;
  Slovenia?:                                       string;
  Suriname?:                                       string;
  Tanzania?:                                       string;
  Thailand?:                                       string;
  Zimbabwe?:                                       string;
  Argentina?:                                      string;
  Australia?:                                      string;
  Gibraltar?:                                      string;
  Greenland?:                                      string;
  Guatemala?:                                      string;
  "Hong Kong"?:                                    string;
  Indonesia?:                                      string;
  "Korea DPR"?:                                    string;
  Lithuania?:                                      string;
  Macedonia?:                                      string;
  Mauritius?:                                      string;
  Nicaragua?:                                      string;
  Palestine?:                                      string;
  Singapore?:                                      string;
  "Sri Lanka"?:                                    string;
  Swaziland?:                                      string;
  Venezuela?:                                      string;
  Antarctica?:                                     string;
  Azerbaijan?:                                     string;
  Bangladesh?:                                     string;
  "Cape Verde"?:                                   string;
  "Costa Rica"?:                                   string;
  Guadeloupe?:                                     string;
  Kazakhstan?:                                     string;
  Kyrgyzstan?:                                     string;
  Luxembourg?:                                     string;
  Madagascar?:                                     string;
  Martinique?:                                     string;
  Mauritania?:                                     string;
  Micronesia?:                                     string;
  Montenegro?:                                     string;
  Montserrat?:                                     string;
  Mozambique?:                                     string;
  "San Marino"?:                                   string;
  Seychelles?:                                     string;
  Tayikistan?:                                     string;
  Uzbekistan?:                                     string;
  Afghanistan?:                                    string;
  "El Salvador"?:                                  string;
  "Isle of Man"?:                                  string;
  Netherlands?:                                    string;
  "New Zealand"?:                                  string;
  Philippines?:                                    string;
  "Puerto Rico"?:                                  string;
  "Saint Lucia"?:                                  string;
  "South Sudan"?:                                  string;
  Switzerland?:                                    string;
  "Timor-Leste"?:                                  string;
  "Burkina Faso"?:                                 string;
  "Cook Islands"?:                                 string;
  "Saint Martin"?:                                 string;
  "Saudi Arabia"?:                                 string;
  "Sierra Leone"?:                                 string;
  "South Africa"?:                                 string;
  Turkmenistan?:                                   string;
  AmericanSamoa?:                                  string;
  "Cote d'Ivoire"?:                                string;
  "Faroe Islands"?:                                string;
  "French Guiana"?:                                string;
  "Guinea-Bissau"?:                                string;
  Liechtenstein?:                                  string;
  "New Caledonia"?:                                string;
  NorfolkIsland?:                                  string;
  "Cayman Islands"?:                               string;
  "Chinese Taipei"?:                               string;
  "Korea Republic"?:                               string;
  "United Kingdom"?:                               string;
  "Åland Islands"?:                                string;
  "Solomon Islands"?:                              string;
  "Christmas Island"?:                             string;
  "French Polynesia"?:                             string;
  "Marshall Islands"?:                             string;
  "Papua New Guinea"?:                             string;
  "Brunei Darussalam"?:                            string;
  "Equatorial Guinea"?:                            string;
  "Saint Barthélemy"?:                             string;
  "US Virgin Islands"?:                            string;
  "Wallis and Futuna"?:                            string;
  "Dominican Republic"?:                           string;
  "Antigua and Barbuda"?:                          string;
  "Trinidad and Tobago"?:                          string;
  "Netherlands Antilles"?:                         string;
  "United Arab Emirates"?:                         string;
  "Saint Kitts and Nevis"?:                        string;
  "Sao Tome and Principe"?:                        string;
  "Bosnia and Herzegovina"?:                       string;
  "British Virgin Islands"?:                       string;
  NorthernMarianaIslands?:                         string;
  "Svalbard and Jan Mayen"?:                       string;
  "Cocos (Keeling) Islands"?:                      string;
  "Central African Republic"?:                     string;
  "Turks and Caicos Islands"?:                     string;
  "Saint Pierre and Miquelon"?:                    string;
  "Falkland Islands (Malvinas)"?:                  string;
  "Holy See (Vatican City State)"?:                string;
  "British Indian Ocean Territory"?:               string;
  "Saint Vincent and the Grenadines"?:             string;
  "Saint Helena, Ascension and Tristan Da Cunha"?: string;
  " Faroe Islands"?:                               string;
  Austrália?:                                      string;
} export interface WelcomeMonths {
  months?:              MonthsMonths;
  months_abbreviation?: MonthsAbbreviation;
} export interface MonthsMonths {
  May?:       string;
  July?:      string;
  June?:      string;
  April?:     string;
  March?:     string;
  August?:    string;
  January?:   string;
  October?:   string;
  December?:  string;
  February?:  string;
  November?:  string;
  September?: string;
  Setembro?:  string;
} export interface MonthsAbbreviation {
  Apr?: string;
  Aug?: string;
  Dec?: string;
  Feb?: string;
  Jan?: string;
  Jul?: string;
  Jun?: string;
  Mar?: string;
  May?: string;
  Nov?: string;
  Oct?: string;
  Sep?: string;
} export interface PlayersPositions {
  "1"?:  string;
  "2"?:  string;
  "3"?:  string;
  "4"?:  string;
  "5"?:  string;
  "6"?:  string;
  "7"?:  string;
  "8"?:  string;
  "9"?:  string;
  "10"?: string;
  "11"?: string;
} export interface Weekdays {
  friday?:    string;
  monday?:    string;
  sunday?:    string;
  tuesday?:   string;
  saturday?:  string;
  thursday?:  string;
  wednesday?: string;
} export interface WidgetsNoDataAvailable {
  no_info?:      string;
  no_info_desc?: string;
}

/**
 * [ℹ] HASURA: scores_football_leagues (&)
*/
export interface B_H_SFL {
  country?: ScoresFootballLeaguesDataClass;
  data?:    Data;
  id?:      number;
  name?:    string;
  season?:  ScoresFootballLeaguesSeasonElement;
  seasons?: ScoresFootballLeaguesSeasonElement[];
} export interface ScoresFootballLeaguesDataClass {
  extra?:      ScoresFootballLeaguesExtra | null;
  image_path?: string;
  name?:       string;
  id?:         number;
} export interface ScoresFootballLeaguesExtra {
  iso2?:         string;
  world_region?: string;
  iso?:          string;
  latitude?:     string;
  sub_region?:   string;
  flag?:         string;
  fifa?:         string;
  longitude?:    string;
  continent?:    string;
} export interface ScoresFootballLeaguesData {
  legacy_id?:         number;
  country_id?:        number;
  season?:            ScoresFootballLeaguesDataSeason;
  country?:           ScoresFootballLeaguesDataCountry;
  current_stage_id?:  number;
  is_cup?:            boolean;
  coverage?:          ScoresFootballLeaguesCoverage;
  live_standings?:    boolean;
  active?:            boolean;
  name?:              string;
  is_friendly?:       boolean;
  id?:                number;
  type?:              string;
  seasons?:           ScoresFootballLeaguesSeasons;
  current_round_id?:  null;
  current_season_id?: number;
  logo_path?:         string;
} export interface ScoresFootballLeaguesDataCountry {
  data?: ScoresFootballLeaguesDataClass;
} export interface ScoresFootballLeaguesCoverage {
  topscorer_assists?: boolean;
  topscorer_goals?:   boolean;
  predictions?:       boolean;
  topscorer_cards?:   boolean;
} export interface ScoresFootballLeaguesDataSeason {
  data?: ScoresFootballLeaguesSeasonElement;
} export interface ScoresFootballLeaguesSeasonElement {
  league_id?:         number;
  current_stage_id?:  number | null;
  name?:              string;
  id?:                number;
  is_current_season?: boolean;
  current_round_id?:  number | null;
} export interface ScoresFootballLeaguesSeasons {
  data?: ScoresFootballLeaguesSeasonElement[];
}

/**
 * [ℹ] HASURA: scores_football_seasons_details_aggregate (&)
*/
export interface B_H_SFSD_AG {
  aggregate?: Aggregate;
} export interface Aggregate {
  totalCount?: number;
}

/**
 * [ℹ] HASURA: scores_football_seasons_details (&)
*/
export interface B_H_SFSD {
  data_stats?:        SeasonDetailsDataStats;
  default_data?:      SeasonDetailsDefaultData;
  end_date?:          Date;
  id?:                number;
  is_current_season?: boolean;
  league_id?:         number;
  round_data?:        SeasonDetailsRoundDatum[];
  start_date?:        Date;
  goalscorers?:       SeasonDetailsGoalscorers[];
  assistscorers?:     SeasonDetailsAssistscorers[];
  squad?:             SeasonDetailsSquad[];
  stages?:            SeasonDetailsStagesDataum[];
} export interface SeasonDetailsDataStats {
  id?:                                    number;
  btts?:                                  number;
  goal_line?:                             GoalLine;
  league_id?:                             number;
  season_id?:                             number;
  updated_at?:                            Date;
  goals_scored?:                          SeasonDetailsDefeatPercentage;
  goals_conceded?:                        SeasonDetailsDefeatPercentage;
  win_percentage?:                        SeasonDetailsDefeatPercentage;
  draw_percentage?:                       number;
  number_of_clubs?:                       number;
  number_of_goals?:                       number;
  avg_player_rating?:                     number;
  defeat_percentage?:                     SeasonDetailsDefeatPercentage;
  number_of_matches?:                     number;
  number_of_redcards?:                    number;
  avg_goals_per_match?:                   number;
  season_topscorer_id?:                   number;
  goals_scored_minutes?:                  SeasonDetailsGoalsScoredMinutes;
  team_most_corners_id?:                  null;
  avg_corners_per_match?:                 number;
  number_of_yellowcards?:                 number;
  avg_redcards_per_match?:                number;
  avg_awaygoals_per_match?:               number;
  avg_homegoals_per_match?:               number;
  season_topscorer_number?:               number;
  team_most_corners_count?:               null;
  team_with_most_goals_id?:               number;
  number_of_matches_played?:              number;
  number_of_yellowredcards?:              number;
  team_most_cleansheets_id?:              number;
  avg_yellowcards_per_match?:             number;
  goal_scored_every_minutes?:             number;
  matches_both_teams_scored?:             number;
  season_assist_topscorer_id?:            null;
  team_with_most_goals_number?:           number;
  avg_yellowredcards_per_match?:          number;
  team_most_cleansheets_number?:          number;
  goalkeeper_most_cleansheets_id?:        number;
  season_assist_topscorer_number?:        null;
  team_with_most_conceded_goals_id?:      number;
  team_with_most_goals_per_match_id?:     number;
  goalkeeper_most_cleansheets_number?:    number;
  team_with_most_conceded_goals_number?:  number;
  team_with_most_goals_per_match_number?: number;
} export interface SeasonDetailsDefeatPercentage {
  all?:  number;
  away?: number;
  home?: number;
} export interface SeasonDetailsGoalLine {
  over?:  { [key: string]: number };
  under?: { [key: string]: number };
} export interface SeasonDetailsGoalsScoredMinutes {
  "0-15"?:  string;
  "15-30"?: string;
  "30-45"?: string;
  "45-60"?: string;
  "60-75"?: string;
  "75-90"?: string;
} export interface SeasonDetailsDefaultData {
  id?:               number;
  name?:             string;
  end_date?:         Date;
  league_id?:        number;
  start_date?:       Date;
  current_round_id?: number;
  current_stage_id?: number;
} export interface SeasonDetailsRoundDatum {
  id?:        number;
  end?:       Date;
  name?:      number;
  start?:     Date;
  stage_id?:  number;
  league_id?: number;
  season_id?: number;
} export interface SeasonDetailsGoalscorers {
  type?:          string;
  goals?:         number;
  team_id?:       number;
  position?:      number;
  stage_id?:      number;
  player_id?:     number;
  season_id?:     number;
  team_name?:     string;
  player_name?:   null;
  penalty_goals?: number;
} export interface SeasonDetailsAssistscorers {
  type?:        string;
  assists?:     number;
  team_id?:     number;
  position?:    number;
  stage_id?:    number;
  player_id?:   number;
  season_id?:   number;
  team_name?:   string;
  player_name?: null;
} export interface SeasonDetailsSquad {
  id?:                number;
  name?:              string;
  squad?:             SeasonDetailsSquadSub;
  founded?:           number | null;
  twitter?:           null;
  logoPath?:          null;
  venue_id?:          number | null;
  legacy_id?:         number | null;
  country_id?:        number;
  short_code?:        null | string;
  national_team?:     boolean;
  is_placeholder?:    boolean;
  current_season_id?: number | null;
} export interface SeasonDetailsSquadSub {
  data?: SeasonDetailsSquadDatum[];
} export interface SeasonDetailsSquadDatum {
  duels?:                SeasonDetailsSquadDuels;
  fouls?:                SeasonDetailsSquadFouls;
  goals?:                number;
  saves?:                null;
  shots?:                SeasonDetailsSquadShots;
  blocks?:               null;
  number?:               number | null;
  passes?:               SeasonDetailsSquadPasses;
  rating?:               string | null;
  assists?:              number;
  captain?:              number;
  crosses?:              SeasonDetailsSquadCrosses;
  injured?:              boolean;
  lineups?:              number;
  minutes?:              number;
  tackles?:              null;
  dribbles?:             SeasonDetailsSquadDribbles;
  hit_post?:             null;
  owngoals?:             null;
  redcards?:             number;
  penalties?:            SeasonDetailsSquadPenalties;
  player_id?:            number;
  yellowred?:            number;
  appearences?:          number;
  cleansheets?:          null;
  dispossesed?:          null;
  player_name?:          null | string;
  position_id?:          number;
  yellowcards?:          number;
  interceptions?:        null;
  substitute_in?:        number;
  substitute_out?:       number;
  inside_box_saves?:     null;
  substitutes_on_bench?: number;
} export interface SeasonDetailsSquadCrosses {
  total?:    null;
  accurate?: null;
} export interface SeasonDetailsSquadDribbles {
  success?:       null;
  attempts?:      null;
  dribbled_past?: null;
} export interface SeasonDetailsSquadDuels {
  won?:   null;
  total?: null;
} export interface SeasonDetailsSquadFouls {
  drawn?:     null;
  committed?: null;
} export interface SeasonDetailsSquadPasses {
  total?:      null;
  accuracy?:   null;
  key_passes?: null;
} export interface SeasonDetailsSquadPenalties {
  won?:       null;
  saves?:     null;
  missed?:    null;
  scores?:    null;
  committed?: null;
} export interface SeasonDetailsSquadShots {
  shots_total?:      null;
  shots_on_target?:  null;
  shots_off_target?: null;
} export interface SeasonDetailsStagesDataum {
  id?:                   number;
  name?:                 string;
  type?:                 null | string;
  league_id?:            number;
  season_id?:            number;
  sort_order?:           number | null;
  has_standings?:        boolean;
  has_outgroup_matches?: number;
}

/**
 * [ℹ] HASURA: sportsbook_details (&)
*/
export interface B_H_SD {
  data?: { [key: string]: Sportbook };
  lang?: string;
} export interface Sportbook {
  bonus?:             string;
  image?:             string;
  stars?:             string;
  title?:             string;
  position?:          string;
  bonus_code?:        string;
  information?:       string;
  review_link?:       string;
  register_link?:     string;
  bonus_description?: string;
}

/**
 * [ℹ] HASURA: scores_widget_league_info_translations (&)
*/
export interface BETARENA_HASURA_scores_widget_league_info_translations {
  data?: DataLang;
  lang?: string;
} export interface DataLang {
  stats?:     string;
  teams?:     string;
  content?:   string;
  overview?:  string;
  following?: string;
}

/**
 * [ℹ] HASURA: scores_league_list (&)
*/
export interface BETARENA_HASURA_scores_league_list {
  country_id:     number
  country_name:   string
  image_path:     string
  league_id:      number
  league_name:    string
  logo_path:      string
  type:           string
}

/**
 * [ℹ] HASURA: leagues_filtered_country (&)
*/
export interface B_H_LFC {
  lang: string
  leagues: {
    league_id: number
  }[]
}

/**
 * [ℹ] HASURA: scores_leagues_list_translations (&)
*/
export interface BETARENA_HASURA_scores_leagues_list_translations {
  lang: string
  translations: {
    search_form: string
    top_leagues: string
    leagues_by_country: string
    widget_title: string
    competitions_results: string
    countries_results: string
    full_list: string
    no_results: string
    hide: string
  }
}

/**
 * [ℹ] HASURA: scores_tournaments (&)
*/
export interface B_H_ST {
  author?:        ScoresTournamentsAuthor;
  country?:       string;
  date?:          Date;
  id?:            number;
  lang?:          ScoresTournamentsLang;
  modified_date?: Date;
  name?:          string;
  sport?:         ScoresTournamentsSport;
  status?:        ScoresTournamentsStatus;
  title?:         ScoresTournamentsTitle;
  tournament_id?: number;
  type?:          ScoresTournamentsType;
  widgets?:       any[];
  urls?:          ScoresTournamentsUrls;
  seo_content?:   string;
} export enum ScoresTournamentsAuthor {
  Betarena = "Betarena",
} export enum ScoresTournamentsLang {
  Br = "br",
  En = "en",
  Es = "es",
  It = "it",
  Pt = "pt",
  Ro = "ro",
} export enum ScoresTournamentsSport {
  Calcio = "calcio",
  Football = "football",
  Fotbal = "fotbal",
  Futebol = "futebol",
  Fútbol = "Fútbol",
} export enum ScoresTournamentsStatus {
  Draft = "draft",
  Published = "published",
} export enum ScoresTournamentsTitle {
  EnDirecto = "en directo",
  LiveScore = "live score",
  Resultados = "resultados",
  ResultadosAoVivo = "resultados ao vivo",
  RezultateLive = "Rezultate Live",
} export enum ScoresTournamentsType {
  CupInternational = "cup_international",
  Domestic = "domestic",
  DomesticCup = "domestic_cup",
  International = "international",
} export interface ScoresTournamentsUrls {
  br?: string;
  en?: string;
  es?: string;
  it?: string;
  pt?: string;
  ro?: string;
}

/**
 * [ℹ] HASURA: scores_standings_home_widget_translations (&)
*/
export interface BETARENA_HASURA_scores_standings_home_widget_translations {
  games: string
  lang: string
  points: string
  title: string
}

/**
 * [ℹ] HASURA: historic_fixtures_aggregate (&)
*/
export interface B_H_HF_AG {
  aggregate?: Aggregate;
} export interface Aggregate {
  totalCount?: number;
}

/**
 * [ℹ] HASURA: historic_fixtures (&)
*/
export interface B_H_HF {
  id?:              number;
  fixture_day?:     string;
  league_name?:     string;
  country_flag?:    string;
  home_team_logo?:  string;
  away_team_logo?:  string;
  away_team_name?:  string;
  status?:          Status;
  tvstations?:      any[];
  inserted_at?:     string;
  time?:            string;
  home_team_name?:  string;
  round_name?:      string;
  data?:            WelcomeData;
  league_id?:       number;
  season_id?:       number;
  probabilities?:   Probabilities | null;
  valuebets?:       null;
  tip_link_wp?:     null;
  fixture_link_wp?: Urls;
  media_link?:      null;
  urls?:           Urls;
  publish_status?: PublishStatus;
  teams_rating?:   HistFixturesTeamsRating;
  seo_fixtures?:    string;
  seo_fixtures_pt?: string;
  seo_fixtures_br?: string;
  seo_fixtures_es?: string;
  seo_fixtures_ro?: string;
  seo_fixtures_se?: string;
} export interface WelcomeData {
  id?:                      number;
  leg?:                     Leg;
  time?:                    Time;
  bench?:                   Bench;
  cards?:                   GoalsClass;
  goals?:                   GoalsClass;
  other?:                   Bench;
  pitch?:                   null;
  round?:                   Round;
  stage?:                   Stage;
  stats?:                   DataStats;
  venue?:                   Venue;
  colors?:                  Colors | null;
  events?:                  Events;
  league?:                  League;
  lineup?:                  Bench;
  scores?:                  Scores;
  coaches?:                 Coaches;
  corners?:                 Corners;
  deleted?:                 boolean;
  details?:                 null;
  comments?:                Bench;
  group_id?:                null;
  round_id?:                number;
  shootout?:                Bench;
  stage_id?:                number;
  venue_id?:                number | null;
  league_id?:               number;
  localTeam?:               LocalTeamClass;
  season_id?:               number;
  sidelined?:               Bench;
  standings?:               Standings;
  assistants?:              Assistants;
  attendance?:              null;
  formations?:              Formations;
  referee_id?:              number | null;
  tvstations?:              Bench;
  probability?:             Probability;
  visitorTeam?:             LocalTeamClass;
  aggregate_id?:            null;
  commentaries?:            boolean;
  localteam_id?:            number;
  neutral_venue?:           boolean;
  substitutions?:           Substitue;
  is_placeholder?:          boolean;
  visitorteam_id?:          number;
  weather_report?:          WeatherReport | null;
  winner_team_id?:          number | null;
  winning_odds_calculated?: boolean;
  referee?:                 Referee;
  localCoach?:              Coach;
  visitorCoach?:            Coach;
} export interface Assistants {
  first_assistant_id?:  null;
  fourth_official_id?:  null;
  second_assistant_id?: null;
} export interface Bench {
  data?: BenchDatum[];
} export interface BenchDatum {
  posx?:                null;
  posy?:                null;
  type?:                DatumType;
  stats?:               DatumStats;
  number?:              null;
  captain?:             null;
  team_id?:             number;
  position?:            Position;
  player_id?:           number;
  fixture_id?:          number;
  player_name?:         string;
  formation_position?:  number | null;
  additional_position?: null;
} export interface Substitue {
  data?: HistFixtures_Substitue[];
} export interface HistFixtures_Substitue {
  id?:              number;
  type?:            string;
  minute?:          number;
  team_id?:         string;
  injuried?:        boolean | null;
  fixture_id?:      number;
  extra_minute?:    number | null;
  player_in_id?:    number;
  player_out_id?:   number;
  player_in_name?:  string;
  player_out_name?: string;
} export enum Position {
  A = "A",
  D = "D",
  G = "G",
  M = "M",
} export interface DatumStats {
  cards?:    StatsCards;
  duels?:    Duels;
  fouls?:    Fouls;
  goals?:    Goals;
  other?:    { [key: string]: number | null };
  shots?:    StatsShots;
  rating?:   null;
  passing?:  Passing;
  dribbles?: Dribbles;
} export interface StatsCards {
  redcards?:       number;
  yellowcards?:    number;
  yellowredcards?: number;
} export interface Dribbles {
  success?:       null;
  attempts?:      null;
  dribbled_past?: null;
} export interface Duels {
  won?:   null;
  total?: null;
} export interface Fouls {
  drawn?:     null;
  committed?: null;
} export interface Goals {
  scored?:        number;
  assists?:       number;
  conceded?:      number;
  owngoals?:      number;
  team_conceded?: number;
} export interface Passing {
  passes?:           null;
  key_passes?:       null;
  total_crosses?:    null;
  accurate_passes?:  null;
  passes_accuracy?:  null;
  crosses_accuracy?: null;
} export interface StatsShots {
  shots_total?:   null;
  shots_on_goal?: null;
} export enum DatumType {
  Bench = "bench",
  Lineup = "lineup",
} export interface GoalsClass {
  data?: CardsDatum[];
} export interface CardsDatum {
  id?:                 number;
  type?:               string;
  minute?:             number;
  reason?:             null;
  team_id?:            string;
  on_pitch?:           null;
  player_id?:          number;
  fixture_id?:         number;
  player_name?:        string;
  extra_minute?:       number | null;
  player_assist_id?:   null;
  player_assist_name?: null;
  result?:             string;
} export interface Coaches {
  localteam_coach_id?:   number | null;
  visitorteam_coach_id?: number | null;
} export interface Colors {
  localteam?:   Team;
  visitorteam?: Team;
} export interface Team {
  color?:      string;
  kit_colors?: string;
} export interface Corners {
  data?: CornersDatum[];
} export interface CornersDatum {
  id?:           number;
  minute?:       number;
  comment?:      string;
  team_id?:      number;
  fixture_id?:   number;
  extra_minute?: null;
} export interface Events {
  data?: EventsDatum[];
} export interface EventsDatum {
  fixture_id?:          number;
  id?:                  number;
  minute?:              number;
  on_pitch?:            boolean;
  player_id?:           number;
  player_name?:         string;
  team_id?:             string;
  type?:                FluffyType2;
  related_player_id?:   number;
  related_player_name?: string;
  injuried?:            boolean;
  extra_minute?:        number;
  result?:              string;
  reason?:              string;
  var_result?:          string;
  player_assist_id?:    number;
  player_assist_name?:  string;
} export enum FluffyType2 {
  Goal = "goal",
  MissedPenalty = "missed_penalty",
  OwnGoal = "own-goal",
  Penalty = "penalty",
  Substitution = "substitution",
  Var = "var",
  Yellowcard = "yellowcard",
  Redcard = "redcard",
  Yellowred = "yellowred"
} export interface Formations {
  localteam_formation?:   null;
  visitorteam_formation?: null;
} export interface League {
  data?: LeagueData;
} export interface LeagueData {
  id?:                number;
  name?:              string;
  type?:              PurpleType;
  active?:            boolean;
  is_cup?:            boolean;
  coverage?:          Coverage;
  legacy_id?:         number | null;
  logo_path?:         string;
  country_id?:        number;
  is_friendly?:       boolean;
  live_standings?:    boolean;
  current_round_id?:  number | null;
  current_stage_id?:  number | null;
  current_season_id?: number;
} export interface Coverage {
  predictions?:       boolean;
  topscorer_cards?:   boolean;
  topscorer_goals?:   boolean;
  topscorer_assists?: boolean;
} export enum PurpleType {
  Domestic = "domestic",
} export enum Leg {
  The11 = "1/1",
} export interface Coach {
  data?: LocalCoachData;
} export interface LocalCoachData {
  team_id?:      number;
  coach_id?:     number;
  fullname?:     string;
  lastname?:     string;
  birthdate?:    null | string;
  firstname?:    string;
  birthplace?:   null;
  country_id?:   number;
  image_path?:   null;
  common_name?:  string;
  nationality?:  string;
  birthcountry?: string;
} export interface LocalTeamClass {
  data?: LocalTeamData;
} export interface LocalTeamData {
  id?:                number;
  name?:              string;
  founded?:           number | null;
  twitter?:           null;
  venue_id?:          number | null;
  legacy_id?:         number | null;
  logo_path?:         string;
  country_id?:        number;
  short_code?:        null | string;
  national_team?:     boolean;
  is_placeholder?:    boolean;
  current_season_id?: number;
} export interface Probability {
  data?: ProbabilityData;
} export interface ProbabilityData {
  fixture_id?:  number;
  predictions?: Probabilities;
} export interface Probabilities {
  away?:          number;
  btts?:          number;
  draw?:          number;
  home?:          number;
  over_2_5?:      number;
  over_3_5?:      number;
  under_2_5?:     number;
  under_3_5?:     number;
  AT_over_0_5?:   number;
  AT_over_1_5?:   number;
  HT_over_0_5?:   number;
  HT_over_1_5?:   number;
  AT_under_0_5?:  number;
  AT_under_1_5?:  number;
  HT_under_0_5?:  number;
  HT_under_1_5?:  number;
  correct_score?: { [key: string]: number };
} export interface Referee {
  data?: RefereeData;
} export interface RefereeData {
  id?:          number;
  fullname?:    string;
  lastname?:    string;
  firstname?:   string;
  common_name?: string;
} export interface Round {
  data?: RoundData;
} export interface RoundData {
  id?:        number;
  end?:       string;
  name?:      number;
  start?:     string;
  stage_id?:  number;
  league_id?: number;
  season_id?: number;
} export interface Scores {
  et_score?:              null;
  ft_score?:              null | string;
  ht_score?:              null | string;
  ps_score?:              null;
  localteam_score?:       number;
  visitorteam_score?:     number;
  localteam_pen_score?:   null;
  visitorteam_pen_score?: null;
} export interface Stage {
  data?: StageData;
} export interface StageData {
  id?:                   number;
  name?:                 string;
  type?:                 FluffyType;
  league_id?:            number;
  season_id?:            number;
  sort_order?:           number;
  has_standings?:        boolean;
  has_outgroup_matches?: number;
} export enum FluffyType {
  GroupStage = "Group Stage",
} export interface Standings {
  localteam_position?:   number | null;
  visitorteam_position?: number | null;
} export interface DataStats {
  data?: StatsDatum[];
} export interface StatsDatum {
  fouls?:          null;
  goals?:          number;
  saves?:          null;
  shots?:          DatumShots;
  passes?:         null;
  attacks?:        Attacks;
  corners?:        number;
  tackles?:        null;
  team_id?:        number;
  injuries?:       null;
  offsides?:       null;
  redcards?:       number;
  throw_in?:       null;
  ball_safe?:      null;
  free_kick?:      null;
  goal_kick?:      null;
  penalties?:      number;
  fixture_id?:     number;
  yellowcards?:    number;
  goal_attempts?:  null;
  substitutions?:  number;
  possessiontime?: null;
  yellowredcards?: null;
} export interface Attacks {
  attacks?:           number;
  dangerous_attacks?: number;
} export interface DatumShots {
  total?:      number;
  ongoal?:     number;
  blocked?:    null;
  offgoal?:    number;
  insidebox?:  null;
  outsidebox?: null;
} export interface Time {
  minute?:       number | null;
  second?:       null;
  status?:       Status;
  added_time?:   null;
  injury_time?:  null;
  starting_at?:  StartingAt;
  extra_minute?: null;
} export interface StartingAt {
  date?:      string;
  time?:      string;
  timezone?:  Timezone;
  date_time?: string;
  timestamp?: number;
} export enum Timezone {
  UTC = "UTC",
} export enum Status {
  Ft = "FT",
  NS = "NS",
  Tba = "TBA",
} export interface Venue {
  data?: VenueData;
} export interface VenueData {
  id?:          number;
  city?:        string;
  name?:        string;
  address?:     null | string;
  surface?:     string;
  capacity?:    number;
  image_path?:  null | string;
  coordinates?: string;
} export interface WeatherReport {
  code?:                string;
  icon?:                string;
  type?:                string;
  wind?:                Wind;
  clouds?:              string;
  humidity?:            string;
  pressure?:            number;
  updated_at?:          string;
  coordinates?:         Coordinates;
  temperature?:         Temperature;
  temperature_celcius?: Temperature;
} export interface Coordinates {
  lat?: number;
  lon?: number;
} export interface Temperature {
  temp?: number;
  unit?: string;
} export interface Wind {
  speed?:  string;
  degree?: number;
} export interface MediaLinkWelcome {
  id?:             number;
  date?:           string;
  league?:         string;
  country?:        string;
  thumbnail?:      string;
  teams_name?:     MediaLinkTeamsName;
  video_link?:     string;
  video_title?:    string;
  video_subtitle?: string;
} export interface MediaLinkTeamsName {
  local?:   string;
  visitor?: string;
} export enum PublishStatus {
  Draft = "draft",
  Published = "published"
} export interface Urls {
  br?: string;
  en?: string;
  es?: string;
  it?: string;
  pt?: string;
  ro?: string;
  se?: string;
} export interface HistFixturesTeamsRating {
  away_team?: number | null
  home_team?: number | null
}


/**
 * [ℹ] HASURA: scores_widget_football_fixtures_odds_translations (&)
*/
export interface B_H_SWFFOT {
  lang?:         string;
  translations?: FixturesOddsTranslations;
} export interface FixturesOddsTranslations {
  tip?:     string;
  odds?:    string;
  week?:    string;
  round?:   string;
  matches?: string;
  away?:    string;
  draw?:    string;
  home?:    string;
  no_odds?: string;
}


/**
 * [ℹ] HASURA: scores_livescore_football_translations (&)
*/
export interface B_H_SLFT {
  lang?:       string;
  status_abv?: Array<string[]>;
  terms?:      Array<string[]>;
  status?:     Array<string[]>;
}


/**
 * [ℹ] HASURA: widget_league_info_translations (&)
*/
export interface BETARENA_HASURA_widget_league_info_translations {
  lang?: string;
  data?: WidgetLeagueInfo2Data;
} export interface WidgetLeagueInfo2Data {
  clubs?:                 string;
  goals?:                 string;
  league_info?:           string;
  average_goals?:         string;
  win_percentage?:        string;
  average_player_rating?: string;
}

/**
 * [ℹ] HASURA: scores_widget_tournament_about_translations (&)
*/
export interface BETARENA_HASURA_scores_widget_tournament_about_translations {
  lang?: string;
  data?: WidgetTournamentAboutData;
} export interface WidgetTournamentAboutData {
  about_the_league?:      string;
}

/**
 * [ℹ] HASURA: scores_endpoints_translations (&)
*/
export interface BETARENA_HASURA_scores_endpoints_translations {
  countries_translation?: { [key: string]: string };
  lang?:                  string;
  sport?:                 string;
  sports_translation?:    EndpointSportsTranslation;
  title?:                 string;
  type?:                  string;
  id?:                    number;
} export interface EndpointSportsTranslation {
  football?: string;
}

/**
 * [ℹ] HASURA: scores_seo_fixtures (&)
*/
export interface BETARENA_HASURA_scores_seo_fixtures {
  lang?:         string;
  main_data?:    Main_Data;
  opengraph?:    FixturesOpengraph;
  sports_type?:  string;
  twitter_card?: FixturesTwitterCard;
} export interface FixturesOpengraph {
  url?:         string;
  type?:        string;
  title?:       string;
  images?:      FixturesImage[];
  locale?:      string;
  description?: string;
} export interface FixturesImage {
  alt?:    string;
  url?:    string;
  width?:  number;
  height?: number;
} export interface FixturesTwitterCard {
  site?:        string;
  image?:       string;
  title?:       string;
  imageAlt?:    string;
  description?: string;
}

/**
 * [ℹ] HASURA: scores_fixture_scoreboard_translations (&)
*/
export interface B_H_SFST {
  lang?:         string;
  translations?: ScoreboardTranslations;
} export interface ScoreboardTranslations {
  overview?:   string;
  news_views?: string;
}

/**
 * [ℹ] HASURA: scores_fixture_lineup_translations (&)
*/
export interface B_H_SFLT {
  lang?:         string;
  translations?: FixtureLineupTranslations;
} export interface FixtureLineupTranslations {
  out?:   string;
  title?: string;
}

/**
 * [ℹ] HASURA: scores_incidents_translations (&)
*/
export interface B_H_SIT {
  lang?:         string;
  translations?: IncidentsTranslations;
} export interface IncidentsTranslations {
  out?:   string;
  title?: string;
}

/**
 * [ℹ] HASURA: scores_fixture_stats_translations (&)
*/
export interface B_H_SFST_2 {
  lang?:         string;
  translations?: FixtureStatsTranslations;
} export interface FixtureStatsTranslations {
  fouls?:          string;
  goals?:          string;
  other?:          string;
  saves?:          string;
  title?:          string;
  total?:          string;
  ongoal?:         string;
  attacks?:        string;
  blocked?:        string;
  corners?:        string;
  offgoal?:        string;
  tackles?:        string;
  accurate?:       string;
  injuries?:       string;
  offsides?:       string;
  redcards?:       string;
  throw_in?:       string;
  ball_safe?:      string;
  free_kick?:      string;
  goal_kick?:      string;
  insidebox?:      string;
  penalties?:      string;
  outsidebox?:     string;
  percentage?:     string;
  shots_title?:    string;
  yellowcards?:    string;
  passes_title?:   string;
  total_passes?:   string;
  attacks_title?:  string;
  goal_attempts?:  string;
  substitutions?:  string;
  possessiontime?: string;
  yellowredcards?: string;
}

/**
 * [ℹ] HASURA: external_content (&)
*/
export interface B_H_EC {
  id?:             number;
  source?:         Source;
  title?:          string;
  lang?:           Lang;
  link?:           string;
  featured_media?: string | null;
  excerpt?:        string;
  author?:         string;
  date?:           string;
  gameid?:         number;
  category?:       number;
} export enum Lang {
  En = "en",
  Es = "es",
  It = "it",
  Se = "se",
  Ro = "ro",
  Br = "br",
  Pt = "pt"
} export enum Source {
  BtaWordpress = "bta_wordpress",
  ApostasWordpress = "apostas_wordpress"
}

/**
 * [ℹ] HASURA: scores_fixture_about_translations (&)
*/
export interface BETARENA_HASURA_scores_fixture_about_translations {
  lang?:         string;
  translations?: FixtureAboutTranslations;
} export interface FixtureAboutTranslations {
  title?:          string;
}

/**
 * [ℹ] HASURA: scores_fixtures_content_translations (&)
*/
export interface B_H_SFCT {
  lang?:         string;
  translations?: FixtureContentTranslations;
} export interface FixtureContentTranslations {
  new?:            string;
  view_all?:       string;
  news_and_views?: string;
}

/**
 * [ℹ] HASURA: widget_featured_match_votes (&)
*/
export interface BETARENA_HASURA_widget_featured_match_votes {
	match_id?:         number;
	vote_draw_x?:      number;
	vote_win_local?:   number;
	vote_win_visitor?: number;
}

/**
 * [ℹ] HASURA: scores_fixture_voting_translations (&)
*/
export interface BETARENA_HASURA_scores_fixture_voting_translations {
  lang?:         string;
  translations?: FixtureVotesTranslations;
} export interface FixtureVotesTranslations {
  bet?:          string;
  vote?:         string;
  stake?:        string;
  winnings?:     string;
  probability?:  string;
  widget_title?: string;
}


/**
 * [ℹ] HASURA: links_map (&)
*/
export interface BETARENA_HASURA_links_map {
  url?:        string;
  created_at?: string;
  category?:   string;
  alt_links?:  AltLinks;
} export interface AltLinks {
  br?: string;
  en?: string;
  es?: string;
  it?: string;
  pt?: string;
  ro?: string;
  se?: string;
}

/**
 * [ℹ] HASURA: scores_fixture_probabilities_translations (&)
 */
export interface B_H_SFPT {
	lang?: string;
	data?: FixtureProbabilitiesDataTranslation;
}
export interface FixtureProbabilitiesDataTranslation {
	btts?: string;
	draw?: string;
	odds?: string;
	market?: string;
	over_2_5?: string;
	over_3_5?: string;
	show_less?: string;
	under_2_5?: string;
	under_3_5?: string;
	at_over_0_5?: string;
	at_over_1_5?: string;
	featured_by?: string;
	ht_over_0_5?: string;
	ht_over_1_5?: string;
	at_under_0_5?: string;
	at_under_1_5?: string;
	away_team_win?: string;
	ht_under_0_5?: string;
	ht_under_1_5?: string;
	correct_score?: string;
	home_team_win?: string;
	probabilities?: string;
	show_more_options?: string;
}

/**
 * [ℹ] HASURA: football_h2h (&)
 */
export interface B_H_FH2H {
	team_ids?: string;
	data?: WelcomeData;
	last_5_data?: WelcomeData[];
	wins_draws?: football_h2h_WINSDraws;
	yellow_cards_avg?: number;
	overs?: football_h2h_Overs;
	btts?: football_h2h_Btts;
}
export interface football_h2h_Btts {
	btts_count?: number;
}
export interface football_h2h_Overs {
	over_1_5_count?: number;
	over_2_5_count?: number;
	over_3_5_count?: number;
}
export interface football_h2h_WINSDraws {
	draws?: number;
	team_1?: number;
	team_2?: number;
}

/**
 * [ℹ] HASURA: scores_fixtures_h2h_translations (&)
 */
export interface B_H_SFH2HT {
	lang?: string;
	translations?: h2h_Translations;
}
export interface h2h_Translations {
	in?: string;
	btts?: string;
	wins?: string;
	draws?: string;
	round?: string;
	last_5?: string;
	corners?: string;
	matches?: string;
	over_1_5?: string;
	over_2_5?: string;
	over_3_5?: string;
	widget_title?: string;
	yellow_cards?: string;
}

/**
 * [ℹ] HASURA: scores_livescore_football_translations_v2 (&)
*/
export interface B_H_SLFT_V2 {
  lang?:        string;
  translation?: SLFT_Translation;
} export interface SLFT_Translation {
  all?:           string;
  tip?:           string;
  days?:          SLFT_Days;
  live?:          string;
  title?:         string;
  status?:        SLFT_Status;
  no_info?:       SLFT_NoInfo;
  more_games?:    string;
  status_abbrev?: SLFT_StatusAbbrev;
} export interface SLFT_Days {
  Fri?:  string;
  Mon?:  string;
  Sat?:  string;
  Sun?:  string;
  Tue?:  string;
  Wed?:  string;
  Thur?: string;
} export interface SLFT_NoInfo {
  desc?:    string;
  "sub-t"?: string;
  title?:   string;
} export interface SLFT_Status {
  AU?:       string;
  ET?:       string;
  FT?:       string;
  HT?:       string;
  NS?:       string;
  WO?:       string;
  AET?:      string;
  INT?:      string;
  TBA?:      string;
  ABAN?:     string;
  LIVE?:     string;
  SUSP?:     string;
  BREAK?:    string;
  CANCL?:    string;
  POSTP?:    string;
  FT_PEN?:   string;
  AWARDED?:  string;
  PEN_LIVE?: string;
} export interface SLFT_StatusAbbrev {
  AU?:       string;
  FT?:       string;
  HT?:       string;
  WO?:       string;
  AET?:      string;
  TBA?:      string;
  SUSP?:     string;
  BREAK?:    string;
  CANCL?:    string;
  POSTP?:    string;
  FT_PEN?:   string;
  PEN_LIVE?: string;
}

/**
 * [ℹ] HASURA: leagues_supported_filter_v2 (&)
*/
export interface B_H_LSF_V2 {
  id?:                         number;
  league_id?:                  number[];
  featured_livescore_leagues?: number[];
}
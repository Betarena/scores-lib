//#region IMPORTS
// <⬇️-add-imports-below-⬇️>

import { GraphQLClient } from "graphql-request";
import { B_H_STSH, PurpleDatumHist } from "../../types/hasura";
import { B_H_STA_Q, B_STA_D, B_STA_T, STA_Groups, STA_Team } from "../../types/standings";
import { B_C_STA_T_Q_D0, B_C_STA_T_Q_D2, B_C_STA_T_Q_T } from "../graphql/query.standings.js";

//#endregion IMPORTS

//#region [METHODS]
// <⬇️-add-methods-below-⬇️>

/**
 * @description [MAIN] - compiles the data and process it
 * ready to be utilized and cached/displayed;
 * @param {B_H_STA_Q} data 
 * @returns Promise < B_STA_D[] >
 */
export async function STA_F_data_main (
  response: B_H_STA_Q
): Promise < B_STA_D[] > {

  const cache_data_arr: B_STA_D[] = []

  loop_league: for (const league of response.scores_football_leagues) {

    // console.log(`🔼 league: ${league.id}`)
    const finalCacheObj: B_STA_D = { }
    finalCacheObj.league_id = league.id;
    finalCacheObj.seasons = []

    // [ℹ] get all seasons for (THIS) league (tournament-id)
    loop_season: for (const season_main of league.seasons) {

      let season_standings_teams_list: PurpleDatumHist[];
      // FIXME: incorrect, due to the fact that season can be 
      // FIXME: current for target league, however, cannot be 
      // FIXME: current for the team - thus, need to validate if it is
      // FIXME: current for the target team [?] by... (unkonw solution)
      let seasonCurrent = false;
      seasonCurrent = season_main?.is_current_season;

      // [🐞]
      // console.log(`${season_main.id} is_current_season`);
      // console.log(`season_standings_teams_list} is undefined: ${season_standings_teams_list}`);

      const season_standings = 
        season_main?.is_current_season == true
        ? response.scores_football_standings
          .find(( { league_id } ) =>
            league_id === league.id
          ) // [ℹ] contains only ONE (current) season PER league [1:1]
        : response.scores_football_standings_history
          .find(( { league_id, season_id } ) => 
            league_id === season_main.league_id 
            && season_id === season_main.id
          ) // [ℹ] contains MANY seasons PER league [X:1]
      ;

      // [ℹ] continue (cond)
      if (season_standings == undefined) {
        continue
      }

      // [ℹ] break;
      // [ℹ] discontinued;
      // if (season_standings?.type != 'domestic') {
      //   console.log(`🔺 breaking league: ${league.id}`)
      //   break loop_season;
      // }

      finalCacheObj.comp_typ = season_standings?.type

      // [ℹ] check for multi-part
      // [ℹ] NOTE: entirely different method
      if (season_standings?.multipart) {
        // [ℹ] ignore the seasons with the complex
        // [ℹ] type:group => type:stage => teams[]
        // [ℹ] structure
        if (season_standings?.data[0]?.standings?.data[0]?.standings) {
          // console.log(`complex season standing ${season_main.id}`)
          // NOTE: IGNORE
          continue
        }

        const season_standing_groups_arr = season_standings?.data;

        // [ℹ] standard type:group => teams[]
        // [ℹ] have consistent "color-codes" in each group
        // [ℹ] therefore, can use only first set [0] of type:group => teams[]
        const season_color_codes: {
          [key: number]: string;
        } = { }
        for (const season_group_team of season_standing_groups_arr[0].standings.data) {
          const team_pos: number = season_group_team?.position;
          let team_color_code =
            season_group_team.result == undefined
              ? 'transparent'
              : response.color_codes_league_standings_positions
                .find( ({ sports }) => 
                  sports === "football"
                )
                .color_codes[season_group_team.result.toString()]
          ;
          // [ℹ] special color-code cases
          // [ℹ] for world-cup, champions-league, europa-league
          if (league.id == 732 
            && season_group_team?.result == '8th Finals') {
            team_color_code = 
              response.color_codes_league_standings_positions
              .find( ({ sports }) => 
                sports === "football"
              ).color_codes["8th Finals (WC)"]
          }
          if (league.id == 2 
            && season_group_team?.result == '8th Finals') {
            team_color_code = 
              response.color_codes_league_standings_positions
              .find( ({ sports }) => 
                sports === "football"
              ).color_codes["8th Finals (CL)"]
          }
          if (league.id == 2
            && season_group_team?.result == 'UEFA Europa League') {
            team_color_code = 
              response.color_codes_league_standings_positions
              .find( ({ sports }) => 
                sports === "football"
              ).color_codes["UEFA Europa League (CL)"]
          }
          if (league.id == 5
            && season_group_team?.result == '8th Finals') {
            team_color_code = 
              response.color_codes_league_standings_positions
              .find( ({ sports }) => 
                sports === "football"
              ).color_codes["8th Finals (EL)"]
          }
          season_color_codes[team_pos] = team_color_code
        }

        const season_gen_group_list: STA_Groups[] = []

        // [ℹ] generate (THIS) team view objects (total | home | away);
        for (const season_standing_group of season_standing_groups_arr) {

          const season_group_object: STA_Groups = { }
          season_group_object.group_name = season_standing_group?.name
          season_group_object.group_round = season_standing_group?.round_name
          season_group_object.total = []
          season_group_object.home = []
          season_group_object.away = []

          // [ℹ] generate (THIS) (SPECIFIC) (GROUP) season team 
          // [ℹ] appropiate order view of [home || away] tables
          // [ℹ] based on team [home || away] points
          // [ℹ] and grouping team_names[] by their [home || away] points
          // [ℹ] with inner-point-group alphebetical sorting
          const home_view_teams_map = new Map <number, string[]> ()
          const away_view_teams_map = new Map <number, string[]> ()

          // [ℹ] iterate over (THIS) season standing teams
          for (const season_group_team of season_standing_group.standings.data) {

            const team_name = season_group_team.team_name;
            
            // [ℹ] dealing with positions of "home" teams

            const team_home_position: number = 
              season_group_team?.home?.points == undefined
                ? null
                : season_group_team?.home?.points
            ;

            if (home_view_teams_map.has(team_home_position)) {
              const pos_arr = home_view_teams_map.get(team_home_position);
              pos_arr.push(team_name)
              pos_arr.sort()
              home_view_teams_map.set(team_home_position, pos_arr)
            } 
            else {
              const init_arr = []
              init_arr.push(team_name)
              init_arr.sort()
              home_view_teams_map.set(team_home_position, init_arr)
            }

            // [ℹ] dealing with positions of "away" teams
            
            const team_away_position: number = 
              season_group_team?.away?.points == undefined
                ? null
                : season_group_team?.away?.points
            ;

            if (away_view_teams_map.has(team_away_position)) {
              const pos_arr = away_view_teams_map.get(team_away_position);
              pos_arr.push(team_name)
              pos_arr.sort()
              away_view_teams_map.set(team_away_position, pos_arr)
            } 
            else {
              const init_arr = []
              init_arr.push(team_name)
              init_arr.sort()
              away_view_teams_map.set(team_away_position, init_arr)
            }

          }

          // [ℹ] sort each [home || away] map by points (desc.)
          const sortHomeViewAsc = new Map([...home_view_teams_map].sort((a, b) => b[0] - a[0]));
          const sortAwayViewAsc = new Map([...away_view_teams_map].sort((a, b) => b[0] - a[0]));

          let sortHomeViewAscArr: string[] = []
          let sortHomeAwayAscArr: string[] = []

          // [ℹ] flatten [home || away] map into a single ARRAY of strings
          for (const [key, value] of sortHomeViewAsc.entries()) {
            sortHomeViewAscArr = sortHomeViewAscArr.concat(value)
          }
          for (const [key, value] of sortAwayViewAsc.entries()) {
            sortHomeAwayAscArr = sortHomeAwayAscArr.concat(value)
          }

          // [ℹ] final data aggregation && persistance
          for (const season_group_team of season_standing_group.standings.data) {

            const team_data_main =
              response.scores_football_teams
              .find( ( { id } ) => 
                id === season_group_team.team_id
              )
            ;

            const team_logo: string = 
              response.scores_football_teams
              .find( ({ id }) =>
                id === season_group_team.team_id
              )?.data?.logo_path // [ℹ] can be "undefined"
            ;

            const team_name: string =
              response.scores_football_teams
              .find( ({ id }) => 
                id === season_group_team.team_id
              )?.data?.name == undefined // [ℹ] if no TEAM-ID exists in DB-data
                ? season_group_team?.team_name // [ℹ] use TEAM-NAME provided in STANDINGS OBJ-data
                : response.scores_football_teams
                  .find( ({ id }) =>
                    id === season_group_team.team_id
                  )?.data?.name // [ℹ] else, use correct TEAM-NAME in scores_football_teams
            ;

            const target_team_stat = 
              response.scores_team_statistics
              .find( ({ team_id }) =>
                team_id === season_group_team.team_id
              )
            ;

            const target_team_stat_hist = 
              response.scores_team_statistics_history
              .find( ({ team_id, season_id }) => 
                team_id === season_group_team.team_id
                && season_id === season_main.id 
              )
            ;

            // [ℹ] NOTE: check for team-stats is_current_season
            const team_current_season = team_data_main?.data?.current_season_id;
            
            const team_stats_current_valid = 
              seasonCurrent
              && team_current_season === season_main.id;

            // console.log('team_stats_current_valid', team_stats_current_valid)

            let target_team_stats: B_H_STSH = 
              team_stats_current_valid === true
                ? target_team_stat
                : target_team_stat_hist; // [ℹ] not correct type

            // [ℹ] order stats-data in DESC [1st-stage first-order]
            // NOTE: perhaps not the best solution - although effective
            target_team_stats?.data?.sort((a, b) => b.stage_id - a.stage_id)

            const team_winP: number = 
              target_team_stat?.winning_probability == undefined
                ? null
                : target_team_stat?.winning_probability
            ;

            const team_home_position: number = 
              sortHomeViewAscArr.indexOf(team_name) + 1;
  
            const team_away_position: number = 
              sortHomeAwayAscArr.indexOf(team_name) + 1;

            const team_total_color_code = season_group_team?.position == null ? 'black' : season_color_codes[season_group_team?.position.toString()]
            // const team_home_color_code = team_home_position == null ? 'black' : season_color_codes[team_home_position.toString()]
            // const team_away_color_code = team_away_position == null ? 'black' : season_color_codes[team_away_position.toString()]

            const team_total_ov15: number =
              target_team_stats?.data[0].goal_line?.over["1_5"]?.away == null
              || target_team_stats?.data[0]?.goal_line?.over["1_5"]?.home == null 
                ? null
                : (target_team_stats?.data[0].goal_line?.over["1_5"]?.away 
                  + target_team_stats?.data[0]?.goal_line?.over["1_5"]?.home) 
                  / 2
            ;

            const team_total_ov25: number =
              target_team_stats?.data[0].goal_line?.over["2_5"]?.away == null
              || target_team_stats?.data[0]?.goal_line?.over["2_5"]?.home == null
                ? null
                : (target_team_stats?.data[0].goal_line?.over["2_5"]?.away 
                  + target_team_stats?.data[0]?.goal_line?.over["2_5"]?.home) 
                  / 2
            ;

            const team_total_gavg: number = 
              season_group_team?.round_name == null
              || season_group_team?.overall?.goals_scored == null
                ? null
                : season_group_team?.overall?.goals_scored / season_group_team?.round_name;
            ;

            const team_home_gavg: number = 
              season_group_team?.home?.games_played == null
              || season_group_team?.home?.goals_scored == null
                ? null
                : season_group_team?.home?.goals_scored / season_group_team?.home?.games_played;
            ;

            const team_away_gavg: number = 
              season_group_team?.away?.games_played == null
              || season_group_team?.away?.goals_scored == null
                ? null
                : season_group_team?.away?.goals_scored / season_group_team?.away?.games_played;
            ;

            const team_obj_total: STA_Team = {
              team_logo:      team_logo,
              team_name:      team_name,
              color_code:     team_total_color_code,
              points:         season_group_team?.points,
              position:       season_group_team?.position,
              games_played:   season_group_team?.overall?.games_played, // [ℹ] previously, .round_name
              won:            season_group_team?.overall?.won,
              draw:           season_group_team?.overall?.draw,
              lost:           season_group_team?.overall?.lost,
              gs:             season_group_team?.overall?.goals_scored,
              ga:             season_group_team?.overall?.goals_against,
              gavg:           team_total_gavg,
              cavg:           parseInt(target_team_stats?.data[0]?.avg_corners), // [📌 inaccurate with "multi-stage" season case, FIXME: TODO:]
              ycavg:          target_team_stats?.average_yellow_cards,
              ov15:           team_total_ov15,
              ov25:           team_total_ov25,
              winP:           team_winP,
              rf:             season_group_team?.recent_form
            }

            const team_obj_home: STA_Team = {
              team_logo:      team_logo,
              team_name:      team_name,
              color_code:     team_total_color_code,
              points:         season_group_team?.home?.points,
              position:       team_home_position, // season_group_team?.home?.points
              games_played:   season_group_team?.home?.games_played,
              won:            season_group_team?.home?.won,
              draw:           season_group_team?.home?.draw,
              lost:           season_group_team?.home?.lost,
              gs:             season_group_team?.home?.goals_scored,
              ga:             season_group_team?.home?.goals_against,
              gavg:           team_home_gavg,
              cavg:           null,
              ycavg:          null,
              ov15:           null,
              ov25:           null,
              winP:           team_winP,
              rf:             null
            }
  
            const team_obj_away: STA_Team = {
              team_logo:      team_logo,
              team_name:      team_name,
              color_code:     team_total_color_code,
              points:         season_group_team?.away?.points,
              position:       team_away_position, // season_group_team?.away?.points
              games_played:   season_group_team?.away?.games_played,
              won:            season_group_team?.away?.won,
              draw:           season_group_team?.away?.draw,
              lost:           season_group_team?.away?.lost,
              gs:             season_group_team?.away?.goals_scored,
              ga:             season_group_team?.away?.goals_against,
              gavg:           team_away_gavg,
              cavg:           null,
              ycavg:          null,
              ov15:           null,
              ov25:           null,
              winP:           team_winP,
              rf:             null
            }

            season_group_object.total.push(team_obj_total)
            season_group_object.home.push(team_obj_home)
            season_group_object.away.push(team_obj_away)
          }

          season_gen_group_list.push(season_group_object)
        }

        finalCacheObj.seasons.push(
          {
            season_id: season_main.id,
            group: true,
            group_standings: season_gen_group_list
          }
        )
      }
      // [ℹ] non-multi-part season 
      // [ℹ] data pre-processing
      else {

        season_standings_teams_list = season_standings?.data[0]?.standings?.data;

        const season_gen_list_total: STA_Team[] = []
        const season_gen_list_home:  STA_Team[] = []
        const season_gen_list_away:  STA_Team[] = []

        // [ℹ] no season standings data found in DB 
        // [ℹ] [exit]
        if (season_standings_teams_list == undefined) {
          // console.log(`Season ID: ${season_main.id}`)
          continue
        }

        // [ℹ] generate (THIS) season standings color-codes;
        const season_color_codes: {
          [key: number]: string;
        } = { }
        for (const season_team of season_standings_teams_list) {
          const team_pos: number = season_team?.position;
          const team_color_code =
            season_team.result == undefined
              ? 'transparent'
              : response.color_codes_league_standings_positions
                .find( ({ sports }) => 
                  sports === "football"
                )
                .color_codes[season_team.result.toString()]
          ;

          season_color_codes[team_pos] = team_color_code
        }

        // [🐞]
        /*
          // [🐞] DEBUG COLOR-CODES
          console.log(
            `color-codes: ${season_color_codes}`
          )
          const data = JSON.stringify(season_color_codes, null, 4)
          fs.appendFile('./datalog/main-COLORCODES.json', data, err => {
            if (err) {
              console.error(err);
            }
          });
        */

        // [ℹ] generate (THIS) (STANDARD) season team 
        // [ℹ] appropiate order view of [home || away] tables
        // [ℹ] based on team [home || away] points
        // [ℹ] and grouping team_names[] by their [home || away] points
        // [ℹ] with inner-point-group alphebetical sorting
        const home_view_teams_map = new Map <number, string[]> ()
        const away_view_teams_map = new Map <number, string[]> ()

        // [ℹ] iterate over (THIS) season standing teams
        for (const season_team of season_standings_teams_list) {

          const team_name = season_team.team_name;
          
          // [ℹ] dealing with positions of "home" teams

          const team_home_position: number = 
            season_team?.home?.points == undefined
              ? null
              : season_team?.home?.points
          ;

          if (home_view_teams_map.has(team_home_position)) {
            const pos_arr = home_view_teams_map.get(team_home_position);
            pos_arr.push(team_name)
            pos_arr.sort()
            home_view_teams_map.set(team_home_position, pos_arr)
          } 
          else {
            const init_arr = []
            init_arr.push(team_name)
            init_arr.sort()
            home_view_teams_map.set(team_home_position, init_arr)
          }

          // [ℹ] dealing with positions of "away" teams
          
          const team_away_position: number = 
            season_team?.away?.points == undefined
              ? null
              : season_team?.away?.points
          ;

          if (away_view_teams_map.has(team_away_position)) {
            const pos_arr = away_view_teams_map.get(team_away_position);
            pos_arr.push(team_name)
            pos_arr.sort()
            away_view_teams_map.set(team_away_position, pos_arr)
          } 
          else {
            const init_arr = []
            init_arr.push(team_name)
            init_arr.sort()
            away_view_teams_map.set(team_away_position, init_arr)
          }

        }

        // [ℹ] sort each [home || away] map by points (desc.)
        const sortHomeViewAsc = new Map([...home_view_teams_map].sort((a, b) => b[0] - a[0]));
        const sortAwayViewAsc = new Map([...away_view_teams_map].sort((a, b) => b[0] - a[0]));

        let sortHomeViewAscArr: string[] = []
        let sortHomeAwayAscArr: string[] = []

        // [ℹ] flatten [home || away] map into a single ARRAY of strings
        for (const [key, value] of sortHomeViewAsc.entries()) {
          sortHomeViewAscArr = sortHomeViewAscArr.concat(value)
        }
        for (const [key, value] of sortAwayViewAsc.entries()) {
          sortHomeAwayAscArr = sortHomeAwayAscArr.concat(value)
        }

        // [ℹ] generate (THIS) season teams [total | home | away]
        // [ℹ] views
        for (const season_team of season_standings_teams_list) {

          const team_data_main = 
            response.scores_football_teams
            .find( ( { id } ) => 
              id === season_team.team_id
            )
          ;

          const team_logo: string = 
            response.scores_football_teams
            .find( ( { id } ) => 
              id === season_team.team_id
            )?.data?.logo_path // [ℹ] can be "undefined"
          ;

          const team_name: string =
            response.scores_football_teams
            .find( ( { id } ) => 
              id === season_team.team_id
            )?.data?.name == undefined // [ℹ] if no TEAM-ID exists in DB-data
                ? season_team?.team_name // [ℹ] use TEAM-NAME provided in STANDINGS OBJ-data
                : response.scores_football_teams
                  .find( ( { id } ) => 
                    id === season_team.team_id
                  )?.data?.name
          ;

          const target_team_stat = 
            response.scores_team_statistics
            .find( ({ team_id }) => 
              team_id === season_team.team_id
            )
          ;

          const target_team_stat_hist = 
            response.scores_team_statistics_history
            .find( ({ team_id, season_id }) => 
                team_id === season_team.team_id
                && season_id === season_main.id 
            )
          ;

          // [ℹ] NOTE: check for team-stats is_current_season
          const team_current_season = team_data_main?.data?.current_season_id;
          
          const team_stats_current_valid = 
            seasonCurrent
            && team_current_season === season_main.id;

          // console.log('team_stats_current_valid', team_stats_current_valid)

          let target_team_stats: B_H_STSH = 
            team_stats_current_valid === true
              ? target_team_stat
              : target_team_stat_hist; // [ℹ] not correct type

          // [ℹ] order stats-data in DESC [1st-stage first-order]
          // NOTE: perhaps not the best solution - although effective
          target_team_stats?.data?.sort((a, b) => b.stage_id - a.stage_id)

          const team_winP: number = 
            target_team_stat?.winning_probability == null || 
            target_team_stat?.winning_probability == undefined
              ? null
              : target_team_stat?.winning_probability

          const team_home_position: number = 
            sortHomeViewAscArr.indexOf(team_name) + 1;
  
          const team_away_position: number = 
            sortHomeAwayAscArr.indexOf(team_name) + 1;

          // [🐞]
          /*
            if (team_name === "Manchester City") {
              console.log(
                `seasons_id: ${season_main?.id}`,
                `team_total_position: ${season_team?.position}`,
                `team_total_points: ${season_team?.points}`,
                `team_home_position: ${team_home_position}`,
                `team_home_position verify: ${season_team?.home?.points}`,
                `team_away_position: ${team_away_position}`,
                `team_away_position verify: ${season_team?.away?.points}`,
              )
            }
          */

          const team_total_color_code = season_team?.position == null ? 'black' : season_color_codes[season_team?.position.toString()]
          // const team_home_color_code = team_home_position == null ? 'black' : season_color_codes[team_home_position.toString()]
          // const team_away_color_code = team_away_position == null ? 'black' : season_color_codes[team_away_position.toString()]

          const team_total_ov15: number =
            target_team_stats?.data[0].goal_line?.over["1_5"]?.away == null
            || target_team_stats?.data[0]?.goal_line?.over["1_5"]?.home == null 
              ? null
              : (target_team_stats?.data[0].goal_line?.over["1_5"]?.away + target_team_stats?.data[0]?.goal_line?.over["1_5"]?.home) / 2
          ;

          const team_total_ov25: number =
            target_team_stats?.data[0].goal_line?.over["2_5"]?.away == null
            || target_team_stats?.data[0]?.goal_line?.over["2_5"]?.home == null
              ? null
              : (target_team_stats?.data[0].goal_line?.over["2_5"]?.away + target_team_stats?.data[0]?.goal_line?.over["2_5"]?.home) / 2
          ;

          const team_total_gavg: number = 
            season_team?.round_name == null
            || season_team?.overall?.goals_scored == null
              ? null
              : season_team?.overall?.goals_scored / season_team?.round_name;
          ;

          const team_home_gavg: number = 
            season_team?.home?.games_played == null
            || season_team?.home?.goals_scored == null
              ? null
              : season_team?.home?.goals_scored / season_team?.home?.games_played;
          ;

          const team_away_gavg: number = 
            season_team?.away?.games_played == null
            || season_team?.away?.goals_scored == null
              ? null
              : season_team?.away?.goals_scored / season_team?.away?.games_played;
          ;

          const team_obj_total: STA_Team = {
            team_logo:      team_logo,
            team_name:      team_name,
            color_code:     team_total_color_code,
            points:         season_team?.points,
            position:       season_team?.position,
            games_played:   season_team?.overall?.games_played, // [ℹ] previously, .round_name
            won:            season_team?.overall?.won,
            draw:           season_team?.overall?.draw,
            lost:           season_team?.overall?.lost,
            gs:             season_team?.overall?.goals_scored,
            ga:             season_team?.overall?.goals_against,
            gavg:           team_total_gavg,
            cavg:           parseInt(target_team_stats?.data[0]?.avg_corners), // [📌 inaccurate with "multi-stage" season case, FIXME: TODO:]
            ycavg:          target_team_stats?.average_yellow_cards,
            ov15:           team_total_ov15,
            ov25:           team_total_ov25,
            winP:           team_winP,
            rf:             season_team?.recent_form
          }

          const team_obj_home: STA_Team = {
            team_logo:      team_logo,
            team_name:      team_name,
            color_code:     team_total_color_code,
            points:         season_team?.home?.points,
            position:       team_home_position, // season_team?.home?.points
            games_played:   season_team?.home?.games_played,
            won:            season_team?.home?.won,
            draw:           season_team?.home?.draw,
            lost:           season_team?.home?.lost,
            gs:             season_team?.home?.goals_scored,
            ga:             season_team?.home?.goals_against,
            gavg:           team_home_gavg,
            cavg:           null,
            ycavg:          null,
            ov15:           null,
            ov25:           null,
            winP:           team_winP,
            rf:             null
          }

          const team_obj_away: STA_Team = {
            team_logo:      team_logo,
            team_name:      team_name,
            color_code:     team_total_color_code,
            points:         season_team?.away?.points,
            position:       team_away_position, // season_team?.away?.points
            games_played:   season_team?.away?.games_played,
            won:            season_team?.away?.won,
            draw:           season_team?.away?.draw,
            lost:           season_team?.away?.lost,
            gs:             season_team?.away?.goals_scored,
            ga:             season_team?.away?.goals_against,
            gavg:           team_away_gavg,
            cavg:           null,
            ycavg:          null,
            ov15:           null,
            ov25:           null,
            winP:           team_winP,
            rf:             null
          }

          season_gen_list_total.push(team_obj_total)
          season_gen_list_home.push(team_obj_home)
          season_gen_list_away.push(team_obj_away)
        }   
        
        // [ℹ] re-ordering of team-position for 
        // [ℹ] each [TOTAL | HOME | AWAY] view
        // [ℹ] by their position, if exists
        const nullPosTotal = season_gen_list_total.filter(( { position } ) => position == null).length
        const nullPosHome  = season_gen_list_home.filter(( { position } ) => position == null).length
        const nullPosAway  = season_gen_list_away.filter(( { position } ) => position == null).length

        if (nullPosTotal == 0) {
          season_gen_list_total.sort((a, b) => parseFloat(a.position.toString()) - parseFloat(b.position.toString()));
        }
        if (nullPosHome == 0) {
          season_gen_list_home.sort((a, b) => parseFloat(a.position.toString()) - parseFloat(b.position.toString()));
        }
        if (nullPosAway == 0) {
          season_gen_list_away.sort((a, b) => parseFloat(a.position.toString()) - parseFloat(b.position.toString()));
        }

        finalCacheObj.seasons.push (
          {
            season_id: season_main.id,
            total: season_gen_list_total,
            home: season_gen_list_home,
            away: season_gen_list_away,
            group: false
          }
        )
      }

      cache_data_arr.push(finalCacheObj)
    } 
  }

  return cache_data_arr;
}

/**
 * @description [QUERY] method for getting
 * translation data for the Complete Standings Data (widget);
 * @version 1.0
 * @param {GraphQLClient} initGrapQLClient 
 * @returns Promise < B_H_STA_Q >
 */
export async function STA_T_get_all_standings_data (
  initGrapQLClient: GraphQLClient
): Promise < B_H_STA_Q > {

  // const t0 = performance.now();
  // const queryName = "REDIS_CACHE_TOURNAMENT_STANDINGS_DATA_0";

	const response: B_H_STA_Q = await initGrapQLClient.request (
    B_C_STA_T_Q_D0
  );

  // const t1 = performance.now();
  // logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response;
}

/**
 * @description [QUERY] method for getting
 * translation data for the Complete Standings Data (widget);
 * @version 1.0
 * @param {GraphQLClient} initGrapQLClient 
 * @returns Promise < B_H_STA_Q >
 */
export async function STA_T_get_target_leagues (
  initGrapQLClient: GraphQLClient,
  leagueIdsArr: number[]
): Promise < B_H_STA_Q > {

  // const t0 = performance.now();
  // const queryName = "REDIS_CACHE_TOURNAMENT_STANDINGS_DATA_0";

  const VARIABLES = {
    leagueIdsArr
  }
	const response: B_H_STA_Q = await initGrapQLClient.request (
    B_C_STA_T_Q_D0,
    VARIABLES
  );

  // const t1 = performance.now();
  // logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response;
}

/**
 * @description [QUERY] method for getting
 * translation data for the Complete Standings Data (widget);
 * @version 1.0
 * @param {B_H_STA_Q} data 
 * @returns Promise < number[] >
 */
export async function STA_T_generate_target_teams_ids (
  data: B_H_STA_Q
): Promise < number[] > {

  let teamIdsArr = []

  // [ℹ] obtain all target teams
  for (const league of data.scores_football_leagues) {
    for (const season_main of league.seasons) {

      let season_standings_teams_list: PurpleDatumHist[] = [];

      const season_standings = 
        season_main.is_current_season == true
        ? data.scores_football_standings
          .find(( { league_id } ) =>
            league_id === league.id
          ) // [ℹ] contains only ONE (current) season PER league [1:1]
        : data.scores_football_standings_history
          .find(( { league_id, season_id } ) => 
            league_id === season_main.league_id 
            && season_id === season_main.id
          ) // [ℹ] contains MANY seasons PER league [X:1]
      ;

      if (season_standings == undefined) {
        continue
      }

      // [ℹ] check for multi-part
      // [ℹ] NOTE: entirely different method
      if (season_standings?.multipart) {
        // [ℹ] ignore the seasons with the complex
        // [ℹ] type:group => type:stage => teams[]
        // [ℹ] structure
        if (season_standings?.data[0]?.standings?.data[0]?.standings) {
          // console.log(`complex season standing ${season_main.id}`)
          // NOTE: IGNORE
          continue
        }

        const season_standing_groups_arr = season_standings?.data;

        for (const season_standing_group of season_standing_groups_arr) {
          for (const season_group_team of season_standing_group.standings.data) {
            teamIdsArr.push(season_group_team.team_id)
          }
        }
      }
      // [ℹ] non-multi-part season 
      // [ℹ] data pre-processing
      else {
        season_standings_teams_list = season_standings?.data[0]?.standings?.data;
        if (season_standings_teams_list == undefined) {
          // console.log(`Standard Season. Undefiend Team Info! leagueID: ${league.id}`, `seasonID: ${season_main.id}`)
          continue;
        }
        teamIdsArr = teamIdsArr.concat(season_standings_teams_list.map(a => a.team_id));
      }
    }
  }

  teamIdsArr = teamIdsArr.filter(element => {
    return element !== undefined
  });
  teamIdsArr = [...new Set(teamIdsArr)]
  // logs.push(`num. of teamIdsArr: ${teamIdsArr.length}`);

  return teamIdsArr
}

/**
 * @description [QUERY] method for getting
 * translation data for the Complete Standings Data (widget);
 * @version 1.0
 * @param {GraphQLClient} initGrapQLClient 
 * @returns Promise < B_H_STA_Q >
 */
export async function STA_T_get_teams_data (
  initGrapQLClient: GraphQLClient,
  teamIdsArr: number[]
): Promise < B_H_STA_Q > {

  // const t0 = performance.now();
  // const queryName = "REDIS_CACHE_TOURNAMENT_STANDINGS_DATA_0";

  const VARIABLES = {
    teamIdsArr
  }
	const response: B_H_STA_Q = await initGrapQLClient.request (
    B_C_STA_T_Q_D2,
    VARIABLES
  );

  // const t1 = performance.now();
  // logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response;
}

// ==================
// 📌 TRANSLATION METHODS [below]
// ==================

/**
 * @description [QUERY] method for getting
 * translation data for the Lineups Fixtures (widget);
 * NOTE: uses newest implementation of SINGLE and MULTI langauge
 * data retrival from Hasura DB with the use of langArray[];
 * @todo needs revision of the WRAPPER use-case
 * @version 3.0
 * @param {GraphQLClient} initGrapQLClient 
 * @param {string[]} langArray 
 * @returns Promise < B_H_STA_Q >
 */
export async function STA_T_get_widget_translations (
  initGrapQLClient: GraphQLClient,
  langArray: string[]
): Promise < B_H_STA_Q > {

  const QUERY_VARIABLES: { 
    langArray: string[]
  } = {
    langArray
  }

  // const t0 = performance.now();
  // const queryName = "REDIS_CACHE_FIXTURE_PROBABILITIES_1";

  const response: B_H_STA_Q = await initGrapQLClient.request (
    B_C_STA_T_Q_T,
    QUERY_VARIABLES
  );
  
  // const t1 = performance.now();
  // logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response;
}

/**
 * @description [MAIN] method for generating a MAP
 * of target supplied translations for the 
 * Lineups Fixtures (widget);
 * NOTE: can generate for a SINGLE or MULTI langauges, depending 
 * on the ones that are supplied;
 * @version 3.0
 * @param {B_H_STA_Q} data - data recieved from the Hasura DB
 * @param {string[]} langArray - array of target languages
 * @returns Promise < Map <string, B_STA_T> >
 */
export async function STA_T_translations_main (
  data: B_H_STA_Q,
  langArray: string[]
): Promise < Map <string, B_STA_T> > {
  
  const fix_odds_translation_map = new Map <string, B_STA_T> ()
  
  for (const lang_ of langArray) {

    const object: B_STA_T = {};
    object.lang = lang_;

    const objectFixAbout = data.scores_widget_standings_translations
      .find(({ lang }) => lang === lang_)

    const objectFixGeneralTranslation = data.scores_general_translations
      .find(({ lang }) => lang === lang_)

    const MERGED_OBJECT_T = {
      ...object, 
      ...objectFixAbout,
      no_data_t: objectFixGeneralTranslation.widgets_no_data_available
    }
    fix_odds_translation_map.set(lang_, MERGED_OBJECT_T)
  }

  return fix_odds_translation_map
}

//#endregion METHODS]
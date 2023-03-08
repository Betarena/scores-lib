//#region IMPORTS
// <⬇️-add-imports-below-⬇️>
//#endregion IMPORTS

import { GraphQLClient } from "graphql-request";
import { PurpleDatumHist } from "../../types/hasura";
import { B_H_LEGT_Q, B_LEGT_D, LEGT_Table, LEGT_Team } from "../../types/leagues-table";
import { B_C_LEGT_M_Q_D0, B_C_LEGT_M_Q_D1, B_C_LEGT_M_Q_D2 } from "../graphql/query.leagues-table";

//#region [METHODS]
// <⬇️-add-methods-below-⬇️>

export async function LEPT_getTargetInitData(
  initGrapQLClient: GraphQLClient
): Promise<B_H_LEGT_Q> {

  // const t0 = performance.now();
  // const queryName = "REDIS_CACHE_LEAGUES_TABLE_DATA_2";

  const response = await initGrapQLClient.request(
    B_C_LEGT_M_Q_D0
  );

  // const t1 = performance.now();
  // logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response;
}

export async function LEPT_getTargetLeagueData(
  initGrapQLClient: GraphQLClient,
  leagueIdsArr: number[]
): Promise<B_H_LEGT_Q> {

  // const t0 = performance.now();
  // const queryName = "REDIS_CACHE_LEAGUES_TABLE_DATA_2";

  const VARIABLES = {
    leagueIds: leagueIdsArr,
  };
  const response = await initGrapQLClient.request(
    B_C_LEGT_M_Q_D1,
    VARIABLES
  );

  // const t1 = performance.now();
  // logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response;
}

export async function LEPT_getTargetTeamsList(
  data: B_H_LEGT_Q
): Promise<number[]> {

  let teamIdsArr: number[] = [];

  // [ℹ] obtain all target teams []
  for (const iterator of data.scores_football_leagues) {
    for (const season_main of iterator.seasons) {
      
      let season_standings_teams_list: PurpleDatumHist[];

      if (season_main.is_current_season) {
        const season_standings = data.scores_football_standings.find(
          ({ league_id }) => 
            league_id === iterator.id
        );

        season_standings_teams_list = season_standings?.data.find(
          ({ name, season_id }) =>
            name === "Regular Season" 
            && season_id === season_main.id
        )?.standings?.data;
      }
      // NOTE: Ignore NON-CURRENT-SEASON
      else {
        continue;
      }

      // [ℹ] exit, validation
      if (season_standings_teams_list == undefined) {
        continue;
      }

      teamIdsArr = teamIdsArr.concat(
        season_standings_teams_list.map((a) => a.team_id)
      );
    }
  }

  // console.log(teamIdsArr.includes(undefined))
  teamIdsArr = teamIdsArr.filter((element) => {
    return element !== undefined;
  });

  teamIdsArr = [...new Set(teamIdsArr)];
  // logs.push(`num. of teamIdsArr: ${teamIdsArr.length}`);

  return teamIdsArr;
}

export async function LEPT_getTargetTeamData(
  initGrapQLClient: GraphQLClient,
  teamIdsArr: number[]
): Promise<B_H_LEGT_Q> {

  // const t2 = performance.now();
  // const queryName2 = "REDIS_CACHE_LEAGUES_TABLE_DATA_3";

  const VARIABLES = {
    teamIds: teamIdsArr,
  };
  const response: B_H_LEGT_Q = await initGrapQLClient.request(
    B_C_LEGT_M_Q_D2,
    VARIABLES
  );
  
  // const t3 = performance.now();
  // logs.push(`${queryName2} completed in: ${(t3 - t2) / 1000} sec`);

  return response;
}

export async function LEPT_H_data_main (
  response: B_H_LEGT_Q,
  league_and_standings_data: B_H_LEGT_Q,
  team_data: B_H_LEGT_Q
): Promise < Map< string, B_LEGT_D > > {

  const league_table_geo = new Map< string, B_LEGT_D >();
  
  // [ℹ] for-each country-filtered-league-list,
  for (const geo of response?.leagues_filtered_country) {

    const season_league_cache: B_LEGT_D = { }
    season_league_cache.lang = geo.lang;
    season_league_cache.top_leagues_table_data = []

    // [ℹ] iterate over each country (geo) leagues;
    for await (const league of geo.leagues) {
      for (const season_league of league_and_standings_data.scores_football_standings) {
        if (season_league.league_id.toString() === league.league_id.toString()) {
          for (const season_type of season_league.data) {

            // [ℹ] validation (continue);
            if (season_type.name.toString() !== "Regular Season") {
              continue
            }

            // [ℹ] init.;
            const season_league_obj: LEGT_Table = { };
            season_league_obj.season_league_teams = []
            season_league_obj.season_league_id = season_league.league_id.toString();
            season_league_obj.season_league_name = season_league.name.toString();

            // [ℹ] populate "season_league_logo" (property)
            // FIXME: can be improved by using a MAP instead for "scores_football_leagues"
            for (const league_season of league_and_standings_data.scores_football_leagues) {
              if (season_league_obj.season_league_id.toString() === league_season.id.toString()) {
                season_league_obj.season_league_logo = league_season.data.logo_path.toString(); // ✅ exists...
              }
            }

            // [ℹ] populate league/season teams data
            for (const team of season_type.standings.data) {

              const team_obj: LEGT_Team = { };

              // [ℹ] assign "team_obj.team_logo"
              for (const info_team of team_data.scores_football_teams) {
                if (info_team.id.toString() === team.team_id.toString()) {
                  team_obj.team_logo = info_team.data.logo_path;
                }
              }

              // [ℹ] assign "team_obj.color_code"
              if (team.result != null && team.result != undefined) {
                // [ℹ] iterate over "sport" color codes;
                for (const sport of response.color_codes_league_standings_positions) {
                  // [ℹ] validate;
                  if (sport.sports === "football") {
                    // [ℹ] assign;
                    team_obj.color_code = sport.color_codes[team.result.toString()];
                  }
                }
              } else {
                team_obj.color_code = "transparent";
              }

              team_obj.position = parseInt(team.position.toString());
              team_obj.team_name = team.team_name;
              team_obj.games_played = team.overall.games_played.toString();
              team_obj.points = team.overall.points.toString();
              season_league_obj.season_league_teams.push(team_obj);
            }

            // [ℹ] add to the gloabal cache data:
            season_league_cache.top_leagues_table_data.push(season_league_obj);
          }
        }

        // [ℹ] terminating condition;
        if (season_league_cache.top_leagues_table_data != undefined &&
          season_league_cache.top_leagues_table_data.length > 7
        ) {
          break;
        }
      }

      // [ℹ] terminating condition;
      if (
        season_league_cache.top_leagues_table_data != undefined &&
        season_league_cache.top_leagues_table_data.length > 7
      ) {
        break;
      }
    }
    league_table_geo.set(season_league_cache.lang, season_league_cache)
  }
  
  return league_table_geo
}

//#endregion METHODS]
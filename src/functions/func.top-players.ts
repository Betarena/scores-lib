//#region IMPORTS
// <⬇️-add-imports-below-⬇️>

import { GraphQLClient } from "graphql-request";
import { B_H_SFP, B_H_SFSD, B_H_SFT } from "../../types/hasura";
import { B_H_TP_Q, B_TP_D, TP_assits, TP_goalscorers, TP_ratings, TP_Season_Top_Player, TP_total_shots } from "../../types/top-players";
import { BETARENA_CACHE_TOP_PLAYERS_DATA_0, BETARENA_CACHE_TOP_PLAYERS_DATA_2 } from "../graphql/query.top-players.js";

//#endregion IMPORTS

//#region [METHODS]
// <⬇️-add-methods-below-⬇️>

/**
 * @description [GraphQL] method to obtain
 * top-players data information for all seasons
 * of type (is_current_season);
 * NOTE: requires a supply number[] of season-id's;
 * @param {GraphQLClient} initGrapQLClient
 * @returns Promise < Map < number, B_H_SFSD > >
 */
export async function getTargetSeasonPlayersInfo(
  initGrapQLClient: GraphQLClient,
  seasonIdsArr: number[]
): Promise < Map < number, B_H_SFSD > > {

  // BETARENA_HASURA_scores_football_seasons_details[] was as an ARRAY for surgical;
 
  const limit = 100; // IMPORTANT can't go above 100;
  let offset = 0;
  let total_limit;

  const season_details_map = new Map <number, B_H_SFSD> ()
  let counter = 0

  // const t0 = performance.now();
  // const queryName = "REDIS_CACHE_TOP_PLAYERS_DATA_1";

  // eslint-disable-next-line no-constant-condition
  while (true) {
    
    const VARIABLES = {
      limit: limit,
      offset: offset,
      seasonIds: seasonIdsArr
    }
    // console.log(`ℹ variables: ${VARIABLES.limit} ${VARIABLES.offset}`)

    const response: B_H_TP_Q = await initGrapQLClient.request(
      BETARENA_CACHE_TOP_PLAYERS_DATA_0,
      VARIABLES
    );

    for (const season of response.scores_football_seasons_details) {
      season_details_map.set(season.id, season);
    }

    // [ℹ] exit loop
    if (offset >= total_limit) {
      // [🐛] debug
      // if (dev) console.log(`exiting loop!`)
      // logs.push(`total limit: ${total_limit}`)
      // logs.push(`seasons gathered: ${season_details_map.size}`)
      // logs.push(`exiting loop after ${counter} iterations`)
      break;
    }

    total_limit = response.scores_football_seasons_details_aggregate.aggregate.totalCount;
    offset += limit;
    counter++
  }

  // const t1 = performance.now();
  // logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return season_details_map;
}

/**
 * @description [HELPER] method to obtain target
 * data on valid player & team id's from their
 * respective seasons; 
 * Then convert both to number[]
 * and pass through a set to remove duplicates;
 * Return both arrays as a tuple [[],[]];
 * @param {Map<number, B_H_SFSD>} season_details_map
 * @returns Promise < [number[], number[]]>
 */
export async function extract_playerId_and_teamId(
  season_details_map: Map<number, B_H_SFSD>
): Promise < [number[], number[]]> {

  let teamIdsArr: number[], playerIdsArr: number[] = []

  // -----------
  //#region ALETERNATIVE - ALL [v1]

  /*
  for (const [season_id, season_data] of season_details_map) {
    if (season_data.squad !== null &&
      season_data.squad.length != 0) {
      for (const squad_item of season_data.squad) {
        for (const season_team_player of squad_item.squad.data) {
          const player_id = season_team_player?.player_id;
          const team_id = squad_item.id;
          playerIdsArr.push(player_id)
          teamIdsArr.push(team_id)
        }
      }
    }
    if (season_data.goalscorers !== null &&
      season_data.goalscorers.length != 0) {
      for (const goalscorer_item of season_data.goalscorers) {
        const player_id = goalscorer_item?.player_id;
        const team_id = goalscorer_item.team_id;
        playerIdsArr.push(player_id)
        teamIdsArr.push(team_id)
      }
    }
    if (season_data.assistscorers !== null &&
      season_data.assistscorers.length != 0) {
      for (const assistscorer_item of season_data.assistscorers) {
        const player_id = assistscorer_item?.player_id;
        const team_id = assistscorer_item.team_id;
        playerIdsArr.push(player_id)
        teamIdsArr.push(team_id)
      }
    }
  }
  */

  //#endregion ALETERNATIVE - ALL [v1]

  // -----------
  // ✅ ALETERNATIVE - SURGICAL [v2]
  // -----------
  // NOTE: simply uses only the SQUAD DATA to identify TEAM & PLAYER (ID's)
  // const methodName = "getTeamsAndPlayersIds"
  // logs.push(`${methodName}`);

  for (const [season_id, season_data] of season_details_map) {
    // console.log(`season: ${season.id}`)
    if (season_data?.squad !== null) {
      for (const team of season_data.squad) {
        // console.log(`team: ${team.id}`)
        teamIdsArr.push(team.id)
        for (const player of team.squad.data) {
          playerIdsArr.push(player.player_id);
        }
      }
    }
  }

  // [ℹ] remove undefined;
  playerIdsArr = playerIdsArr.filter(element => {
    return element !== undefined
  });
  teamIdsArr = teamIdsArr.filter(element => {
    return element !== undefined
  });

  // console.log("playerIdsArr (size): " + playerIdsArr.length)
  // console.log("teamIdsArr (size): " + teamIdsArr.length)

  playerIdsArr = [...new Set(playerIdsArr)]
  teamIdsArr = [...new Set(teamIdsArr)]

  // console.log("playerIdsArr (size) [post]: " + playerIdsArr.length)
  // console.log("teamIdsArr (size) [post]: " + teamIdsArr.length)

  // logs.push(` ↳ num. of playerIdsArr: ${playerIdsArr.length}`);
  // logs.push(` ↳ num. of teamIdsArr: ${teamIdsArr.length}`);

  return [
    teamIdsArr,
    playerIdsArr
  ]
}

/**
 * @description [GraphQL] method to obtain
 * target PLAYER and TEAM data, using their
 * respective ID's;
 * @param {GraphQLClient} initGrapQLClient
 * @param {number[]} teamIdsArr 
 * @param {number[]} playerIdsArr 
 * @returns Promise < B_H_TP_Q >
 */
export async function get_target_teams_players_data (
  initGrapQLClient: GraphQLClient,
  teamIdsArr:   number[],
  playerIdsArr: number[]
): Promise < B_H_TP_Q > {

  const VARIABLES = {
    teamIds: teamIdsArr,
    playerIds: playerIdsArr
  }

  // const t0 = performance.now();
  // const queryName = "REDIS_CACHE_TOP_PLAYERS_DATA_2";

  const response: B_H_TP_Q = await initGrapQLClient.request(
    BETARENA_CACHE_TOP_PLAYERS_DATA_2,
    VARIABLES
  );

  // const t1 = performance.now();
  // logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response;
}

/**
 * @description [HELPER] method - converts
 * target supplied data for PLAYERS & TEAMS
 * into respective MAP's and returns as tuple;
 * @param {B_H_TP_Q} data 
 * @returns Promise < [ Map < number, B_H_SFP >, Map < number, B_H_SFT > ] > 
 */
export async function generateTeamsAndPlayersMap (
  data: B_H_TP_Q
): Promise < [ Map < number, B_H_SFP >, Map < number, B_H_SFT > ] > {

  const t0 = performance.now();
  const players_map = new Map < number, B_H_SFP > ()

  for (const p of data.scores_football_players) {
    players_map.set(p.player_id, p)
  }
  const teams_map = new Map < number, B_H_SFT > ()
  for (const t of data.scores_football_teams) {
    teams_map.set(t.id, t)
  }

  const t1 = performance.now();
  // console.log(`players_map generated with size: ${players_map.size}`)
  // console.log(`teams_map generated with size: ${teams_map.size}`)
  // console.log(`hashmap conversion: ${(t1 - t0) / 1000} sec`);

  return [
    players_map,
    teams_map
  ]
}

/**
 * @description [HELPER] method - generate per LeagueId / Tournament;
 *  with 1 season (current-season) within each Key
 * @param {Map<number, B_H_SFSD>} season_details_map 
 * @param {Map<number, B_H_SFP>} players_map 
 * @param {Map<number, B_H_SFT>} teams_map 
 * @returns Promise < Map <number, B_TP_D>
 */
export async function generate_top_players_data(
  season_details_map: Map<number, B_H_SFSD>,
  players_map: Map<number, B_H_SFP>,
  teams_map: Map<number, B_H_SFT>
): Promise < Map<number, B_TP_D> > {

  const final_obj_array = new Map <number, B_TP_D>()

  for (const [season_id, season_data] of season_details_map) {

    // [ℹ] per LEAGUE

    const finalCacheObj: B_TP_D = { }
    finalCacheObj.league_id = season_data?.league_id;
    finalCacheObj.seasons = []

    // [ℹ] [THIS] current season for (this) league (tournament-id)
    if (season_data == undefined) {
      continue;
    }

    const season_top_player_obj: TP_Season_Top_Player = { }
    season_top_player_obj.season_id = season_id
    season_top_player_obj.top_players_rating = []  
    season_top_player_obj.top_players_goals = []
    season_top_player_obj.top_players_assists = []
    season_top_player_obj.top_players_total_shots = []

    // [ℹ] populate > .top_players_rating
    if (season_data.squad !== null 
      && season_data.squad.length != 0) {
        
      for (const season_team of season_data.squad) {
        for (const season_team_player of season_team.squad.data) {

          // [ℹ] ignore those players with "NaN" rating
          if (season_team_player?.rating == undefined) {
            continue;
          }

          const top_player: TP_ratings = { }

          const target_player = players_map.get(season_team_player.player_id);
          const target_team = teams_map.get(season_team.id);  // [ℹ] unecessary [?];
          
          top_player.avatar = 
            target_player == undefined
              ? null
              : target_player.data?.image_path;

          top_player.rating =
            parseFloat(season_team_player.rating.toString());

          top_player.position =
            target_player == undefined
              ? null
              : target_player.data?.position_id;

          top_player.player_name =
            season_team_player.player_name;
          
          top_player.team_logo = 
            target_team == undefined
              ? null
              : target_team.data?.logo_path;
            
          top_player.rank = 1;

          // [ℹ] ignore those players with "NaN" data
          if (top_player?.player_name == null || top_player?.position == null) {
            continue;
          }

          season_top_player_obj.top_players_rating.push(top_player);
        }

        season_top_player_obj.top_players_rating.sort((a, b) => parseFloat(b.rating.toString()) - parseFloat(a.rating.toString()));
        season_top_player_obj.top_players_rating.splice(50);
      }
    }

    // [ℹ] populate > .top_players_goals
    if (season_data.goalscorers !== null 
      && season_data.goalscorers.length != 0) {

      for (const season_goalscorer of season_data.goalscorers) {

        // [ℹ] ignore those players with "NaN" goals
        if (season_goalscorer?.goals == undefined) {
          continue;
        }
        
        const top_player: TP_goalscorers = { }

        const target_player = players_map.get(season_goalscorer.player_id);
        const target_team = teams_map.get(season_goalscorer.team_id);  // [ℹ] unecessary [?];

        top_player.avatar = 
          target_player == undefined
            ? null
            : target_player.data?.image_path;

        top_player.goals =
          season_goalscorer.goals

        top_player.position =
          target_player == undefined
            ? null
            : target_player.data?.position_id;

        top_player.player_name =
          season_goalscorer.player_name;
        
        top_player.team_logo = 
          target_team == undefined
            ? null
            : target_team.data?.logo_path;
          
        top_player.rank =
          season_goalscorer.position;

        // [ℹ] ignore those players with "NaN" data
        if (top_player?.player_name == null || top_player?.position == null) {
          continue;
        }

        season_top_player_obj.top_players_goals.push(top_player);
      }

      season_top_player_obj.top_players_goals.sort((a, b) => parseFloat(b.goals.toString()) - parseFloat(a.goals.toString()));
      season_top_player_obj.top_players_goals.splice(50);
    }

    // [ℹ] populate > .top_players_assists
    if (season_data.assistscorers !== null 
      && season_data.assistscorers.length != 0) {
      
      for (const season_assistscorer of season_data.assistscorers) {

        // [ℹ] ignore those players with "NaN" assists
        if (season_assistscorer?.assists == null || season_assistscorer?.assists == undefined) {
          continue;
        }
      
        const top_player: TP_assits = { }

        const target_player = players_map.get(season_assistscorer.player_id);
        const target_team  = teams_map.get(season_assistscorer.team_id);  // [ℹ] unecessary [?];

        top_player.avatar = 
          target_player == undefined
            ? null
            : target_player.data?.image_path;

        top_player.assists =
          season_assistscorer.assists

        top_player.position =
          target_player == undefined
            ? null
            : target_player.data?.position_id;

        top_player.player_name =
          season_assistscorer.player_name;
        
        top_player.team_logo = 
          target_team == undefined 
            ? null
            : target_team.data?.logo_path;
          
        top_player.rank =
          season_assistscorer.position;

        // [ℹ] ignore those players with "NaN" data
        if (top_player?.player_name == null || top_player?.position == null) {
          continue;
        }

        season_top_player_obj.top_players_assists.push(top_player);
      }

      season_top_player_obj.top_players_assists.sort((a, b) => parseFloat(b.assists.toString()) - parseFloat(a.assists.toString()));
      season_top_player_obj.top_players_assists.splice(50);
    }

    // [ℹ] populate > .top_players_total_shots
    if (season_data.squad !== null 
      && season_data.squad.length != 0) {
        
      for (const season_team of season_data.squad) {
        for (const season_team_player of season_team.squad.data) {

          // [ℹ] ignore those players with "NaN" shots_total
          if (season_team_player?.shots?.shots_total == undefined) {
            continue;
          }

          const top_player: TP_total_shots = { }

          const target_player = players_map.get(season_team_player.player_id);
          const target_team = teams_map.get(season_team.id);  // [ℹ] unecessary [?];
          
          top_player.avatar = 
            target_player == undefined
              ? null
              : target_player.data?.image_path;

          top_player.total_shots =
            season_team_player?.shots?.shots_total;

          top_player.position =
            target_player == undefined
              ? null
              : target_player.data?.position_id;

          top_player.player_name =
            season_team_player.player_name;
          
          top_player.team_logo = 
            target_team == undefined
              ? null
              : target_team.data?.logo_path;
            
          top_player.rank = 1;

          // [ℹ] ignore those players with "NaN" data
          if (top_player?.player_name == null || top_player?.position == null) {
            continue;
          }

          season_top_player_obj.top_players_total_shots.push(top_player);
        }

        season_top_player_obj.top_players_total_shots.sort((a, b) => parseFloat(b.total_shots.toString()) - parseFloat(a.total_shots.toString()));
        season_top_player_obj.top_players_total_shots.splice(50);
      }
    }

    finalCacheObj.seasons.push(season_top_player_obj);

    if (finalCacheObj.seasons.length == 0) {
      continue;
    }

    final_obj_array.set(finalCacheObj.league_id, finalCacheObj);
  }

  return final_obj_array;
}

//#endregion METHODS]
//#region IMPORTS
// <⬇️-add-imports-below-⬇️>

import { GraphQLClient } from "graphql-request";
import { B_H_SD } from "../../types/hasura";
import { B_SPT_D } from "../../types/sportbook.js";
import { B_C_SPD_M_Q_D0 } from "../graphql/query.sportbook.js";

//#endregion IMPORTS

//#region [METHODS]
// <⬇️-add-methods-below-⬇️>

export async function SPD_M_data_main (
  sportsbook_details: B_H_SD[]
): Promise < [Map< string, B_SPT_D >, Map< string, B_SPT_D[] >] > {

  const sportbook_main_map = new Map< string, B_SPT_D >();
  const sportbook_all_map = new Map< string, B_SPT_D[] >();
  
  // [ℹ] sportbook (main) generation
  for (const geoSportbook of sportsbook_details) {

    let data_object: B_SPT_D = {
      geoPos: geoSportbook?.lang
    }

    for (const [key, value] of Object.entries(geoSportbook.data)) {
      // [ℹ] get the "position: 1"
      if (geoSportbook.data[key].position.toString() === '1') {
        data_object = {
          ...value,
          geoPos: geoSportbook.lang
        }
      }
    }

    sportbook_main_map.set(data_object?.geoPos, data_object)
  }

  // [ℹ] sportbook (all) generation
  for (const geoSportbook of sportsbook_details) {

    const data_list: B_SPT_D[] = []

    let data_object: B_SPT_D = {
      geoPos: geoSportbook?.lang
    }

    for (const [key, value] of Object.entries(geoSportbook.data)) {
      data_object = {
        ...value,
        geoPos: geoSportbook.lang
      }
      data_list.push(data_object)
    }

    sportbook_all_map.set(data_object?.geoPos, data_list)
  }

  return [
    sportbook_main_map,
    sportbook_all_map
  ]

}

export async function getSportbookDetails (
  initGrapQLClient: GraphQLClient
): Promise < any > {
  
  // const t0 = performance.now();
  // const queryName = "REDIS_CACHE_LEAGUE_INFO_DATA_2";

  const response: any = await initGrapQLClient.request(
    B_C_SPD_M_Q_D0
  );

  // const t1 = performance.now();
  // logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response;
}

//#endregion METHODS]
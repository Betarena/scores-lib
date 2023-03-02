import { GraphQLClient } from "graphql-request";
import { B_H_LFC, B_H_LSF_V2, B_H_ST } from "../../types/hasura.js";
import { B_H_HF_LSV2_Q, B_H_SJ_HF_LSV2, B_H_SJ_SFL, LS2_C_Fixture, LS2_C_League } from "../../types/livescores-v2.js";
/**
 * @description [GRAPH-QL] [GET] method for obtaining
 * all historic fixtures occurring on target ISO-string
 * dates on an string[] type;
 * NOTE: takes into account getting target (single) date
 * fixtures data;
 * @param {GraphQLClient} initGrapQLClient
 * @param {string[]} fixture_dates
 * @returns {Promise< B_H_HF_LSV2_Q >} B_H_HF_LSV2_Q
 */
export declare function get_target_date_fixtures(initGrapQLClient: GraphQLClient, fixture_dates: string[]): Promise<B_H_HF_LSV2_Q>;
/**
 * @description method to generate a Map<string, fixture[]>
 * grouped by fixture-day as the KEY and return;
 * @param {B_H_SJ_HF_LSV2[]} h_fixtures_arr
 * @returns {Promise < Map <string, B_H_SJ_HF_LSV2[]> >} Map <string, B_H_SJ_HF_LSV2[]>
 */
export declare function generate_historic_fixtures_day_group_map(h_fixtures_arr: B_H_SJ_HF_LSV2[]): Promise<Map<string, LS2_C_Fixture[]>>;
/**
 * @description [GRAPH-QL] [GET] method for obtaining
 * target leagues data;
 * @param {GraphQLClient} initGrapQLClient
 * @param {number[]} league_ids_arr
 * @returns {Promise< [B_H_SJ_SFL[], B_H_ST[], B_H_LSF_V2[], B_H_LFC[]] >} [B_H_SJ_SFL[], B_H_ST[], B_H_LSF_V2[], B_H_LFC[]]
 */
export declare function get_target_leagues(initGrapQLClient: GraphQLClient, league_ids_arr: number[]): Promise<[B_H_SJ_SFL[], B_H_ST[], B_H_LSF_V2[], B_H_LFC[]]>;
/**
 * @description method to generate a Map<string, league[]>
 * grouped by league-id as the KEY and return;
 * @param {B_H_SJ_SFL[]} league_arr
 * @returns {Promise < Map <number, LS2_C_League> >} Map <string, LS2_C_League>
 */
export declare function generate_leagues_map(league_arr: B_H_SJ_SFL[]): Promise<Map<number, LS2_C_League>>;
/**
 * @description method to generate a Map<string, league[]>
 * by their league-Id as the KEY and return;
 * @param {B_H_ST[]} league_arr
 * @returns {Promise < Map <number, B_H_ST> >} Map <number, B_H_ST>
 */
export declare function generate_tournaments_map(league_arr: B_H_ST[]): Promise<Map<number, B_H_ST>>;

export interface BACKEND_FIX_SJ_D {
  leagueSeasons?: LeagueSeason[];
  teamsList?:     number[];
  fixturesList?:  number[];
} export interface LeagueSeason {
  leagueId?: number;
  seasonId?: number;
}
import { gql } from 'graphql-request';

// ======================
// IMPORTANT - FOR: SEO & Pages Data
// IMPORTANT - TAG: B_C_SAP_M_Q_<T/D>
// ======================

/**
 * [ℹ] Complete Page & Seo Query
 * [ℹ] Caching & Sitemap generation 
*/
export const B_C_SAP_M_Q_D0 = gql`
  query B_C_SAP_M_Q_D0 
  @cached
  (ttl: 300) 
  {
    scores_hreflang {
      hreflang
      link
    }
    scores_seo_homepage {
      lang
      main_data
      twitter_card
      opengraph
    }
    scores_seo_tournaments {
      lang
      main_data
      opengraph
      twitter_card
    }
    scores_seo_fixtures {
      lang
      main_data
      opengraph
      sports_type
      twitter_card
    }
    scores_endpoints_translations {
      countries_translation
      lang
      sport
      sports_translation
    }
    scores_football_countries {
      id
      name
    }
    scores_tournaments {
      author
      country
      date
      id
      tournament_id
      lang
      modified_date
      name
      sport
      status
      title
      type
      widgets
      urls
    }
  }
`;

/**
 * [ℹ] Complete Page & Seo Query 
 * [ℹ] HISTORIC_FIXTURES [GET] [#2]
*/
export const B_C_SAP_M_Q_D1 = gql`
  query B_C_SAP_M_Q_D1
  (
    $limit: Int, 
    $offset: Int
  )
  @cached
  (ttl: 300) 
  {
    historic_fixtures_aggregate 
    (
      where: {
        publish_status: {
          _eq: "published"
        }
      }
    ) {
      aggregate {
        totalCount: count
      }
    }
    # NOTE: LARGE QUERY
    # NOTE: PAGINATION REQUIRED
    historic_fixtures
    (
      # limit: 50,
      # FIXME: too large of a query for 300k - 2M records
      # FIXME: needs a WHERE clause with "publish_status" for now
      # FIXME: update to include "pagination" + loop one iteration && cache-stream
      # FIXME: of data straight to cache
      order_by: {
        fixture_day: asc, 
        id: asc
      }, 
      limit: $limit, 
      offset: $offset,
      where: {
        publish_status: {
          _eq: "published"
        }
      }
    ) {
      id
      urls
      publish_status
      away_team_name
      home_team_name
      league_name
      fixture_day
      league_id
      venue_name_j: data(path: "$.venue.data.name")
      venue_city_j: data(path: "$.venue.data.city")
      country_id_j: data(path: "$.league.data.country_id")
    }
  }
`;

/**
 * [ℹ] Complete Page & Seo Query 
 * [ℹ] LINKS_MAP [GET] [#2]
*/
export const B_C_SAP_M_Q_D2 = gql`
  query B_C_SAP_M_Q_D2
  (
    $limit: Int, 
    $offset: Int
  )
  @cached
  (ttl: 300) 
  {
    # NOTE: LARGE QUERY
    # NOTE: PAGINATION REQUIRED
    links_map_aggregate
    {
      aggregate {
        totalCount: count
      }
    }
    links_map 
    (
      order_by: {
        url: asc
      },
      limit: $limit, 
      offset: $offset
    ) {
      url
      created_at
      category
      alt_links
    }
  }
`;

/**
 * [ℹ] Surgical Target Fixture
 * [ℹ] Caching & Sitemap Update 
*/
export const B_C_SAP_M_Q_D3 = gql`
  query B_C_SAP_M_Q_D3 
  (
    $fixtureId: Int!
  ) 
  @cached 
  (ttl: 300)
  {
    scores_seo_fixtures {
      lang
      main_data
      opengraph
      sports_type
      twitter_card
    }
    scores_endpoints_translations {
      countries_translation
      lang
      sport
      sports_translation
    }
    scores_football_countries {
      id
      name
    }
    historic_fixtures
    (
      where: {
        id: {
          _eq: $fixtureId
        }
      }
    ) {
      id
      urls
      publish_status
      away_team_name
      home_team_name
      league_name
      fixture_day
      league_id
      venue_name_j: data(path: "$.venue.data.name")
      venue_city_j: data(path: "$.venue.data.city")
      country_id_j: data(path: "$.league.data.country_id")
    }
  }
`;
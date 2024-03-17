interface Address {
    shop: string;
    road: string;
    city_block: string;
    suburb: string;
    city_district: string;
    city: string;
    ISO3166_2_lvl6: string;
    state: string;
    ISO3166_2_lvl4: string;
    region: string;
    postcode: string;
    country: string;
    country_code: string;
    municipality: string
  }
  
  interface LocationData {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    lat: string;
    lon: string;
    display_name: string;
    address: Address;
    boundingbox: [string, string, string, string];
  }
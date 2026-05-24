import { Comparable } from '../types';

const RAPIDAPI_HOST = 'zillow-com1.p.rapidapi.com';

function headers(apiKey: string) {
  return {
    'x-rapidapi-host': RAPIDAPI_HOST,
    'x-rapidapi-key': apiKey,
  };
}

export interface CompSearchParams {
  address: string;
  zip: string;
  beds: number;
  baths: number;
  sqft: number;
  radiusMiles?: number;
  maxResults?: number;
}

export async function searchComparables(
  params: CompSearchParams,
  apiKey: string
): Promise<Comparable[]> {
  const { address, zip, beds, baths, sqft, radiusMiles = 0.5, maxResults = 10 } = params;

  const url = new URL(`https://${RAPIDAPI_HOST}/propertyExtendedSearch`);
  url.searchParams.set('location', `${zip}`);
  url.searchParams.set('status_type', 'RecentlySold');
  url.searchParams.set('home_type', 'Houses');
  url.searchParams.set('bedsMin', String(Math.max(1, beds - 1)));
  url.searchParams.set('bedsMax', String(beds + 1));
  url.searchParams.set('bathsMin', String(Math.max(1, baths - 1)));
  url.searchParams.set('sqftMin', String(Math.round(sqft * 0.8)));
  url.searchParams.set('sqftMax', String(Math.round(sqft * 1.2)));

  const res = await fetch(url.toString(), { headers: headers(apiKey) });
  if (!res.ok) throw new Error(`Zillow API error: ${res.status}`);

  const data = await res.json();
  const props = (data.props ?? []).slice(0, maxResults);

  return props.map((p: any): Comparable => {
    const salePrice = p.price ?? p.soldPrice ?? 0;
    const sqftVal = p.livingArea ?? 1;
    return {
      id: p.zpid ?? `${(p.address ?? '').replace(/\s+/g, '-').toLowerCase()}-${p.zipcode ?? zip}`,
      address: p.address ?? '',
      city: p.city ?? '',
      state: p.state ?? '',
      zip: p.zipcode ?? zip,
      beds: p.bedrooms ?? beds,
      baths: p.bathrooms ?? baths,
      sqft: sqftVal,
      lot_sqft: p.lotAreaValue ? Math.round(p.lotAreaValue * 43560) : undefined,
      year_built: p.yearBuilt,
      sale_price: salePrice,
      list_price: p.listingPrice,
      sale_date: p.soldDate ?? new Date().toISOString().split('T')[0],
      days_on_market: p.daysOnMarket ?? 0,
      status: p.listingStatus?.toLowerCase().includes('sold') ? 'sold' : 'active',
      price_per_sqft: sqftVal > 0 ? Math.round(salePrice / sqftVal) : 0,
      distance_miles: p.distance,
      included: true,
      source: 'zillow',
      zpid: p.zpid,
    };
  });
}

export async function getPropertyDetails(zpid: string, apiKey: string): Promise<any> {
  const url = `https://${RAPIDAPI_HOST}/property?zpid=${zpid}`;
  const res = await fetch(url, { headers: headers(apiKey) });
  if (!res.ok) throw new Error(`Zillow detail error: ${res.status}`);
  return res.json();
}

import { NextResponse } from 'next/server';
import { getCache, setCache, CACHE_TTL } from '@/lib/redis';

const MEMBERSHIP_CACHE_KEY = 'membership_plans';

const memberships = [
  {
    id: 'basic',
    name: 'Basic Membership',
    price: 0,
    description: 'Free access to public content and news.',
    benefits: [
      'Access to public news',
      'View match schedules',
      'Join the community',
    ],
  },
  {
    id: 'premium',
    name: 'Premium Membership',
    price: 99,
    description: 'Unlock premium features and exclusive content.',
    benefits: [
      'All Basic benefits',
      'Priority ticket booking',
      'Exclusive member events',
      'Discounts on merchandise',
    ],
  },
  {
    id: 'vip',
    name: 'VIP Membership',
    price: 199,
    description: 'All-access pass to everything FC ESCUELA offers.',
    benefits: [
      'All Premium benefits',
      'Meet & greet with players',
      'VIP lounge access',
      'Personalized club gifts',
    ],
  },
];

export async function GET() {
  try {
    // Try to get from cache
    const cachedMemberships = await getCache(MEMBERSHIP_CACHE_KEY);
    if (cachedMemberships) return NextResponse.json(cachedMemberships);

    // Set cache (long TTL since it's mostly static)
    await setCache(MEMBERSHIP_CACHE_KEY, memberships, CACHE_TTL.SQUAD);

    return NextResponse.json(memberships);
  } catch (error) {
    return NextResponse.json(memberships); // Fallback to hardcoded list
  }
}

export async function POST() {
  return NextResponse.json({ error: 'Automated membership enrollment is currently offline.' }, { status: 403 });
}
 
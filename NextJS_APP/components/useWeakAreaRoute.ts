/**
 * useWeakAreaRoute
 *
 * Maps recent_struggles tags to the most relevant remediation route.
 * Returns the best route + label for a child based on their struggle history.
 */

interface RouteRecommendation {
  route: string;
  label: string;
  emoji: string;
  reason: string;
}

// Tag-to-route mapping
// Tags are recorded in useSubjectProgress like: "carry_over", "borrow_concept",
// "level_3_multiplication", "vowel_confusion", "missing_letter_level2", etc.
const STRUGGLE_ROUTE_MAP: { pattern: RegExp; recommendation: RouteRecommendation }[] = [
  {
    pattern: /carry|carry_over|carrying/i,
    recommendation: { route: '/carry-borrow', label: 'Carry & Borrow', emoji: '📊', reason: 'repeated carry-over mistakes' },
  },
  {
    pattern: /borrow|borrowing|borrow_concept/i,
    recommendation: { route: '/carry-borrow', label: 'Carry & Borrow', emoji: '📊', reason: 'repeated borrowing difficulty' },
  },
  {
    pattern: /multiplication|times_table|mult_/i,
    recommendation: { route: '/multiplication-race', label: 'Multiplication Race', emoji: '🏎️', reason: 'multiplication recall issues' },
  },
  {
    pattern: /division|divide|÷/i,
    recommendation: { route: '/division-splitter', label: 'Division Splitter', emoji: '➗', reason: 'division concept needs review' },
  },
  {
    pattern: /vowel|vowel_confusion|missing_letter/i,
    recommendation: { route: '/missing-letter', label: 'Missing Letter', emoji: '🔤', reason: 'vowel and missing letter mistakes' },
  },
  {
    pattern: /letter_fishing|phonics|letter_sound/i,
    recommendation: { route: '/letter-fishing', label: 'Letter Fishing', emoji: '🎣', reason: 'phonics and letter sounds need practice' },
  },
  {
    pattern: /word|spelling|english|level.*word/i,
    recommendation: { route: '/english', label: 'Word Builder', emoji: '📝', reason: 'word building errors' },
  },
  {
    pattern: /math|addition|subtraction|level.*\d/i,
    recommendation: { route: '/math', label: 'Math Engine', emoji: '🧮', reason: 'arithmetic needs practice' },
  },
];

const DEFAULT_RECOMMENDATION: RouteRecommendation = {
  route: '/carry-borrow',
  label: 'Carry & Borrow',
  emoji: '📊',
  reason: 'structured practice',
};

/**
 * Given a list of recent struggle tags (across all subjects),
 * returns the highest-priority remediation route.
 */
export function getWeakAreaRoute(struggles: string[]): RouteRecommendation {
  if (!struggles.length) return DEFAULT_RECOMMENDATION;

  // Count how many struggles map to each route (first match wins per tag)
  const routeCounts: Map<string, { count: number; rec: RouteRecommendation }> = new Map();

  for (const tag of struggles) {
    for (const { pattern, recommendation } of STRUGGLE_ROUTE_MAP) {
      if (pattern.test(tag)) {
        const existing = routeCounts.get(recommendation.route);
        routeCounts.set(recommendation.route, {
          count: (existing?.count ?? 0) + 1,
          rec: recommendation,
        });
        break; // first match only
      }
    }
  }

  if (!routeCounts.size) return DEFAULT_RECOMMENDATION;

  // Return the route with the most struggle tags pointing to it
  let best = DEFAULT_RECOMMENDATION;
  let bestCount = 0;
  for (const { count, rec } of routeCounts.values()) {
    if (count > bestCount) {
      bestCount = count;
      best = rec;
    }
  }

  return best;
}

/**
 * Given a route, returns the matching RouteRecommendation or a generic one.
 */
export function getRecommendationForRoute(route: string): RouteRecommendation {
  for (const { recommendation } of STRUGGLE_ROUTE_MAP) {
    if (recommendation.route === route) return recommendation;
  }
  return DEFAULT_RECOMMENDATION;
}

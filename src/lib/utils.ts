export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

/**
 * Formats a title from SCREAMING_SNAKE_CASE or snake_case to Title Case with spaces.
 */
export function formatDisplayTitle(title: string): string {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Formats categories consistently.
 */
export function formatCategory(category: string): string {
  if (!category) return '';
  if (category.toUpperCase() === 'ALL') return 'All';
  return formatDisplayTitle(category);
}

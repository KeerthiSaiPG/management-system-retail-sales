/**
 * Category Color Mapping
 * Provides light shade colors for different product categories
 */

const CATEGORY_COLORS = {
  "Electronics": {
    background: "#E0F2FE", // Light blue
    text: "#0369A1",
    border: "#0EA5E9"
  },
  "Clothing": {
    background: "#FCE7F3", // Light pink
    text: "#BE185D",
    border: "#EC4899"
  },
  "Beauty": {
    background: "#FEF3C7", // Light amber
    text: "#B45309",
    border: "#FBBF24"
  }
};

/**
 * Get color scheme for a category
 * @param {string} category - The product category name
 * @returns {object} Color object with background, text, and border colors
 */
export function getCategoryColor(category) {
  return CATEGORY_COLORS[category] || {
    background: "#F1F5F9", // Default light gray
    text: "#0F172A",
    border: "#E2E8F0"
  };
}

/**
 * Get background color only
 */
export function getCategoryBgColor(category) {
  return getCategoryColor(category).background;
}

/**
 * Get text color only
 */
export function getCategoryTextColor(category) {
  return getCategoryColor(category).text;
}

/**
 * Get border color only
 */
export function getCategoryBorderColor(category) {
  return getCategoryColor(category).border;
}

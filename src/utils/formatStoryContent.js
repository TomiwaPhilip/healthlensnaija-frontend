/**
 * Formats story content with HTML tags for display
 * @param {string} content - The raw story content
 * @returns {string} - Formatted HTML content
 */
export const formatStoryContent = (content) => {
  if (!content) return '';

  return content
    // Section headers
    .replace(
      /\*\*Overview\*\*/g,
      "<h2 class='font-bold text-xl mt-4'>Overview</h2>"
    )
    .replace(
      /\*\*Key Data Points\*\*/g,
      "<h2 class='font-bold text-xl mt-4'>Key Data Points</h2>"
    )
    .replace(
      /\*\*Policy Recommendations\*\*/g,
      "<h2 class='font-bold text-xl mt-4'>Policy Recommendations</h2>"
    )
    .replace(
      /\*\*Challenges & Solutions\*\*/g,
      "<h2 class='font-bold text-xl mt-4'>Challenges & Solutions</h2>"
    )
    
    // Challenge/Solution labels
    .replace(/\*\*Challenge\*\*/g, "<strong class='text-green-600 dark:text-green-400'>Challenge:</strong>")
    .replace(/\*\*Solution\*\*/g, "<strong class='text-green-600 dark:text-green-400'>Solution:</strong>")
    
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    
    // Bullet points - handle both - and • bullets
    .replace(/^[-•]\s+(.*)$/gm, "<li class='ml-4'>$1</li>")
    
    // Line breaks
    .replace(/\n/g, "<br/>")
    
    // Clean up list formatting
    .replace(/<\/li><br\/>/g, "</li>")
    .replace(
      /<li class='ml-4'>(.*?)<\/li>/g,
      "<ul class='list-disc ml-6 text-lg'><li>$1</li></ul>"
    )
    
    // Handle multiple consecutive list items
    .replace(/(<ul class='list-disc ml-6 text-lg'><li>.*?<\/li><\/ul>)+/g, (match) => {
      // Remove duplicate ul wrappers for consecutive list items
      return match.replace(/<\/ul><ul class='list-disc ml-6 text-lg'>/g, '');
    });
};

/**
 * Extracts plain text from formatted content (for PDF export)
 * @param {string} content - The raw story content
 * @returns {string} - Plain text content
 */
export const getPlainTextContent = (content) => {
  if (!content) return '';

  return content
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markers
    .replace(/^[-•]\s+/gm, '• ') // Convert bullets to simple format
    .replace(/\n{2,}/g, '\n\n'); // Normalize line breaks
};
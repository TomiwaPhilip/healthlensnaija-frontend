import jsPDF from "jspdf";

/**
 * Exports a story as PDF with proper formatting
 * @param {Object} story - The story object to export
 * @param {string} story.title - Story title
 * @param {string} story.content - Story content
 * @param {Array} story.tags - Story tags
 * @param {string} story.createdAt - Creation date
 */
export const exportStoryPDF = (story) => {
  const doc = new jsPDF();
  const marginLeft = 15;
  const marginRight = 15;
  const maxWidth = 180;
  let y = 20;
  const lineHeight = 7;
  const sectionSpacing = 10;

  // Set document properties
  doc.setProperties({
    title: story.title,
    subject: 'Generated Story',
    author: 'Story Generator',
    keywords: (story.tags || []).join(', ')
  });

  // Add title
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  const titleLines = doc.splitTextToSize(story.title, maxWidth);
  doc.text(titleLines, marginLeft, y);
  y += titleLines.length * lineHeight + sectionSpacing;

  // Add creation date
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(100, 100, 100);
  const createdDate = new Date(story.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.text(`Generated on: ${createdDate}`, marginLeft, y);
  y += sectionSpacing;

  // Reset text color
  doc.setTextColor(0, 0, 0);

  // Process content lines
  const contentLines = story.content.split('\n');
  let currentSection = '';

  contentLines.forEach((line, index) => {
    // Check for page break
    if (y >= 270) {
      doc.addPage();
      y = 20;
    }

    const trimmedLine = line.trim();

    // Handle section headers
    if (trimmedLine === '**Overview**') {
      currentSection = 'overview';
      addSectionHeader(doc, 'Overview', marginLeft, y);
      y += lineHeight + 2;
      return;
    } else if (trimmedLine === '**Key Data Points**') {
      currentSection = 'dataPoints';
      addSectionHeader(doc, 'Key Data Points', marginLeft, y);
      y += lineHeight + 2;
      return;
    } else if (trimmedLine === '**Policy Recommendations**') {
      currentSection = 'recommendations';
      addSectionHeader(doc, 'Policy Recommendations', marginLeft, y);
      y += lineHeight + 2;
      return;
    } else if (trimmedLine === '**Challenges & Solutions**') {
      currentSection = 'challenges';
      addSectionHeader(doc, 'Challenges & Solutions', marginLeft, y);
      y += lineHeight + 2;
      return;
    }

    // Handle challenge/solution labels
    if (trimmedLine === '**Challenge**') {
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0, 0, 150);
      doc.text('Challenge:', marginLeft, y);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(0, 0, 0);
      y += lineHeight;
      return;
    } else if (trimmedLine === '**Solution**') {
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0, 100, 0);
      doc.text('Solution:', marginLeft, y);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(0, 0, 0);
      y += lineHeight;
      return;
    }

    // Handle bullet points
    if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
      const bulletText = trimmedLine.replace(/^[-•]\s+/, '• ');
      const bulletLines = doc.splitTextToSize(bulletText, maxWidth - 5);
      
      doc.setFontSize(10);
      doc.text(bulletLines, marginLeft + 5, y);
      y += bulletLines.length * lineHeight;
      doc.setFontSize(12);
      return;
    }

    // Handle regular text
    if (trimmedLine) {
      const cleanLine = trimmedLine.replace(/\*\*(.*?)\*\*/g, '$1');
      const textLines = doc.splitTextToSize(cleanLine, maxWidth);
      
      // Set appropriate font style based on section
      if (currentSection === 'dataPoints' || currentSection === 'recommendations') {
        doc.setFontSize(10);
      } else {
        doc.setFontSize(12);
      }

      doc.text(textLines, marginLeft, y);
      y += textLines.length * lineHeight;
      
      // Reset font size
      doc.setFontSize(12);
    } else {
      // Empty line - add spacing
      y += lineHeight / 2;
    }
  });

  // Add page numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - marginRight, doc.internal.pageSize.height - 10, { align: 'right' });
  }

  // Save the PDF
  doc.save(`${story.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
};

/**
 * Adds a section header to the PDF
 * @param {Object} doc - jsPDF instance
 * @param {string} text - Header text
 * @param {number} x - X position
 * @param {number} y - Y position
 */
const addSectionHeader = (doc, text, x, y) => {
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(text, x, y);
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
};

/**
 * Creates a summary PDF with multiple stories
 * @param {Array} stories - Array of story objects to export
 * @param {string} filename - Output filename
 */
export const exportStoriesSummaryPDF = (stories, filename = 'stories_summary.pdf') => {
  const doc = new jsPDF();
  let y = 20;

  // Add title
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text('Stories Summary', 105, y, { align: 'center' });
  y += 15;

  stories.forEach((story, index) => {
    // Add page break if needed
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    // Story title
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    const titleLines = doc.splitTextToSize(story.title, 180);
    doc.text(titleLines, 15, y);
    y += titleLines.length * 7 + 5;

    // Story date
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100, 100, 100);
    const createdDate = new Date(story.createdAt).toLocaleDateString();
    doc.text(`Generated: ${createdDate}`, 15, y);
    y += 7;

    // Tags
    if (story.tags && story.tags.length > 0) {
      const tagsText = `Tags: ${story.tags.join(', ')}`;
      doc.text(tagsText, 15, y);
      y += 7;
    }

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // Brief excerpt (first 100 characters)
    doc.setFontSize(10);
    const excerpt = story.content.substring(0, 200) + (story.content.length > 200 ? '...' : '');
    const excerptLines = doc.splitTextToSize(excerpt, 180);
    doc.text(excerptLines, 15, y);
    y += excerptLines.length * 6 + 10;

    // Add separator line
    if (index < stories.length - 1) {
      doc.setDrawColor(200, 200, 200);
      doc.line(15, y, 195, y);
      y += 5;
    }
  });

  doc.save(filename);
};
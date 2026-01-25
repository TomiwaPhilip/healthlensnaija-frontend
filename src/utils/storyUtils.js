export const formatStoryContent = (content) => {
    return content
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
      .replace(/\*\*Challenge\*\*/g, "<strong>Challenge:</strong>")
      .replace(/\*\*Solution\*\*/g, "<strong>Solution:</strong>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/- /g, "<li class='ml-4'>")
      .replace(/\n/g, "<br/>")
      .replace(/<\/li><br\/>/g, "</li>")
      .replace(
        /<li class='ml-4'>(.*?)<\/li>/g,
        "<ul class='list-disc ml-6 text-lg'><li>$1</li></ul>"
      );
  };
  
  export const handleExportStory = (story) => {
    const doc = new jsPDF();
    const marginLeft = 10;
    const maxWidth = 180;
    let y = 20;
  
    // Set title
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text(story.title, marginLeft, 10);
  
    // Split content into lines
    const contentLines = story.content.split('\n');
  
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
  
    contentLines.forEach(line => {
      // Section headers
      if (/\*\*Overview\*\*/.test(line)) {
        doc.setFont(undefined, 'bold');
        doc.text('Overview', marginLeft, y);
        y += 8;
        doc.setFont(undefined, 'normal');
      } else if (/\*\*Key Data Points\*\*/.test(line)) {
        doc.setFont(undefined, 'bold');
        doc.text('Key Data Points', marginLeft, y);
        y += 8;
        doc.setFont(undefined, 'normal');
      } else if (/\*\*Policy Recommendations\*\*/.test(line)) {
        doc.setFont(undefined, 'bold');
        doc.text('Policy Recommendations', marginLeft, y);
        y += 8;
        doc.setFont(undefined, 'normal');
      } else if (/\*\*Challenges & Solutions\*\*/.test(line)) {
        doc.setFont(undefined, 'bold');
        doc.text('Challenges & Solutions', marginLeft, y);
        y += 8;
        doc.setFont(undefined, 'normal');
      }
  
      // Challenge/Solution labels
      else if (/\*\*Challenge\*\*/.test(line)) {
        doc.setFont(undefined, 'bold');
        doc.text('Challenge:', marginLeft, y);
        doc.setFont(undefined, 'normal');
        y += 7;
      } else if (/\*\*Solution\*\*/.test(line)) {
        doc.setFont(undefined, 'bold');
        doc.text('Solution:', marginLeft, y);
        doc.setFont(undefined, 'normal');
        y += 7;
      }
  
      // Bullet points
      else if (/^- /.test(line)) {
        const bulletText = line.replace(/^- /, '• ');
        const lines = doc.splitTextToSize(bulletText, maxWidth);
        doc.text(lines, marginLeft + 5, y);
        y += lines.length * 6;
      }
  
      // Other lines
      else if (line.trim() !== '') {
        const cleaned = line.replace(/\*\*(.*?)\*\*/g, '$1');
        const lines = doc.splitTextToSize(cleaned, maxWidth);
        doc.text(lines, marginLeft, y);
        y += lines.length * 6;
      }
  
      // Add spacing for blank lines
      else {
        y += 5;
      }
  
      // Handle page overflow
      if (y >= 280) {
        doc.addPage();
        y = 20;
      }
    });
  
    doc.save(`${story.title}.pdf`);
  };
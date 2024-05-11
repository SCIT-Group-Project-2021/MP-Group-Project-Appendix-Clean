import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertTextToHtml'
})
export class ConvertTextToHtmlPipe implements PipeTransform {

  transform(text: string | null): string {
    if (typeof text !== 'string' || text.trim() === '') {
      return '';
    }

    const lines = text.split("\n").filter((line) => line.trim() !== "");
    let htmlContent = "<div>";
    let listOpened = false;

    lines.forEach((line, index) => {
      if (line.startsWith("* **")) {
        if (!listOpened) {
          htmlContent += "<ul>";
          listOpened = true;
        }
        const listItem = line.replace('* **', '').replace('**', '');
        htmlContent += `<li>${listItem}</li>`;
      } else {
        if (listOpened) {
          htmlContent += "</ul>";
          listOpened = false;
        }
        if (line.startsWith("**")) {
          const title = line.replace(/\*\*/g, "");
          htmlContent += `<h4>${title}</h4>`;
        }
        else if (line.match(/^\d+\./)) {
          if (index === 1 || !lines[index - 1].match(/^\d+\./)) {
            htmlContent += "<ol>";
          }
          htmlContent += `<li>${line}</li>`;

          if (index === lines.length - 1 || !lines[index + 1].match(/^\d+\./)) {
            htmlContent += "</ol>";
          }
        }


        else if (line.startsWith("```")) {
          const title = line.replace(/\`\`\`/g, "");
          htmlContent += `<code>${title}</code>`;
        }
        else {
          htmlContent += `<p>${line}</p>`;
        }
      }
    });

    if (listOpened) {
      htmlContent += "</ul>";
    }

    htmlContent += "</div>";
    return htmlContent;
  }
}

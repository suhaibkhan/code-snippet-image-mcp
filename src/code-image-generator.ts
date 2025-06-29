import * as fs from 'fs/promises';
import * as path from 'path';
import { chromium, Browser } from 'playwright-chromium';
import hljs from 'highlight.js';

export interface CodeImageOptions {
  code: string;
  language: string;
  theme: string;
  title?: string;
  width: number;
  height?: number;
  padding?: number;
  backgroundColor?: string;
  showLineNumbers?: boolean;
  outputDir?: string;
}

export interface Theme {
  background: string;
  windowBar: string;
  windowDots: string[];
  codeBackground: string;
  textColor: string;
  lineNumberColor: string;
  shadowColor: string;
  isLight: boolean;
}

export class CodeImageGenerator {
  private browser: Browser | null = null;

  private async loadThemes(): Promise<Record<string, Theme>> {
    const themesPath = path.join(
      path.dirname(new URL(import.meta.url).pathname),
      'themes.json'
    );
    const themesData = await fs.readFile(themesPath, 'utf-8');
    return JSON.parse(themesData);
  }

  async generateImage(options: CodeImageOptions): Promise<string> {
    const {
      code,
      language = 'javascript',
      theme = 'dracula',
      title,
      width = 800,
      height,
      padding = 52,
      backgroundColor,
      showLineNumbers = true,
      outputDir = path.join(process.cwd(), 'output'),
    } = options;

    const themes = await this.loadThemes();
    const themeConfig = themes[theme] || themes.dracula;

    // Highlight the code
    const highlightedCode = hljs.highlight(code, {
      language: language || 'plaintext',
    }).value;

    // Generate HTML
    const html = await this.generateHTML({
      code: highlightedCode,
      originalCode: code,
      theme: themeConfig,
      themeName: theme,
      title,
      width,
      height,
      padding,
      backgroundColor,
      showLineNumbers,
      language,
    });

    // Launch browser and capture screenshot
    if (!this.browser) {
      this.browser = await chromium.launch({
        headless: true,
        args: [
          '--force-color-profile=srgb',
          '--disable-web-security',
          '--disable-features=TranslateUI',
          '--disable-ipc-flooding-protection',
          '--font-render-hinting=full',
        ],
      });
    }

    const page = await this.browser.newPage({
      deviceScaleFactor: 2,
    });
    await page.setViewportSize({
      width: width + padding * 2,
      height: 1080,
    });

    try {
      await page.setContent(html);
      await page.waitForLoadState('networkidle');

      const screenshot = await page.locator('.code-window-parent').screenshot({
        type: 'png',
        scale: 'device',
      });

      // Save the image
      await fs.mkdir(outputDir, { recursive: true });

      const timestamp = Date.now();
      const filename = `code-snippet-${timestamp}.png`;
      const filepath = path.join(outputDir, filename);

      await fs.writeFile(filepath, screenshot);

      return filepath;
    } finally {
      await page.close();
    }
  }

  private async generateHTML(options: {
    code: string;
    originalCode: string;
    theme: Theme;
    themeName: string;
    title?: string;
    width: number;
    height?: number;
    padding: number;
    backgroundColor?: string;
    showLineNumbers: boolean;
    language: string;
  }): Promise<string> {
    const {
      code,
      originalCode,
      theme,
      themeName,
      title,
      width,
      height,
      padding,
      backgroundColor,
      showLineNumbers,
      language,
    } = options;
    const lines = originalCode.split('\n');

    // Read template file
    const templatePath = path.join(
      path.dirname(new URL(import.meta.url).pathname),
      'template.html'
    );
    let template = await fs.readFile(templatePath, 'utf-8');

    // Remove development-only sections for rendering
    template = template.replace(/<!--DEV START-->[\s\S]*?<!--DEV END-->/g, '');

    // Apply theme class to body for syntax highlighting
    const themeClass = theme.isLight ? 'theme-light' : 'theme-dark';
    template = template.replace('<body>', `<body class="${themeClass}">`);

    // Generate code lines with individual syntax highlighting
    const codeLines = lines
      .map((line, i) => {
        const highlightedLine = hljs.highlight(line || ' ', {
          language: language || 'plaintext',
        }).value;

        if (showLineNumbers) {
          return `<div class="code-line">
        <div class="line-number">${i + 1}</div>
        <div class="code-content">
          <div class="code-line-content hljs">${highlightedLine}</div>
        </div>
      </div>`;
        } else {
          return `<div class="code-line-no-numbers">
        <div class="code-content-full">
          <div class="code-line-content hljs">${highlightedLine}</div>
        </div>
      </div>`;
        }
      })
      .join('');

    // Replace template variables
    const replacements = {
      'theme.background': backgroundColor || theme.background,
      'theme.codeBackground': theme.codeBackground,
      'theme.shadowColor': theme.shadowColor,
      'theme.windowBar': theme.windowBar,
      'theme.textColor': theme.textColor,
      'theme.lineNumberColor': theme.lineNumberColor,
      'theme.windowDots[0]': theme.windowDots[0],
      'theme.windowDots[1]': theme.windowDots[1],
      'theme.windowDots[2]': theme.windowDots[2],
      'padding': padding.toString(),
      'widthStyle': width ? `width: ${width}px;` : '',
      'heightStyle': height ? `height: ${height}px;` : '',
      'titleHtml': title ? `<div class="title">${title}</div>` : '',
      'codeLines': codeLines,
    };

    Object.entries(replacements).forEach(([key, value]) => {
      // Handle CSS placeholders with /* */ syntax
      const cssRegex = new RegExp(
        `/\\*\\{\\{${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\}\\}\\*/`,
        'g'
      );
      // Handle HTML placeholders with <!-- --> syntax
      const htmlRegex = new RegExp(
        `<!--\\{\\{${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\}\\}-->`,
        'g'
      );
      template = template.replace(cssRegex, value);
      template = template.replace(htmlRegex, value);
    });

    return template;
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

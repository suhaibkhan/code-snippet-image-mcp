// All theme values from code-image-generator.ts
const themes = {
  dracula: {
    background:
      'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
    windowBar: '#44475a',
    windowDots: ['#ff5555', '#f1fa8c', '#50fa7b'],
    codeBackground: '#282a36',
    textColor: '#f8f8f2',
    lineNumberColor: '#6272a4',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    isLight: false,
  },
  monokai: {
    background:
      'linear-gradient(135deg, #0d1117 0%, #161b22 50%, #21262d 100%)',
    windowBar: '#3e3d32',
    windowDots: ['#f92672', '#fd971f', '#a6e22e'],
    codeBackground: '#272822',
    textColor: '#f8f8f2',
    lineNumberColor: '#75715e',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    isLight: false,
  },
  github: {
    background:
      'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
    windowBar: '#f1f3f4',
    windowDots: ['#ff5f56', '#ffbd2e', '#27ca3f'],
    codeBackground: '#ffffff',
    textColor: '#24292e',
    lineNumberColor: '#8b949e',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    isLight: true,
  },
  'solarized-dark': {
    background:
      'linear-gradient(135deg, #0c1821 0%, #1e3a8a 50%, #1e40af 100%)',
    windowBar: '#073642',
    windowDots: ['#dc322f', '#cb4b16', '#859900'],
    codeBackground: '#002b36',
    textColor: '#839496',
    lineNumberColor: '#586e75',
    shadowColor: 'rgba(0, 0, 0, 0.4)',
    isLight: false,
  },
  'solarized-light': {
    background:
      'linear-gradient(135deg, #fefce8 0%, #fef3c7 50%, #fde68a 100%)',
    windowBar: '#eee8d5',
    windowDots: ['#dc322f', '#cb4b16', '#859900'],
    codeBackground: '#fdf6e3',
    textColor: '#657b83',
    lineNumberColor: '#93a1a1',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    isLight: true,
  },
};

const defaultTheme = themes.dracula;

const defaultOptions = {
  padding: 52,
  width: 800,
  height: null,
  title: 'Sample Code',
};

// Sample code lines for demo
const sampleCodeLines = `
  <div class="code-line">
    <div class="line-number">1</div>
    <div class="code-content">
      <div class="code-line-content hljs"><span class="hljs-keyword">function</span> <span class="hljs-title">hello</span>() {</div>
    </div>
  </div>
  <div class="code-line">
    <div class="line-number">2</div>
    <div class="code-content">
      <div class="code-line-content hljs">  <span class="hljs-built_in">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">'Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World!'</span>);</div>
    </div>
  </div>
  <div class="code-line">
    <div class="line-number">10</div>
    <div class="code-content">
      <div class="code-line-content hljs">}</div>
    </div>
  </div>`;

const sampleCodeNoLines = `
  <div class="code-line-no-numbers">
    <div class="code-content-full">
      <div class="code-line-content hljs"><span class="hljs-keyword">function</span> <span class="hljs-title">hello</span>() {</div>
    </div>
  </div>
  <div class="code-line-no-numbers">
    <div class="code-content-full">
      <div class="code-line-content hljs">  <span class="hljs-built_in">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">'Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World!'</span>);</div>
    </div>
  </div>
  <div class="code-line-no-numbers">
    <div class="code-content-full">
      <div class="code-line-content hljs">}</div>
    </div>
  </div>`;

function updateTheme(themeName) {
  const theme = themes[themeName];
  if (!theme) return;

  const root = document.documentElement;
  root.style.setProperty('--theme-background', theme.background);
  root.style.setProperty('--theme-code-background', theme.codeBackground);
  root.style.setProperty('--theme-shadow-color', theme.shadowColor);
  root.style.setProperty('--theme-window-bar', theme.windowBar);
  root.style.setProperty('--theme-text-color', theme.textColor);
  root.style.setProperty('--theme-line-number-color', theme.lineNumberColor);
  root.style.setProperty('--theme-dot-1', theme.windowDots[0]);
  root.style.setProperty('--theme-dot-2', theme.windowDots[1]);
  root.style.setProperty('--theme-dot-3', theme.windowDots[2]);

  // Apply theme class for syntax highlighting
  const body = document.body;
  body.classList.remove('theme-dark', 'theme-light');
  body.classList.add(theme.isLight ? 'theme-light' : 'theme-dark');
}

function toggleLineNumbers(showLineNumbers) {
  const codeContainer = document.querySelector('.code-container');
  if (!codeContainer) return;

  // Use predefined sample code with or without line numbers
  codeContainer.innerHTML = showLineNumbers ? sampleCodeLines : sampleCodeNoLines;
}

function attachEventListeners() {
  // Handle theme change
  const themeSelect = document.getElementById('themeSelect');
  if (themeSelect) {
    themeSelect.addEventListener('change', function (e) {
      updateTheme(e.target.value);
    });
  }

  // Handle line numbers toggle
  const lineNumbersCheckbox = document.getElementById('lineNumbersCheckbox');
  if (lineNumbersCheckbox) {
    lineNumbersCheckbox.addEventListener('change', function (e) {
      toggleLineNumbers(e.target.checked);
    });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // Replace template variables with default values if they weren't replaced by generator
  const replacements = {
    'theme.background': defaultTheme.background,
    'theme.codeBackground': defaultTheme.codeBackground,
    'theme.shadowColor': defaultTheme.shadowColor,
    'theme.windowBar': defaultTheme.windowBar,
    'theme.textColor': defaultTheme.textColor,
    'theme.lineNumberColor': defaultTheme.lineNumberColor,
    'theme.windowDots[0]': defaultTheme.windowDots[0],
    'theme.windowDots[1]': defaultTheme.windowDots[1],
    'theme.windowDots[2]': defaultTheme.windowDots[2],
    'padding': defaultOptions.padding.toString(),
    'widthStyle': defaultOptions.width
      ? `width: ${defaultOptions.width}px;`
      : '',
    'heightStyle': defaultOptions.height
      ? `height: ${defaultOptions.height}px;`
      : '',
    'titleHtml': defaultOptions.title
      ? `<div class="title">${defaultOptions.title}</div>`
      : '',
    'codeLines': sampleCodeLines,
  };

  let htmlContent = document.documentElement.outerHTML;

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
    htmlContent = htmlContent.replace(cssRegex, value);
    htmlContent = htmlContent.replace(htmlRegex, value);
  });

  // Only replace if we found template placeholders
  if (htmlContent !== document.documentElement.outerHTML) {
    document.open();
    document.write(htmlContent);
    document.close();
  }
  // Attach event listeners after the DOM is ready
  attachEventListeners();
  document.body.classList.add(
    defaultTheme.isLight ? 'theme-light' : 'theme-dark'
  );
});

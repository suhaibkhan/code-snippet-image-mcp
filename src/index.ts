#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CodeImageGenerator } from './code-image-generator.js';
import path from 'path';
import { z } from 'zod';

// Parse command line arguments for output directory
const outputDir = process.argv[2] || path.join(process.cwd(), 'output');

// Define zod schema for create_code_image tool
const paramsSchema = {
  code: z.string().describe('The code snippet to convert to image'),
  language: z
    .string()
    .default('javascript')
    .describe(
      'Programming language for syntax highlighting (e.g., javascript, python, typescript)'
    ),
  theme: z
    .string()
    .default('dracula')
    .describe(
      'Color theme (dracula, monokai, github, solarized-dark, solarized-light)'
    ),
  title: z.string().optional().describe('Optional title for the code snippet'),
  width: z.number().default(800).describe('Image width in pixels'),
  height: z
    .number()
    .optional()
    .describe('Image height in pixels (auto if not specified)'),
  padding: z
    .number()
    .default(52)
    .describe('Padding around the code window in pixels'),
  backgroundColor: z
    .string()
    .optional()
    .describe('Custom background color (overrides theme background)'),
  showLineNumbers: z
    .boolean()
    .default(true)
    .describe('Show or hide line numbers'),
};

const server = new McpServer({
  name: 'code-snippet-image-mcp',
  version: '1.0.0',
  capabilities: {
    resources: {},
    tools: {},
  },
});

const codeImageGenerator = new CodeImageGenerator();

// Define the create_code_image tool using the new server.tool method
server.tool(
  'create_code_image',
  'Generate a beautiful code snippet image with syntax highlighting and styling',
  paramsSchema,
  async (args) => {
    const imagePath = await codeImageGenerator.generateImage({
      ...args,
      outputDir,
    });

    return {
      content: [
        {
          type: 'text',
          text: `Code image generated successfully at: ${imagePath}`,
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});

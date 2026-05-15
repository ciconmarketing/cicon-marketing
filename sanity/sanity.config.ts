import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

export default defineConfig({
  name: 'default',
  title: 'CiCon Marketing',

  projectId: '26ol0sqj',
  dataset: 'cicon-marketing',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
});

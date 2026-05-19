import { defineConfig, useDocumentOperation } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';
import type { DocumentActionComponent } from 'sanity';

/**
 * Custom Publish action for blogPost documents.
 * Automatically sets status → "published" on the draft before publishing,
 * so the GROQ query on the blog index always finds the post immediately.
 * Also triggers the existing Sanity → Vercel deploy webhook automatically.
 */
const BlogPublishAction: DocumentActionComponent = (props) => {
  const { patch, publish } = useDocumentOperation(props.id, props.type);

  return {
    label: 'Publish',
    tone: 'positive' as const,
    disabled: !!publish.disabled,
    onHandle: () => {
      // 1. Set the workflow status field to "published" on the draft
      patch.execute([{ set: { status: 'published' } }]);
      // 2. Publish the draft (makes it live; triggers Sanity → Vercel webhook)
      publish.execute();
      props.onComplete();
    },
  };
};

export default defineConfig({
  name: 'default',
  title: 'CiCon Marketing',

  projectId: '26ol0sqj',
  dataset: 'cicon-marketing',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },

  document: {
    // Override the Publish button only for blogPost — all other types unchanged
    actions: (prev, context) => {
      if (context.schemaType !== 'blogPost') return prev;
      return prev.map((action) =>
        action.action === 'publish' ? BlogPublishAction : action,
      );
    },
  },
});

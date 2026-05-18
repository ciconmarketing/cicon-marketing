import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

// ── Singleton document IDs ────────────────────────────────────────────────────
// These fixed IDs ensure only one document of each singleton type is ever created.
const SINGLETON_DOCUMENT_IDS: Record<string, string> = {
  aboutPage:    'about-page-singleton',
  contactPage:  'contact-page-singleton',
  mapCheckPage: 'map-check-page-singleton',
};

// ── Singleton types to hide from the "New document" menu ─────────────────────
const SINGLETON_TYPES = new Set(Object.keys(SINGLETON_DOCUMENT_IDS));

export default defineConfig({
  name: 'default',
  title: 'CiCon Marketing',

  projectId: '26ol0sqj',
  dataset: 'cicon-marketing',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([

            // ── Homepage ───────────────────────────────────────────────────
            S.listItem()
              .title('🏠 Homepage')
              .id('homepage')
              .child(
                S.documentTypeList('homepage')
                  .title('Homepage')
              ),

            S.divider(),

            // ── Pages group (singletons) ───────────────────────────────────
            S.listItem()
              .title('📄 Pages')
              .child(
                S.list()
                  .title('Pages')
                  .items([
                    S.listItem()
                      .title('👤 About Us')
                      .id('aboutPage')
                      .child(
                        S.document()
                          .schemaType('aboutPage')
                          .documentId(SINGLETON_DOCUMENT_IDS.aboutPage)
                          .title('About Us Page')
                      ),
                    S.listItem()
                      .title('📬 Contact Us')
                      .id('contactPage')
                      .child(
                        S.document()
                          .schemaType('contactPage')
                          .documentId(SINGLETON_DOCUMENT_IDS.contactPage)
                          .title('Contact Us Page')
                      ),
                    S.listItem()
                      .title('🗺️ Free Map Check')
                      .id('mapCheckPage')
                      .child(
                        S.document()
                          .schemaType('mapCheckPage')
                          .documentId(SINGLETON_DOCUMENT_IDS.mapCheckPage)
                          .title('Free Map Check Page')
                      ),
                  ])
              ),

            S.divider(),

            // ── Service Pages ──────────────────────────────────────────────
            S.listItem()
              .title('🛠️ Service Pages')
              .child(
                S.documentTypeList('servicePage').title('Service Pages')
              ),
            S.listItem()
              .title('🛠️ Services Hub')
              .child(
                S.documentTypeList('servicesHub').title('Services Hub')
              ),

            S.divider(),

            // ── Blog ───────────────────────────────────────────────────────
            S.listItem()
              .title('✍️ Blog Posts')
              .child(
                S.documentTypeList('blogPost').title('Blog Posts')
              ),
            S.listItem()
              .title('🏷️ Blog Categories')
              .child(
                S.documentTypeList('blogCategory').title('Blog Categories')
              ),

            S.divider(),

            // ── Case Studies ───────────────────────────────────────────────
            S.listItem()
              .title('📊 Case Studies')
              .child(
                S.documentTypeList('caseStudy').title('Case Studies')
              ),

          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    // Hide singleton types from the global "New document" button
    templates: (templates) =>
      templates.filter(({ schemaType }) => !SINGLETON_TYPES.has(schemaType)),
  },
});

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'thankYouPage',
  title: 'Thank You Page',
  type: 'document',
  icon: () => '✅',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({ name: 'headline', title: 'Headline (H1)', type: 'string',
      initialValue: "Got it. Now it's our move." }),
    defineField({ name: 'paragraph1', title: 'Paragraph 1 — Message Received', type: 'text', rows: 3,
      initialValue: "Your submission is sitting in MJ's and Soroush's inboxes right now. One of us will reach out within the next business hour — by phone, email, or whichever you prefer." }),
    defineField({ name: 'paragraph2', title: 'Paragraph 2 — WhatsApp Nudge', type: 'text', rows: 2,
      initialValue: 'In the meantime, if something urgent comes up, message us directly on WhatsApp. Same response window.' }),
    defineField({ name: 'nurtureLinkLabel', title: '"While You Wait" Link Label', type: 'string',
      description: 'Text for the nurture link (e.g. "Read our latest guide on GTA SEO"). Leave empty to hide this element.' }),
    defineField({ name: 'nurtureLinkUrl', title: '"While You Wait" Link URL', type: 'string',
      description: 'URL for the nurture content link.' }),
  ],
  preview: { prepare() { return { title: 'Thank You Page' } } },
})

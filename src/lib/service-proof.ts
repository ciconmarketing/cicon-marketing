/**
 * SERVICE_PROOF — owner-approved anonymous client results shown on service
 * pages (#case-study-1). Approved by MJ for the dental services page,
 * 2026-11-05 (period and cost definition corrected the same day).
 *
 * Rules baked into the data:
 * - No clinic name, location, initials, account details or identifying images.
 * - Tracked enquiries are not appointments, patients, revenue or ROI.
 * - Every figure keeps its dates, its metric definition and its limits.
 * - The screenshot is shown unedited, with its date selector and banner visible.
 * Change figures here only after MJ re-confirms them.
 */

export interface ProofStat {
  value: string
  label: string
}

export interface ProofImage {
  /** Path under /public. */
  src: string
  width: number
  height: number
  alt: string
  caption: string
}

export interface ServiceProof {
  slug: string
  eyebrow: string
  headline: string
  /** Date range the figures cover. */
  period: string
  stats: ProofStat[]
  /** What the cost figure includes and excludes. */
  costNote: string
  image?: ProofImage
  /** What the counted metric means. */
  definition: string
  /** Plain-language limits shown under the figures. */
  limits: string[]
}

const SERVICE_PROOF: Record<string, ServiceProof> = {
  'dental-marketing-services': {
    slug: 'dental-marketing-services',
    eyebrow: 'Client result',
    headline: 'One dental clinic client, measured in tracked enquiries',
    period: 'Google Ads report period: March 1 to November 1, 2026',
    stats: [
      { value: '231', label: 'tracked enquiries' },
      { value: 'CA$62.07', label: 'average Google ad spend per tracked enquiry' },
    ],
    costNote:
      'CA$62.07 is Google ad spend only. It does not include CiCon’s management fee.',
    image: {
      src: '/images/proof/dental-google-ads-report-2026-03-01-to-2026-11-01.png',
      width: 2048,
      height: 1192,
      alt: 'Unedited Google Ads report for the anonymous clinic. Date selector: Mar 1 – Nov 1, 2026. Banner: You are viewing data between 2026-03-01 and 2026-11-01. Conversions: 231.00. Cost per conversion: CA$62.07.',
      caption:
        'Unedited Google Ads screenshot. The selected report period is March 1 to November 1, 2026, shown in the date selector and the banner. Google Ads labels the tracked enquiries “Conversions” and the average Google ad spend per enquiry “Cost / conv.”, which excludes CiCon’s management fee. The chart’s axis labels (Feb 23 and Oct 26, 2026) are graph labels, not the report dates. The ↑ markers are Google Ads display markers; we make no claim about change from an earlier period.',
    },
    definition:
      'In this example, a tracked enquiry is a phone call longer than 60 seconds or an appointment-form submission. CiCon confirmed the count has no duplicates.',
    limits: [
      'Tracked enquiries are not booked or attended appointments, patients, revenue or return on investment.',
      'This is one clinic over one period. It is not a forecast for your clinic.',
      'The figures come from CiCon’s own records, confirmed by CiCon. They are not an independent audit.',
      'We do not name the clinic or say where it is.',
    ],
  },
}

export function getServiceProof(slug: string): ServiceProof | null {
  return SERVICE_PROOF[slug] ?? null
}

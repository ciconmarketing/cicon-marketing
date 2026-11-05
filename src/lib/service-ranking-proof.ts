/**
 * SERVICE_RANKING_PROOF — a second, separate anonymous dental-clinic example:
 * local search positions recorded by an independent rank-tracking tool for two
 * generic searches (#case-study-2). Approved by MJ, 2026-11-05; the tool is not
 * named on the page. Data: the first two series of the
 * sanitized export anonymized-ranking-history.json (every supplied
 * observation, timestamps in UTC).
 *
 * Rules baked into the data:
 * - A different clinic from the Google Ads example. No name, location, IDs or links.
 * - Positions only: not calls, clicks, directions, enquiries, appointments or patients.
 * - No attribution to CiCon: scan comparability and engagement dates are unverified.
 * - No averages, percentages or "top" claims.
 */

export interface RankingPoint {
  /** ISO timestamp (UTC) of the recorded observation. */
  t: string
  /** Recorded position; lower is better. */
  pos: number
}

export interface RankingSeries {
  keyword: string
  points: RankingPoint[]
}

export interface ServiceRankingProof {
  slug: string
  eyebrow: string
  headline: string
  intro: string
  metricLabel: string
  series: RankingSeries[]
  notes: string[]
}

const SERVICE_RANKING_PROOF: Record<string, ServiceRankingProof> = {
  'dental-marketing-services': {
    slug: 'dental-marketing-services',
    eyebrow: 'Second client example',
    headline: 'A different dental clinic: tracked local search positions for two searches',
    intro:
      'This is a different clinic from the Google Ads example above. The charts show the positions that an independent rank-tracking tool recorded for the clinic’s Google Business Profile listing on two searches. Every supplied observation is plotted against its actual date.',
    metricLabel: 'Independently tracked local search positions (lower is better)',
    series: [
      {
        keyword: 'dentist near me',
        points: [
      { t: '2025-06-26T16:53:26.220Z', pos: 7 },
      { t: '2025-07-03T17:23:27.147Z', pos: 6 },
      { t: '2025-07-10T16:53:27.483Z', pos: 5 },
      { t: '2025-07-17T17:23:28.320Z', pos: 6 },
      { t: '2025-07-24T16:53:28.869Z', pos: 6 },
      { t: '2025-07-31T17:23:29.351Z', pos: 6 },
      { t: '2025-08-07T16:53:30.285Z', pos: 6 },
      { t: '2025-08-14T17:23:31.178Z', pos: 6 },
      { t: '2025-08-21T16:53:31.978Z', pos: 8 },
      { t: '2025-08-28T17:23:32.588Z', pos: 6 },
      { t: '2025-09-04T16:53:33.346Z', pos: 6 },
      { t: '2025-09-11T17:23:33.635Z', pos: 5 },
      { t: '2025-09-18T16:53:34.039Z', pos: 4 },
      { t: '2025-09-25T17:23:35.148Z', pos: 8 },
      { t: '2025-10-02T16:53:35.446Z', pos: 6 },
      { t: '2025-10-09T17:23:35.790Z', pos: 6 },
      { t: '2025-10-16T16:53:36.103Z', pos: 5 },
      { t: '2025-10-23T17:23:37.115Z', pos: 5 },
      { t: '2025-10-30T16:53:38.126Z', pos: 5 },
      { t: '2025-10-31T16:27:06.356Z', pos: 4 },
      { t: '2025-11-06T18:23:38.435Z', pos: 7 },
      { t: '2025-11-13T17:53:39.040Z', pos: 6 },
      { t: '2025-11-20T18:23:40.108Z', pos: 5 },
      { t: '2025-11-27T17:53:41.109Z', pos: 3 },
      { t: '2025-12-04T18:23:41.702Z', pos: 8 },
      { t: '2025-12-11T17:53:42.867Z', pos: 2 },
      { t: '2025-12-18T18:23:43.304Z', pos: 2 },
      { t: '2025-12-27T16:23:45.020Z', pos: 3 },
      { t: '2026-01-05T17:53:45.370Z', pos: 6 },
      { t: '2026-01-12T18:23:45.664Z', pos: 6 },
      { t: '2026-01-19T17:53:46.581Z', pos: 11 },
      { t: '2026-01-26T18:23:46.964Z', pos: 4 },
      { t: '2026-01-31T20:48:38.885Z', pos: 6 },
      { t: '2026-02-02T17:53:47.163Z', pos: 8 },
      { t: '2026-02-09T18:23:47.495Z', pos: 2 },
      { t: '2026-02-17T18:23:48.251Z', pos: 2 },
      { t: '2026-02-24T17:53:48.853Z', pos: 2 },
      { t: '2026-02-28T18:19:31.518Z', pos: 1 },
      { t: '2026-03-03T18:23:49.388Z', pos: 2 },
      { t: '2026-03-10T16:53:49.721Z', pos: 2 },
      { t: '2026-03-17T17:23:50.657Z', pos: 2 },
      { t: '2026-03-24T16:53:51.358Z', pos: 2 },
      { t: '2026-03-31T16:25:33.056Z', pos: 2 },
      { t: '2026-03-31T17:23:52.281Z', pos: 3 },
      { t: '2026-04-07T16:53:52.710Z', pos: 2 },
      { t: '2026-04-14T17:23:53.858Z', pos: 4 },
      { t: '2026-04-21T16:53:54.035Z', pos: 2 },
      { t: '2026-04-28T17:23:54.985Z', pos: 2 },
      { t: '2026-05-05T16:53:56.107Z', pos: 2 },
      { t: '2026-05-12T17:23:56.762Z', pos: 2 },
      { t: '2026-05-19T16:53:57.598Z', pos: 2 },
      { t: '2026-05-26T17:23:58.004Z', pos: 3 },
      { t: '2026-05-30T18:18:43.283Z', pos: 1 },
      { t: '2026-06-02T16:53:58.876Z', pos: 2 },
      { t: '2026-06-09T17:23:59.148Z', pos: 3 },
      { t: '2026-06-16T16:53:59.440Z', pos: 2 },
      { t: '2026-06-23T17:24:26.754Z', pos: 2 },
      { t: '2026-06-30T16:54:27.933Z', pos: 6 },
      { t: '2026-07-07T17:24:28.983Z', pos: 3 },
      { t: '2026-07-14T16:54:30.292Z', pos: 2 },
      { t: '2026-07-21T17:24:31.622Z', pos: 2 },
      { t: '2026-07-28T16:54:32.359Z', pos: 4 },
      { t: '2026-08-04T17:24:32.649Z', pos: 3 },
      { t: '2026-08-11T16:54:32.939Z', pos: 3 },
      { t: '2026-08-18T17:24:33.649Z', pos: 2 },
      { t: '2026-08-25T16:54:34.431Z', pos: 2 },
      { t: '2026-08-31T21:32:57.441Z', pos: 2 },
      { t: '2026-09-01T17:24:34.604Z', pos: 2 },
      { t: '2026-09-10T16:46:09.030Z', pos: 2 },
      { t: '2026-09-17T16:54:36.086Z', pos: 2 },
      { t: '2026-09-24T17:24:36.298Z', pos: 4 },
      { t: '2026-09-30T22:32:17.345Z', pos: 2 },
      { t: '2026-10-01T16:54:36.961Z', pos: 2 },
        ],
      },
      {
        keyword: 'dentist',
        points: [
      { t: '2026-02-02T18:02:59.177Z', pos: 13 },
      { t: '2026-02-09T17:33:00.169Z', pos: 2 },
      { t: '2026-02-17T17:33:01.807Z', pos: 2 },
      { t: '2026-02-24T18:03:02.744Z', pos: 2 },
      { t: '2026-02-28T18:19:31.380Z', pos: 1 },
      { t: '2026-03-03T17:33:03.601Z', pos: 2 },
      { t: '2026-03-10T17:03:04.202Z', pos: 2 },
      { t: '2026-03-17T16:33:04.562Z', pos: 2 },
      { t: '2026-03-24T17:03:05.437Z', pos: 2 },
      { t: '2026-03-31T16:25:32.836Z', pos: 2 },
      { t: '2026-03-31T16:33:05.930Z', pos: 3 },
      { t: '2026-04-07T17:03:06.546Z', pos: 2 },
      { t: '2026-04-14T16:33:06.956Z', pos: 2 },
      { t: '2026-04-21T17:03:07.761Z', pos: 2 },
      { t: '2026-04-28T16:33:08.906Z', pos: 2 },
      { t: '2026-05-05T17:03:09.656Z', pos: 2 },
      { t: '2026-05-12T16:33:09.885Z', pos: 2 },
      { t: '2026-05-19T17:03:10.780Z', pos: 2 },
      { t: '2026-05-26T16:33:11.853Z', pos: 2 },
      { t: '2026-05-30T18:18:43.186Z', pos: 1 },
      { t: '2026-06-02T17:03:12.553Z', pos: 2 },
      { t: '2026-06-09T16:33:12.699Z', pos: 2 },
      { t: '2026-06-16T17:03:13.186Z', pos: 2 },
      { t: '2026-06-23T16:33:13.980Z', pos: 2 },
      { t: '2026-06-30T17:03:14.558Z', pos: 2 },
      { t: '2026-07-07T16:33:15.622Z', pos: 3 },
      { t: '2026-07-14T17:03:16.060Z', pos: 2 },
      { t: '2026-07-21T16:33:17.144Z', pos: 3 },
      { t: '2026-07-28T17:03:18.173Z', pos: 4 },
      { t: '2026-08-04T16:33:19.007Z', pos: 4 },
      { t: '2026-08-11T17:03:19.487Z', pos: 3 },
      { t: '2026-08-18T16:33:20.403Z', pos: 2 },
      { t: '2026-08-25T17:03:21.131Z', pos: 2 },
      { t: '2026-08-31T21:32:57.192Z', pos: 2 },
      { t: '2026-09-01T16:33:21.983Z', pos: 2 },
      { t: '2026-09-10T16:33:23.584Z', pos: 2 },
      { t: '2026-09-17T17:03:23.906Z', pos: 2 },
      { t: '2026-09-24T16:33:24.411Z', pos: 2 },
      { t: '2026-09-30T22:32:17.280Z', pos: 2 },
      { t: '2026-10-01T17:03:25.141Z', pos: 2 },
        ],
      },
    ],
    notes: [
      'Positions vary by search location and scan setup. How the recorded positions were calculated has not been confirmed. The tool’s records are not an independent audit.',
      'Scan comparability over time and CiCon’s engagement dates have not been verified, so we do not attribute these positions to CiCon.',
      'These are ranking measurements. They are not Google Business Profile calls, website clicks, direction requests, enquiries, appointments or patients.',
      'This is one clinic. It is not a forecast for your clinic. We do not name the clinic or say where it is.',
    ],
  },
}

export function getServiceRankingProof(slug: string): ServiceRankingProof | null {
  return SERVICE_RANKING_PROOF[slug] ?? null
}

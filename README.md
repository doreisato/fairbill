# FairBill

Medical bill negotiation tool powered by Medicare-benchmarked pricing data.

## Features

- Search by CPT code or procedure name
- View Medicare allowable rates
- Get suggested negotiation amounts (Medicare × 1.2)
- Copy ready-to-use negotiation scripts

## Tech Stack

- Next.js 15+ with App Router
- TypeScript
- Tailwind CSS
- Supabase (jeollamxgbmlhvzdgoqt)
- Lucide React icons

## Deployment

### Railway

1. Ensure PORT 8080 binding in package.json
2. Link GitHub repo to Railway service
3. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

### Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Database Schema

Table: `fairbill_procedures`

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| cpt_code | text | CPT procedure code |
| description | text | Procedure name |
| medicare_rate | decimal | Medicare allowable amount |

## Data Source

CMS Physician Fee Schedule (public dataset)

## Legal Disclaimer

This tool provides reference information only and does not constitute financial or medical advice. Medicare rates vary by location and provider. Consult a medical billing advocate for personalized guidance.
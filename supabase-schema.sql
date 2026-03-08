-- FairBill Procedures Table Schema
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.fairbill_procedures (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  cpt_code text NOT NULL,
  description text NOT NULL,
  medicare_rate decimal(10,2) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster searches
CREATE INDEX idx_fairbill_cpt ON public.fairbill_procedures(cpt_code);
CREATE INDEX idx_fairbill_desc ON public.fairbill_procedures USING gin(to_tsvector('english', description));

-- Enable Row Level Security
ALTER TABLE public.fairbill_procedures ENABLE ROW LEVEL SECURITY;

-- Allow public read access (no auth required)
CREATE POLICY "Allow public read access" ON public.fairbill_procedures
  FOR SELECT USING (true);

-- Sample seed data (top 10 common procedures)
INSERT INTO public.fairbill_procedures (cpt_code, description, medicare_rate) VALUES
('99213', 'Office visit, established patient, moderate complexity', 93.51),
('99214', 'Office visit, established patient, high complexity', 131.21),
('80053', 'Comprehensive metabolic panel', 14.12),
('85025', 'Complete blood count with differential', 10.32),
('36415', 'Routine venipuncture', 3.00),
('71046', 'Chest X-ray, 2 views', 27.41),
('93000', 'Electrocardiogram (EKG)', 17.28),
('82947', 'Glucose blood test', 4.24),
('84443', 'Thyroid stimulating hormone (TSH)', 19.63),
('70450', 'CT scan head without contrast', 181.42)
ON CONFLICT DO NOTHING;

-- Add more procedures from CMS Physician Fee Schedule as needed
-- Download: https://www.cms.gov/medicare/physician-fee-schedule/search
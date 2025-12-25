
-- Temporarily disable RLS to insert seed data
ALTER TABLE public.vendors DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.available_jobs DISABLE ROW LEVEL SECURITY;

-- Insert sample vendors
INSERT INTO public.vendors (name, specialty, rating, reviews, completed_jobs, distance, response_time, avg_price, verified, favorite, avatar)
VALUES 
  ('Ahmad Al-Mansouri', 'Plumbing', 4.9, 127, 245, '2.3 km', '< 1 hour', '$80-150', true, true, ''),
  ('Sarah Mitchell', 'Electrical', 4.8, 89, 178, '3.1 km', '< 2 hours', '$90-180', true, false, ''),
  ('Mohammed Hassan', 'HVAC', 4.7, 156, 312, '1.8 km', '< 30 min', '$100-200', true, true, ''),
  ('Lisa Chen', 'Cleaning', 4.9, 234, 456, '0.8 km', '< 1 hour', '$50-100', true, false, ''),
  ('Carlos Rodriguez', 'Painting', 4.6, 67, 134, '4.2 km', '< 3 hours', '$70-140', true, false, ''),
  ('Fatima Al-Rashid', 'Home Repair', 4.8, 98, 189, '2.5 km', '< 1 hour', '$60-120', true, true, ''),
  ('David Kim', 'Landscaping', 4.7, 145, 267, '3.8 km', '< 2 hours', '$80-160', false, false, ''),
  ('Priya Sharma', 'Interior Design', 4.9, 78, 145, '5.1 km', '< 4 hours', '$150-300', true, false, '');

-- Insert sample available jobs
INSERT INTO public.available_jobs (title, category, description, budget, distance, time, client_name, client_member_since, urgent)
VALUES 
  ('Fix Leaking Kitchen Faucet', 'Plumbing', 'Kitchen faucet has been dripping for a week. Need someone to repair or replace it.', '$50-100', '1.2 km', '2 hours ago', 'John Smith', '2023', true),
  ('Install New Light Fixtures', 'Electrical', 'Need 3 ceiling light fixtures installed in living room and bedrooms.', '$150-250', '3.4 km', '5 hours ago', 'Emily Watson', '2024', false),
  ('AC Unit Not Cooling', 'HVAC', 'Central AC running but not cooling properly. May need refrigerant or repair.', '$100-300', '0.8 km', '1 hour ago', 'Michael Brown', '2022', true),
  ('Deep Clean 3BR Apartment', 'Cleaning', 'Moving out cleaning needed. 3 bedroom, 2 bathroom apartment.', '$200-350', '2.1 km', '3 hours ago', 'Sara Johnson', '2024', false),
  ('Paint Master Bedroom', 'Painting', 'Repaint master bedroom. Walls are already prepped. About 400 sq ft.', '$300-500', '4.5 km', '1 day ago', 'Robert Davis', '2023', false),
  ('Repair Broken Door Handle', 'Home Repair', 'Front door handle is loose and lock not working properly.', '$40-80', '1.7 km', '4 hours ago', 'Anna Martinez', '2024', true),
  ('Garden Maintenance', 'Landscaping', 'Monthly garden maintenance needed. Lawn mowing, hedge trimming, weeding.', '$100-150', '2.9 km', '6 hours ago', 'James Wilson', '2021', false),
  ('Living Room Redesign Consultation', 'Interior Design', 'Looking for advice on furniture arrangement and color scheme.', '$150-250', '5.3 km', '2 days ago', 'Christina Lee', '2023', false),
  ('Unclog Bathroom Drain', 'Plumbing', 'Shower drain completely clogged. Water not draining at all.', '$60-100', '0.5 km', '30 mins ago', 'Kevin Thomas', '2024', true),
  ('Install Smart Thermostat', 'HVAC', 'Replace old thermostat with Nest smart thermostat.', '$80-120', '3.2 km', '8 hours ago', 'Michelle Garcia', '2023', false);

-- Re-enable RLS
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.available_jobs ENABLE ROW LEVEL SECURITY;

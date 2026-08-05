-- CHECK constraints for enum-like columns. These are String columns in the
-- Prisma schema (not native Postgres enums) because several real values
-- contain spaces/ampersands ("Mandal Admin", "Roads & Transport", "Waiting
-- for Funds") that Postgres enum identifiers can't represent — application
-- code already validates these against the same option lists
-- (server/src/models/*.js), this just enforces it at the database layer too.
--
-- Safe to re-run: each constraint is dropped first if it already exists.

ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check
  CHECK (role IN ('Resident', 'Volunteer', 'Mandal Admin', 'Administrator'));

ALTER TABLE users DROP CONSTRAINT IF EXISTS users_preferred_language_check;
ALTER TABLE users ADD CONSTRAINT users_preferred_language_check
  CHECK (preferred_language IN ('en', 'te'));

ALTER TABLE problems DROP CONSTRAINT IF EXISTS problems_category_check;
ALTER TABLE problems ADD CONSTRAINT problems_category_check
  CHECK (category IN (
    'Roads & Transport', 'Water Supply', 'Electricity', 'Sanitation & Waste',
    'Drainage', 'Public Health', 'Education', 'Street Lighting'
  ));

ALTER TABLE problems DROP CONSTRAINT IF EXISTS problems_status_check;
ALTER TABLE problems ADD CONSTRAINT problems_status_check
  CHECK (status IN (
    'New', 'Verified', 'In Progress', 'Waiting for Funds', 'Completed', 'Rejected'
  ));

ALTER TABLE problems DROP CONSTRAINT IF EXISTS problems_priority_check;
ALTER TABLE problems ADD CONSTRAINT problems_priority_check
  CHECK (priority IN ('Critical', 'Medium', 'Low'));

ALTER TABLE status_history DROP CONSTRAINT IF EXISTS status_history_status_check;
ALTER TABLE status_history ADD CONSTRAINT status_history_status_check
  CHECK (status IN (
    'New', 'Verified', 'In Progress', 'Waiting for Funds', 'Completed', 'Rejected'
  ));

ALTER TABLE otp_codes DROP CONSTRAINT IF EXISTS otp_codes_purpose_check;
ALTER TABLE otp_codes ADD CONSTRAINT otp_codes_purpose_check
  CHECK (purpose IN ('register', 'login'));

-- support_count should never go negative (mirrors app-level increment-only usage).
ALTER TABLE problems DROP CONSTRAINT IF EXISTS problems_support_count_check;
ALTER TABLE problems ADD CONSTRAINT problems_support_count_check
  CHECK (support_count >= 0);

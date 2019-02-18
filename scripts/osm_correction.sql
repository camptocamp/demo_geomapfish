BEGIN;
UPDATE planet_osm_point SET name ='Association des Musulmans de Fribourg'  WHERE osm_id = 1351136417;
ALTER TABLE public.swiss_points ADD COLUMN datetime timestamp with time zone;
ALTER TABLE public.swiss_points ADD COLUMN date date;
UPDATE public.swiss_points SET datetime = timestamp;
UPDATE public.swiss_points SET date = timestamp;
COMMIT;

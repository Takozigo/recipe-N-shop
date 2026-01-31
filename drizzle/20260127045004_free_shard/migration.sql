ALTER TABLE "recipes" ALTER COLUMN "content" SET DATA TYPE jsonb USING "content"::jsonb;--> statement-breakpoint
ALTER TABLE "recipes" ALTER COLUMN "content" SET NOT NULL;
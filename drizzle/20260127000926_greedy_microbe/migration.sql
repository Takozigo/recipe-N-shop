DROP TABLE "recipe_steps";--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "steps" text NOT NULL;
ALTER TABLE "recipe_steps" DROP CONSTRAINT "recipe_steps_section_id_recipe_sections_id_fk";
--> statement-breakpoint
ALTER TABLE "recipe_ingredients" ALTER COLUMN "amount" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "recipe_steps" ALTER COLUMN "section_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "recipe_steps" ADD CONSTRAINT "recipe_steps_section_id_recipe_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."recipe_sections"("id") ON DELETE set null ON UPDATE no action;
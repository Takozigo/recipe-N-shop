ALTER TABLE "ingredients" DROP CONSTRAINT "ingredients_name_unique";--> statement-breakpoint
ALTER TABLE "ingredients" DROP CONSTRAINT "ingredients_nom_unique";--> statement-breakpoint
ALTER TABLE "ingredients" DROP CONSTRAINT "ingredients_namae_unique";--> statement-breakpoint
ALTER TABLE "ingredients" ADD COLUMN "value" text NOT NULL;--> statement-breakpoint
ALTER TABLE "ingredients" ADD COLUMN "lang" text NOT NULL;--> statement-breakpoint
ALTER TABLE "ingredients" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "ingredients" DROP COLUMN "nom";--> statement-breakpoint
ALTER TABLE "ingredients" DROP COLUMN "namae";--> statement-breakpoint
ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_value_lang_unique" UNIQUE("value","lang");
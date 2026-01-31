import 'dotenv/config'

import { eq } from 'drizzle-orm'
import { db } from '..'
import { recipes } from '../schema'

const steps = [
  {
    id: '0dd1c8ca-2f9c-4f97-8cfd-bc4c244a7ff0',
    section: null,
    position: 1,
    title: null,
    description:
      "Faire mariner le poulet avec la sauce soja dans un sac plastique ou bol pendant 15 min.\nRaper l'ail et couper le gingembre en tranche.\nFaire sauter les aromatiques (Ail, oignions, gingembre) dans une poêle avec l'huile, une fois qu'ils deviennent translucent, ajouter le poulet mariné et saisissez bien le tout.\najouter la marinade. l'eau, le laurier et le poivre. Laisser mijoter le tout, une quizaine de minute le temps  que le poulet devient tendre et que la saveur s'incopore bien.\nAjouter le vinaigre. Laisse le vinaigre cuire avant de mélanger. \nLaisser mijoter encore une vingtaine de minute pour laisse la sauce s'épaissir (Vous pouvez ajouter le sucre à ce moment là, si vous souhaitez un Adobo un peu plus sucré)\nFaire cuire les oeufs.",
    image_url: null,
    recipe_id: '0e040515-a7c1-4c7e-b2eb-333cbf82e07e',
  },
  {
    id: '12d4e36a-4318-4309-87e2-fabdd102ad94',
    section: null,
    position: 1,
    title: null,
    description:
      "Égoutter complètement l'eau du maïs en conserve.\nFaites chauffer une poêle et ajoutez la mayonnaise et l'ail.\nLorsque l'huile sort, ajoutez le maïs égoutté et faites revenir le tout.\nMettre le fromage par-dessus, couvrir et laisser cuire jusqu'à ce que le fromage soit complètement fondu.",
    image_url: null,
    recipe_id: '8ebce4b7-128b-47fa-8a84-5ac70df213ba',
  },
  {
    id: 'b02aebe7-e40f-42d7-abbc-d1175af59810',
    section: null,
    position: 1,
    title: null,
    description:
      'Couper le radis (daikon) en fine lamelle (environ 3mm, pas trop fine).\nMélanger le Daikon avec tous les autres ingrédients et laisser reposer au moins 20 minutes afin que toutes les saveurs se mélangent.',
    image_url: null,
    recipe_id: '4ba9b015-e35c-4a21-a752-6c40625fcf70',
  },
  {
    id: '26a7a311-b723-4012-af17-02dd811d2259',
    section: null,
    position: 1,
    title: null,
    description:
      "Enlever l'excès de gras, les couper en morceaux (en bouchées) et les tremper dans l'eau pendant 20 min (trempage optionnel).\nFaire bouillir de l'eau dans une casserole, ajouter les morceaux de poulet égouttés et faites-les blanchir pendant 5 minutes.\nCoupé ou déchiré le Konjac en morceau et le faire bouillir également quelques minutes.\nRincer le poulet blanchit sous l'eau froide pour enlever les impuretés.\nCouper les pommes de terre en quatre et couper les carottes en morceau de la même taille environ.\nMettre l'huile de sésame dans une poêle large, et faite y revenir le poulet et le Konjac.\nCouper les pommes de terre en quatre et couper les carottes en morceau de la même taille environ.\nAjouter les pommes de terre et les carottes, mélanger délicatement en faisant revenir le tout, puis ajouter la sauce Yangnyeom pendant 2 minutes.\nAjouter l'eau, couvrir et laisser frémir pendant 15 min à feu fort.\nPour finir, ajouter les oignons verts couper diagonalement puis laisser cuire encore 5 min. Déguster.\n Sauce Yangnyeom\n Mélanger ensemble les ingrédients pour la sauce.\n",
    image_url: null,
    recipe_id: '548aed71-dbc5-4081-97a3-83690864fb19',
  },
]

async function main() {
  for (const step of steps) {
    const test = await db
      .update(recipes)
      .set({ steps: step.description })
      .where(eq(recipes.id, step.recipe_id))

    console.log({ test })
  }

  console.log('✅ Import done')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

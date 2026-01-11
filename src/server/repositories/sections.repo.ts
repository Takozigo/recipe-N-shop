// import { recipeSections } from '../db/schema'
// import type { DbClient } from '../db'

// const sectionTitles = Array.from(
//   new Set(
//     [
//       ...ingredients.map((i) => i.section),
//       ...steps.map((s) => s.section),
//     ].filter((e): e is string => typeof e === 'string'),
//   ),
// )
// const createdSections = await inserSection(tx, insertedId, sectionTitles)

// if (createdSections) {
//   createdSections.forEach((sec) => {
//     ingredients.forEach((i) => {
//       if (i.section === sec.title) {
//         i.section === sec.id
//       }
//     })
//     steps.forEach((i) => {
//       if (i.section === sec.title) {
//         i.section === sec.id
//       }
//     })
//   })
// }

// export async function inserSection(
//   tx: DbClient,
//   recipeId: string,
//   sectionTitles: Array<string>,
// ) {
//   const sections = sectionTitles.map((sTitle, index) => ({
//     recipeId: recipeId,
//     title: sTitle,
//     position: index,
//   }))
//   if (sectionTitles.length > 0) {
//     return await tx
//       .insert(recipeSections)
//       .values(sections)
//       .returning({ title: recipeSections.title, id: recipeSections.id })
//   }
// }

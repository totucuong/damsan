// // Example usage of the image analysis functions

// import { analyzeImageFromStorage, analyzeImageFile, type ImageAnalysis } from './image'

// /**
//  * Example: Analyze an image stored in Supabase storage
//  */
// export async function exampleAnalyzeStoredImage() {
//   try {
//     const userId = 'your-user-id'
//     const imagePath = 'user-id/image.jpg' // Path in Supabase storage
    
//     const analysis: ImageAnalysis = await analyzeImageFromStorage(imagePath, userId)
    
//     console.log('Image Analysis Results:')
//     console.log('Description:', analysis.description)
//     console.log('Objects found:', analysis.objects)
//     console.log('Text content:', analysis.text)
//     console.log('Dominant colors:', analysis.colors)
//     console.log('Mood:', analysis.mood)
//     console.log('Tags:', analysis.tags)
//     console.log('People count:', analysis.people_count)
//     console.log('Location type:', analysis.location_type)
    
//     return analysis
//   } catch (error) {
//     console.error('Failed to analyze stored image:', error)
//     throw error
//   }
// }

// /**
//  * Example: Analyze an image file directly
//  */
// export async function exampleAnalyzeImageFile(file: File) {
//   try {
//     const analysis: ImageAnalysis = await analyzeImageFile(file)
    
//     console.log('Image Analysis Results:')
//     console.log('Description:', analysis.description)
//     console.log('Objects found:', analysis.objects)
//     console.log('Text content:', analysis.text)
//     console.log('Dominant colors:', analysis.colors)
//     console.log('Mood:', analysis.mood)
//     console.log('Tags:', analysis.tags)
//     console.log('People count:', analysis.people_count)
//     console.log('Location type:', analysis.location_type)
    
//     return analysis
//   } catch (error) {
//     console.error('Failed to analyze image file:', error)
//     throw error
//   }
// }

// /**
//  * Example: Process uploaded image and save analysis to database
//  */
// export async function processUploadedImage(file: File, userId: string) {
//   try {
//     // First analyze the image
//     const analysis = await analyzeImageFile(file)
    
//     // Here you could save the analysis to your database
//     // For example, using Prisma:
//     // await prisma.imageAnalysis.create({
//     //   data: {
//     //     userId,
//     //     fileName: file.name,
//     //     description: analysis.description,
//     //     objects: analysis.objects,
//     //     text: analysis.text,
//     //     colors: analysis.colors,
//     //     mood: analysis.mood,
//     //     tags: analysis.tags,
//     //     peopleCount: analysis.people_count,
//     //     locationType: analysis.location_type,
//     //   }
//     // })
    
//     return {
//       file,
//       analysis,
//       message: 'Image processed and analyzed successfully'
//     }
//   } catch (error) {
//     console.error('Failed to process uploaded image:', error)
//     throw error
//   }
// }

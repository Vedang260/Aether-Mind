import { HfInference, InferenceClient } from "@huggingface/inference";
import { InternalServerErrorException } from "@nestjs/common";
import axios from "axios";
import OpenAI from 'openai';

export class AIService {
    // hugging face api key
    private huggingFaceApiKey = process.env.HUGGING_FACE_API_KEY;
    
    async generateSummary(content: string): Promise<string>{
        try{
            const response = await axios.post(
                "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
                { inputs: content },
                { headers: { Authorization: `Bearer ${this.huggingFaceApiKey}` } }
              );
              
              return response.data[0]?.summary_text || "Summary unavailable";
        }catch(error){
            console.error('Error in summary generation: ', error.message);
            throw new InternalServerErrorException('Error in summary generation');
        }
    }

    async generateTags(content: string): Promise<string[]> {
        try {
          // Using a model specifically trained for keyword/tag extraction
          const response = await axios.post(
            "https://api-inference.huggingface.co/models/yanekyuk/bert-keyword-extractor",
            { inputs: content },
            { headers: { Authorization: `Bearer ${this.huggingFaceApiKey}` } }
          );
    
          // Process the response to extract tags
          if (response.data && Array.isArray(response.data)) {
            // The model returns an array of objects with "word" and "score" properties
            const keywords = response.data
              .filter(item => item.score > 0.5) // Filter by confidence score
              .map(item => item.word.toLowerCase()) // Convert to lowercase
              .filter((word, index, self) => self.indexOf(word) === index); // Remove duplicates
    
            return keywords.slice(0, 5); // Return top 5 tags
          }
          return [];
        } catch (error) {
          console.error('Error in tag generation: ', error.message);
          throw new InternalServerErrorException('Error in tag generation');
        }
    }    

    // async getImageCaption(imageUrl: string){
    //     const response = await this.openai.chat.completions.create({
    //         model: "gpt-4-vision-preview",
    //         messages: [{
    //           role: "user",
    //           content: [
    //             { type: "text", text: "Analyze & Describe this image in detail." },
    //             { type: "image_url", image_url: { url: imageUrl } },
    //           ],
    //         }],
    //     });
    //     console.log(response);
    // }

    // async generateArticleFromImage(image_url: string): Promise<{ title: string; description: string; content: string }> {
    //     try {
    //         const caption = await this.getImageCaption(image_url);
    //         console.log("Image Caption: ", caption);
    //         // Define the advanced prompt
    //         const advancedPrompt = `
    //             As a professional content writer with expertise in visual analysis, create a comprehensive article based on this caption: ${caption}.
    //             **Requirements:**
    //             1. Title: Catchy, 5-8 words, SEO-friendly
    //             2. Description: 1-2 sentences, 150-160 characters
    //             3. Article Content:
    //                - Introduction (100 words): Context setting
    //                - Main Body (500-600 words):
    //                  * 3-5 subsections with H2 headings
    //                  * Include relevant facts, statistics, history
    //                  * Add cultural/social context if applicable
    //                - Conclusion (100 words): Summary + thought-provoking ending
    //             **Writing Style:**
    //             - Professional yet accessible
    //             - Engaging narrative flow
    //             - Accurate technical details
    //             - Include analogies for complex concepts
    //             - Add "Did You Know?" boxes for interesting facts
    //             **Special Instructions:**
    //             - If the image contains people, analyze their activities/emotions
    //             - For products/artifacts, include origin/history/usage
    //             - For nature scenes, discuss geographical/ecological aspects
    //             - For abstract images, provide creative interpretations
    //             **Output Format:**
    //             - Return as a JSON object with properties: title, description, content (object with introduction, mainBody array, conclusion)
    //         `;
    
    //         const response = await axios.post(
    //             'https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct', // You can also try 'tiiuae/falcon-7b-instruct'
    //             { inputs: advancedPrompt },
    //             {
    //               headers: {
    //                 Authorization: `Bearer ${this.huggingFaceApiKey}`,
    //               },
    //             },
    //         );
    //         //console.log("Response: ", response);

    //         const rawOutput = response.data?.[0]?.generated_text;
    //         if (!rawOutput) {
    //             throw new Error('No article generated');
    //         }

    //         // Parse JSON if model outputs structured JSON
    //         let articleData: any;
    //         try {
    //             articleData = JSON.parse(rawOutput);
    //         } catch {
    //             throw new Error('Output is not valid JSON. Try using a more structured model like Falcon or format the response manually.');
    //         }

    //         // Build markdown content
    //         let fullContent = `## Introduction\n${articleData.content.introduction}\n\n`;
    //         articleData.content.mainBody.forEach((section: { heading: string; text: string }) => {
    //             fullContent += `## ${section.heading}\n${section.text}\n\n`;
    //         });
    //         fullContent += `## Conclusion\n${articleData.content.conclusion}`;

    //         return {
    //             title: articleData.title,
    //             description: articleData.metaDescription,
    //             content: fullContent,
    //         };
    
    //     } catch (error) {
    //         console.error('Error in generating the article from image: ', error.message);
    //         throw new Error('Failed to generate content for the article');
    //     }
    // }
}
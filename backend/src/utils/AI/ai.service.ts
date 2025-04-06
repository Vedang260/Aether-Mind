import { HfInference, InferenceClient } from "@huggingface/inference";
import { InternalServerErrorException } from "@nestjs/common";
import axios from "axios";
import { Model, Input } from "clarifai-nodejs";

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

    async getImageCaption(data): Promise<string>{
      try{
        const response = await fetch(
          "https://router.huggingface.co/hf-inference/models/Salesforce/blip-image-captioning-large",
          {
            headers: {
            Authorization: `Bearer ${this.huggingFaceApiKey}`,
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(data),
            }
        );
        const result = await response.json();
        return result[0].generated_text;
      }catch(error){
          console.error('Error in image caption generation: ', error.message);
          throw new InternalServerErrorException('Error in image caption generation');
      }
    }  
    
    async generateArticleFromImage(image_url: string){
      try{
        const caption = await this.getImageCaption({ inputs: image_url });
        const prompt = `
          You are a professional content writer. 
          
          Required JSON structure:
          {
              "title": "A catchy, SEO-friendly title",
              "description": "1-2 line summary",
              "introduction": "Hook the reader with context (50-100 words)",
              "content": "3-5 paragraphs (300-500 words) covering key aspects",
              "conclusion": "Summarize key takeaways (50-100 words)",
              "quote": "A relevant inspiring quote",
              "did_you_know": "A surprising fact"
          }
          
          Make the article:
          - Well-researched & factual  
          - Engaging & easy to read  
          - Increase reader's knowledge  
          - Long enough (500+ words total)  

          Generate a detailed, engaging, and informative article in JSON format based on this image description: "${caption}".
          And plz do not include the given prompt in the response.
        `;
          const response = await fetch(
            "https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.3",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${this.huggingFaceApiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ inputs: prompt })
            }
          );
          const result = await response.json();
          const jsonMatch = result[0].generated_text.match(/```json([\s\S]*?)```/);
          if (jsonMatch) {
            const jsonString = jsonMatch[1].trim(); // Get the JSON inside the code block
            
            // Step 2: Parse the JSON
            try {
                const articleData = JSON.parse(jsonString);
                
                // Step 3: Access the extracted fields
                console.log("Title:", articleData.title);
                console.log("Description:", articleData.description);
                console.log("Introduction:", articleData.introduction);
                console.log("Content:", articleData.content.join("\n")); // Join paragraphs if array
                console.log("Conclusion:", articleData.conclusion);
                console.log("Quote:", articleData.quote);
                console.log("Did You Know:", articleData.did_you_know);
                
                // Full structured JSON output
                console.log("Full Article Data:", articleData);
                return articleData;
            } catch (error) {
                console.error("❌ Failed to parse JSON:", error);
            }
        } else {
            console.error("No JSON found in the response.");
        }
      }catch(error){
        console.error("Error in generating Article: ", error.message);
        throw new InternalServerErrorException("Failed to generate article using AI");
      }
    }
}
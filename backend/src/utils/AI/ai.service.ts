import { HfInference, InferenceClient } from "@huggingface/inference";
import { InternalServerErrorException } from "@nestjs/common";
import axios from "axios";
import { Model, Input } from "clarifai-nodejs";

export class AIService {
    // hugging face api key
    private huggingFaceApiKey = process.env.HUGGING_FACE_API_KEY;
    private groqApiKey = process.env.GROQAI_API_KEY;
    private readonly GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
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
          const response = await fetch(
            "https://api-inference.huggingface.co/models/fabiochiu/t5-base-tag-generation",
            {
              headers: {
                Authorization: `Bearer ${this.huggingFaceApiKey}`,
                "Content-Type": "application/json",
              },
              method: "POST",
              body: JSON.stringify({ inputs: content }),
            }
          );
          const result = await response.json();
          console.log(result);
          const generatedText = result?.[0]?.generated_text || '';

          // Split by comma and trim spaces
          const tags = generatedText
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0);

          return tags;
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
            Generate a detailed, engaging, and informative article in pure JSON format (do not include any explanations or the prompt). Use the following structure:
            {
              "title": "A catchy, SEO-friendly title",
              "description": "1-2 line summary",
              "introduction": "Hook the reader with context (50-100 words)",
              "content": "In Detail the main-content with (300-500 words)",
              "conclusion": "Summarize key takeaways (50-100 words)",
              "quote": "A relevant inspiring quote",
              "did_you_know": "A surprising fact"
            }

            Write at least 500 words in total.
            Base the article on this image description: "${caption}".
            Output only the JSON structure.
            Do not include this prompt in the response. I just want the response
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
          const generatedText = result[0].generated_text;
          // Find last opening '{' and last closing '}'
          const startIndex = generatedText.lastIndexOf('{');
          const endIndex = generatedText.lastIndexOf('}') + 1;

          if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
            const jsonString = generatedText.substring(startIndex, endIndex);

            try {
              const jsonObject = JSON.parse(jsonString);
              console.log("✅ Final JSON Object:", jsonObject);
              return jsonObject;
            } catch (parseError) {
              console.error("❌ Error parsing JSON:", parseError.message);
              throw new InternalServerErrorException("Failed to parse generated JSON");
            }
          } else {
            console.error("❌ Could not find JSON block in the response");
            throw new InternalServerErrorException("No JSON found in generated text");
          }
    }catch(error){
        console.error("Error in generating Article: ", error.message);
        throw new InternalServerErrorException("Failed to generate article using AI");
      }
    }
}
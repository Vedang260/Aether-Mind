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
          return []
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
          console.log(generatedText);
          const prompt2 = `
          You will receive a block of text that contains an AI-generated article in JSON-like format, but mixed with prompts and explanations.

          Your task is to extract and clean this into a valid JSON with the following structure:

          {
            "title": "...",
            "description": "...",
            "introduction": "...",
            "content": "...",
            "conclusion": "...",
            "quote": "...",
            "did_you_know": "..."
          }

          Please only return the valid JSON, without any explanations or extra textAnd .

          Here is the input:
          ${generatedText}
              `;
          const extractedResponse = await axios.post(
            this.GROQ_API_URL,
            {
              model: 'llama3-8b-8192', // or llama3-8b-8192
              messages: [
                { role: 'system', content: 'You are a helpful assistant that extracts valid JSON from text. Do not include any given prompt in the output.' },
                { role: 'user', content: prompt2 }
              ],
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.groqApiKey}`,
              },
            },
          );
          const messageContent = extractedResponse.data.choices[0].message.content;
          console.log(messageContent);
      }catch(error){
        console.error("Error in generating Article: ", error.message);
        throw new InternalServerErrorException("Failed to generate article using AI");
      }
    }
}
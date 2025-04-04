import { InternalServerErrorException } from "@nestjs/common";
import axios from "axios";

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

    async analyzeImage(image_url: string){
        try{
            const response = await axios.post(
                'https://api.clarifai.com/v2/models/general-image-recognition/versions/aa7f35c01e0642fda5cf400f543e7c40/outputs',
                {
                    inputs: [{ data: { image: { url: image_url }}}],
                },
                {
                    headers: {
                        Authorization: `Key ${process.env.CLARIFAI_API_KEY}`
                    },
                },
            );
            return response.data;
        }catch(error){
            console.error('Error in analyzing an image: ', error.message);
            throw new InternalServerErrorException('Failed to analyze your image');
        }
    }

    async generateArticleFromImage(image_url: string){
        try{
            const analysis = await this.analyzeImage(image_url);
            const concepts = analysis.outputs[0].data.concepts;
            
            const prompt = `Generate an innovative & structured article in JSON format with title, 1 liner description, and 
                            detailed content such that users can find it useful, engaging and can improve their knowledge & understanding 
                            based on: ${concepts.map(c => c.name).join(', ')}.`;
            
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                model: 'gpt-3.5-turbo',
                response_format: { type: "json_object" }, // Important for JSON output
                messages: [
                    { role: "system", content: "You are a helpful assistant that generates Innovative & Kowledge Based Articles containing title, description & content & outputs in JSON." },
                    { role: "user", content: prompt }
                ]
                },
                { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } }
            );

            return {
                ...JSON.parse(response.data.choices[0].message.content),
                concepts: concepts.map(c => ({ name: c.name, confidence: c.value })),
            };
        }catch(error){
            console.error('Error in generating the article from analyzed content of the image: ', error.message);
            throw new InternalServerErrorException('Failed to generate content for the article');
        }
    }
}
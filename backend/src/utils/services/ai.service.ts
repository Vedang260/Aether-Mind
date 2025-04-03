import { InternalServerErrorException } from "@nestjs/common";
import axios from "axios";

export class AIService {
    // hugging face api key
    private huggingFaceApiKey = process.env.HUGGING_FACE_API_KEY;

    async generateSumaary(content: string): Promise<string>{
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
}
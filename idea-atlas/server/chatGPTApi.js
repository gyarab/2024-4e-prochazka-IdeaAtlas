// Only server side code
// User is not able to see this code
import OpenAI from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateIdeas(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating ideas:', error);
    throw error;
  }
}
import { Request, Response } from 'express';
import { Groq } from 'groq-sdk';
import { Course } from '../models/Course.js';

// 💡 REMOVED global client initialization to prevent ESM hoisting race conditions

export const handleChatbotQuery = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body;
    
    console.log("\n==================================================");
    console.log("📨 [New Request] Chatbot payload detected");
    console.log(`💬 User Message: "${message}"`);
    
    // 💡 Initialize right here on request so process.env is 100% loaded!
    console.log("🔑 Checking Environment Key Status:", process.env.GROQ_API_KEY ? "FOUND! 🎉" : "STILL UNDEFINED ❌");
    
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY || ''
    });

    if (!message) {
      console.log("⚠️ [Validation Error] Request blocked: message field was empty");
      res.status(400).json({ message: 'Message content is required' });
      return;
    }

    // 1. Retrieval Phase
    console.log("🔍 [Database RAG] Searching MongoDB courses matching keywords...");
    const matchedCourses = await Course.find({
      $or: [
        { title: { $regex: message, $options: 'i' } },
        { description: { $regex: message, $options: 'i' } },
        { tags: { $regex: message, $options: 'i' } }
      ]
    }).limit(3);

    console.log(`📊 [Database RAG] Query finished. Found ${matchedCourses.length} course matches in DB.`);

    let courseContext = "No specific matching courses found right now.";
    if (matchedCourses.length > 0) {
      courseContext = matchedCourses.map(c => 
        `- Course Title: ${c.title}\n  Category: ${c.category}\n  Price: $${c.price}\n  Description: ${c.description}\n`
      ).join('\n');
    }

    // 2. Generation Phase with GPT-OSS-120B
    console.log("🧠 [LLM Inference] Transmitting to Groq edge cloud...");
    console.log("⚙️  [LLM Inference] Target Model: 'openai/gpt-oss-120b'");

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are the brilliant, helpful AI Assistant for Waypoint Academy. Your task is to guide students to finding the perfect courses. 
          
          Here is the current real-time course data matching their inquiry from our database:
          ---
          ${courseContext}
          ---
          
          Guidelines:
          - Use the provided course data to tailor your recommendations.
          - If relevant courses exist, highlight how they solve the user's learning goal.
          - If no matching courses are available, gently recommend general topics.
          - Keep your response friendly, clear, concise, and professional.`
        },
        {
          role: 'user',
          content: message
        }
      ],
      model: 'openai/gpt-oss-120b',
      temperature: 0.5,
      max_tokens: 1024
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content || "I am processing your request, please try again.";
    console.log("✅ [LLM Inference] Response streamed back successfully from Groq.");

    // 3. Return JSON structure
    console.log("📦 [HTTP Response] Sending fully structured JSON response payload back to client.");
    console.log("==================================================\n");

    res.status(200).json({
      reply: aiResponse,
      recommendedCourses: matchedCourses.map(c => ({
        id: c.id,
        title: c.title,
        price: c.price,
        imageUrl: c.imageUrl
      }))
    });
  } catch (error: any) {
    console.error("❌ [Engine Critical Exception] Controller execution collapsed:");
    console.error(`💥 Error Message: ${error.message}`);
    console.log("==================================================\n");
    
    res.status(500).json({ message: 'AI Engine internal issue', error: error.message });
  }
};
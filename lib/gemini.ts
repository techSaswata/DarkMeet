import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Initialize Gemini models
const textModel = genAI.getGenerativeModel({ model: 'gemini-pro' })
const visionModel = genAI.getGenerativeModel({ model: 'gemini-pro-vision' })

export interface AIResponse {
  success: boolean
  data?: any
  error?: string
}

export class GeminiAI {
  // Meeting Summary Generation
  static async generateMeetingSummary(transcript: string, participants: string[]): Promise<AIResponse> {
    try {
      const prompt = `
        Analyze this meeting transcript and generate a comprehensive summary:
        
        Participants: ${participants.join(', ')}
        
        Transcript:
        ${transcript}
        
        Please provide:
        1. Executive Summary (2-3 sentences)
        2. Key Discussion Points (bullet points)
        3. Action Items (with responsible parties if mentioned)
        4. Decisions Made
        5. Next Steps
        
        Format the response as JSON with these sections.
      `

      const result = await textModel.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      return {
        success: true,
        data: JSON.parse(text)
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate summary'
      }
    }
  }

  // Real-time Q&A Assistant
  static async answerQuestion(question: string, context: string): Promise<AIResponse> {
    try {
      const prompt = `
        Based on the following meeting context, answer this question:
        
        Context: ${context}
        Question: ${question}
        
        Provide a helpful, accurate answer based only on the information available in the context.
        If the information isn't available, say so politely.
      `

      const result = await textModel.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      return {
        success: true,
        data: { answer: text }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to answer question'
      }
    }
  }

  // Language Translation
  static async translateText(text: string, targetLanguage: string): Promise<AIResponse> {
    try {
      const prompt = `
        Translate the following text to ${targetLanguage}:
        
        "${text}"
        
        Provide only the translation, maintaining the original tone and context.
      `

      const result = await textModel.generateContent(prompt)
      const response = await result.response
      const translation = response.text()

      return {
        success: true,
        data: { translation }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to translate text'
      }
    }
  }

  // Sentiment Analysis
  static async analyzeSentiment(text: string): Promise<AIResponse> {
    try {
      const prompt = `
        Analyze the sentiment and engagement level of this text:
        
        "${text}"
        
        Provide a JSON response with:
        - sentiment: "positive", "negative", or "neutral"
        - confidence: number between 0 and 1
        - engagement: "high", "medium", or "low"
        - emotions: array of detected emotions
      `

      const result = await textModel.generateContent(prompt)
      const response = await result.response
      const text_response = response.text()

      return {
        success: true,
        data: JSON.parse(text_response)
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to analyze sentiment'
      }
    }
  }

  // Whiteboard Analysis
  static async analyzeWhiteboard(imageData: string): Promise<AIResponse> {
    try {
      const prompt = `
        Analyze this whiteboard image and:
        1. Describe what you see
        2. Convert any diagrams or flowcharts to structured text
        3. Extract any text content
        4. Suggest improvements or professional alternatives
        
        Provide the response as JSON with these sections.
      `

      const imagePart = {
        inlineData: {
          data: imageData,
          mimeType: 'image/png'
        }
      }

      const result = await visionModel.generateContent([prompt, imagePart])
      const response = await result.response
      const text = response.text()

      return {
        success: true,
        data: JSON.parse(text)
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to analyze whiteboard'
      }
    }
  }

  // Voice Command Processing
  static async processVoiceCommand(command: string): Promise<AIResponse> {
    try {
      const prompt = `
        Parse this voice command and determine the intended action:
        
        Command: "${command}"
        
        Available actions:
        - mute_all, unmute_all
        - start_recording, stop_recording
        - enable_chat, disable_chat
        - start_screen_share, stop_screen_share
        - create_breakout_rooms
        - end_meeting
        - take_screenshot
        - generate_summary
        
        Respond with JSON:
        {
          "action": "action_name",
          "confidence": 0.0-1.0,
          "parameters": {}
        }
      `

      const result = await textModel.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      return {
        success: true,
        data: JSON.parse(text)
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process voice command'
      }
    }
  }

  // Generate Action Items
  static async extractActionItems(transcript: string): Promise<AIResponse> {
    try {
      const prompt = `
        Extract action items from this meeting transcript:
        
        ${transcript}
        
        For each action item, provide:
        - task: clear description
        - assignee: person responsible (if mentioned)
        - deadline: if mentioned
        - priority: high/medium/low
        
        Return as JSON array of action items.
      `

      const result = await textModel.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      return {
        success: true,
        data: JSON.parse(text)
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to extract action items'
      }
    }
  }

  // Key Moments Detection
  static async detectKeyMoments(transcript: string, timestamps: number[]): Promise<AIResponse> {
    try {
      const prompt = `
        Identify key moments in this meeting transcript:
        
        ${transcript}
        
        Look for:
        - Important decisions
        - Breakthrough moments
        - Conflicts or disagreements
        - Presentations or demos
        - Q&A sessions
        
        Return JSON array with:
        - timestamp: approximate time
        - type: moment type
        - description: what happened
        - importance: 1-10 scale
      `

      const result = await textModel.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      return {
        success: true,
        data: JSON.parse(text)
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to detect key moments'
      }
    }
  }

  // Generate Meeting Insights
  static async generateInsights(meetingData: {
    transcript: string
    participants: string[]
    duration: number
    chatMessages: string[]
  }): Promise<AIResponse> {
    try {
      const prompt = `
        Analyze this meeting data and provide insights:
        
        Duration: ${meetingData.duration} minutes
        Participants: ${meetingData.participants.join(', ')}
        
        Transcript: ${meetingData.transcript}
        
        Chat Messages: ${meetingData.chatMessages.join('\n')}
        
        Provide insights on:
        1. Meeting effectiveness (1-10 score)
        2. Participation levels by person
        3. Communication patterns
        4. Suggested improvements
        5. Follow-up recommendations
        
        Return as structured JSON.
      `

      const result = await textModel.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      return {
        success: true,
        data: JSON.parse(text)
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate insights'
      }
    }
  }
} 
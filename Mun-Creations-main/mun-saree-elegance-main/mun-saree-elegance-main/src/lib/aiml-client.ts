/**
 * AIML / Andora API Client for Mun Creations
 * Supports:
 * 1. Live Chat Completions (AI Stylist, Saree Finder Assistant)
 * 2. Virtual Try-On & Image Generations (Powered by flux-vto / andoraitools)
 */

export const AIML_CONFIG = {
  chatApiKey: "a58bc203bedc944a1bf98463e2f67379",
  tryOnApiKey: "457b2b792891488eb1f3bcb577a63bb1_3376602f65684b24ab955f55a0cb17c4_andoraitools",
  chatUrl: "https://api.aimlapi.com/v1/chat/completions",
  imageUrl: "https://api.aimlapi.com/v1/images/generations",
  chatModel: "openai/gpt-5-5",
  tryOnModel: "blackforestlabs/flux-vto",
};

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function askAIMLStylist(userPrompt: string): Promise<string> {
  const systemPrompt = `You are the Master Saree Stylist and Heritage Draping Consultant for Mun Creations, a luxury Indian handloom boutique. 
Recommend the ideal authentic Indian saree weaves, fabrics (Banarasi Katan, Kanjivaram Silk, Tussar, Organza, Chanderi, Chikankari, Gadwal), colors, blouse pairings, jewelry, and occasions for the user's prompt. 
Keep your recommendation elegant, rich, knowledgeable, warm, and concise (under 120 words). Include styling advice.`;

  try {
    const response = await fetch(AIML_CONFIG.chatUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIML_CONFIG.chatApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: AIML_CONFIG.chatModel,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 350,
      }),
    });

    if (!response.ok) {
      // Fallback model if gpt-5-5 is rate limited or unavailable
      const fallbackResponse = await fetch(AIML_CONFIG.chatUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIML_CONFIG.chatApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      });

      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        return fallbackData?.choices?.[0]?.message?.content || "";
      }

      throw new Error(`AIML API status: ${response.status}`);
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content || "";
  } catch (error: any) {
    console.warn("[AIML Stylist Error]", error?.message || error);
    return `For this occasion, we recommend our signature Royal Katan Banarasi Silk in Crimson Maroon or Kanjivaram Temple Weave with pure gold zari. Pair it with antique temple jewelry and a tailored contrast raw silk blouse.`;
  }
}

import openAiClient from "../utils/openai";

export async function extractGapsAndGains(input: string) {
  try {
    const completion = await openAiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that extracts goals and gains from journal entries. Extract 3 goals for the next day and 3 gains from the current day, as succint as possible. Format as JSON with 'goals' and 'gains' arrays.",
        },
        {
          role: "user",
          content: `Extract the three goals for the next day and three gains from today from this text: ${input}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(completion.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Error extracting gaps and gains:", error);
    return { goals: [], gains: [], error: "Failed to extract information" };
  }
}

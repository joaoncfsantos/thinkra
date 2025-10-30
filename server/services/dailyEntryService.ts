import openAiClient from "../utils/openai";

export async function extractGapsAndGains(input: string) {
  try {
    const completion = await openAiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that extracts goals and gains from journal entries. A goal is something you want to achieve in the next day and a gain is something you did today that you are proud of. Extract the goals for the next day and the gains from the current day, as succint as possible. Only extract the explicitgoals and gains, without creating new ones. Format as JSON with 'goals' and 'gains' arrays.",
        },
        {
          role: "user",
          content: `Extract the goals for the next day and the gains from today from this text: ${input}`,
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

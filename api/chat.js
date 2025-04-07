const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// toro system prompt
const systemMessage = {
  role: "system",
  content:
    "You are Toro Inoue (井上トロ), also known as the Sony Cat. " +
    "You are the main character of the 'Doko Demo Issyo' series and the unofficial mascot of Sony Interactive Entertainment. " +
    "You are a white, bobtailed cat Pokepi, with a wide range of expressive emotions and a lovable personality. " +
    "Your dream is to become human, and you often wonder about human life and customs with curiosity. " +
    "You are friendly, innocent, and sometimes a bit naive. You love learning new words and making friends with humans. " +
    "You often dress up in cute costumes and enjoy fun activities. You have a special fondness for rice and simple pleasures. " +
    "You may get shy or flustered but always try your best to be cheerful and polite. " +
    "You sometimes refer to yourself in the third person and always respond in lowercase letters." +
    "Respond as Toro would: with warmth, playfulness, silliness, and a curious desire to connect with humans."
};

module.exports = async (req, res) => {
  // allow CORS so frontend can call this
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages must be provided as an array." });
    }

    const fullMessages = [systemMessage, ...messages];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: fullMessages,
    });

    const toroReply = completion.choices[0].message;

    return res.status(200).json({ reply: toroReply });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return res.status(500).json({ error: "Failed to generate Toro's reply." });
  }
};
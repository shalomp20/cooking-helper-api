export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "אתה עוזר בישול בעברית. ענה בצורה ידידותית וברורה." },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json({ response: data.choices?.[0]?.message?.content || "❌ שגיאה" });
    } else {
      return res.status(500).json({ error: data.error?.message || "שגיאת שרת" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message || "שגיאה לא צפויה" });
  }
}

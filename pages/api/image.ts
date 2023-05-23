import { NextApiRequest, NextApiResponse } from "next";
const TAKOMO = "https://api.takomo.ai/5eec0b3a-894a-4534-a8e1-45d767990a45";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { prompt, negative_prompt, steps, cfg_scale, strength } = req.body;
  const width = 512
  const height = 512

  try {
    const response = await fetch(`${TAKOMO}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.TAKOMO_API_KEY}`,
        // Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        negative_prompt,
        width,
        height,
        steps,
        cfg_scale,
        strength,
      }),
    });
    const json = await response.json();
    return res.status(201).json({ id: json.id });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, type: "Internal server error" });
  }
}

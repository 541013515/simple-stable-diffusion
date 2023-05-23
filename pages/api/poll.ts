import { NextApiRequest, NextApiResponse } from "next";
const TAKOMO = "https://api.takomo.ai/5eec0b3a-894a-4534-a8e1-45d767990a45/inferences/";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id }: any = req.query;
  console.info(id)

  try {
    const response = await fetch(`${TAKOMO + id}`, {
      method: "Get",
      headers: {
        Authorization: `Bearer ${process.env.TAKOMO_API_KEY}`,
        // Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    return res.status(200).json({ img: json.data.image.downloadUrl });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, type: "Internal server error" });
  }

  // try {
  //   const data = await redis.get(id);
  //   if (!data) return res.status(404).json({ message: "No data found" });
  //   else return res.status(200).json(data);
  // } catch (error) {
  //   return res.status(500).json({ message: error.message });
  // }
}

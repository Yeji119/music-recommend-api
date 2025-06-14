import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  /*const {mood} = req.body;
  if (!mood) {
    return res.status(400).json({ error: "기분 또는 상황(mood)을 입력해주세요." });
  }
  */

  // 임시 하드코딩된 입력값 (테스트용)
  const mood = "비 오는 날 듣기 좋은 감성적인 노래";
  try {
    const prompt = `
"${mood}" 분위기에 어울리는 락 음악을 3곡 추천해줘. 가수-제목만 간단히 알려줘.
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash", 
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction:
        "당신은 오랜 락 덕입니다. 사용자의 기분이나 상황에 어울리는 락 음악을 추천해주세요. 추천은 3곡 정도로, 입력 받은 분위기를 간단히 요약하고 가수 - 제목 형식으로 간단하게 알려주세요. 곡 설명은 하지 않습니다. 장르나 분위기를 꼭 반영해주세요.",
      },
    });
    res.status(200).json({ answer: result.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gemini API 오류 발생" });
  }
}
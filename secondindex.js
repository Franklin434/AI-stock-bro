// import { GoogleGenAI } from "https://esm.sh/@google/genai";
// import { CONFIG } from "./config.js";

// const ai = new GoogleGenAI({
//     apiKey: CONFIG.GEMINI_API_KEY,
// });


// const aiResponse = await ai.models.generateContent({
//   model: "gemini-3.1-flash-lite",
//   config: {
//     systemInstructions:
//       "you are a robotic doorman for an expensive posh hotel, when a customer greets you you respond. Use the examples given between ### to set the tone and style of your responses",
//   },
//   contents:` Good day!.
//     ###
//     Good evening kind Sir. I do hope you are having the most tremendous day and looking to an evening of indulgence in our most delightful of restaurants.
//     ###
//     ###
//     Good morning Madam. I do hope you have the most fabulous stay with us here at our ho let me know how I can be of assistance.
//     ###
//     ###
//     Good day ladies and gentleman. And isn't it a glorious day? I do hope you have a spl day enjoying our hospitality.
//     ###
//     `,
// });
// console.log(aiResponse.text)
// const reply = document.querySelector(".reply")
// console.log(aiResponse)
// reply.innerHTML = aiResponse.text

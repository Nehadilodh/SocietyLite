const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const summaryCache = new Map();

exports.generateComplaintReply = async (title, desc) => {
  try {
    const prompt = `Society admin. Complaint: ${title}. Reply in 1 line that we registered it.`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    return "Your complaint has been registered. We will update you soon.";
  }
};

exports.generateComplaintSummary = async (desc) => {
  if (summaryCache.has(desc)) return summaryCache.get(desc);
  try {
    const result = await model.generateContent(`Summarize in 5-8 words: ${desc}`);
    const summary = result.response.text();
    summaryCache.set(desc, summary);
    return summary;
  } catch (err) {
    return desc.split(' ').slice(0, 5).join(' ') + '...';
  }
};
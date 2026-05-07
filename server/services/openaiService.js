const OpenAI = require('openai');

const getOpenAI = () => {
    // OpenAI Initialization
    return new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
}

// Function to generate an initial automated AI reply to the user's complaint
const generateComplaintReply = async (title, description) => {
    try {
        const openai = getOpenAI();
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful society management assistant. A resident has raised a complaint. Provide a short, polite initial reply confirming receipt." },
                { role: "user", content: `Title: ${title}\nDescription: ${description}` }
            ]
        });
        return response.choices[0].message.content || "Your complaint has been registered. Our team will contact you soon.";
    } catch (error) {
        console.error("OpenAI Error (Reply):", error);
        return "Your complaint has been registered. Our team will contact you soon."; // Fallback
    }
};

// Function to generate a 2-line summary of the complaint for easy admin viewing
const generateComplaintSummary = async (description) => {
    try {
        const openai = getOpenAI();
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are an assistant that summarizes society complaints in exactly 2 short lines." },
                { role: "user", content: `Complaint description: ${description}` }
            ]
        });
        return response.choices[0].message.content || description.substring(0, 50) + "...";
    } catch (error) {
        console.error("OpenAI Error (Summary):", error);
        return description.substring(0, 50) + "..."; // Fallback
    }
};

module.exports = {
    generateComplaintReply,
    generateComplaintSummary
};

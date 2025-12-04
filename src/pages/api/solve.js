import OpenAI from 'openai';

export const POST = async ({ request }) => {
    const apiKey = import.meta.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY;

    if (!apiKey) {
        return new Response(JSON.stringify({ error: 'Missing API Key' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const openai = new OpenAI({
        apiKey: apiKey,
        baseURL: "https://api.groq.com/openai/v1"
    });

    try {
        const { text } = await request.json();

        if (!text) {
            return new Response(JSON.stringify({ error: 'Text is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a specialized test solver. Your task is to analyze the user's input. If the input is a multiple-choice question (or looks like a test question), you must reply ONLY with the correct option letter (e.g., 'a', 'b', 'c', 'd') or the short answer if no options are provided but it's clearly a question with a specific answer. If the input is NOT a test question (e.g., it's just a sentence to translate, a greeting, or random text), you must reply with exactly 'NO_TEST'. Do not provide explanations. Just the answer or 'NO_TEST'."
                },
                { role: "user", content: text }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0,
        });

        const answer = completion.choices[0].message.content.trim();

        return new Response(JSON.stringify({ answer }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error calling OpenAI/Groq:', error);
        return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

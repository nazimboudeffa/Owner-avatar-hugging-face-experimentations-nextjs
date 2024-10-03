import { NextRequest, NextResponse } from "next/server"
import { Client } from "@gradio/client"


type ChatPrompt = {
    apiKey: string
    model: string
    userInput: string
}

async function handleInference(apiKey: string, model: string, userInput: string, type = "chat") {
    

    try {
        let result, data;
        
        // Choix de l'API selon le type de requête (chat ou génération de texte)
        if (type === "chat") {
            const client = await Client.connect(model, { hf_token: apiKey as `hf_${string}`});
            result = await client.predict("/chat", { 		
                    message: userInput, 		
                    max_new_tokens: 100, 		
                    temperature: 0.1, 		
                    top_p: 0.05, 		
                    top_k: 1, 		
                    repetition_penalty: 1, 
            });
            data = result.data;
        }

        console.log(data);

        return NextResponse.json({
            success: true, message: data,
            status: 200
        });
    } catch (error) {
        console.error(`Error during inference for model ${model}:`, error);

        return NextResponse.json(
            { success: false, message: "Internal application error" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { apiKey, model, userInput } = body as ChatPrompt;
    
    if (!apiKey || !userInput) {
        return NextResponse.json(
            { success: false, message: "Missing apiKey or userInput" },
            { status: 400 }
        );
    }

    let type = "chat"; // Par défaut, on part sur la génération de texte

    switch (model) {
        case "huggingface-projects/llama-3.2-3B-Instruct":
            type = "chat";  // Ce modèle utilise textGeneration
            console.log("Llama");
            break;
        default:
            return NextResponse.json(
                { success: false, message: "Invalid model selection" },
                { status: 400 }
            );
    }

    // Appel à la fonction générique
    return handleInference(apiKey, model, userInput, type);
}
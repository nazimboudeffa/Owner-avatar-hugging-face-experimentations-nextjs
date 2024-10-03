import Header from "@/components/header"
import Chat from "@/components/Chat"
import NavBar from "@/components/NavBar"

export default async function ChatWithAI() {

    return (
        <>
        <NavBar />
        <main className="flex flex-col items-center justify-center w-full h-full">
            <Header
                heading="Chat with AI"
                subheading="Hugging Face Experimentations"
            />
            <Chat />
        </main>
        </>
    )
}
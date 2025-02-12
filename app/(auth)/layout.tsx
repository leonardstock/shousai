import TopBar from "@/components/layout/(auth)/TopBar";
import { Sidebar } from "@/components/Sidebar";

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <TopBar />
            <div className='flex'>
                <Sidebar />
                <div
                    className='flex-1 rounded-lg border overflow-y-scroll'
                    style={{ height: "calc(100vh - 90px)" }}>
                    {children}
                </div>
            </div>
        </>
    );
}

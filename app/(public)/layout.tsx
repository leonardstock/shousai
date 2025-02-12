import Footer from "@/components/layout/Footer";
import TopBar from "@/components/layout/(public)/TopBar";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className='min-h-screen flex flex-col'>
            <TopBar />
            {children}
            <Footer />
        </div>
    );
}

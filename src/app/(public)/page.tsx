import { HeroSection } from "@/components/landing/HeroSection"
import { ServicesSection } from "@/components/landing/ServicesSection"
import { RoomSection } from "@/components/landing/RoomsSection"
import { ContactSection } from "@/components/landing/ContactSection"
import { Navbar } from "@/components/landing/Navbar"
import Footer from "@/components/landing/Footer"
import ChatWidget from "@/components/virtual-assistant/ChatWidget"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ServicesSection />
        <RoomSection />
        <ContactSection />
        <ChatWidget />
      </main>
      <Footer />
    </div>
  )
}

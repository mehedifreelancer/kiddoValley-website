import Image from "next/image";
import HeroSection from "./components/shared/HeroSection";
import AllProductSection from "./components/shared/AllProductSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AllProductSection />
    </>
  );
}

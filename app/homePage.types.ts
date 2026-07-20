// app/HomePage.types.ts
import { HeroSlider } from "@/modules/hero-slider/heroSlider.types";

export interface HomePageData {
  heroSliders: HeroSlider[];
  // you can extend this with other sections later
}

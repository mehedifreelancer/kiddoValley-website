// components/common/Footer.tsx
import Link from "next/link";
import { BookOpen, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-cream-200 dark:bg-dark-surface border-t border-stone-300 dark:border-dark-border">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen size={24} className="text-logo-red" />
              <span className="text-lg font-light text-stone-800 dark:text-stone-200">
                Kiddo<span className="font-medium text-logo-red">Valley</span>
              </span>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">
              Where stories come alive and imaginations soar. 
              Discover the magic of reading with our curated collection.
            </p>
            <div className="flex space-x-4">
              {['#D51B26', '#1C08A9', '#8859F8', '#36A43D'].map((color, i) => (
                <div 
                  key={i} 
                  className="w-6 h-6 rounded-full" 
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-medium text-stone-800 dark:text-stone-200 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['About Us', 'Contact', 'FAQs', 'Shipping'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-stone-600 dark:text-stone-400 hover:text-logo-purple dark:hover:text-logo-purple transition-colors">
                    {item}
        -           </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-medium text-stone-800 dark:text-stone-200 mb-4">Categories</h3>
            <ul className="space-y-2">
              {['Picture Books', 'Chapter Books', 'Educational', 'Activity'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-stone-600 dark:text-stone-400 hover:text-logo-green dark:hover:text-logo-green transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-stone-300 dark:border-dark-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-stone-500 dark:text-stone-500">
            © 2024 KiddoValley. All rights reserved.
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-500 flex items-center">
            Made with <Heart size={12} className="mx-1 text-logo-red" /> for young readers
          </p>
        </div>
      </div>
    </footer>
  );
}
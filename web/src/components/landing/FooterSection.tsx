import { motion } from 'framer-motion'
import { Language } from '../../i18n/translations'
import { Twitter, Github, Disc } from 'lucide-react'

interface FooterSectionProps {
  language: Language
}

export default function FooterSection({ language }: FooterSectionProps) {
  return (
    <footer className="border-t border-[#222] bg-[#050505] py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white tracking-tighter">DarkMoon</h2>
            <div className="flex gap-4">
              <a href="#" className="text-[#666] hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#666] hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#666] hover:text-white transition-colors">
                <Disc className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div className="text-[#444] text-sm">
            &copy; {new Date().getFullYear()} DarkMoon. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

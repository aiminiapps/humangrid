'use client'

import Image from 'next/image'
import Link from 'next/link'
import { RiTwitterXFill, RiBook2Line, RiExternalLinkLine } from 'react-icons/ri'

export default function LandingFooter() {
    const FOOTER_LINKS = [
        { label: 'Documentation', icon: RiBook2Line, href: '#' },
        { label: 'X (Twitter)', icon: RiTwitterXFill, href: '#' },
        { label: 'BSCScan', icon: RiExternalLinkLine, href: '#' },
    ]

    return (
        <footer className="bg-[#FAFAFC] pt-16 pb-8 px-4 sm:px-6 overflow-hidden relative">
            
            {/* Subtle bottom ambient glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[#FF7100]/[0.03] blur-[80px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Top Section */}
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 mb-12">
                    
                    {/* Brand & Description */}
                    <div className="flex flex-col items-center md:items-start gap-4">
                        {/* Assuming your logo.png is updated for a light theme. If it's a white logo, you can add `filter invert` to the className */}
                        <Image src="/logo.png" alt="HumanGrid AI" width={140} height={32} className="opacity-90" />
                    </div>

                    {/* Navigation Links */}
                    <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
                        {FOOTER_LINKS.map((link) => (
                            <Link 
                                key={link.label} 
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-slate-500 hover:text-[#FF7100] transition-colors duration-300 group"
                            >
                                <link.icon className="text-lg text-slate-400 group-hover:text-[#FF7100] transition-colors duration-300" />
                                <span className="text-sm font-bold tracking-tight">{link.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Bottom Section (Copyright & Status) */}
                <div className="border-t border-slate-200/60 pt-8 flex items-center justify-center gap-4">
                    <div className="text-slate-400 text-[11px]">
                        © 2026 HumanGrid AI. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    )
}
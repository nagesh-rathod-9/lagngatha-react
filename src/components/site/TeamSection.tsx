'use client'

import { Camera, Instagram, Phone, Video, PenLine, Share2 } from 'lucide-react'
import { Reveal } from './Reveal'

interface TeamMember {
    id: string
    photo: string
    name: string
    role: string
    instagramHandle: string
    phone: string
}

interface TeamData {
    eyebrow: string
    headingLine1: string
    headingLine2: string
    description: string
    quote: string
    tagline: string
    members: TeamMember[]
}

// Default Data
const defaultTeamData: TeamData = {
    eyebrow: 'Meet The Team',
    headingLine1: 'The Hands Behind',
    headingLine2: 'Every Frame',
    description: 'A small, dedicated crew of photographers, filmmakers and editors — each one obsessed with getting your story right.',
    quote: "We don't just take photos, we create memories.",
    tagline: 'Different minds. One vision. Your story.',
    members: [
        { id: 'm1', photo: 'team1.png', name: 'Kiran Hiwale', role: 'Lead Photographer & Founder', instagramHandle: '@kiran_hiwale_photography', phone: '9673111013' },
        { id: 'm2', photo: 'team2.png', name: 'Mangesh Kurne', role: 'Cinematographer', instagramHandle: '@mk_photography096', phone: ' 9604626431' },
        { id: 'm3', photo: 'team3.png', name: 'Walmik Temkar ', role: 'Traditional photography', instagramHandle: '@vt_films_and_photography', phone: '' },
        { id: 'm4', photo: 'team4.png', name: 'Kishor Phimpale', role: 'Traditional VideoGrapher', instagramHandle: '@kishorphotography_kp', phone: '' },
        { id: 'm5', photo: 'team5.png', name: 'Shubham Jadhav', role: 'Traditional Photographer', instagramHandle: '@shubham_jadhav_patil_007', phone: '' },
        { id: 'm6', photo: 'team6.png', name: 'Vaibhav Wagh', role: 'Traditional VideoGrapher', instagramHandle: '@waghvaibhav__', phone: '' },
    ],
}

// Helper to pick the right icon
function roleIcon(role: string) {
    const r = role.toLowerCase()
    if (r.includes('cinema') || r.includes('film') || r.includes('video')) return Video
    if (r.includes('edit')) return PenLine
    if (r.includes('drone') || r.includes('second')) return Share2
    return Camera
}

export default function TeamSection({ data = defaultTeamData }: { data?: TeamData }) {
    return (
        <section id="team" className="section-alt relative overflow-hidden py-20 md:py-28">
            <div className="container-x relative z-10">

                {/* --- HEADER --- */}
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-8 mb-12 lg:mb-16">

                    <div className="max-w-2xl">
                        <Reveal>
                            <span className="eyebrow">{data.eyebrow}</span>
                        </Reveal>

                        <Reveal>
                            {/* 
                  FIXED CONSISTENCY HERE:
                  1. Removed 'script' class.
                  2. Added 'font-serif' (Playfair) for both lines to match the Hero.
                  3. Used 'text-gold' and generic heading sizing to match your CSS tokens.
              */}
                            <h2 className="font-serif text-4xl sm:text-4xl lg:text-5xl leading-[1.1] font-bold text-[var(--ink)]">
                                {data.headingLine1}
                                <br />
                                <span className="text-[var(--maroon)] block">
                                    {data.headingLine2}
                                </span>
                            </h2>
                        </Reveal>

                        <Reveal>
                            <p className="text-[var(--ink-soft)] mt-4 ms-2 text-base sm:text-lg max-w-lg leading-relaxed">
                                {data.description}
                            </p>
                        </Reveal>
                    </div>

                    <Reveal>
                        <div className="max-w-[280px] lg:mb-2">
                            <p className="text-[var(--ink-soft)] text-[15px] leading-relaxed">
                                <span className="text-[var(--maroon)] font-serif text-2xl mr-1">&ldquo;</span>
                                {data.quote.split(/(memories\.?)$/i).map((chunk, i) =>
                                    /memories\.?$/i.test(chunk) ? (
                                        <span key={i} className="text-[var(--maroon)] text-xl font-bold font-serif">
                                            {chunk}
                                        </span>
                                    ) : (
                                        <span key={i}>{chunk}</span>
                                    )
                                )}
                                <span className="text-[var(--maroon)] font-serif text-2xl ml-1">&rdquo;</span>
                            </p>
                        </div>
                    </Reveal>
                </div>

                {/* --- DIVIDER --- */}
                <Reveal>
                    <div className="flex items-center gap-4 mb-12">
                        <div className="flex-1 h-px bg-[var(--hairline)]" />
                        <span className="w-10 h-10 rounded-full border border-[var(--hairline)] flex items-center justify-center text-[var(--ink-soft)]">
                            <Camera className="w-5 h-5" />
                        </span>
                        <div className="flex-1 h-px bg-[var(--hairline)]" />
                    </div>
                </Reveal>

                {/* --- TEAM GRID --- */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {data.members.map((member, idx) => {
                        const Icon = roleIcon(member.role)
                        return (
                            <Reveal key={member.id}>
                                <div className="flex flex-col items-center group">

                                    {/* Card Holder */}
                                    <div className="w-full relative mb-4 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-[var(--cream  )] aspect-[4/5]">

                                        {/* Role Badge */}
                                        <div className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-[var(--maroon)] flex items-center justify-center text-white shadow-sm">
                                            <Icon className="w-4 h-4" />
                                        </div>

                                        {/* Image / Placeholder */}
                                        <div className="absolute inset-0 w-full h-full">
                                            {member.photo ? (
                                                <img
                                                    src={member.photo}
                                                    alt={member.name}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[var(--ink-soft)]/40 text-xs font-medium tracking-wide">
                                                    Photo Coming Soon
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Info: Fixed font consistency here too */}
                                    <h3 className="font-serif text-lg font-bold text-[var(--ink)] text-center">{member.name}</h3>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--maroon   )] mt-0.5 text-center">
                                        {member.role}
                                    </p>

                                    {/* Socials */}
                                    {(member.instagramHandle || member.phone) && (
                                        <div className="flex items-center justify-center gap-2 mt-2.5">
                                            {member.instagramHandle && (
                                                <a
                                                    href={`https://instagram.com/${member.instagramHandle.replace('@', '')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-8 h-8 rounded-full border border-[var(--hairline)] flex items-center justify-center transition-all duration-200 text-[var(--ink-soft)] hover:text-[var(--maroon)] hover:border-[var(--maroon)] hover:bg-[var(--maroon-tint)]"
                                                >
                                                    <Instagram className="w-3.5 h-3.5" />
                                                </a>
                                            )}
                                            {member.phone && (
                                                <a
                                                    href={`tel:${member.phone}`}
                                                    className="w-8 h-8 rounded-full border border-[var(--hairline)] flex items-center justify-center transition-all duration-200 text-[var(--ink-soft)] hover:text-[var(--maroon)] hover:border-[var(--maroon)] hover:bg-[var(--maroon-tint)]"
                                                >
                                                    <Phone className="w-3.5 h-3.5" />
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </Reveal>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
import React from 'react';
import { motion } from 'framer-motion';

export default function HomePage() {
    return (
        <div className="min-h-screen font-sans bg-white">
            {/* Header */}
            <header className="flex justify-between items-center px-20 py-6 shadow">
                <div className="flex items-center gap-4">
                    <img src="/infinity-1.png" alt="Infinity Logo" className="h-16 w-16 object-cover" />
                    <span className="text-4xl font-bold tracking-widest font-[Kode_Mono]">INFINITY</span>
                </div>
                <div className="text-xl text-gray-500 font-[Kode_Mono]">
                    Site language: <span className="text-black">English</span>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative mt-12 px-20 flex gap-16 items-center">
                <img src="/infinitylogo2-2.png" alt="Mascot" className="w-[500px] h-[500px] object-cover" />
                <div className="max-w-xl text-2xl tracking-wider leading-relaxed font-[Be_Vietnam_Pro]">
                    <p className="font-bold">Chances are <span className="text-[#00a1a1]">INFINITE</span> with languages.</p>
                    <p className="font-bold mt-4">To INFINITY and BEYOND<br />Today, get started.</p>
                    <div className="mt-8 space-y-6">
                        <button className="w-[600px] h-[126px] bg-[url\(/3d-button-2.png\)] bg-cover text-5xl font-bold text-black font-[Be_Vietnam_Pro]">Get started</button>
                        <button className="w-[600px] h-[126px] bg-[url\(/3d-button-3.png\)] bg-cover text-2xl font-bold text-black font-[Be_Vietnam_Pro]">Let's go, I already have an account</button>
                    </div>
                </div>
            </section>

            {/* Language Switcher */}
            <div className="flex items-center justify-center gap-24 mt-32">
                <div className="flex items-center gap-4">
                    <img src="/image-4.png" alt="US Flag" className="w-[60px] h-[60px]" />
                    <span className="text-2xl font-semibold">English (U.S)</span>
                </div>
                <div className="flex items-center gap-4">
                    <img src="/image-5.png" alt="VN Flag" className="w-[60px] h-[60px]" />
                    <span className="text-2xl font-semibold">Tiếng Việt</span>
                </div>
            </div>

            {/* Feature Sections */}
            <Feature title="free > fun > depends on you" desc="Learning with Infinity is fun, and research shows that it works! With quick, bite-sized lessons, you'll earn points and unlock new levels all while gaining real-world communication skills." />
            <Feature title="Backed by Researches" desc="We use a lot combination of research-backed teaching methods and delightful content to create courses that effectively teach reading, writing, listening and speaking skills!" reverse />
            <Feature title="Stay motivated" desc="We make it easy to form a habit of language learning with game-like features, fun challenges, and reminders from our 'friendly' mascot, Infie the cat." />
            <Feature title="Trusted by the Pros" desc="We offer a real world needs based teaching program to create courses that effectively improves reading, writing, listening and speaking skills for aviation pros" reverse />

            {/* Banners */}
            <div className="bg-[#c5c5c5] h-[907px] flex items-center justify-center text-8xl">Banner</div>
            <div className="bg-[#999999] h-[700px] flex items-center justify-center text-8xl">Banner</div>

            {/* Infie Sections */}
            <InfieFeature title="Infie's english test" desc="Our convenient, fast, and affordable English test will accurately test their English where and when they're at their best." button="Let's go!" />
            <InfieFeature title="Infie's spells" desc="From language to literacy! With fun phonics lessons and delightful stories, Infie's spells helps kids ages 3–8 learn to read and write — 100% free." button="Learn more" />

            {/* CTA */}
            <section className="text-center mt-32">
                <h2 className="text-[80px] font-bold leading-tight">Learn a language <br />with Infinity</h2>
                <button className="w-[600px] h-[126px] mt-8 bg-[url\(/3d-button.png\)] bg-cover text-5xl font-bold text-black font-[Be_Vietnam_Pro]">GET STARTED</button>
                <img src="/infinitylogo2-2.png" alt="Mascot" className="w-[400px] h-[400px] mx-auto mt-10 object-cover" />
            </section>

            {/* Footer */}
            <footer className="bg-[#a6a6a6] h-[1185px] mt-32 text-center relative">
                <div className="text-[50px] font-bold pt-[450px]">Footer</div>
                <div className="text-[50px] font-bold absolute bottom-[100px] left-1/2 -translate-x-1/2">Contacts và hoặc ngôn ngữ khác</div>
            </footer>
        </div>
    );
}

function Feature({ title, desc, reverse = false }: { title: string; desc: string; reverse?: boolean }) {
    return (
        <section className={`flex ${reverse ? 'flex-row-reverse' : 'flex-row'} items-center justify-between px-[295px] mt-[100px]`}>
            <div className="max-w-[771px]">
                <h2 className="text-[40px] font-bold">{title}</h2>
                <p className="mt-6 text-2xl font-bold text-[#00000066]">{desc}</p>
            </div>
            <div className="w-[350px] h-[350px] bg-[#d9d9d9] flex items-center justify-center text-4xl font-semibold">Media</div>
        </section>
    );
}

function InfieFeature({ title, desc, button }: { title: string; desc: string; button: string }) {
    return (
        <section className="flex items-center justify-between px-[295px] mt-[100px]">
            <div className="max-w-[763px]">
                <h2 className="text-[50px] font-bold">{title}</h2>
                <p className="mt-6 text-3xl font-bold text-[#00000066]">{desc}</p>
                <button className="w-[600px] h-[126px] mt-8 bg-cover text-5xl font-bold text-black font-[Be_Vietnam_Pro] bg-[url\(/3d-button-4.png\)]">{button}</button>
            </div>
            <div className="w-[350px] h-[350px] bg-[#d9d9d9] flex items-center justify-center text-4xl font-semibold">Media</div>
        </section>
    );
}

// IndexClient.tsx
import React from "react";
import Hero from "../components/layout-components/Hero";
import LanguageSwitcher from "../components/layout-components/LanguageSwitcher";
import Feature from "../components/layout-components/Feature";
import InfieFeature from "../components/layout-components/InfieFeature";
import CTA from "../components/layout-components/CTA";
import Footer from "../components/layout-components/Footer";
import HeroBanners from "@/components/layout-components/HeroBanners";
import Breadcrumbs from "@/components/Breadcrumbs";
import Header from "@/components/layout-components/Header";

export default function IndexClient() {
    return (
        <main className="bg-white dark:bg-gray-900">
            <Header/>
            <Breadcrumbs />
            <Hero />
            <div className=" hidden md:block">
                <LanguageSwitcher />
            </div>
            <Feature />
            <HeroBanners />
            <InfieFeature />
            <CTA />
            <Footer />
        </main>
    );
}

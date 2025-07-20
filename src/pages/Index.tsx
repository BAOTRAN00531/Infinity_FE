// Index.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout-components/Header";
import Hero from "../components/layout-components/Hero";
import LanguageSwitcher from "../components/layout-components/LanguageSwitcher";
import Feature from "../components/layout-components/Feature";
import InfieFeature from "../components/layout-components/InfieFeature";
import CTA from "../components/layout-components/CTA";
import Footer from "../components/layout-components/Footer";
import HeroBanners from "@/components/layout-components/HeroBanners";

export default function Index() {
    const navigate = useNavigate();
    const token = localStorage.getItem("access_token");

    const handleLogin = () => navigate("/login");
    const handleRegister = () => navigate("/register");
    return (
        <main className="bg-white dark:bg-gray-900">
            <Header/>
            <Hero />
            <div className=" hidden md:block">
                <LanguageSwitcher />
            </div>
            <Feature />
            {/*Banner*/}
            <HeroBanners />
            <InfieFeature />
            <CTA />
            <Footer />
        </main>
    );
}

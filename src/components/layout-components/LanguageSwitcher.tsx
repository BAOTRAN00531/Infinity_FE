import React, { useState, useEffect } from "react";
import { Separator } from "../reusable-components/separator";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";

// ép kiểu các icon
const ArrowLeftIcon = SlArrowLeft as React.FC<React.SVGProps<SVGSVGElement>>;
const ArrowRightIcon = SlArrowRight as React.FC<React.SVGProps<SVGSVGElement>>;

export default function LanguageSwitcher() {
    const [language, setLanguage] = useState<"en" | "vi">("en");

    useEffect(() => {
        const savedLang = localStorage.getItem("language");
        if (savedLang === "en" || savedLang === "vi") {
            setLanguage(savedLang);
        }
    }, []);

    const handleChange = (lang: "en" | "vi") => {
        setLanguage(lang);
        localStorage.setItem("language", lang);
    };

    return (
        <section className="w-full py-6 bg-white dark:bg-gray-800">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row flex-wrap items-center justify-between px-4 gap-4 text-center md:text-left">
                {/* Mũi tên trái */}
                <ArrowLeftIcon className="w-8 h-8 cursor-pointer" />

                <div className="flex gap-6 md:gap-12 justify-center text-black dark:text-white">
                    {/* English */}
                    <div
                        onClick={() => handleChange("en")}
                        className={`flex items-center gap-2 cursor-pointer ${
                            language === "en" ? "font-bold underline" : ""
                        }`}
                    >
                        <img src="/image-4.png" alt="EN" className="w-10 h-10" />
                        <span>English (U.S)</span>
                    </div>

                    {/* Vietnamese */}
                    <div
                        onClick={() => handleChange("vi")}
                        className={`flex items-center gap-2 cursor-pointer ${
                            language === "vi" ? "font-bold underline" : ""
                        }`}
                    >
                        <img src="/image-5.png" alt="VN" className="w-10 h-10" />
                        <span>Tiếng Việt</span>
                    </div>
                </div>

                {/* Mũi tên phải */}
                <ArrowRightIcon className="w-8 h-8 cursor-pointer" />
            </div>

            <Separator className="mt-6" />
        </section>
    );
}

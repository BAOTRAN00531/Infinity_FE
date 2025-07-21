import React, { useEffect, useState } from "react";
import { Separator } from "../reusable-components/separator";
import { motion } from "framer-motion";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import axios from "axios";

const FacebookIcon = FaFacebook as React.FC<React.SVGProps<SVGSVGElement>>;
const TwitterIcon = FaTwitter as React.FC<React.SVGProps<SVGSVGElement>>;
const InstagramIcon = FaInstagram as React.FC<React.SVGProps<SVGSVGElement>>;
const LinkedinIcon = FaLinkedin as React.FC<React.SVGProps<SVGSVGElement>>;

const LANGUAGE_CODES = [
  "العربية","বাংলা","Čeština","Deutsch","Ελληνικά","English","Español","Français","हिंदी","Magyar","Bahasa Indonesia","Italiano","日本語","한국어","Nederlands","Polski","Português","Română","Русский","svenska","தமிழ்","తెలుగు","ภาษาไทย","Tagalog","Türkçe","Українською","Tiếng Việt","中文"
];

export default function Footer() {
  const [courses, setCourses] = useState<string[]>([]);
  const [modules, setModules] = useState<string[]>([]);
  const [languages, setLanguages] = useState<any[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  useEffect(() => {
    // Fetch courses
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get("http://localhost:8080/api/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(res.data.map((c: any) => c.name));
      } catch {}
    };
    // Fetch modules
    const fetchModules = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get("http://localhost:8080/api/modules", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setModules(res.data.map((m: any) => m.name));
      } catch {}
    };
    // Fetch languages
    const fetchLanguages = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get("http://localhost:8080/api/language-templates", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Lọc chỉ các ngôn ngữ trong LANGUAGE_CODES
        setLanguages(res.data.filter((l: any) => LANGUAGE_CODES.includes(l.name)));
      } catch {}
    };
    fetchCourses();
    fetchModules();
    fetchLanguages();
    // Lấy ngôn ngữ đã chọn từ localStorage
    setSelectedLanguage(localStorage.getItem("selectedLanguage"));
  }, []);

  const handleLanguageSelect = (lang: string) => {
    setSelectedLanguage(lang);
    localStorage.setItem("selectedLanguage", lang);
  };

  return (
    <motion.footer
      className="w-full bg-gray-200 dark:bg-gray-800 py-12 px-4 text-sm text-gray-700 dark:text-gray-300"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-6 gap-8">
        {/* Logo & Giới thiệu */}
        <div>
          <p className="text-lg font-semibold">Infinity App</p>
          <Separator className="my-4" />
          <p>
            Cung cấp giải pháp phần mềm hiện đại, sáng tạo và dễ sử dụng cho doanh nghiệp và cá nhân.
          </p>
        </div>
        {/* Liên kết nhanh */}
        <div>
          <p className="text-lg font-semibold">Liên kết nhanh</p>
          <Separator className="my-4" />
          <ul className="space-y-2">
            <li><a href="/" className="hover:underline">Trang chủ</a></li>
            <li><a href="/about" className="hover:underline">Về chúng tôi</a></li>
            <li><a href="/services" className="hover:underline">Dịch vụ</a></li>
            <li><a href="/contact" className="hover:underline">Liên hệ</a></li>
          </ul>
        </div>
        {/* Khóa học */}
        <div>
          <p className="text-lg font-semibold">Tên khóa học</p>
          <Separator className="my-4" />
          <ul className="space-y-2 max-h-32 overflow-y-auto">
            {courses.map((name, idx) => (
              <li key={idx}>{name}</li>
            ))}
          </ul>
        </div>
        {/* Module */}
        <div>
          <p className="text-lg font-semibold">Module name</p>
          <Separator className="my-4" />
          <ul className="space-y-2 max-h-32 overflow-y-auto">
            {modules.map((name, idx) => (
              <li key={idx}>{name}</li>
            ))}
          </ul>
        </div>
        {/* Liên hệ */}
        <div>
          <p className="text-lg font-semibold">Liên hệ</p>
          <Separator className="my-4" />
          <p>Email: <a href="mailto:contact@infinity.com" className="hover:underline">contact@infinity.com</a></p>
          <p>Hotline: <a href="tel:+84123456789" className="hover:underline">+84 123 456 789</a></p>
          <p>Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</p>
        </div>
        {/* Mạng xã hội */}
        <div>
          <p className="text-lg font-semibold">Mạng xã hội</p>
          <Separator className="my-4" />
          <div className="flex gap-4">
            <a href="#" aria-label="Facebook">
              <FacebookIcon className="w-5 h-5 hover:text-blue-600" />
            </a>
            <a href="#" aria-label="Twitter">
              <TwitterIcon className="w-5 h-5 hover:text-sky-500" />
            </a>
            <a href="#" aria-label="Instagram">
              <InstagramIcon className="w-5 h-5 hover:text-pink-500" />
            </a>
            <a href="#" aria-label="LinkedIn">
              <LinkedinIcon className="w-5 h-5 hover:text-blue-700" />
            </a>
          </div>
        </div>
      </div>
      <Separator className="my-6" />
      {/* Ngôn ngữ hiển thị */}
      <div className="max-w-6xl mx-auto mt-6">
        <h1 className="text-lg font-bold mb-2">Ngôn ngữ hiển thị</h1>
        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => (
            <button
              key={lang.id || lang.name}
              className={`px-3 py-1 rounded-full border text-xs transition-all ${selectedLanguage === lang.name ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-blue-100'}`}
              onClick={() => handleLanguageSelect(lang.name)}
            >
              {lang.name}
            </button>
          ))}
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
        © {new Date().getFullYear()} Infinity App. All rights reserved.
      </div>
    </motion.footer>
  );
}

import React, { forwardRef } from "react";
import { Separator } from "../reusable-components/separator";
import { motion } from "framer-motion";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";


const FacebookIcon = FaFacebook as React.FC<React.SVGProps<SVGSVGElement>>;
const TwitterIcon = FaTwitter as React.FC<React.SVGProps<SVGSVGElement>>;
const InstagramIcon = FaInstagram as React.FC<React.SVGProps<SVGSVGElement>>;
const LinkedinIcon = FaLinkedin as React.FC<React.SVGProps<SVGSVGElement>>;



// ✅ Footer component
export default function Footer() {
    return (
        <motion.footer
            className="w-full bg-gray-200 dark:bg-gray-800 py-12 px-4 text-sm text-gray-700 dark:text-gray-300"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
        >
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
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

            <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
                © {new Date().getFullYear()} Infinity App. All rights reserved.
            </div>
        </motion.footer>
    );
}

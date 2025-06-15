import React, {useRef, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence  } from 'framer-motion';

import { FaEnvelope, FaSpinner } from "../components/lib/icon";

const VerifyOtp: React.FC = () => {
    const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resendCountdown, setResendCountdown] = useState<number>(0);

    const email = localStorage.getItem('forgotEmail') || '';
    const navigate = useNavigate();
    const inputsRef = useRef<HTMLInputElement[]>([]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (resendCountdown > 0) {
            timer = setInterval(() => {
                setResendCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [resendCountdown]);

    const handleChange = (value: string, index: number) => {
        if (!/^\d?$/.test(value)) return;
        const updated = [...otp];
        updated[index] = value;
        setOtp(updated);
        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace') {
            if (otp[index]) {
                const updated = [...otp];
                updated[index] = '';
                setOtp(updated);
            } else if (index > 0) {
                inputsRef.current[index - 1]?.focus();
            }
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const data = e.clipboardData.getData('text').trim().replace(/\D/g, '');
        if (!data) return;
        const newOtp = data.split('').slice(0, 6);
        const filled = [...otp];
        newOtp.forEach((val, idx) => {
            filled[idx] = val;
        });
        setOtp(filled);
        const nextIndex = newOtp.length >= 6 ? 5 : newOtp.length;
        inputsRef.current[nextIndex]?.focus();
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const otpCode = otp.join('');
        const response = await fetch('http://localhost:8080/auth/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ otp: otpCode, email }),
        });
        const data = await response.json();
        setMessage(data.message);
        setShowMessage(true);
        setLoading(false);
        setOtp(Array(6).fill(''));

        if (response.ok) {
            localStorage.setItem('otp', otpCode);
            setTimeout(() => navigate('/reset-password'), 1000);
        }

        setTimeout(() => setShowMessage(false), 3000);
    };

    const handleResend = async () => {
        if (resendCountdown > 0) return;
        const response = await fetch('http://localhost:8080/auth/resend-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        const data = await response.json();
        setMessage(data.message);
        setShowMessage(true);
        setResendCountdown(60);

        setTimeout(() => setShowMessage(false), 3000);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f4f4] dark:bg-gray-900 px-4 relative">
            {/* POPUP MESSAGE */}
            <AnimatePresence>
                {showMessage && (
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        className="fixed top-4 px-6 py-3 rounded-xl bg-green-500 text-white shadow-lg z-50"
                    >
                        {message}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md space-y-6 bg-[#e4e1e1] dark:bg-gray-800 rounded-2xl p-6 shadow-md"
            >
                <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white">Xác thực OTP</h2>

                <form onSubmit={handleVerify} className="space-y-6">
                    <div className="flex justify-between gap-2" onPaste={handlePaste}>
                        {otp.map((value, index) => (
                            <input
                                key={index}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={value}
                                onChange={(e) => handleChange(e.target.value, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                ref={(el) => {
                                    if (el) inputsRef.current[index] = el;
                                }}
                                className="w-12 h-14 text-center text-2xl rounded-md border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        ))}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className={`w-full h-[60px] relative rounded-xl transition-opacity ${
                            loading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                        style={{
                            backgroundImage: "url('/3d-button-1.png')",
                            backgroundSize: "100% 100%",
                        }}
                    >
                        <span className="absolute inset-0 flex items-center justify-center transform -translate-y-[14%] text-black font-bold text-lg tracking-wide">
                            {loading ? <FaSpinner className="animate-spin text-xl" /> : 'Xác thực'}
                        </span>
                    </motion.button>

                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={resendCountdown > 0}
                        className={`w-full text-center text-sm font-medium ${
                            resendCountdown > 0
                                ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                : 'text-blue-600 dark:text-blue-400 hover:underline'
                        }`}
                    >
                        {resendCountdown > 0
                            ? `Gửi lại OTP sau ${resendCountdown}s`
                            : 'Gửi lại mã OTP'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default VerifyOtp;



// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
//
// const VerifyOtp: React.FC = () => {
//     const [otp, setOtp] = useState('');
//     const [message, setMessage] = useState('');
//     const [email, setEmail] = useState(localStorage.getItem('forgotEmail') || '');
//     const navigate = useNavigate();
//
//     const handleVerify = async (e: React.FormEvent) => {
//         e.preventDefault();
//         const response = await fetch('http://localhost:8080/auth/verify-otp', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ otp, email }),
//         });
//         const data = await response.json();
//         setMessage(data.message);
//         if (response.ok) {
//             localStorage.setItem('otp', otp);
//             navigate('/reset-password');
//         }
//     };
//
//     const handleResend = async () => {
//         const response = await fetch('http://localhost:8080/auth/resend-otp', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ email }),
//         });
//         const data = await response.json();
//         setMessage(data.message);
//     };
//
//     return (
//         <div>
//             <h2>Xác thực OTP</h2>
//             <form onSubmit={handleVerify}>
//                 <div>
//                     <label>Email</label>
//                     <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); localStorage.setItem('forgotEmail', e.target.value); }} required />
//                 </div>
//                 <div>
//                     <label>OTP</label>
//                     <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />
//                 </div>
//                 <button type="submit">Xác thực</button>
//                 <button type="button" onClick={handleResend} style={{ marginLeft: '10px' }}>Gửi lại OTP</button>
//             </form>
//             {message && <p>{message}</p>}
//         </div>
//     );
// };
//
// export default VerifyOtp;
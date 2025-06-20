// Hero.tsx
import React from "react";
import { Button } from "../reusable-components/button";
import { motion } from "framer-motion";

export default function Hero() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative bg-white dark:bg-gray-900 py-24 px-6 text-left"
        >
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <motion.img
                    src="/infinitylogo2-2.png"
                    alt="Infinity Logo"
                    className="w-full max-w-[400px] mx-auto object-contain"
                    whileHover={{ scale: 1.05 }}
                />
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold leading-snug text-black dark:text-white">
                        <span>Chances are </span>
                        <span className="text-[#00a1a1]">INFINITE</span>
                        <span>
              <br />with languages. <br />To INFINITY and BEYOND<br />Today,
              get started.
            </span>
                    </h1>
                    <Button
                        className="mt-6 w-full md:w-[400px] h-14 md:h-16 text-lg md:text-xl font-bold"
                        style={{ backgroundImage: "url('/3d-button-2.png')", backgroundSize: "100% 100%" }}
                    >
                        <span className={"-translate-y-[14%]"}>Get started</span>
                    </Button>
                    <Button
                        className="mt-4 w-full md:w-[400px] h-14 md:h-16 text-base md:text-lg"
                        style={{ backgroundImage: "url('/3d-button-3.png')", backgroundSize: "100% 100%" }}
                    >
                        <span className={"-translate-y-[14%]"}>Let&apos;s go, I already have an account</span>

                    </Button>
                </div>
            </div>
        </motion.section>
    );
}

// import React from "react";
// import { Button } from "./ui/button";
// import { motion } from "framer-motion";
//
// export default function Hero() {
//     return (
//         <motion.section
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="relative bg-white py-24 px-6 text-left"
//         >
//             <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
//                 <motion.img
//                     src="/1infinitylogo2-2.png"
//                     alt="Infinity Logo"
//                     className="w-[400px] h-[400px] object-contain"
//                     whileHover={{ scale: 1.05 }}
//                 />
//                 <div>
//                     <h1 className="text-4xl font-bold leading-snug">
//                         <span className="text-black">Chances are </span>
//                         <span className="text-[#00a1a1]">INFINITE</span>
//                         <span className="text-black">
//               <br />with languages. <br />To INFINITY and BEYOND<br />Today,
//               get started.
//             </span>
//                     </h1>
//                     <Button
//                         className="mt-6 w-full md:w-[400px] h-16 text-xl font-bold"
//                         style={{ backgroundImage: "url('/3d-button-2.png')", backgroundSize: "100% 100%" }}
//                     >
//                         Get started
//                     </Button>
//                     <Button
//                         className="mt-4 w-full md:w-[400px] h-16 text-lg"
//                         style={{ backgroundImage: "url('/3d-button-3.png')", backgroundSize: "100% 100%" }}
//                     >
//                         Let&apos;s go, I already have an account
//                     </Button>
//                 </div>
//             </div>
//         </motion.section>
//     );
// }

// import React from "react";
// export default function Hero() {
//     return (
//         <section className="w-full py-20 bg-blue-100 text-center">
//             <h1 className="text-4xl font-bold">Hero Section</h1>
//         </section>
//     );
// }
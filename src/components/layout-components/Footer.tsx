import React from "react";
import { Separator } from "../reusable-components/separator";
import { motion } from "framer-motion";

export default function Footer() {
    return (
        <motion.footer
            className="w-full bg-gray-200 dark:bg-gray-800 py-12 px-4 text-sm text-gray-700 dark:text-gray-300"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
        >
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
                <div className="w-full md:w-1/2">
                    <p className="text-lg font-semibold">Footer</p>
                    <Separator className="my-6" />
                    <p>Contacts và hoặc ngôn ngữ khác</p>
                </div>
                <div className="w-full md:w-1/2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">© {new Date().getFullYear()} Infinity App. All rights reserved.</p>
                </div>
            </div>
        </motion.footer>
    );
}


// Footer.tsx
// import React from "react";
// import { Separator } from "./ui/separator";
// import { motion } from "framer-motion";
//
// export default function Footer() {
//     return (
//         <motion.footer
//             className="w-full bg-gray-200 py-12 px-4 text-sm text-gray-700"
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             transition={{ duration: 0.6 }}
//             viewport={{ once: true }}
//         >
//             <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
//                 <div className="w-full md:w-1/2">
//                     <p className="text-lg font-semibold">Footer</p>
//                     <Separator className="my-6" />
//                     <p>Contacts và hoặc ngôn ngữ khác</p>
//                 </div>
//                 <div className="w-full md:w-1/2">
//                     <p className="text-sm text-gray-500">© {new Date().getFullYear()} Infinity App. All rights reserved.</p>
//                 </div>
//             </div>
//         </motion.footer>
//     );
// }



// import React from "react";
// export default function Footer() {
//     return (
//         <footer className="w-full p-6 bg-gray-200 text-center text-sm">
//             Footer
//         </footer>
//     );
// }
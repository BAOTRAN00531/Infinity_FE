// CTA.tsx
import React from "react";
import { Button } from "../reusable-components/button";
import { motion } from "framer-motion";
import FancyButton from "../button/FancyButton";

export default function CTA() {
    return (
        <motion.section
            className="w-full bg-gray-100 dark:bg-gray-800 py-20 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
        >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Learn a language with Infinity</h2>
            <FancyButton
                className="mt-6 text-xl font-bold "
                text="GET STARTED"
                variant="primary"
                // onClick={() => navigate("/login")}
            />


            <img
                src="/infinitylogo2-2.png"
                alt="Infinity Logo"
                className="mx-auto mt-8 w-48 h-48 object-contain"
            />
        </motion.section>
    );
}

// import React from "react";
// import { Button } from "./ui/button";
// import { motion } from "framer-motion";
//
// export default function CTA() {
//     return (
//         <motion.section
//             className="w-full bg-gray-100 py-20 text-center"
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             transition={{ duration: 0.5 }}
//             viewport={{ once: true }}
//         >
//             <h2 className="text-4xl font-bold">Learn a language with Infinity</h2>
//             <Button
//                 className="mt-6 w-64 h-16 text-xl font-bold"
//                 style={{ backgroundImage: "url('/3d-button.png')", backgroundSize: "100% 100%" }}
//             >
//                 GET STARTED
//             </Button>
//             <img
//                 src="/1infinitylogo2-2.png"
//                 alt="Infinity Logo"
//                 className="mx-auto mt-8 w-48 h-48 object-contain"
//             />
//         </motion.section>
//     );
// }

// import React from "react";
// export default function CTA() {
//     return (
//         <section className="w-full py-16 bg-green-100 text-center">
//             <h2 className="text-3xl font-bold">Call to Action</h2>
//         </section>
//     );
// }
// LanguageSwitcher.tsx
import React from "react";
import { Separator } from "./ui/separator";

export default function LanguageSwitcher() {
    return (
        <section className="w-full py-6 bg-white dark:bg-gray-800">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row flex-wrap items-center justify-between px-4 gap-4 text-center md:text-left">
                <img src="/image-2-1.png" alt="Left" className="w-8 h-8" />
                <div className="flex gap-6 md:gap-12 justify-center text-black dark:text-white">
                    <div className="flex items-center gap-2">
                        <img src="/image-4.png" alt="EN" className="w-10 h-10" />
                        <span>English (U.S)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <img src="/image-5.png" alt="VN" className="w-10 h-10" />
                        <span>Tiếng Việt</span>
                    </div>
                </div>
                <img src="/image-2-1.png" alt="Right" className="w-8 h-8" />
            </div>
            <Separator className="mt-6" />
        </section>
    );
}


// import React from "react";
// import { Separator } from "./ui/separator";
//
// export default function LanguageSwitcher() {
//     return (
//         <section className="w-full py-6 bg-white">
//             <div className="max-w-5xl mx-auto flex flex-col md:flex-row flex-wrap items-center justify-between px-4 gap-4 text-center md:text-left">
//                 <img src="/image-2-1.png" alt="Left" className="w-8 h-8" />
//                 <div className="flex gap-6 md:gap-12 justify-center">
//                     <div className="flex items-center gap-2">
//                         <img src="/image-4.png" alt="EN" className="w-10 h-10" />
//                         <span>English (U.S)</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                         <img src="/image-5.png" alt="VN" className="w-10 h-10" />
//                         <span>Tiếng Việt</span>
//                     </div>
//                 </div>
//                 <img src="/image-2-1.png" alt="Right" className="w-8 h-8" />
//             </div>
//             <Separator className="mt-6" />
//         </section>
//     );
// }

// import React from "react";
// export default function LanguageSwitcher() {
//     return (
//         <div className="w-full py-4 bg-white text-center">
//             Language Switcher
//         </div>
//     );
// }
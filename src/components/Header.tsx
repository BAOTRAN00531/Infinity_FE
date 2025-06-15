// Header.tsx
import React from "react";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
    return (
        <header className="w-full p-4 bg-white dark:bg-gray-900 shadow flex justify-center font-bold text-xl">
            <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-4">
                    <img src="/infinity-1.png" alt="Logo" className="w-10 h-10" />
                    <span className="text-black dark:text-white tracking-widest">INFINITY</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <span>Site language: English</span>
                        <img src="/image-2-1.png" alt="Lang" className="w-5 h-5" />
                    </div>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}

// import React from "react";
// import ThemeToggle from "./ThemeToggle";
//
// export default function Header() {
//     return (
//         <header className="w-full p-4 bg-white shadow flex justify-center font-bold text-xl">
//             <div className="max-w-7xl w-full flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                     <img src="/infinity-1.png" alt="Logo" className="w-10 h-10" />
//                     <span className="text-black tracking-widest">INFINITY</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                     <span>Site language: English</span>
//                     <img src="/image-2-1.png" alt="Lang" className="w-5 h-5" />
//                 </div>
//             </div>
//             <ThemeToggle />
//         </header>
//     );
// }
// import React from "react";
// export default function Header() {
//     return (
//         <header className="w-full p-4 bg-gray-100 text-center font-bold text-xl">
//             Header
//         </header>
//     );
// }
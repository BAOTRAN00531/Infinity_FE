// src/utils/env.ts

/**
 * Trả về giá trị biến môi trường theo tên key
 * hỗ trợ cả CRA (process.env.REACT_APP_…) và Vite (import.meta.env.VITE_…)
 */
export function getEnv(key: string): string | undefined {
    // if (typeof import.meta !== "undefined" && import.meta.env) {
    //     // Vite
    //     return import.meta.env[key];
    // }

    if (typeof process !== "undefined" && process.env) {
        // CRA / Node
        return process.env[key];
    }

    return undefined;
}

/**
 * Lấy URL backend, ưu tiên VITE_ rồi tới REACT_APP_, nếu thiếu thì throw.
 */
export const BACKEND_URL: string =
    getEnv("VITE_BACKEND_URL") ||
    getEnv("REACT_APP_BACKEND_URL") || (() => {
        throw new Error("❌ BACKEND_URL is not defined in .env.local");
    })();

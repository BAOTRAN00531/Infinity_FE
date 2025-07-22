import {
    FaEnvelope as RawFaEnvelope,
    FaSpinner as RawFaSpinner,
    FaEye as RawFaEye,
    FaEyeSlash as RawFaEyeSlash,
    FaGoogle as RawFaGoogle,
    FaFacebook as RawFaFacebook, // 👈 Thêm dòng này
} from "react-icons/fa6";

import type { SVGProps } from "react";

// Hàm ép kiểu chung
function castIcon<T = SVGProps<SVGSVGElement>>(icon: unknown): React.FC<T> {
    return icon as React.FC<T>;
}

// Các icon đã ép kiểu
export const FaEnvelope = castIcon(RawFaEnvelope);
export const FaSpinner = castIcon(RawFaSpinner);
export const FaEye = castIcon(RawFaEye);
export const FaEyeSlash = castIcon(RawFaEyeSlash);
export const FaGoogle = castIcon(RawFaGoogle);
export const FaFacebook = castIcon(RawFaFacebook); // 👈 Thêm dòng này

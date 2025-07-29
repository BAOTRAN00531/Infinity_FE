// icon.ts
import {
    FaEnvelope as RawFaEnvelope,
    FaSpinner as RawFaSpinner,
    FaEye as RawFaEye,
    FaEyeSlash as RawFaEyeSlash,
    FaGoogle as RawFaGoogle,
    FaFacebook as RawFaFacebook,
    FaCartShopping as RawFaCartShopping,
    FaClockRotateLeft as RawFaClockRotateLeft,// 👈 Icon giỏ hàng
} from "react-icons/fa6";

import type { SVGProps } from "react";

function castIcon<T = SVGProps<SVGSVGElement>>(icon: unknown): React.FC<T> {
    return icon as React.FC<T>;
}

export const FaEnvelope = castIcon(RawFaEnvelope);
export const FaSpinner = castIcon(RawFaSpinner);
export const FaEye = castIcon(RawFaEye);
export const FaEyeSlash = castIcon(RawFaEyeSlash);
export const FaGoogle = castIcon(RawFaGoogle);
export const FaFacebook = castIcon(RawFaFacebook);
export const FaCartShopping = castIcon(RawFaCartShopping); // 👈 Đã ép kiểu
export const FaClockRotateLeft = castIcon(RawFaClockRotateLeft);
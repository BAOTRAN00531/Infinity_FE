// src/types/react-player.d.ts

// Tự động import các kiểu dữ liệu gốc của thư viện
import 'react-player';

// Mở rộng interface ReactPlayerProps để thêm className
declare module 'react-player' {
    interface ReactPlayerProps {
        className?: string;
    }
}
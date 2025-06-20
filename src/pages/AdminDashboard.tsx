import React from 'react';
import { Link } from 'react-router-dom';
import CRUDDashboard from './CRUDDashboard'; // Điều chỉnh đường dẫn nếu cần

const AdminDashboard: React.FC = () => {
    return (
        <div>
            <CRUDDashboard /> {/* Nhúng CRUDDashboard */}
        </div>
    );
};

export default AdminDashboard;
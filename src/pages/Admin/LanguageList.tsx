import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const LanguageList: React.FC = () => {
    const [languages, setLanguages] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchLanguages();
    }, []);

    const fetchLanguages = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) throw new Error('No token found');
            const response = await axios.get('http://localhost:8080/api/languages', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLanguages(response.data);
        } catch (error) {
            toast.error('Failed to fetch languages');
        }
    };

    const isAdmin = () => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const decodedToken: any = jwtDecode(token);
                return decodedToken.role === 'ROLE_ADMIN';
            } catch (error) {
                console.error('Invalid token:', error);
                return false;
            }
        }
        return false;
    };

    // @ts-ignore
    return (
        <div>
            <h2>Language List</h2>
            {isAdmin() && (
                <button onClick={() => navigate('/languages/create')}>
                    Create New Language
                </button>
            )}
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Flag</th>
                </tr>
                </thead>
                <tbody>
                {languages.map((lang) => (
                    <tr key={lang.id}>
                        <td>{lang.id}</td>
                        <td>{lang.code}</td>
                        <td>{lang.name}</td>
                        <td><img
                            src={lang.flag.startsWith('http') ? lang.flag : `${process.env.REACT_APP_API_BASE_URL}${lang.flag}`}
                            alt="Flag"
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%' }}
                        /></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default LanguageList;
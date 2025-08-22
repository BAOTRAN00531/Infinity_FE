import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PageLayout from '@/components/layout-components/PageLayout';
import { motion } from 'framer-motion';
import api from '@/api';
import { Skeleton } from '@/components/reusable-components/skeleton';
import { Button } from '@/components/reusable-components/button';

const languageImages: Record<string, string> = {
    'Tiếng Đức': 'https://flagcdn.com/w80/de.png',
    'Tiếng Ý': 'https://flagcdn.com/w80/it.png',
    'Tiếng Nhật': 'https://flagcdn.com/w80/jp.png',
    'Tiếng Thái': 'https://flagcdn.com/w80/th.png',
    'Tiếng Hàn': 'https://flagcdn.com/w80/kr.png',
    'Tiếng Nga': 'https://flagcdn.com/w80/ru.png',
    'Tiếng Trung': 'https://flagcdn.com/w80/cn.png',
    'Japan': 'https://flagcdn.com/w80/jp.png',
    'Austria': 'https://flagcdn.com/w80/at.png',
};

interface CourseDto {
    id: number;
    name: string;
    description: string;
    language: string;
    price: number;
    status: string;
    thumbnail: string;
}

interface LanguageDto {
    id: number;
    name: string;
    courseCount: number;
    thumbnail?: string;
    flag?: string; // ✅ thêm cột flag cho đúng với BE
}

const LanguageSelection: React.FC = () => {
    const navigate = useNavigate();
    const [languages, setLanguages] = useState<LanguageDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

    const popularLanguages = [
        'Tiếng Đức',
        'Tiếng Ý',
        'Tiếng Nhật',
        'Tiếng Thái',
        'Tiếng Hàn',
        'Tiếng Nga',
        'Tiếng Trung',
    ];

    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                setLoading(true);
                const res = await api.get('/client/api/course');
                const courses: CourseDto[] = res.data;

                const languageCountMap: Record<string, number> = {};
                courses.forEach((course) => {
                    languageCountMap[course.language] =
                        (languageCountMap[course.language] || 0) + 1;
                });

                const allLanguageNames = new Set<string>();
                courses.forEach((course) => allLanguageNames.add(course.language));
                popularLanguages.forEach((lang) => allLanguageNames.add(lang));

                // ✅ gọi thêm API languages để lấy flag từ DB
                const langRes = await api.get('/api/languages');
                const langFromDb: Record<string, string> = {};
                langRes.data.forEach((lang: any) => {
                    langFromDb[lang.name] = lang.flag;
                });

                const finalLanguages: LanguageDto[] = Array.from(allLanguageNames).map(
                    (langName, index) => {
                        const course = courses.find((c) => c.language === langName);
                        return {
                            id: index + 1,
                            name: langName,
                            courseCount: languageCountMap[langName] || 0,
                            thumbnail: course?.thumbnail || '',
                            flag: langFromDb[langName] || '', // ✅ ưu tiên flag từ DB
                        };
                    }
                );

                finalLanguages.sort((a, b) => b.courseCount - a.courseCount);

                setLanguages(finalLanguages);
            } catch (err) {
                toast.error('Không thể tải danh sách ngôn ngữ.');
            } finally {
                setLoading(false);
            }
        };

        fetchLanguages();
    }, []);

    const handleLanguageSelect = (languageName: string) => {
        setSelectedLanguage(languageName);
    };

    const handleContinue = () => {
        if (!selectedLanguage) {
            toast.warning('Vui lòng chọn ngôn ngữ trước khi tiếp tục');
            return;
        }
        const normalized = selectedLanguage.toLowerCase().replace(/\s+/g, '-');
        navigate(`/client/course/${normalized}`);
        toast.info(`Bạn đã chọn: ${selectedLanguage}`, {
            autoClose: 1500,
            pauseOnHover: false,
        });
    };

    return (
        <PageLayout>
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-white transition-colors duration-300">
                <div className="max-w-6xl mx-auto px-4 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            CHỌN KHÓA HỌC
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Hãy chọn ngôn ngữ bạn muốn học
                        </p>
                    </motion.div>

                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {Array.from({ length: 7 }).map((_, idx) => (
                                <Skeleton
                                    key={idx}
                                    className="h-40 rounded-xl bg-gray-200 dark:bg-gray-800"
                                />
                            ))}
                        </div>
                    ) : languages.length > 0 ? (
                        <>
                            <motion.div
                                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                {languages.map((lang) => {
                                    const displayFlag =
                                        lang.flag && lang.flag.startsWith('http')
                                            ? lang.flag
                                            : languageImages[lang.name] || '';

                                    return (
                                        <motion.div
                                            key={lang.id}
                                            onClick={() => handleLanguageSelect(lang.name)}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            className={`relative p-4 rounded-xl shadow-md cursor-pointer transition-all duration-200 border-2 ${
                                                selectedLanguage === lang.name
                                                    ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-200 dark:ring-blue-800'
                                                    : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                                            }`}
                                        >
                                            <div className="flex flex-col items-center">
                                                <div className="w-20 h-20 mb-3 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center bg-white dark:bg-gray-800">
                                                    {displayFlag ? (
                                                        <img
                                                            src={displayFlag}
                                                            alt={lang.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-2xl">🌐</span>
                                                    )}
                                                </div>
                                                <h2 className="text-lg font-semibold text-center">
                                                    {lang.name}
                                                </h2>
                                                <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {lang.courseCount} khóa học
                        </span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex justify-center"
                            >
                                <Button
                                    onClick={handleContinue}
                                    size="lg"
                                    className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                                    disabled={!selectedLanguage}
                                >
                                    TIẾP TỤC
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 ml-2"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </Button>
                            </motion.div>
                        </>
                    ) : (
                        <p className="text-center text-gray-400 py-10">
                            Không có ngôn ngữ nào khả dụng
                        </p>
                    )}
                </div>
            </div>
        </PageLayout>
    );
};

export default LanguageSelection;

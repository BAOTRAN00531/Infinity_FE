export interface LoginDTO {
    username: string;
    password: string;
}

export interface RegisterDTO {
    email: string;
    username: string;
    password: string;
}

export interface UserLogin {
    id: number;
    email: string;
    name: string;
    role?: string; // cần có để Header hoạt động đúng
}


export interface ResLoginDTO {
    access_token: string;
    userp: UserLogin;
}

export interface ApiError {
    message: string;
}


//
// export interface Language {
//     id: number;
//     name: string;
//     code: string;
//     flag: string;
//     coursesCount?: number;
//     difficulty?: 'Easy' | 'Medium' | 'Hard';
//     popularity?: 'High' | 'Medium' | 'Low';
// }
//
//






export interface Lesson {
    id: number;
    name: string;
    moduleId: number;
}



export interface OptionCreateDto {
    optionText: string;
    correct: boolean;
    position: number;
    questionId?: number;
    imageUrl?: string;
}

export interface AnswerCreateDto {
    answerText: string;
    caseSensitive: boolean;
    position: number;
    questionId?: number;
}



export class QuestionDto {
    id?: number;
    questionText!: string;
    questionTypeId!: number;
    moduleId!: number;
    lessonId!: number;
    difficulty!: 'easy' | 'medium' | 'hard';
    points!: number;
    options?: OptionCreateDto[];
    answers?: AnswerCreateDto[];

    constructor(data: Partial<QuestionDto>) {
        Object.assign(this, data);
    }
}



export interface QuestionType {
    id: number;
    code: string;
    description: string;
    minOptions?: number;
    minCorrect?: number;
    maxCorrect?: number | null;
}



// types.ts
export interface UIQuestion {
    id: number;
    moduleId: number;
    questionText: string;
    courseId?: number;
    lessonId: number;
    questionTypeId: number;
    difficulty: string;
    points: number;
    media: {
        mediaUrl?: string;
        audioUrl?: string;
        videoUrl?: string;
    };
    options: {
        id: number;
        optionText: string;
        correct: boolean;
        position: number;
        imageUrl?: string;
    }[];
    answers: {
        id: number;
        answerText: string;
        caseSensitive: boolean;
        position: number;
    }[];
    createdBy?: number;
    createdAt?: string;
    updatedBy?: number;
    updatedAt?: string;
}


export interface QuestionCreateDto {
    questionText: string;
    courseId?: number;
    moduleId?: number;
    lessonId: number;
    questionTypeId: number;
    difficulty: string;
    points: number;
    media?: {
        mediaUrl?: string;
        audioUrl?: string;
        videoUrl?: string;
    };
    options?: OptionCreateDto[];
    answers?: AnswerCreateDto[];
}


export interface AnswerResponseDto {
    id: number;
    answerText: string;
    caseSensitive: boolean;
    position: number;
}

export interface OptionResponseDto {
    id: number;
    optionText: string;
    correct: boolean;
    position: number;
    imageUrl?: string;
}

export interface MediaDto {
    mediaUrl?: string;
    audioUrl?: string;
    videoUrl?: string;
}

export interface QuestionResponseDto {
    id: number;

    // ✅ moduleId được tính từ Lesson → LearningModule
    moduleId: number;

    questionText: string;
    courseId?: number;          // Có thể null → nên để optional
    lessonId: number;
    questionTypeId: number;

    difficulty: string;
    points: number;

    media?: MediaDto;

    options: OptionResponseDto[];
    answers: AnswerResponseDto[];

    createdBy?: number;
    createdAt?: string;         // ISO string (backend trả kiểu timestamp -> string)
    updatedBy?: number;
    updatedAt?: string;
}





export const QUESTION_TYPE_MAP: Record<number, string> = {
    1: 'Câu hỏi trắc nghiệm - 1 đáp án đúng',
    2: 'Câu hỏi trắc nghiệm - nhiều đáp án đúng',
    3: 'Sắp xếp từ thành câu đúng',
    4: 'Nhập câu trả lời từ bàn phím',
};


//
// ===== TOI UU
// src/types/course.types.ts

// ===== TOI UU
// Ngôn ngữ
export interface Language {
    id: number;
    name: string;
}

// Course Level và Status
export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type CourseStatus = 'active' | 'inactive';
export type ModuleStatus = 'active' | 'inactive';

// Course - Phiên bản đầy đủ cho quản lý
export interface Course {
    id: number;
    name: string;
    description: string;
    language: Language;
    level: CourseLevel;
    status: CourseStatus;
    createdAt: string;
    modulesCount: number;
    price: number;
    thumbnail: string;
}

// Course - Phiên bản rút gọn cho học tập
export interface LearningCourse {
    courseId: number;
    courseName: string;
    thumbnail: string;
    modules: LearningModule[];
}

// Props cho CourseForm
export interface CourseFormProps {
    initialData?: Course;
    onSubmit: (data: Omit<Course, 'id' | 'createdAt' | 'modulesCount' | 'duration'>) => void;
}

// Module - Phiên bản cơ bản
export interface BaseModule {
    id: number;
    name: string;
    description: string;
    courseId: number;
    courseName: string;
    order: number;
    status: ModuleStatus;
    partsCount: number;
}

// Module - Phiên bản đầy đủ với duration
export interface Module extends BaseModule {
    duration?: string;
}

// Module - Phiên bản cho học tập
export interface LearningModule extends BaseModule {
    duration: string | null;
    lessons?: Lesson[];
    completedLessons?: number;
}

// Request để tạo Module
export interface ModuleRequest {
    name: string;
    description: string;
    courseId: number;
    order: number;
    status: ModuleStatus;
}

// Lesson
export interface Lesson {
    id: number;
    name: string;
    type: string;
    content: string;
    videoUrl?: string;
    duration: string;
    isCompleted: boolean;
    orderIndex: number;
}

// Course Progress
export interface CourseProgress {
    courseId: number;
    progressPercentage: number;
    totalModules: number;
    completedModules: number;
}

// Question và Option
export interface QuestionOption {
    id: number;
    optionText: string;
    correct: boolean;
    position: number;
}

export interface Question {
    id: number;
    questionText: string;
    lessonId: number;
    options: QuestionOption[];
}

// Props cho các component học tập
export interface CourseHeaderProps {
    courseName: string;
    courseProgress: CourseProgress | null;
    onBack: () => void;
}

export interface LessonContentAreaProps {
    selectedLesson: Lesson | null;
    isQuizMode: boolean;
    questions: Question[];
    onMarkComplete: (lessonId: number) => void;
    onStartQuiz: (lessonId: number) => void;
}

export interface CourseSidebarProps {
    courseName: string;
    modules: LearningModule[];
    selectedLesson: Lesson | null;
    onLessonSelect: (lesson: Lesson) => void;
    onModuleSelect: (moduleId: number) => void;
}

export interface ModuleAccordionProps {
    module: LearningModule;
    selectedLesson: Lesson | null;
    onLessonSelect: (lesson: Lesson) => void;
    onModuleSelect: (moduleId: number) => void;
}

export interface QuizComponentProps {
    questions: Question[];
}


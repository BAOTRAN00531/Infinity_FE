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
// Ngôn ngữ
export interface Language {
    id: number;
    name: string;
}

// Course
export interface Course {
    id: number;
    name: string;
    description: string;
    language: Language;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    status: 'active' | 'inactive';
    createdAt: string; // bắt buộc
    modulesCount: number;
    price: number;
    thumbnail: string;
}

// Props cho CourseForm
export interface CourseFormProps {
    initialData?: Course;
    onSubmit: (data: Omit<Course, 'id' | 'createdAt' | 'modulesCount' | 'duration'>) => void;
}

//Module

export interface Module {
    id: number;
    name: string;
    description: string;
    courseId: number;
    courseName: string;
    order: number;
    duration?: string;
    status: 'active' | 'inactive';
    partsCount: number;
}

export interface ModuleRequest {
    name: string;
    description: string;
    courseId: number;
    order: number;
    status: 'active' | 'inactive';
}
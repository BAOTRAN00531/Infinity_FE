// @ts-nocheck
import React, { createContext } from "react";

const quizzContext = createContext(null);

const QUESTION_TYPES = {
  "MULTIPLE-CHOICE": "Multiple Choice",
  "FILL-IN-THE-BLANK": "Fill in the Blank",
  AUDIO: "Audio",
  MATCHING: "Matching",
  "SINGLE-TEXT": "Single Text",
  REARRANGE: "Rearrange",
  "SINGLE-IMAGE": "Single Image",
};

const lesson = {
  id: 1,
  title: "Thì hiện tại hoàn thành",
  slug: "thi-hien-tai-hoan-thanh",
  questions: [
    {
      id: "question-2",
      title: "Câu hỏi dạng nghe",
      type: QUESTION_TYPES["AUDIO"],
      options: [],
      vocabs: [
        { id: "vocab-1", text: "What" },
        { id: "vocab-2", text: "are" },
        { id: "vocab-3", text: "Which" },
        { id: "vocab-4", text: "you" },
        { id: "vocab-5", text: "doing" },
        { id: "vocab-6", text: "Should" },
        { id: "vocab-7", text: "we" },
        { id: "vocab-8", text: "?" },
        { id: "vocab-9", text: "long word" },
        { id: "vocab-10", text: "for test" },
        { id: "vocab-11", text: "another word" },
        { id: "vocab-12", text: "yet another word" },
        { id: "vocab-13", text: "one more word" },
      ],
      correctAnswer: {
        text: "What are you doing?",
        arr: [
          [
            { id: "vocab-1", text: "What" },
            { id: "vocab-2", text: "are" },
            { id: "vocab-3", text: "you" },
            { id: "vocab-4", text: "doing" },
          ],
          [
            { id: "vocab-1", text: "What" },
            { id: "vocab-2", text: "are" },
            { id: "vocab-3", text: "you" },
            { id: "vocab-4", text: "doing" },
            { id: "vocab-8", text: "?" },
          ],
        ],
      },
    },
    {
      id: "question-3",
      title: "Câu hỏi dạng sắp xếp",
      type: QUESTION_TYPES["REARRANGE"],
      options: [],
      vocabs: [
        { id: "vocab-1", text: "What" },
        { id: "vocab-2", text: "are" },
        { id: "vocab-3", text: "you" },
        { id: "vocab-4", text: "doing" },
        { id: "vocab-5", text: "?" },
        { id: "vocab-6", text: "sample word." },
        { id: "vocab-7", text: "another sample word." },
      ],
      correctAnswer: {
        arr: [
          [
            { id: "vocab-1", text: "What" },
            { id: "vocab-2", text: "are" },
            { id: "vocab-3", text: "you" },
            { id: "vocab-4", text: "doing" },
          ],
          [
            { id: "vocab-1", text: "What" },
            { id: "vocab-2", text: "are" },
            { id: "vocab-3", text: "you" },
            { id: "vocab-4", text: "doing" },
            { id: "vocab-8", text: "?" },
          ],
        ],
      },
    },
    {
      id: "question-4",
      title: "Câu hỏi dạng chọn một đáp án",
      type: QUESTION_TYPES["SINGLE-TEXT"],
      conversation: "What are you doing?",
      options: [
        { id: "option-1", text: "Bạn đang làm gì?" },
        { id: "option-2", text: "Tôi đang học tiếng Anh" },
        { id: "option-3", text: "Bạn đang ở đâu?" },
        { id: "option-4", text: "Bạn đang làm bài tập?" },
      ],
      correctAnswer: {
        text: "option-1",
      },
    },
    {
      id: "question-5",
      title: "Câu hỏi dạng chọn một đáp án có hình ảnh",
      type: QUESTION_TYPES["SINGLE-IMAGE"],
      options: [
        {
          id: "option-1",
          text: "Cuốn lịch",
          image: "/images/questions/calendar.png",
        },
        {
          id: "option-2",
          text: "Cái tủ",
          image: "/images/questions/bedside-table.png",
        },
        { id: "option-3", text: "Radio", image: "/images/questions/radio.png" },
        {
          id: "option-4",
          text: "Cái bàn",
          image: "/images/questions/table.png",
        },
      ],
      correctAnswer: {
        text: "option-1",
      },
    },
    {
      id: "question-6",
      title: "Câu hỏi điền vào chỗ trống trong hội thoại",
      type: QUESTION_TYPES["FILL-IN-THE-BLANK"],
      conversation: {
        lines: [
          {
            speaker: "left", // or "right" for the other participant
            content: "Hello! How ___ you today?", // Blank marked with ___
            blankIndex: 1, // Which blank in this line (if multiple)
            blankPositions: [
              {
                start: 12, // Character position where blank starts
                end: 14, // Character position where blank ends
              },
            ],
            avatar: "/images/avatars/girl.png",
            audio: "/audio/conversation-line1.mp3", // Optional
          },
          {
            speaker: "right",
            content: "I'm fine, thanks! And ___?",
            blankIndex: 1,
            blankPositions: [
              {
                start: 17,
                end: 19,
              },
            ],
            avatar: "/images/avatars/profile-avt.png",
            audio: "/audio/conversation-line2.mp3",
          },
        ],
        blanks: [
          {
            lineIndex: 0, // Which conversation line
            blankIndex: 0, // Which blank in that line
            correctAnswers: ["are"], // Multiple possible correct answers
            hint: "Verb to be", // Optional hint
          },
          {
            lineIndex: 1,
            blankIndex: 0,
            correctAnswers: ["you"],
            hint: "Personal pronoun",
          },
        ],
      },
      correctAnswer: {
        text: "Hello! How are you today? I'm fine, thanks! And you?",
        // Or separate answers for each blank:
        blanks: ["are", "you"],
      },
    },
    {
      id: "question-7",
      title: "Match the pairs (Destroy all to pass)",
      type: QUESTION_TYPES["MATCHING"],
      leftColumn: [
        { id: "left-1", text: "Apple" },
        { id: "left-2", text: "Run" },
        { id: "left-3", text: "Book" },
        { id: "left-4", text: "Water" },
      ],
      rightColumn: [
        { id: "right-1", text: "Quả táo" }, // Vietnamese for Apple
        { id: "right-2", text: "Chạy" }, // Vietnamese for Run
        { id: "right-3", text: "Sách" }, // Vietnamese for Book
        { id: "right-4", text: "Nước" }, // Vietnamese for Water
      ],
      correctPairs: {
        "left-1": "right-1",
        "left-2": "right-2",
        "left-3": "right-3",
        "left-4": "right-4",
      },
    },
  ],
};

const initialState = {
  lesson,
  questions: lesson.questions,
  currentQuestionIndex: 0,
  useVocab: false,
  progress: 12,
  selectedWords: [],
  textAnswer: "",
  hasAnswered: false,
  hasChecked: false,
  isCorrect: null,
  result: 93,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_QUESTIONS":
      return { ...state, questions: action.payload };
    case "NEXT_QUESTION":
      return {
        ...state,
        currentQuestionIndex:
          state.currentQuestionIndex < state.questions.length
            ? state.currentQuestionIndex + 1
            : state.currentQuestionIndex,
      };
    case "SET_TEXT_ANSWER":
      return {
        ...state,
        textAnswer: action.payload,
      };
    case "SET_USE_VOCAB":
      return { ...state, useVocab: !state.useVocab };
    case "ADD_WORD":
      return {
        ...state,
        selectedWords: [...state.selectedWords, action.payload],
      };
    case "REMOVE_WORD":
      return {
        ...state,
        selectedWords: state.selectedWords.filter(
          (word) => word.id !== action.payload.id
        ),
      };
    case "CLEAR_WORDS":
      return { ...state, selectedWords: [] };
    case "SET_ANSWERED":
      return { ...state, hasAnswered: action.payload };
    case "SET_CHECKED":
      return {
        ...state,
        hasChecked: true,
        isCorrect: action.payload,
      };
    case "RESET_CHECK":
      return {
        ...state,
        hasChecked: false,
        isCorrect: null,
      };
    default:
      return state;
  }
}

function QuizzProvider({ children }) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const toggleUseVocab = () => {
    dispatch({ type: "SET_VOCAB" });
  };

  const addWord = (word) => {
    dispatch({ type: "ADD_WORD", payload: word });
  };

  const removeWord = (word) => {
    dispatch({ type: "REMOVE_WORD", payload: word });
  };

  const clearWords = () => {
    dispatch({ type: "CLEAR_WORDS" });
  };

  const setAnswered = (answered) => {
    dispatch({ type: "SET_ANSWERED", payload: answered });
  };

  const nextQuestion = () => {
    dispatch({ type: "NEXT_QUESTION" });
    setAnswered(false);
    setTextAnswer("");
    clearWords();
    resetCheck();
  };

  const setTextAnswer = (text) => {
    dispatch({ type: "SET_TEXT_ANSWER", payload: text });
  };

  const setChecked = (isCorrect) => {
    dispatch({ type: "SET_CHECKED", payload: isCorrect });
  };

  const resetCheck = () => {
    dispatch({ type: "RESET_CHECK" });
  };

  const setUseVocab = () => {
    dispatch({ type: "SET_USE_VOCAB" });
  };

  return (
    <quizzContext.Provider
      value={{
        state: { ...state, QUESTION_TYPES },
        dispatch,
        toggleUseVocab,
        addWord,
        removeWord,
        clearWords,
        setAnswered,
        nextQuestion,
        setTextAnswer,
        setChecked,
        resetCheck,
        setUseVocab,
      }}
    >
      {children}
    </quizzContext.Provider>
  );
}

function useQuizz() {
  const context = React.useContext(quizzContext);
  if (!context) {
    throw new Error("useQuizz must be used within a QuizzProvider");
  }
  return context;
}

export { useQuizz, QuizzProvider, QUESTION_TYPES };

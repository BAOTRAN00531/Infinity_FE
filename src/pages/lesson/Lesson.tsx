// @ts-nocheck
import { Navigate } from "react-router-dom";
import AudioQuizz from "../../components/page-component/lesson/quizz/AudioQuizz";
import FillInTheBlank from "../../components/page-component/lesson/quizz/FillInTheBlank";
import Matching from "../../components/page-component/lesson/quizz/Matching";
import Rearrange from "../../components/page-component/lesson/quizz/Rearrange";
import SingleImage from "../../components/page-component/lesson/quizz/SingleImage";
import SingleText from "../../components/page-component/lesson/quizz/SingleText";
import { useQuizz } from "../../contexts/QuizzContext";
import LessonLayout from "./Layout";

function Lesson() {
  const {
    state: { lesson, questions, currentQuestionIndex, QUESTION_TYPES },
  } = useQuizz();
  const currentQuestion = questions[currentQuestionIndex];

  const renderQuizz = () => {
    if (!currentQuestion) {
      return <Navigate to={`/hoc/bai-hoc/${lesson.slug}/ket-qua`} replace />;
    }

    switch (currentQuestion.type) {
      case QUESTION_TYPES["AUDIO"]:
        return <AudioQuizz />;

      case QUESTION_TYPES["FILL-IN-THE-BLANK"]:
        return <FillInTheBlank />;

      case QUESTION_TYPES["REARRANGE"]:
        return <Rearrange />;

      case QUESTION_TYPES["SINGLE-IMAGE"]:
        return <SingleImage />;

      case QUESTION_TYPES["SINGLE-TEXT"]:
        return <SingleText />;

      case QUESTION_TYPES["MATCHING"]:
        return <Matching />;

      default:
        break;
    }
  };

  return <LessonLayout>{renderQuizz()}</LessonLayout>;
}

export default Lesson;

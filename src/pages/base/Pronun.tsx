// @ts-nocheck
import NextLessonBox from "../../components/page-component/base/NextLessonBox";
import TrialBox from "../../components/page-component/base/TrialBox";

const sampleAudioPath = "/sounds/sample-sound.mp3";
const pronunData = [
  {
    id: 1,
    title: "Nguyên âm",
    lessons: [
      {
        title: "ɑ",
        sample: "hot",
        audio: sampleAudioPath,
      },
      {
        title: "e",
        sample: "bed",
        audio: sampleAudioPath,
      },
      {
        title: "i",
        sample: "bit",
        audio: sampleAudioPath,
      },
      {
        title: "o",
        sample: "hot",
        audio: sampleAudioPath,
      },
      {
        title: "u",
        sample: "put",
        audio: sampleAudioPath,
      },
      {
        title: "ɨ",
        sample: "bit",
        audio: sampleAudioPath,
      },
      {
        title: "ʉ",
        sample: "put",
        audio: sampleAudioPath,
      },
    ],
  },
  {
    id: 2,
    title: "Phụ âm",
    lessons: [
      {
        title: "b",
        sample: "bat",
        audio: sampleAudioPath,
      },
      {
        title: "d",
        sample: "dog",
        audio: sampleAudioPath,
      },
      {
        title: "g",
        sample: "go",
        audio: sampleAudioPath,
      },
      {
        title: "k",
        sample: "cat",
        audio: sampleAudioPath,
      },
      {
        title: "m",
        sample: "man",
        audio: sampleAudioPath,
      },
      {
        title: "n",
        sample: "no",
        audio: sampleAudioPath,
      },
      {
        title: "p",
        sample: "pat",
        audio: sampleAudioPath,
      },
      {
        title: "t",
        sample: "top",
        audio: sampleAudioPath,
      },
    ],
  },
];

function Pronun() {
  const playSound = (audioPath) => {
    const audio = new Audio(audioPath);
    audio.play();
  };

  const onLessonClick = (lesson) => {
    playSound(lesson.audio);
  };

  return (
    <div className="flex be-vietnam-pro-regular gap-20">
      <div className="grow flex justify-center">
        <div className="margin-x-auto max-w-3xl flex flex-col gap-8">
          {/* Main content goes here */}
          <h1 className="uppercase font-black text-2xl text-slate-600 text-center">
            học phát âm cùng <span className="text-primary">infinity</span> nào!
          </h1>
          {pronunData.map((item) => (
            <div className="flex flex-col gap-8" key={item.id + item.title}>
              <div role="title" className="flex-center gap-4">
                <div className="grow h-[2px] bg-slate-300 rounded-full"></div>
                <h2 className="font-black text-xl text-slate-600">
                  {item.title}
                </h2>
                <div className="grow h-[2px] bg-slate-300 rounded-full"></div>
              </div>
              <div className="flex flex-wrap gap-5">
                {item.lessons.map((lesson) => (
                  <div
                    className="flex-center flex-col gap-2 cursor-pointer text-slate-600 p-2.5 rounded-2xl bg-background shadow-muted active:shadow-none active:translate-y-0.5 min-w-20"
                    key={lesson.title}
                    onClick={() => onLessonClick(lesson)}
                  >
                    <h3>{lesson.title}</h3>
                    <p>{lesson.sample}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <aside className="max-w-[360px] h-full flex flex-col gap-8">
        <div className="flex flex-col p-5 rounded-2xl bg-transparent border-2 border-slate-300 gap-4">
          <p className="text-slate-600">
            Đã hoàn thành <span className="text-accent">3</span> / 30
          </p>
          <div
            className="w-full h-2 rounded-full bg-slate-300"
            aria-label="progress-bar"
          >
            <div className="w-3/12 h-full rounded-full bg-accent"></div>
          </div>
        </div>
        <NextLessonBox />
        <TrialBox />
      </aside>
    </div>
  );
}

export default Pronun;

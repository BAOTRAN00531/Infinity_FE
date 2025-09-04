// @ts-nocheck
import useSelectedOption from "../../hooks/useSelectOption";

const imagesPath = "/images/flags";

const courses = [
  { name: "Tiếng Đức", image: `${imagesPath}/germany.png` },
  { name: "Tiếng Anh", image: `${imagesPath}/united-state.png` },
  { name: "Tiếng Ý", image: `${imagesPath}/italy.png` },
  { name: "Tiếng Nhật", image: `${imagesPath}/japan.png` },
  { name: "Tiếng Hàn", image: `${imagesPath}/south-korea.png` },
  { name: "Tiếng Trung", image: `${imagesPath}/china.png` },
  { name: "Tiếng Nga", image: `${imagesPath}/russia.png` },
];

function Courses() {
  const { selected, selectOption } = useSelectedOption(
    courses.map((c) => c.name)
  );

  return (
    <div className="flex flex-col gap-8 w-full">
      <h1 className="be-vietnam-pro-black text-base leading-6 uppercase text-slate-600">
        Các khóa học dành cho bạn
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <Course
            key={course.name}
            course={course}
            selected={selected}
            selectOption={selectOption}
          />
        ))}
      </div>
    </div>
  );
}

export default Courses;

function Course({ course, selected, selectOption }) {
  return (
    <label
      key={course.name + course.image}
      className={`flex gap-3 items-center min-w-52 rounded-2xl p-3 border-2 border-slate-300 cursor-pointer hover:bg-slate-100 transition-all duration-200 has-checked:border-primary has-checked:**:border-primary has-checked:*:text-primary`}
    >
      <input
        type="radio"
        hidden
        name="course"
        value={course.name}
        onChange={() => selectOption(course.name)}
      />
      <img
        src={course.image}
        alt={course.name}
        className="w-14 h-14 rounded-full border-2 border-slate-300 has-checked:border-primary"
      />
      <span className="text-base be-vietnam-pro-bold text-slate-600">
        {course.name}
      </span>
    </label>
  );
}

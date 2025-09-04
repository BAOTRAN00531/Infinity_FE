// @ts-nocheck
import { NavLink } from "react-router-dom";
import Button from "../../components/reuseables/Button";
import Gradient from "../../components/reuseables/Gradient";
import useSelectedOption from "../../hooks/useSelectOption";
import Layout from "./layout";

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

function SelectCourse() {
  const { selected, selectOption } = useSelectedOption(
    courses.map((c) => c.name)
  );

  console.log("Selected course: ", selected);
  return (
    <Layout>
      <Gradient />
      <div className="flex flex-col flex-center gap-14 max-w-[700px]">
        <h1 className="text-slate-600 uppercase be-vietnam-pro-bold text-center">
          Chọn khóa học
        </h1>
        <div className="flex flex-wrap gap-6 justify-center">
          {courses.map((course) => (
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
          ))}
        </div>
        <NavLink to={"/auth/register"}>
          <Button type="primary" className="px-12" disabled={!selected}>
            Tiếp tục
          </Button>
        </NavLink>
      </div>
    </Layout>
  );
}

export default SelectCourse;

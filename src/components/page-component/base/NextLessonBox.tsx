// @ts-nocheck
import Button from "../../reuseables/Button";

function NextLessonBox() {
  return (
    <div className="flex flex-col p-5 rounded-2xl bg-primary gap-5">
      <h2 className="uppercase text-white be-vietnam-pro-black">
        Tuyệt vời, oca! BẠN LÀM RẤT TỐT
      </h2>
      <p className="text-[14px] text-white be-vietnam-pro-regular">
        Bạn đã hoàn thành <b>3</b> bài học trong hôm nay
      </p>
      <Button type="secondary" className="max-w-full">
        Học bài tiếp theo
      </Button>
    </div>
  );
}

export default NextLessonBox;

//	Ánh xạ chung (dùng đa mục đích)
export * from './question/mapQuestion';


//Edit câu hỏi
export * from './question/mapQuestionDtoToUIQuestion';


//Gửi answer về backend
export * from './question/mapUIQuestionToAnswerDto';

//Gửi tạo mới câu hỏi
export * from './question/mapUIQuestionToCreateDto';


//Gửi cập nhật câu hỏi
export * from './question/mapUIQuestionToUpdateDto';

//Load từ API để hiển thị UI
export * from './question/mapQuestionResponseToUIQuestion';
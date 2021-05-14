class QuizStorage {
  constructor() {}
  static quiz_id = '';
  static quiz_name = '';
  static question_id = 0;
  static q_id = 0;
  static answer_id = '';
  static score = 0;
  static number_of_questions = 0;

  static setQuiz_id (id) {
    return this.quiz_id  = id;
  }

  static getQuiz_id () {
    return this.quiz_id;
  }
  static setQuiz_name (name) {
    return this.quiz_name  = name;
  }

  static getQuiz_name () {
    return this.quiz_name;
  }
  static setQuestion_id (id) {
    return this.question_id  = id;
  }

  static getQuestion_id () {
    return this.question_id;
  }
  static pullQuestion_id () {
    return this.question_id = this.question_id+1;
  }
  static setAnswer_id (id) {
    return this.answer_id  = id;
  }

  static getAnswer_id () {
    return this.answer_id;
  }
  static setScore (temp) {
    return this.score  = temp;
  }
  static pullScore () {
    return this.score  = this.score+1;
  }

  static getScore () {
    return this.score;
  }
  static setTasks (temp) {
    return this.number_of_questions  = temp;
  }

  static getTasks () {
    return this.number_of_questions;
  }
  static setQID (temp) {
    return this.q_id  = temp;
  }

  static getQID () {
    return this.q_id;
  }
}
export default QuizStorage;

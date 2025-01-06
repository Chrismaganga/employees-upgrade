export interface User {
    id: string;
    password: string;
    name: string;
    avatarURL: string;
    answers: Record<string, 'optionOne' | 'optionTwo'>;
    questions: string[];
  }
  
  export interface Question {
    id: string;
    author: string;
    timestamp: number;
    optionOne: {
      votes: string[];
      text: string;
    };
    optionTwo: {
      votes: string[];
      text: string;
    };
  }
  
  interface Users {
    [key: string]: User;
  }
  
  interface Questions {
    [key: string]: Question;
  }
  
  let users: Users = {
    sarahedo: {
      id: 'sarahedo',
      password: 'password123',
      name: 'Sarah Edo',
      avatarURL: 'https://www.pngkey.com/png/full/73-730477_first-name-profile-image-placeholder-png.png',
      answers: {
        "8xf0y6ziyjabvozdd253nd": 'optionOne',
        "6ni6ok3ym7mf1p33lnez": 'optionOne',
        "am8ehyc8byjqgar0jgpub9": 'optionTwo',
        "loxhs1bqm25b708cmbf3g": 'optionTwo'
      },
      questions: ['8xf0y6ziyjabvozdd253nd', 'am8ehyc8byjqgar0jgpub9']
    },
 
  };
  
  let questions: Questions = {

  };
  
  interface NewQuestion {
    optionOneText: string;
    optionTwoText: string;
    author: string;
  }
  
  interface SaveQuestionAnswer {
    authedUser: string;
    qid: string;
    answer: 'optionOne' | 'optionTwo';
  }
  
  function generateUID(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
  
  export function _getUsers(): Promise<Users> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...users }), 1000);
    });
  }
  
  export function _getQuestions(): Promise<Questions> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...questions }), 1000);
    });
  }
  
  function formatQuestion({ optionOneText, optionTwoText, author }: NewQuestion): Question {
    return {
      id: generateUID(),
      timestamp: Date.now(),
      author,
      optionOne: {
        votes: [],
        text: optionOneText,
      },
      optionTwo: {
        votes: [],
        text: optionTwoText,
      }
    };
  }
  
  export function _saveQuestion(question: NewQuestion): Promise<Question> {
    return new Promise((resolve, reject) => {
      if (!question.optionOneText || !question.optionTwoText || !question.author) {
        reject("Please provide optionOneText, optionTwoText, and author");
      }
  
      const formattedQuestion = formatQuestion(question);
      setTimeout(() => {
        questions = {
          ...questions,
          [formattedQuestion.id]: formattedQuestion
        };
  
        resolve(formattedQuestion);
      }, 1000);
    });
  }
  
  export function _saveQuestionAnswer({ authedUser, qid, answer }: SaveQuestionAnswer): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!authedUser || !qid || !answer) {
        reject("Please provide authedUser, qid, and answer");
      }
  
      setTimeout(() => {
        users = {
          ...users,
          [authedUser]: {
            ...users[authedUser],
            answers: {
              ...users[authedUser].answers,
              [qid]: answer
            }
          }
        };
  
        questions = {
          ...questions,
          [qid]: {
            ...questions[qid],
            [answer]: {
              ...questions[qid][answer],
              votes: questions[qid][answer].votes.concat([authedUser])
            }
          }
        };
  
        resolve();
      }, 500);
    });
  }
import { _saveQuestion, _saveQuestionAnswer } from '../_DATA';

describe('_DATA.js', () => {
  describe('_saveQuestion', () => {
    it('should save question with correct data', async () => {
      const question = {
        optionOneText: 'Option One',
        optionTwoText: 'Option Two',
        author: 'sarahedo'
      };

      const result = await _saveQuestion(question);
      expect(result.id).toBeTruthy();
      expect(result.author).toBe('sarahedo');
      expect(result.optionOne.text).toBe('Option One');
      expect(result.optionTwo.text).toBe('Option Two');
    });

    it('should fail with missing data', async () => {
      const question = {
        optionOneText: 'Option One'
      };

      await expect(_saveQuestion(question))
        .rejects.toBe('Please provide optionOneText, optionTwoText, and author');
    });
  });

  describe('_saveQuestionAnswer', () => {
    it('should save answer successfully', async () => {
      const answer = {
        authedUser: 'sarahedo',
        qid: '8xf0y6ziyjabvozdd253nd',
        answer: 'optionOne'
      };

      const result = await _saveQuestionAnswer(answer);
      expect(result).toBe(true);
    });

    it('should fail with invalid user', async () => {
      const answer = {
        authedUser: 'invalid_user',
        qid: '8xf0y6ziyjabvozdd253nd',
        answer: 'optionOne'
      };

      await expect(_saveQuestionAnswer(answer))
        .rejects.toBe('User not found');
    });
  });
});
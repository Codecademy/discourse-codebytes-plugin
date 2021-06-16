import { findCodeByte } from '../../../assets/javascripts/initializers/code-bytes';

jest.mock('discourse/lib/plugin-api', () => {}, { virtual: true });
jest.mock('discourse/lib/load-script', () => {}, { virtual: true });
jest.mock('discourse/lib/show-modal', () => {}, { virtual: true });

describe('findCodeByte', () => {
  it('finds empty codebytes at a given index', () => {
    const testString = [
      'test test test',
      '[codebyte language=javascript]',
      '[/codebyte]',
      '[codebyte]',
      '[/codebyte]',
    ];

    expect(findCodeByte(testString, 0)).toEqual([1, 2]);
    expect(findCodeByte(testString, 1)).toEqual([3, 4]);
  });

  it('finds single-line codebytes at a given index', () => {
    const testString = [
      'test test test',
      '[codebyte language=javascript]',
      'test',
      '[/codebyte]',
      '[codebyte]',
      'test',
      '[/codebyte]',
    ];

    expect(findCodeByte(testString, 0)).toEqual([1, 3]);
    expect(findCodeByte(testString, 1)).toEqual([4, 6]);
  });

  it('finds multi-line codebytes at a given index', () => {
    const testString = [
      'test test test',
      '[codebyte language=javascript]',
      'test',
      'test test test',
      '[/codebyte]',
      '[codebyte]',
      'test',
      'test test test',
      '[/codebyte]',
    ];

    expect(findCodeByte(testString, 0)).toEqual([1, 4]);
    expect(findCodeByte(testString, 1)).toEqual([5, 8]);
  });

  it('ignores inline codebytes', () => {
    const testString = [
      '[codebyte language=javascript]test[/codebyte]',
      '[codebyte]test[/codebyte]',
    ];

    expect(findCodeByte(testString, 0)).toEqual([]);
  });

  it('ignores codebytes with leading characters', () => {
    const testString = [
      'test[codebyte lang=javascript]',
      '[/codebyte]',
      '[codebyte language=javascript]',
      'test[/codebyte]',
      'test[codebyte]',
      '[/codebyte]',
      '[codebyte]',
      'test[/codebyte]',
    ];

    expect(findCodeByte(testString, 0)).toEqual([2, 5]);
    expect(findCodeByte(testString, 1)).toEqual([]);
  });

  it('ignores codebytes with trailing characters', () => {
    const testString = [
      '[codebyte lang=javascript]test',
      '[/codebyte]',
      '[codebyte language=javascript]',
      '[/codebyte]test',
      '[codebyte]test',
      '[/codebyte]',
      '[codebyte]',
      '[/codebyte]test',
    ];

    expect(findCodeByte(testString, 0)).toEqual([2, 5]);
    expect(findCodeByte(testString, 1)).toEqual([]);
  });

  it('ignores codebytes with an open tag spread across multiple lines', () => {
    const testString = [
      '[codebyte ',
      'language=javascript]',
      'console.log()',
      '[/codebyte]',
    ];

    expect(findCodeByte(testString, 0)).toEqual([]);
  });

  it('ignores un-terminated codebytes', () => {
    let testString = [
      'test test test',
      '[codebyte language=javascript]',
      'test',
      '[codebyte]',
    ];

    expect(findCodeByte(testString, 0)).toEqual([]);
  });

  it('ignores nested codebytes', () => {
    const testString = [
      'test test test',
      '[codebyte language=javascript]',
      '[codebyte]',
      'test',
      '[/codebyte]',
      '[/codebyte]',
      '[codebyte]',
      'test',
      '[/codebyte]',
    ];

    expect(findCodeByte(testString, 1)).toEqual([6, 8]);
  });
});

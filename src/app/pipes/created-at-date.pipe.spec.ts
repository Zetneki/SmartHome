import { CreatedAtDatePipe } from './created-at-date.pipe';

describe('CreatedAtDatePipe', () => {
  it('create an instance', () => {
    const pipe = new CreatedAtDatePipe();
    expect(pipe).toBeTruthy();
  });
});

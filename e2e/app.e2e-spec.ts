import { OptimumPrimePage } from './app.po';

describe('optimum-prime App', () => {
  let page: OptimumPrimePage;

  beforeEach(() => {
    page = new OptimumPrimePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});

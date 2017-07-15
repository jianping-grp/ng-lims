import { NgLimsPage } from './app.po';

describe('ng-lims App', () => {
  let page: NgLimsPage;

  beforeEach(() => {
    page = new NgLimsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

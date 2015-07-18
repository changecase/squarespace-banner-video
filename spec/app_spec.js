import { jQuery, $ } from "../node_modules/jquery/dist/jquery";
import BannerVideo from '../src/app.js';

describe("Banner Video", function () {
  let bannerVideo, jsonResponse;
  jasmine.getJSONFixtures().fixturesPath = 'base/spec/javascripts/fixtures/json/';

  beforeEach(function(){
    bannerVideo = new BannerVideo();
    jsonResponse = getJSONFixture('sqsPageData.json');
    jasmine.Ajax.install();
  });

  describe("#retrieve", function () {
    it("should be a method of the BannerVideo object", function () {
      expect( bannerVideo.retrieve() ).toBeDefined;
    });

  });
});


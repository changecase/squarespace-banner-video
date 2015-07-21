import $ from "../node_modules/jquery/dist/jquery";
import BannerVideo from '../src/app.js';

describe("Banner Video", function () {
  let bannerVideo, jsonResponse, jsonResponseNoVid, fixture;
  jasmine.getJSONFixtures().fixturesPath  = 'base/spec/javascripts/fixtures/json/';

  beforeEach(function() {
    bannerVideo = new BannerVideo();

    jsonResponse = getJSONFixture('sqsPageData.json');
    jsonResponseNoVid = getJSONFixture('sqsPageDataNoVid.json');

    jasmine.Ajax.stubRequest('/test?format=json').andReturn({
      "status": 200,
      "contentType": 'json',
      "responseText": jsonResponse
    });

    jasmine.Ajax.stubRequest('/does/not/exist?format=json').andReturn({
      "status": 400
    });

    jasmine.Ajax.stubRequest('/not/video/enabled').andReturn({
      "status": 200,
      "contentType": 'json',
      "responseText": jsonResponseNoVid
    });
  });

  describe("#retrieve", function () {
    beforeEach(function(){
      jasmine.Ajax.install();
    });

    afterEach(function(){
      jasmine.Ajax.uninstall();
    });

    it("should be a method of the BannerVideo object", function () {
      expect( bannerVideo.retrieve() ).toBeDefined;
    });

    describe("AJAX request", function () {
      var consoleSpy, result;

      it("should log text from the service to the console",function () {
        consoleSpy = spyOn(console, "log");
        result = bannerVideo.retrieve('/test');
        expect(consoleSpy).toHaveBeenCalledWith(jsonResponse);
      });

      it("should return an object if the customType is 'video-enabled-page'", function() {
        expect(bannerVideo.retrieve('/test')).toBeTruthy();
      });

      it("should NOT return an object if the customType is 'video-enabled-page'", function () {
        expect(bannerVideo.retrieve('/not/video/enabled')).toBe(false);
        expect(bannerVideo.retrieve('/does/not/exist')).toBe(false);
      });
    });
  });

  describe("#parse", function () {
    beforeEach(function(){
      jasmine.Ajax.install();
    });

    afterEach(function(){
      jasmine.Ajax.uninstall();
    });

    it("should return an object with mp4, ogv, and webm properties", function () {
        var json = bannerVideo.retrieve('/test'),
            result = bannerVideo.parse(json);

        expect(result.mp4).toBeDefined();
        expect(result.ogv).toBeDefined();
        expect(result.webm).toBeDefined();
    });
  });

  describe("#hideBanner", function () {
    let fixture;

    beforeEach(function () {
      jasmine.getFixtures().fixturesPath = 'base/spec/javascripts/fixtures';
    });

    it("should hide the banner image on the Five template", function () {
      fixture = loadFixtures('sqs-demo-five.html');

      bannerVideo.hideBanner();
      expect( $('#page-thumb img') ).toBeHidden();
    });
  });
});


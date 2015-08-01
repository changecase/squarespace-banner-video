import $ from "../node_modules/jquery/dist/jquery";
import BannerVideo from "../src/app";
import { getLocation } from "../src/util";

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
      var result;

      it("should return an object if the customType is 'video-enabled-page'", function() {
        expect(bannerVideo.retrieve('/test')).toBeTruthy();
      });

      it("should NOT return an object if the customType isn't 'video-enabled-page'", function () {
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
    let fixture,
    testHide = function (f,e,h) {
      h = h || true;
      fixture = loadFixtures('sqs-demo-' + f);
      bannerVideo.hideBanner();
      if (h == true) {
        expect( $('[data-image$="' + e + '"]') ).toBeHidden();
      } else {
        expect( $('[data-image$="' + e + '"]') ).not.toBeHidden();
      }
    };

    beforeEach(function () {
      jasmine.getFixtures().fixturesPath = 'base/spec/javascripts/fixtures';
    });

    it("should only grab the first image that matches the pattern", function () {
      fixture = loadFixtures('dup-page_thumb-img.html');
      bannerVideo.hideBanner();
      expect( $('#page-thumb img').first() ).toBeHidden();
      expect( $('#page-thumb img').last() ).not.toBeHidden();
    });

    it("should hide the banner image in the Five template", function () {
      testHide('five.html', '5209625883_4f8813122b_o.jpg');
    });

    describe("in the Bryant template", function () {
      it("should hide the banner image on landing pages", function () {
        testHide('bryant.html', 'trade14_0205.jpg');
      });
      it("should hide the banner image on availability pages", function () {
        testHide('bryant/availability.html', '20131006_Trade+128_0051.jpg');
      });
      it("should hide the banner image on contact pages", function () {
        testHide('bryant/contact.html', 'Trade+18_0559.jpg');
      });
    });

    describe("in the Hayden template", function () {
      it("should hide the banner image on landing pages", function () {
        testHide('hayden.html','hayden-header.jpg');
      });
      it("should hide the banner image on content pages", function () {
        testHide('hayden/about.html','Spaces05.jpg');
      });
      it("should hide the banner image on contact pages", function () {
        testHide('hayden/hire.html','NT03.jpg');
      });
      it("should hide the banner image on blog gallery pages", function () {
        testHide('hayden/blog.html','Stills22.jpg');
      });
      it("should hide the banner image on blog posts", function () {
        testHide('hayden/blog/post.html','/1410881502424/');
      });
    });

    describe("in the Adirondack template", function () {
      it("should hide the banner image on landing pages", function () {
        testHide('adirondack.html','rocks.jpg');
      });
      it("should NOT hide the banner image on store gallery pages", function () {
        testHide('adirondack/store.html','red-wool-shirt.jpg','false');
      });
      it("should NOT hide the banner image on store product pages", function () {
        testHide('adirondack/store/product.html','red-wool-shirt.jpg','false');
      });
    });

    describe("in the Momentum template", function () {
      it("should hide the banner image on landing pages", function () {
        testHide('momentum.html','/IMG_65044-sm.jpg');
      });
      it("should NOT hide the banner image on content pages", function () {
        testHide('momentum/about.html','/ea.jpg','false');
      });
    });

    describe("in the Horizon template", function () {
      it("should hide the banner image on landing pages", function () {
        testHide('horizon.html','EbruYildiz_325_edit.jpg');
      });
      it("should hide the banner image on content pages", function () {
        testHide('horizon/merch.html','EbruYildiz_508.jpg');
      });
    });

    describe("in the Anya template", function () {
      it("should hide the banner image on landing pages", function () {
        testHide('anya.html','roshni_blog_019.jpg');
      });
      it("should hide the banner image on content pages", function () {
        testHide('anya/location.html','IMG_1232.jpg');
      });
    });

    it("should hide the banner image in the Forte template", function () {
      testHide('forte.html','/1401465469651/12.jpg');
    });

    it("should hide the banner image in the Montauk template", function () {
      testHide('montauk.html','/wilderness.png');
    });

    describe("in the Native template", function () {
      it("should hide the banner image on landing pages", function () {
        testHide('native.html','/20130731_Trade+100_0275.jpg');
      });
      it("should NOT hide the top image on content pages", function () {
        testHide('native/about.html','/1383938643085/30.png','false');
      });
    });

    describe("in the Alex template", function () {
      it("should hide the top image on landing pages", function () {
        testHide('alex.html','/img_0330-darkened.jpg');
      });
      it("should hide the first image on image series pages", function () {
        testHide('alex/when.html','/img_0618-edit.jpg');
      });
      it("should hide the banner image on thin image pages", function () {
        testHide('alex/registry.html','/img_0531.jpg');
      });
    });

    describe("in the Shift template", function () {
      it("should hide the banner image on landing pages", function () {
        testHide('shift.html','/5472462536_79320276cf_o.jpg');
      });
      it("should hide the banner image on blog gallery pages", function () {
        testHide('shift/blog.html','/5471873265_eec607acdf_o.jpg');
      });
      it("should hide the banner image on blog posts", function () {
        testHide('shift/blog/post.html','/1412698041180/');
      });
    });

    describe("in the Adversary template", function () {
      it("should hide the banner image on landing pages", function () {
        testHide('adversary.html','/8323682210_7dadf47b8c_k.jpg');
      });
      it("should hide the banner image on content pages", function () {
        testHide('adversary/about.html','/8323677482_ef4ab9486d_k.jpg');
      });
    });

    describe("in the Pacific template", function () {
      it("should hide the banner image on landing pages", function () {
        testHide('pacific.html','/10748449035_09683a37e1_k.jpg');
      });
      it("should hide the banner on content pages", function () {
        testHide('pacific/page.html','/9226176954_72f0596f27_k.jpg');
      });
    });

    describe("in the Fulton template", function () {
      it("should hide the banner image on landing pages", function () {
        testHide('fulton.html','/IMG_3992-1.jpg');
      });
      it("should hide the banner image on blog gallery pages", function () {
        testHide('fulton/blog.html','/IMG_0587-1.jpg');
      });
      it("should NOT hide the banner image on blog posts", function () {
        testHide('fulton/blog/post.html','/5422e080e4b060d3c0a5f7bc/1411571854464/','false');
      });
      it("should hide the banner image on store gallery pages", function () {
        testHide('fulton/store.html','/TOP+VIEW-1.jpg');
      });
    });

    describe("in the Marquee template", function () {
      it("should hide the banner image on landing pages", function () {
        testHide('marquee.html','/IMG_4224-retouch.jpg');
      });
      it("should hide the banner image on content pages", function () {
        testHide('marquee/menu.html','/IMG_4508.jpg');
      });
      it("should NOT hide the banner image on blog gallery pages", function () {
        testHide('marquee/blog.html','/IMG_4607_sm.jpg','false');
      });
      it("should hide the banner image on blog posts", function () {
        testHide('marquee/blog/post.html','/IMG_4607_sm.jpg');
      });
    });

    describe("in the Bedford template", function () {
      it("should hide the banner image on landing pages", function () {
        testHide('bedford.html','/1391287287792/');
      });
      it("should hide the banner image on content pages", function () {
        testHide('bedford/about.html','/tumblr_mh1iruZWLf1rkz363o1_1280.jpg');
      });
      it("should hide the banner image on blog gallery pages", function () {
        testHide('bedford/blog.html','/tumblr_mozj7vv77C1rkz363o1_1280.jpg');
      });
      it("should hide the banner image on blog posts", function () {
        testHide('bedford/blog/post.html','/tumblr_mozj7vv77C1rkz363o1_1280.jpg');
      });
    });

    it("should hide the banner image in the Naomi template", function () {
      testHide('naomi.html','/amanda_blog_06.jpg');
    });

    describe("in the Charlotte template", function () {
      it("should hide the banner image on landing pages", function () {
        testHide('charlotte.html','/img_7297.jpg');
      });
      it("should hide the banner image on content pages", function () {
        testHide('charlotte/accommodations.html','img_6495.jpg');
      });
    });
  });

  describe("#replace", function () {
    let retrieveSpy, parseSpy, hideSpy, result;

    beforeEach(function () {
      retrieveSpy = spyOn(bannerVideo, "retrieve").and.returnValue(jsonResponse);
      parseSpy = spyOn(bannerVideo, "parse");
      hideSpy = spyOn(bannerVideo, "hideBanner");
      spyOn(getLocation, 'pathname').and.returnValue('/test');
      bannerVideo.replace();
    });

    it("should attempt to retrieve JSON data", function () {
      expect(retrieveSpy).toHaveBeenCalled();
    });

    it("should parse the JSON sent back", function () {
      expect(parseSpy).toHaveBeenCalled();
    });

    it("should hide the current banner image", function () {
      expect(hideSpy).toHaveBeenCalled();
    });
  });
});


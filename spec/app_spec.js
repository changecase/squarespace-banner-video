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

    it("should only grab the first image that matches the pattern", function () {
      fixture = loadFixtures('dup-page_thumb-img.html');

      bannerVideo.hideBanner();
      expect( $('#page-thumb img').first() ).toBeHidden();
      expect( $('#page-thumb img').last() ).not.toBeHidden();
    });

    it("should hide the banner image in the Five template", function () {
      fixture = loadFixtures('sqs-demo-five.html');

      bannerVideo.hideBanner();
      expect( $('[data-image$="5209625883_4f8813122b_o.jpg"]') ).toBeHidden();
    });

    describe("in the Bryant template", function () {
      it("should hide the banner image on landing pages", function () {
        fixture = loadFixtures('sqs-demo-bryant.html');

        bannerVideo.hideBanner();
        expect( $('[data-image$="trade14_0205.jpg"]') ).toBeHidden();
      });

      it("should hide the banner image on availability pages", function () {
        fixture = loadFixtures('sqs-demo-bryant/availability.html');

        bannerVideo.hideBanner();
        expect( $('[data-image$="20131006_Trade+128_0051.jpg"]') ).toBeHidden();
      });

      it("should hide the banner image on contact pages", function () {
        fixture = loadFixtures('sqs-demo-bryant/contact.html');

        bannerVideo.hideBanner();
        expect( $('[data-image$="Trade+18_0559.jpg"]') ).toBeHidden();
      });
    });

    describe("in the Hayden template", function () {
      it("should hide the banner image on landing pages", function () {
        fixture = loadFixtures('sqs-demo-hayden.html');

        bannerVideo.hideBanner();
        expect( $('[data-image$="hayden-header.jpg"]') ).toBeHidden();
      });

      it("should hide the banner image on content pages", function () {
        fixture = loadFixtures('sqs-demo-hayden/about.html');

        bannerVideo.hideBanner();
        expect( $('[data-image$="Spaces05.jpg"]') ).toBeHidden();
      });

      it("should hide the banner image on contact pages", function () {
        fixture = loadFixtures('sqs-demo-hayden/hire.html');

        bannerVideo.hideBanner();
        expect( $('[data-image$="NT03.jpg"]') ).toBeHidden();
      });

      it("should hide the banner image on blog gallery pages", function () {
        fixture = loadFixtures('sqs-demo-hayden/blog.html');

        bannerVideo.hideBanner();
        expect( $('[data-image$="Stills22.jpg"]') ).toBeHidden();
      });

      it("should hide the banner image on blog posts", function () {
        fixture = loadFixtures('sqs-demo-hayden/blog/post.html');

        bannerVideo.hideBanner();
        expect( $('[data-image$="/1410881502424/"]') ).toBeHidden();
      });
    });

    it("should hide the banner image in the Adirondack template", function () {
      fixture = loadFixtures('sqs-demo-adirondack.html');

      bannerVideo.hideBanner();
      expect( $('[data-image$="rocks.jpg"]') ).toBeHidden();
    });

    describe("in the Momentum template", function () {
      it("should hide the banner image on landing pages", function () {
        fixture = loadFixtures('sqs-demo-momentum.html');

        bannerVideo.hideBanner();
        expect( $('[data-image$="/IMG_65044-sm.jpg"]') ).toBeHidden();
      });
    });

    describe("in the Horizon template", function () {
      it("should hide the banner image on landing pages", function () {
        fixture = loadFixtures('sqs-demo-horizon.html');

        bannerVideo.hideBanner();
        expect( $('[data-image$="EbruYildiz_325_edit.jpg"]') ).toBeHidden();
      });

      it("should hide the banner image on content pages", function () {
        fixture = loadFixtures('sqs-demo-horizon/merch.html');

        bannerVideo.hideBanner();
        expect( $('[data-image$="EbruYildiz_508.jpg"]') ).toBeHidden();
      });
    });

    describe("in the Anya template", function () {
      it("should hide the banner image on landing pages", function () {
        fixture = loadFixtures('sqs-demo-anya.html');

        bannerVideo.hideBanner();
        expect( $('[data-image$="roshni_blog_019.jpg"]') ).toBeHidden();
      });

      it("should hide the banner image on content pages", function () {
        fixture = loadFixtures('sqs-demo-anya/location.html');

        bannerVideo.hideBanner();
        expect( $('[data-image$="IMG_1232.jpg"]') ).toBeHidden();
      });
    });

    it("should hide the banner image in the Forte template", function () {
      fixture = loadFixtures('sqs-demo-forte.html');

      bannerVideo.hideBanner();
      expect( $('[data-image$="/1401465469651/12.jpg"]') ).toBeHidden();
    });

    it("should hide the banner image in the Montauk template", function () {
      fixture = loadFixtures('sqs-demo-montauk.html');

      bannerVideo.hideBanner();
      expect( $('[data-image$="/wilderness.png"]') ).toBeHidden();
    });

    describe("in the Native template", function () {
      it("should hide the banner image on landing pages", function () {
        fixture = loadFixtures('sqs-demo-native.html');

        bannerVideo.hideBanner();
        expect( $('[data-image-id="52f94811e4b0a41caba7514a"]') ).toBeHidden();
      });

      it("should hide the circle banner image on content pages", function () {
        fixture = loadFixtures('sqs-demo-native/about.html');

        bannerVideo.hideBanner();
        expect( $('[data-image$="/1383938643085/30.png"]') ).toBeHidden();
      });
    });

    describe("in the Alex template", function () {
      it("should hide the top image on landing pages", function () {
        fixture = loadFixtures('sqs-demo-alex.html');

        bannerVideo.hideBanner();
        expect( $('[data-image$="/img_0330-darkened.jpg"]') ).toBeHidden();
      });

      it("should hide the first image on image series pages", function () {
        fixture = loadFixtures('sqs-demo-alex/when.html');

        bannerVideo.hideBanner();
        expect( $('[data-image$="/img_0618-edit.jpg"]') ).toBeHidden();
      });

      it("should hide the banner image on thin image pages", function () {
        fixture = loadFixtures('sqs-demo-alex/registry.html');

        bannerVideo.hideBanner();
        expect( $('[data-image$="/img_0531.jpg"]') ).toBeHidden();
      });
    });

    describe("in the Shift template", function () {
      it("should hide the banner image on landing pages", function () {
        fixture = loadFixtures('sqs-demo-shift.html');

        bannerVideo.hideBanner();
        expect( $('[data-image$="/5472462536_79320276cf_o.jpg"]') ).toBeHidden();
      });

      it("should hide the banner image on blog gallery pages", function () {
        fixture = loadFixtures('sqs-demo-shift/blog.html');

        bannerVideo.hideBanner();
        expect( $('[data-image$="/5471873265_eec607acdf_o.jpg"]') ).toBeHidden();
      });

      it("should hide the banner image on blog posts", function () {
        fixture = loadFixtures('sqs-demo-shift/blog/post.html');

        bannerVideo.hideBanner();
        expect( $('[data-image$="/1412698041180/"]') ).toBeHidden();
      });
    });

    describe("in the Adversary template", function () {
      it("should hide the banner image on landing pages", function () {
        fixture = loadFixtures('sqs-demo-adversary.html');

        bannerVideo.hideBanner();
        expect( $('[data-image$="/8323682210_7dadf47b8c_k.jpg"]') ).toBeHidden();
      });

      it("should hide the banner image on content pages", function () {
        fixture = loadFixtures('sqs-demo-adversary/about.html');

        bannerVideo.hideBanner();
        expect( $('[data-image$="/8323677482_ef4ab9486d_k.jpg"]') ).toBeHidden();
      });
    });

    describe("in the Pacific template", function () {
      it("should hide the banner image on landing pages", function () {
        fixture = loadFixtures('sqs-demo-pacific.html');

        bannerVideo.hideBanner();
        expect( $('[data-image$="/10748449035_09683a37e1_k.jpg"]') ).toBeHidden();
      });

      it("should hide the banner on content pages", function () {
        fixture = loadFixtures('sqs-demo-pacific/page.html');

        bannerVideo.hideBanner();
        expect( $('[data-image$="/9226176954_72f0596f27_k.jpg"]') ).toBeHidden();
      });
    });

    describe("in the Fulton template", function () {
      it("should hide the banner image on landing pages", function () {
        fixture = loadFixtures('sqs-demo-fulton.html');

        bannerVideo.hideBanner();
        expect( $('[data-image$="/IMG_3992-1.jpg"]') ).toBeHidden();
      });

      it("should hide the banner image on blog gallery pages", function () {
        fixture = loadFixtures('sqs-demo-fulton/blog.html');

        bannerVideo.hideBanner();
        expect( $('[data-image$="/IMG_0587-1.jpg"]') ).toBeHidden();
      });

      it("should hide the banner image on blog gallery pages", function () {
        fixture = loadFixtures('sqs-demo-fulton/blog.html');

        bannerVideo.hideBanner();
        expect( $('[data-image$="/IMG_0587-1.jpg"]') ).toBeHidden();
      });

      it("should hide the banner image on store gallery pages", function () {
        fixture = loadFixtures('sqs-demo-fulton/store.html');

        bannerVideo.hideBanner();
        expect( $('[data-image$="/TOP+VIEW-1.jpg"]') ).toBeHidden();
      });
    });

    describe("in the Marquee template", function () {
      it("should hide the banner image on landing pages", function () {
        fixture = loadFixtures('sqs-demo-marquee.html');

        bannerVideo.hideBanner();
        expect( $('[data-image$="/IMG_4224-retouch.jpg"]') ).toBeHidden();
      });

      it("should hide the banner image on content pages", function () {
        fixture = loadFixtures('sqs-demo-marquee/menu.html');

        bannerVideo.hideBanner();
        expect( $('[data-image$="/IMG_4508.jpg"]') ).toBeHidden();
      });

      it("should NOT hide the banner image on blog gallery pages", function () {
        fixture = loadFixtures('sqs-demo-marquee/blog.html');

        bannerVideo.hideBanner();
        expect( $('[data-image$="/IMG_4607_sm.jpg"]') ).not.toBeHidden();
      });

      it("should hide the banner image on blog posts", function () {
        fixture = loadFixtures('sqs-demo-marquee/blog/post.html');

        bannerVideo.hideBanner();
        expect( $('[data-image$="/IMG_4607_sm.jpg"]') ).toBeHidden();
      });
    });
  });
});


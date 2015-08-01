import $ from "../node_modules/jquery/dist/jquery";
import { getLocation } from "../src/util";

let rspObj = {},
    targetBanner;

class BannerVideo {
  retrieve(uri, callback = false) {
    let xhr = new XMLHttpRequest(),
        rsp;

    xhr.onreadystatechange = function (args) {
      if (this.readyState == this.DONE) {
        rsp = this.responseText;
      }
    };

    xhr.open("GET", uri + '?format=json');
    xhr.send();

    if (xhr.status == 200) {
      if (callback) { callback(); } 
      else          { return rsp; }

    } else {
      return false;
    }

  }

  parse(f, callback = false) {
    let that = this;

    if ( f.hasOwnProperty('items') && 
         f.items[0].hasOwnProperty('customContent') &&
         f.items[0].customContent.hasOwnProperty('customType') &&
         f.items[0].customContent.customType == 'video-enabled-page' 
       ) {
      rspObj.mp4  = f.items[0].customContent.mp4Source;
      rspObj.ogv  = f.items[0].customContent.ogvSource;
      rspObj.webm = f.items[0].customContent.webmSource;
    }

    if (callback) {
      callback(rspObj);
    } else {
      return rspObj;
    }
  }

  hideBanner() {
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      return;
    } else {
      this.findBanner();
      targetBanner.hide();
    }
  }

  insert(urlObj) {
    let $_video = $('<video class="bannerVideo" autoplay="" loop="" preload></video>'),
        sources = [];

    if (urlObj.mp4 && ( typeof urlObj.mp4 === "string" ) && ( urlObj.mp4.length > 0 )) {
      sources.push('<source src="/s/' + urlObj.mp4 + '" type="video/mp4">');
    }
    if (urlObj.webm && ( typeof urlObj.webm === "string" ) && ( urlObj.webm.length > 0 )) {
      sources.push('<source src="/s/' + urlObj.webm + '" type="video/webm; codecs=vp8,vorbis">');
    }
    if (urlObj.ogv && ( typeof urlObj.ogv === "string" ) && ( urlObj.ogv.length > 0 )) {
      sources.push('<source src="/s/' + urlObj.ogv + '" type="video/ogg; codecs=theora,vorbis">');
    }

    $_video.insertAfter(targetBanner);

    $.each(sources, function(index, value) {
      $_video.append(value);
    });
  }

  findBanner() {
    let banner = $('#pageWrapper .promoted-block-image img');

    if (banner.length === 0) { banner = $('.banner-thumbnail-wrapper > #thumbnail > img'); }
    if (banner.length === 0) { banner = $('#parallax-images img'); }
    if (banner.length === 0) { banner = $('.has-main-image .main-image img'); }
    if (banner.length === 0) { banner = $('.has-main-image .index-section-image img'); }
    if (banner.length === 0) { banner = $('.banner-image img'); }
    if (banner.length === 0) { banner = $('#page-thumb img'); }
    if (banner.length === 0) { banner = $('#fullscreenBrowser img'); }
    if (banner.length === 0) { banner = $('#hero img'); }
    if (banner.length === 0) { banner = $('.has-banner-image .gallery-wrapper img'); }
    if (banner.length === 0) { banner = $('.has-main-image .gallery-wrapper img'); }

    //console.log( banner[0] ); 
    //console.log(banner.selector);

    targetBanner = banner.first();
    return targetBanner;
  }

  replace() {
    let json,
       that = this, 
        
        parseInstructions = function (videos) {
          if (videos.mp4.length != 0 || videos.ogv.length != 0 || videos.webm.length != 0 ) {
            that.findBanner();
            that.hideBanner();
            that.insert(videos);
          } else {
            return false;
          }
        };

    json = that.retrieve(getLocation.pathname());
    that.parse(json, parseInstructions);
  }
};

export default BannerVideo;

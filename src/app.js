import $ from "../node_modules/jquery/dist/jquery";

class BannerVideo {
  retrieve(uri) {
    let xhr = new XMLHttpRequest(),
        rsp;

    xhr.onreadystatechange = function (args) {
      if (this.readyState == this.DONE) {
        console.log(this.responseText);
        rsp = this.responseText;
      }
    };

    xhr.open("GET", uri + '?format=json');
    xhr.send();

    if (xhr.status == 200) {
      return rsp;
    } else {
      return false;
    }
  }

  parse(f) {
    let rspObj = {};

    if ( f.hasOwnProperty('items') && 
         f.items[0].hasOwnProperty('customContent') &&
         f.items[0].customContent.hasOwnProperty('customType') &&
         f.items[0].customContent.customType == 'video-enabled-page' 
       ) {
      rspObj.mp4  = f.items[0].customContent.mp4Source;
      rspObj.ogv  = f.items[0].customContent.ogvSource;
      rspObj.webm = f.items[0].customContent.webmSource;
    }

    return rspObj;
  }

  hideBanner() {
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      return;
    } else {
      let banner = $('#pageWrapper img');

      if (banner.length === 0) { banner = $('.banner-thumbnail-wrapper > #thumbnail > img'); }
      if (banner.length === 0) { banner = $('.main-image img'); }
      if (banner.length === 0) { banner = $('#page-thumb img'); }

      banner.first().hide();
    }
  }
};

export default BannerVideo;

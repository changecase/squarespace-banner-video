let module = {};

module.getLocation = {
  pathname: function () {
              return window.location.pathname;
            }
};

export default module;

'use strict';

describe('Service: profilebadge', function () {

  // load the service's module
  beforeEach(module('headerDirectiveApp'));

  // instantiate service
  var profilebadge;
  beforeEach(inject(function(_profilebadge_) {
    profilebadge = _profilebadge_;
  }));

  it('should do something', function () {
    expect(!!profilebadge).toBe(true);
  });

});

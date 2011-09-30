describe("Reporting", function() {
	it("make sure bind still works", function() {
	  var test = $('<div>');
	  
	  test.bind('blah', function () {
	    expect(true).toEqual(true);
	  });
    function testFn() {
	    expect(false).toEqual(false);
    }
	  for (i = 0; i < 100; i++) {
	    test.bind('blah', testFn);
	  }
	  
	  test.trigger('blah');
	});
	
	it("records when bind is used", function () {
	  expect(BindTable.count()).toEqual(102);
	});

	it("records when trigger is used", function () {
	  expect(TriggerTable.count()).toEqual(101);
	});
});

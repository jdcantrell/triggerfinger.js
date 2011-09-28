describe("Reporting", function() {
	it("make sure bind still works", function() {
	  var test = $('<div>');
	  
	  test.bind('blah', function () {
	    expect(true).toEqual(true);
	  });
    function testFn() {
	    expect(false).toEqual(false);
    }
	  test.bind('blah', testFn);
	  
	  test.trigger('blah');
	  test.trigger('blah');
	});
	
	it("records when bind is used", function () {
	  expect(BindTable.count()).toEqual(2);
	});

	it("records when trigger is used", function () {
	  expect(TriggerTable.count()).toEqual(4);
	});
});

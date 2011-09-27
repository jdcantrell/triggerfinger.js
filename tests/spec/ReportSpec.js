describe("Reporting", function() {
	it("make sure bind still works", function() {
	  var test = $('<div>');
	  
	  test.bind('blah', function () {
	    expect(true).toEqual(true);
	  });
	  
	  test.trigger('blah');
	});
	
	it("records when bind is used", function () {
	  expect(BindTable.count()).toEqual(1);
	});
});
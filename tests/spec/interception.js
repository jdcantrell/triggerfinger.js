describe("Interception", function() {
	it("intercepts function", function() {
		
		var targetFunction, interception;
		
		targetFunction = function () {
		  return 'Whaddup?';
		};
		
		interception = new Interception({
		  postInterception: function (target, result) {
		    return result + ' Nothing.';
		  }
		});
		
		targetFunction = interception.intercept(targetFunction);
		
		expect(targetFunction()).toEqual('Whaddup? Nothing.');
		
	});
});
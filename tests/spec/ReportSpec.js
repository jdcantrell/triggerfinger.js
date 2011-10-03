$(document).ready(function () {
  describe("Reporting", function() {
    it("make sure bind still works", function() {
      var test = $('#tester');
      
      test.bind('customEvent', function () {
        expect(true).toEqual(true);
      });
      function testFn() {
        expect(false).toEqual(false);
      }
      test.trigger('customEvent');
      eventCounts = {'click': 0, mouseMove: 0, mouseLeave: 0}

      function fast() {};
      function slow() {
        var j = 0;
        for(var i = 0; i < 10000000; i++)
        {
          j += i * i;
        }
      };

      test.click(fast);
      test.click(slow);
      test.mousemove(function () {eventCounts.mouseMove += 1});
      test.mouseleave(function () {eventCounts.mouseLeave += 1});

      test.triggerHandler('click');
    });
    
    it("records when bind is used", function () {
      expect(BindTable.count()).toEqual(5);
    });

    it("records when trigger is used", function () {
      expect(TriggerTable.count()).toEqual(3);
    });


  });
});

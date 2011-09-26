describe('DataTable', function () {

  var fields = ['eventName', 'selector', 'fn', 'listenMethod'];
  var dt = new DataTable(fields);
  var record = {eventName:'click', selector: 'a', fn: function () {alert('hi');}, listenMethod: 'bind'};
  var record2 = {eventName:'mouseenter', selector: 'a', fn: function () {console.log('warn')}, listenMethod: 'bind'};
  var badRecord = {id:1, desc: 'hhhhhhiiii'};

  it('can add a bind record row', function () {
    expect(dt.add(record)).toEqual(1);
    expect(dt.get('eventName', 'click')).toEqual([record]);
  });

  it('can keep a count of rows added', function () {
    expect(dt.count()).toEqual(1);
    expect(dt.add(record2)).toEqual(1);
    expect(dt.count()).toEqual(2);
  });

  it('can remove a row', function () {
    expect(dt.remove('eventName', 'click')).toEqual(1);
    expect(dt.count()).toEqual(1);
    expect(dt.get('eventName', 'click')).toEqual([]);
    expect(dt.get('eventName', 'mouseenter')).toEqual([record2]);
  });


});

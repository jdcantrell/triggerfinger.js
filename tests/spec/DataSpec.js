describe('bindTable', function () {
  var fields = ['eventName', 'selector', 'function', 'listenMethod'];
  var record = {eventName:'click', selector: 'a', function: function () {alert('hi');}, listenMethod: 'bind'};
  var record2 = {eventName:'mouseenter', selector: 'a', function: function () {console.log('warn')}, listenMethod: 'bind'};
  var badRecord = {id:1, desc: 'hhhhhhiiii'};

  it('can add a bind record row', function () {
    expect(BindTable.add(record)).toEqual(1);
    expect(BindTable.get('eventName', 'click')).toEqual([record]);
  });

  it('can keep a count of rows added', function () {
    expect(BindTable.count()).toEqual(1);
    expect(BindTable.add(record2)).toEqual(1);
    expect(BindTable.count()).toEqual(2);
  });

  it('can remove a row', function () {
    expect(BindTable.remove('eventName', 'click')).toEqual(1);
    expect(BindTable.count()).toEqual(1);
    expect(BindTable.get('eventName', 'click')).toEqual([]);
    expect(BindTable.get('eventName', 'mouseenter')).toEqual([record2]);
  });


});

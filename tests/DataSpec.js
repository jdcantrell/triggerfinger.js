describe('bindTable', function () {
  var record = {id:1, desc:'here is a row'};
  var record2 = {id:2, desc:'here is a second row'};

  it('can add a bind record row', function () {
    BindTable.add(record);
    expect(BindTable.get('id', 1)).toEqual(record);
  });

  it('can keep a count of rows added', function () {
    expect(BindTable.count()).toEqual(1);
    BindTable.add(record2);
    expect(BindTable.count()).toEqual(2);
  });


});

function getSelectorName(record) {
  var selector = record.selector
  if (record.selector === "no selector")
  {
    try {
      selector = JSON.stringify(record.items);
    }
    catch (exception) {
      var item_names = [];
      record.items.each(function (idx, item) {
        var name = "";

        var id = typeof item.id != "undefined" ? item.id : false;
        var className = typeof item.className != "undefined" ? item.className : false;
        var node = typeof item.nodeName != "undefined" ? item.nodeName : false;

        if (item === document) {
          name = "Document";
        }
        else if (id) {
          name = '#' + item.id 
          if (className || node)
          {
            name += '(' 
                 + (node ? node : "") 
                 + (className ? "." + className : "")
                 + ')';
          }
        }
        else if (node) {
          if (className) {
            name = node + "." + className;
          }
          name = node
        }

        item_names.push(name);
      })
      selector = '(no selector)' + item_names.join(',');
    }
  }
  return selector;
}

function sortTable(table, field, sortFn) {
  var sortValues = [];
  var sortData = {};
  //collect sort values
  table.each(function (i, record) {
    if (typeof sortData[record[field]] === "undefined") 
    {
      sortValues.push(record[field]);
      sortData[record[field]] = [];
    }
    sortData[record[field]].push(record);
  });

  table.removeAll();
  sortValues.sort(sortFn);

  //reorder sort
  var i = 0;
  for (i = 0; i < sortValues.length; i += 1) 
  { 
    var data = sortData[sortValues[i]];
    for (j = 0; j < data.length; j += 1)
    {
      table.add(data[j]);
    }
  }
  return table;
}

function bindReport(sort) {
  var previousBindTime = 0, maxTime = 0, minTime = Date.now(), runTime = 0, bindCount = 0,
      itemCount = 0, reportRows = {}, selectors = {};

  var rows = "";
  reportTable = new DataTable(['Event', 'Selector', 'Function', 'Bind Time', 'Items Bound', 'Bind Gap']);

  BindTable.each(function (idx, record) {
    rec = {
      'Event': record.eventName,
      'Selector': getSelectorName(record) + '<a class="tf-view-selector" href="#">(view)</a>',
      'Function': getFnName(record) + '<a class="tf-view-function" href="#">(view)</a>',
     // 'Bind Time': record.bindTime + 'ms',
      'Items Bound': record.length,
      'Fired': 0,
      'Trigger Time':  0,
      'Bind Gap': previousBindTime != 0 ? (record.time - previousBindTime) + 'ms' : ' - '
    };

    var triggers = TriggerTable.get({bindGuid: record.guid});
    var i = 0;
    for (i = 0; i < triggers.length; i++)
    {
      if (record.items.has(triggers[i].item)) {
        rec['Fired'] += 1;
        rec['Trigger Time'] += triggers[i].runTime;
      }
    }
    if (rec['Fired'] !== 0)
    {
      rec['Trigger Time'] = Math.round(100 * rec['Trigger Time'] / rec['Fired']) / 100;
    }
    rec['Trigger Time'] += 'ms';


    reportTable.add(rec);
    previousBindTime = record.time;
    maxTime = Math.max(maxTime, record.time);
    minTime = Math.min(minTime, record.time);
    runTime += record.bindTime
    bindCount++;
    itemCount += record.length;
  });


  if (typeof sort !== 'undefined')
  {
    var sortFn;
    switch (sort) {
      case 'Items Bound':
      case 'Fired':
      case 'Trigger Time':
      case 'Bind Gap':
        sortFn = function (a ,b) { return parseFloat(b) - parseFloat(a); };
        break;
      case '_uid':
        sortFn = function (a ,b) { return parseFloat(a) - parseFloat(b); };
        break;
    }
    sortTable(reportTable, sort, sortFn);
  }

  var summaryRow1 = [];
  var summaryRow2 = [];
  summaryRow1.push('Total Binds: ' + bindCount);
  summaryRow1.push('Items Bounded:' + itemCount);
  summaryRow2.push('Time for all Binds: ' + (maxTime - minTime) + 'ms');
  summaryRow2.push('Time to Bind:' + runTime + 'ms');
  
  var bindTableDecoration = new DataDecoration(reportTable, {
    id: 'tf-bind-report',
    summaryHTML: '<table width="100%"><tr><td>' + summaryRow1.join('</td><td>') + '</td></tr><tr><td>' + summaryRow2.join('</td><td>') + '</td></tr></table>' 
  });
  bindTableDecoration.render();

  $('.tf-click-header').find('th').bindOriginal('click', function () {
    $('#tf-bind-report').remove();
    bindReport($(this).html());
  });

  $('#tf-bind-report').find('a').bindOriginal('click', function () {
    var anchor = $(this);
    var record = BindTable.get({'_uid':parseInt(anchor.parent().parent().children().last().html())});
    record = record.pop();
    if (typeof record !== 'undefined') {
      if (anchor.hasClass('tf-view-selector')) {
        console.log(record.items);
      }
      else {
        console.log(record.fn);
      }
      return false;
    }
  });
}

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

function bindReport() {
  var previousBindTime = 0, maxTime = 0, minTime = Date.now(), runTime = 0, bindCount = 0,
      itemCount = 0, reportRows = {}, selectors = {};

  var rows = "";
  reportTable = new DataTable(['Event', 'Selector', 'Function', 'Bind Time', 'Items Bound', 'Bind Gap']);

  BindTable.each(function (idx, record) {
    rec = {
      'Event': record.eventName,
      'Selector': getSelectorName(record) + '<a class="tf-view-selector" href="#">(view)</a>',
      'Function': getFnName(record) + '<a class="tf-view-function" href="#">(view)</a>',
      'Bind Time': record.bindTime + 'ms',
      'Items Bound': record.length,
      'Fired': 0,
      'Bind Gap': previousBindTime != 0 ? (record.time - previousBindTime) + 'ms' : ' - '
    };

    var triggers = TriggerTable.get({bindGuid: record.guid});
    var i = 0;
    for (i = 0; i < triggers.length; i++)
    {
      if (record.items.has(triggers[i].item)) {
        rec['Fired'] += 1;
      }
    }

    reportTable.add(rec);
    previousBindTime = record.time;
    maxTime = Math.max(maxTime, record.time);
    minTime = Math.min(minTime, record.time);
    runTime += record.bindTime
    bindCount++;
    itemCount += record.length;
  });

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

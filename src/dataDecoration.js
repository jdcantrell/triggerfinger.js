jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", (($(window).height() - this.outerHeight()) / 2) + $(window).scrollTop() + "px");
    this.css("left", (($(window).width() - this.outerWidth()) / 2) + $(window).scrollLeft() + "px");
    return this;
}

function getFnName(record) {
  fnName = record.fn.toString().match(/function ([a-zA-Z0-9_]*) ?\(/)[1];
  
  if (fnName === "") {
    fnName = "anonymous";
  }
  
  return fnName;
}

/* A representation of a DataTable. In this case it's an HTML table. This should be more abstract, but need to get it done. */
var DataDecoration = function(dataTable, options) {

  var ns = {},
      self = this,
      defaults = {
        id: 'tf-data-table',
        preContent: '',
        postContent: '',
      },
      table = $('<table class="tf-data-table"></table>'),
      container = $('<div class="tf-data-table-container"></div>'),
      rows = [];
  
  options = $.extend(defaults, options);
  container.attr('id', options.id);
  
  $(window).resize(function () {
    container.center();
  });
  
  // helpers
  var constructRow = function(record) {
    var row = '',
        lookupHash = options.fieldDecoration,
        lookup,
        val;
    
    for (fieldName in record) {      
      row += '<td>' + record[fieldName] + '</td>';
    }
    
    return '<tr>' + row + '</tr>';
  };
  
  var constructHead = function(fields) {
    var length = fields.length,
        tableHeader = '';
    
    for (var i = 0; i < length; i += 1) {
      tableHeader += '<th>' + fields[i] + '</th>';
    }
    
    return '<thead><tr>' + tableHeader + '</tr></thead>';
  };
  
  ns.render = function() {
    
    if ($('#' + options.id).length === 0) {
      ns.hide();
      
      dataTable.each(function (i, record) {
        rows.push(constructRow(record));
      });
      
      table.append(constructHead(dataTable.getFields()));
      
      table.append($('<tbody></tbody>').html(rows.join('\n')));
      
      container.css({
        position: 'relative',
        background: '#fafafa',
        width: '80%',
        border: '1px solid #ccc',
        zIndex: 2,
        fontSize: '12px',
        color: '#333',
        boxShadow: '0 0 30px rgba(0,0,0,0.2), 0 0 5px rgba(0,0,0,0.2)',
        borderBottom: '1px solid #fff',
        borderTop: '1px solid #ccc',
        borderLeft: '1px solid #ccc',
        borderRadius: '5px',
        fontFamily: 'menlo, monospace'
      });
      
      var tableWrapper = $('<div class="tf-table-wrapper"></div>').css({
        overflow: 'auto',
        height: '400px'
      });
      
      var headers = table.find('thead').clone();
      var headerTable = $('<table width="100%">');
      headerTable.append(headers);
      headerTable.css({
        width: '100%',
        textAlign: 'left',
        borderCollapse: 'collapse'
      });
      headerTable.find('th').first().css({
        borderTopLeftRadius: '5px'
      });
      headerTable.find('th').last().css({
        borderTopRightRadius: '5px'
      });
      container.append(headerTable);
      container.append(tableWrapper.append(table)).appendTo(document.body);
      
      
      if (options.summaryHTML)
      {
        var summary = $('<div>');
        var hr = $('<hr>');
        hr.css({width: '95%'});
        summary.css({width: '95%', margin: 'auto',fontSize: '12px'});
        summary.html(options.summaryHTML);



        container.append(hr);
        container.append(summary);
      }
      
      table.css({
        width: '100%',
        textAlign: 'left',
        borderCollapse: 'collapse',
        marginTop: '-25px'
      }).attr('cellspacing', 0).attr('cellpadding', 0).attr('border', 0);
      
      table.find('tbody').css({
        fontSize: '10px'
      });
      
      table.find('th').css({
        background: '#444',
        color: '#ddd',
        padding: '5px'
      });
      
      table.find('td').css({
        padding: '5px',
        background: '#fafafa'
      });
      
      table.before('<a href="#" class="tf-close">close</a>');
      
      this.closeButton = container.find('.tf-close');
      this.closeButton.css({
        background: '#444',
        color: '#fafafa',
        display: 'block',
        padding: '5px',
        textAlign: 'center',
        position: 'absolute',
        borderRadius:'8px',
        textDecoration: 'none',
        top: '-25px',
        right: 0
      });
      this.closeButton.click(function (e) {
        ns.destroy();
        e.preventDefault();
      });
      
      table.before(options.preContent);
      table.after(options.postContent);
      
      ns.show();

      //fix the widths on our fixed header
      var widths = [];
      table.find('th').each(function (idx, el) {
        widths[idx] = $(el).width();
      });
      headerTable.find('th').each( function (idx, el) {
        $(el).width(widths[idx]);
        $(el).css({
          background: '#444',
          color: '#ddd',
          padding: '5px'
        })
      });
      
      table.find('th').height(1);

      container.center();
    }
  };
  
  ns.show = function() {
    container.show();
  };
  
  ns.hide = function() {
    container.hide();
  };
  
  ns.destroy = function () {
    container.remove();
  };
  
  return ns;

};

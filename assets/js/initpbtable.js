function initRawTable(data) {
    var html = '<p>原料明细</p><table class="table table-striped table-bordered raw" style="font-size: 10px;padding:0;"><thead><tr><th>成品Id</th><th>成品名</th><th>订单数量</th><th>原料Id</th><th>原料名(单位)</th><th>单位</th><th>总量</th></tr></thead><tbody>';
    $.each(data, function(index, elem) {
        var total = elem.order_count;
        html += "<tr><td rowspan=" + elem.length + ">" + elem.product_id + "</td><td rowspan=" + elem.length + ">" + elem.product_name + "</td><td rowspan=" + elem.length + ">" + elem.order_count + "</td>";
        var first = 1;
        $.each(elem.components, function(index, elem) {
            if (first != 1) {
                html += "<tr>";
                first = 0;
            }
            html += "<td>" + elem.component_product_id + "</td><td>" + elem.component_product_name + "(" + elem.unit_code_name + ")" + "</td><td>" + elem.unit_quantity + "</td><td>" + elem.unit_quantity * total + "</td></tr>"
        });
    });
    html += '</tbody></table>';
    return html;

}

function initRawTotalTable(data) {
    var html = '<p>原料汇总</p><table class="table table-striped table-bordered raw-total" style="font-size: 10px;padding:0;"><thead><tr><th>原料Id</th><th>原料名</th><th>总量</th></tr></thead><tbody>';
    $.each(data, function(index, elem) {
        html += "<tr><td>" + elem.component_product_id + "</td><td>" + elem.component_product_name + "</td><td>" + elem.quantity + elem.unit_code_name + "</td></tr>";
    });
    html += '</tbody></table>';
    return html;
}

function initConsumableTable(data) {
    var html = '<p >耗材明细</p><table class="table table-striped table-bordered Consumable" style="font-size: 10px;padding:0;"><thead><tr><th>成品Id</th><th>成品名</th><th>包装Id</th><th>包装方案</th><th>订单数量</th><th>耗材Id</th><th>耗材名（单位）</th><th>单位数量</th><th>总量</th></tr></thead><tbody>';
    $.each(data, function(index, elem) {
        html += "<tr><td rowspan=" + elem.length + ">" + elem.product_id + "</td><td rowspan=" + elem.length + ">" + elem.product_name + "</td>";
        var first = 1;
        $.each(elem.packages, function(index, elem) {
            if (first != 1) {
                html += "<tr>";
                first = 0;
            }
            html += "<td rowspan=" + elem.length + ">" + elem.package_product_id + "</td><td rowspan=" + elem.length + ">" + elem.package_product_name + "</td><td rowspan=" + elem.length + ">" + elem.order_count + "</td>";
            var second = 1;
            var total = elem.order_count;
            $.each(elem.conponents, function(index, elem) {
                if (second != 1) {
                    html += "<tr>";
                    second = 0;
                }
                html += "<td>" + elem.supplies_product_id + "</td><td>" + elem.supplies_product_name + "(" + elem.unit_code_name + ")" + "</td><td>" + elem.unit_quantity + "</td><td>" + (total * elem.unit_quantity).toFixed(2) + "</td></tr> ";

            });
        });
    });
    html += '</tbody></table>';

    return html;
}

function initConsumableTotalTable(data) {
    var html = '<p>耗材汇总</p><table class="table table-striped table-bordered Consumable-total" style="font-size: 10px;padding:0;"><thead><tr><th>耗材Id</th><th>耗材名</th><th>总量</th></tr></thead><tbody>';
    $.each(data, function(index, elem) {
        html += "<tr><td>" + elem.supplies_product_id + "</td><td>" + elem.supplies_product_name + "</td><td>" + elem.quantity + elem.unit_code_name + "</td></tr>";
    });
    html += '</tbody></table>';
    return html;

}
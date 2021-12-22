$(function () {
    
    var orderTable = function () {
        const orderTableBody = $('.order-table-body');
        $.ajax({
            url: `${baseUrl}/api/dashboard`,
            cache: false,
            processData: false,
            headers: { Authorization: "Bearer " + jwt },
            contentType: false,
            type: 'GET',
            success: function (req) {
                console.log('req: ', req);
                req.orders.forEach(element => {
                    let firstTR = $('.first-element').clone().get(0);
                    const { order_id, url, title, unit_price, order_quantity, order_discount, order_KDV, order_count, unit } = element;
                    const price = calOrderPrice(order_quantity, order_KDV, order_discount, unit_price);
                    $(firstTR).removeClass('first-element')
                        .addClass('order-item');
                    $(firstTR).find('.order-id').text(order_id)
                    $(firstTR).find('.order-name').text(title);
                    $(firstTR).find('.order-price').text(`${price} TL/${unit}`);
                    $('.order-count').text(order_count)
                    orderTableBody.append($(firstTR));
                });
                $('.catalog-count').text(req.catalogs[0].catalog_count);
                $('.customer-count').text(req.customers[0].customer_count);

            },
            error: function (jqXHR, exception) {
            }
        });
    }

    orderTable();

});
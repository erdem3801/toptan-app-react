const ajaxDefaults = {
    contentType: false,
    processData: false,
    cache: false,
    headers: { Authorization: 'Baere ' + jwt }
}

let getData = async (url) => {
    const response = await $.ajax({
        url: url,
        type: 'GET',
        ...ajaxDefaults
    })
    return response;
}
let createData = async (url,data) => {
    const response = await $.ajax({
        url: url,
        type: 'POST',
        data: data,
        ...ajaxDefaults
    })
    return response;
}
let deleteData = async (url) => {
    const response = await $.ajax({
        url: url,
        type: 'POST',
        ...ajaxDefaults
    })
    return response;
}
let updateData = async (url, data) => {
    const response = await $.ajax({
        url: url,
        type: 'POST',
        data: data,
        ...ajaxDefaults
    })  
    return response;
}

let calOrderPrice = function (quantity, KDV, discount, price) {
    let returnPrice = price;
    returnPrice = returnPrice - returnPrice * (discount / 100);
    returnPrice = returnPrice + returnPrice * (KDV / 100);
    returnPrice = returnPrice * quantity;
    return returnPrice;
}
let elapsed = function (time) {
    let returnVal = {
        time: 0,
        date: 'seconds',
        update: time
    };
    let year = Math.round(time / (60 * 60 * 24 * 30 * 12)),
        mounth = Math.round(time / (60 * 60 * 24 * 30)),
        week = Math.round(time / (60 * 60 * 24 * 7)),
        day = Math.round(time / (60 * 60 * 24)),
        hour = Math.round(time / (60 * 60)),
        munit = Math.round(time / 60);
    if (year > 0) {
        returnVal.time = year;
        returnVal.date = 'Yıl';
    }
    else if (mounth > 0) {
        returnVal.time = mounth;
        returnVal.date = 'Ay';
    }
    else if (week > 0) {
        returnVal.time = week;
        returnVal.date = 'Hafta';
    }
    else if (day > 0) {
        returnVal.time = day;
        returnVal.date = 'Gün';
    }
    else if (hour > 0) {
        returnVal.time = hour;
        returnVal.date = 'Saat';
    }
    else if (munit > 0) {
        returnVal.time = munit;
        returnVal.date = 'Dakika';
    }
    else {
        returnVal.time = time;
        returnVal.date = 'Saniye';
    }
    return returnVal;
}
let elapsedTime = function (updated) {
    endTime = new Date();
    var regex = updated.split(/[- :]/);

    var startTime = new Date(Date.UTC(regex[0], regex[1] - 1, regex[2], regex[3] - 3, regex[4], regex[5]));
    startTime.toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })

    var timeDiff = endTime - startTime; //in ms
    // strip the ms
    timeDiff /= 1000;
    // get seconds 
    var seconds = Math.round(timeDiff);
    return elapsed(seconds);
}
let refreshDropdownOrder = (() => {
    $.ajax({
        url: `${baseUrl}/api/order`,
        cache: false,
        processData: false,
        headers: { Authorization: "Bearer " + jwt },
        contentType: false,
        type: 'GET',
        success: function (req) {
            const dropdownOrderBody = $('.dropdown-order'),
                dropdownDivider = $('.dropdown-divider').get(0),
                dropdownFooter = $('.dropdown-order-footer');
            let totalOrderPrice = 0;
            const firstDropdownItem = $('.dropdown-order-item').clone().get(0);
            dropdownOrderBody.html('');
            dropdownOrderBody.append($(firstDropdownItem));
            $('.order-count').text(0);
            req.forEach((element, index) => {
                const { order_id, url, title, unit_price, order_quantity, order_discount, order_KDV, updated } = element;
                const dropdownOrderItem = $('.dropdown-order-item').clone().get(0);
                const price = calOrderPrice(order_quantity, order_KDV, order_discount, unit_price);
                totalOrderPrice += price;
                // Apply each element to the Date function
                const elapsed = elapsedTime(updated);


                $(dropdownOrderItem).show();
                $(dropdownOrderItem).find('.title').text(title);
                $(dropdownOrderItem).find('.total-price span').text(`${price.toFixed(2)} TL`);
                $(dropdownOrderItem).find('.elapsed-time').text(`${elapsed.time} ${elapsed.date} Önce`)
                $(dropdownOrderItem).find('*[data-role="order-delete"]').attr('data-id', order_id);
                $(dropdownOrderItem).find('.thumbnail').attr('src', `${baseUrl}/${url}`);
                if (index < 10) {
                    dropdownOrderBody.append($(dropdownOrderItem)).append($(dropdownDivider));
                    $('.order-count').text(index + 1);
                }
            });
            dropdownOrderBody.append($(dropdownFooter));
            $('.total-order-price').text(`${totalOrderPrice.toFixed(2)} TL`);

        },
        error: function (jqXHR, exception) {
        }
    });
})();
let convertDate = function (sql_date) {
    const { year, mount, day } = sql_date.split('-');
    const date = new Date(Date.UTC(year, mount, day));
    return new Intl.DateTimeFormat('tr-TR', { dateStyle: 'long' }).format(date);
}

var handleError = function (err) {
    console.warn(err);
    return new Response(JSON.stringify({
        code: 400,
        message: 'Stupid network Error'
    }));
};

$('.dropdown-item').on('click', function () {
    const item = $(this).text();
    $(this).closest('.input-group-append').find('button').text(item);
    $(this).closest('.input-group-append').find('input').val(item);
    $(this).closest('.dropdown-menu').find('.dropdown-item').removeClass('active');
    $(this).addClass('active');
});
$('body').on('change', '*[type="file"]', function () {

    const isFile = $(this).get(0).files.length;
    let target = $(this).data('target');
    target = target != undefined ? target : 'thumbnail';
    var output = $(`#${target}`);
    if (isFile != 0) {
        var reader = new FileReader();
        reader.onload = function () {
            output.attr('src', reader.result);
        };
        reader.readAsDataURL($(this).get(0).files[0]);
    }
    else {
        const defaultSrc = $('#thumnail').data('src');
        output.attr('src', defaultSrc);
    }
});
$('.dropdown-order').on('click', '*[data-role="order-delete"]', function () {
    const orderId = $(this).data('id'),
        self = $(this);
    Swal.fire({
        icon: 'info',
        title: 'Sipariş silmek istediğinize eminmisiniz',
        showDenyButton: true,
        confirmButtonText: 'Evet',
        denyButtonText: 'Hayır'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: `${baseUrl}/api/order/remove/${orderId}`,
                cache: false,
                processData: false,
                headers: { Authorization: "Bearer " + jwt },
                contentType: false,
                type: 'GET',
                success: function (req) {
                    refreshDropdownOrder();
                },
                error: function (jqXHR, exception) {
                }
            });
        }
    });
});
// todo iskonto modal functions
$('.add-discount').click(function () {
    const discountForm = $('.discount-group').clone().get(0);
    discountModal = $('.discount-modal');
    $(discountForm).find('.discount-input').val('0');
    discountModal.append(discountForm);
});
$('.apply-discount').click(function () {
    const discounts = $('.discount-input');
    let discount = 1,
        totalDiscount = 0;
    discounts.each((index, element) => {
        discount *= 1 - (parseInt($(element).val()) / 100);
    });
    totalDiscount = 100 - (100 * discount);
    $('.total-discount').val(totalDiscount.toFixed(2));
});
$('.modal-body').on('input', '*[type="number"]', function () {
    const min = parseInt($(this).attr('min')),
        max = parseInt($(this).attr('max'));
    let numberInput = $(this).val();
    if (max != undefined && numberInput > max) {
        $(this).val(max);
    }
    else if (min != undefined && numberInput < 0) {
        $(this).val(min);
    }
});
// ! end iskonto modal functions

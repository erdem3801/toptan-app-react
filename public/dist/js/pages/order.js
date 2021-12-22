$(function () {
    const modalOverlay = $('.overlay'),
        modal = $("#orderFormModal");
    var groupColumn = 1;
    $('.changegroup').click(function () {
        // table.column(groupColumn).visible(true);
        // groupColumn = 6;
        // table.column(groupColumn).visible(false);
        // table.ajax.reload();
        if (history.pushState) {
            var currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('customer', 'ahmet');
            currentUrl.searchParams.set('order', 'iplik');
            window.history.pushState({ path: currentUrl.href }, '', currentUrl.href);
        }
    })
    var table = $("#orderTable").DataTable({
        ajax: {
            url: `${baseUrl}/api/order`,
            headers: { Authorization: "Bearer " + jwt },
            dataSrc: '',
        },
        columns: [
            {
                data: 'order_id',
                render: function (data, type, row) {
                    return `ORD-${data}`;
                }
            },
            { data: 'title' },
            {
                data: { order_quantity: 'order_quantity', order_KDV: 'order_KDV', order_discount: 'order_discount', unit_price: 'unit_price' },
                render: function (data, type, row) {
                    const totalPrice = calOrderPrice(data.order_quantity, data.order_KDV, data.order_discount, data.unit_price);
                    return `${totalPrice} TL`;
                }
            },
            {
                data: 'order_discount',
                render: function (data, type, row) {

                    return `%${parseFloat(data).toFixed(2)}`;
                }
            },
            {
                data: 'order_KDV',
                render: function (data, type, row) {
                    return `%${data}`;
                }
            },
            {
                data: 'order_quantity',
                render: function (data, type, row) {
                    return `%${data}`;
                }
            },
            { data: 'updated' },
          
            {
                data: { isActive: "isActive", order_id: "order_id" },
                render: function (data, type, row) {
                    const isChecked = data.order_isActive == 1 ? 'checked' : '';
                    return `<input type="checkbox" name="my-checkbox" class="change-status" data-bootstrap-switch data-off-text="PASİF" data-on-text="AKTİF" data-off-color="danger" data-on-color="success" data-role="update-order" data-id="${data.order_id}" ${isChecked}>`;
                }
            },
            {
                data: { order_id: 'order_id', name: 'name' },
                render: function (data, type, row) {
                    let silBtn = `<button class="btn btn-block btn-danger btn-sm" data-id="${data.order_id}" data-role="delete-order">Sil</button>`,
                        editBtn = `<button class="btn  btn-block btn-primary btn-sm" data-id="${data.order_id}" data-val="${data.name}" data-toggle="modal" data-target="#orderModal" data-role="edit-order">Düzenle</button>`;
                    return silBtn + editBtn;
                }
            },
        ],
        drawCallback: function (settings) {
            $('input[data-bootstrap-switch]').bootstrapSwitch();
            var api = this.api();
            var rows = api.rows({ page: 'current' }).nodes();
            var last = null;
            var subTotal = new Array();
            var groupID = 0;
            var aData = new Array();
            var index = 0;
            api.column(groupColumn, { page: 'current' }).data().each(function (group, i) {
                // 
                var vals = api.row(api.row($(rows).eq(i)).index()).data();
                
                
                const totalPrice = calOrderPrice(vals.order_quantity, vals.order_KDV, vals.order_discount, vals.unit_price);
                var salary = parseFloat(totalPrice);
                if (typeof aData[group] == 'undefined') {
                    aData[group] = new Array();
                    aData[group].rows = [];
                    aData[group].salary = [];
                }
                aData[group].rows.push(i);
                aData[group].salary.push(salary);
            });
            var idmax = 0; 
            var idmin = 0; 
            for (var groupName in aData) {
                idmax = Math.max.apply(Math, aData[groupName].rows);
                idmin = Math.min.apply(Math, aData[groupName].rows);
              
                
                
                var sum = 0;
                $.each(aData[groupName].salary, function (k, v) {
                    sum = sum + v;
                });
                
                $(rows).eq(idmin).before(
                    '<tr class="group bg-secondary"><td colspan="10">' + groupName + '</td> </tr>'
                );

                $(rows).eq(idmax ).after(
                    '<tr class="group"><td colspan="2"> Toplam </td>' +
                    '<td colspan="8">' + sum + '</td></tr>'
                );
               
               
            };
            //do whatever  
        },
        order: [[ groupColumn, 'desc' ]],
        responsive: true,
        lengthChange: true,
        displayLength: 25,
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
        
        autoWidth: false,
        columnDefs: [
            { visible: true, targets: groupColumn },
            { width: '8%', orderable: false, targets: [0,2,3,4,5,6,7,8] }, 
        ],
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'pdf',
                footer: false,
                exportOptions: {
                    columns: [0, 1]
                }
            },
            {
                extend: 'csv',
                footer: false,
                exportOptions: {
                    columns: [0, 1]
                }
            },
            {
                extend: 'excel',
                footer: false,
                exportOptions: {
                    columns: [0, 1]
                }
            }
        ]
    });
    table.on('click', 'tr.group', function () {
        var currentOrder = table.order()[0];
        if (currentOrder[0] === groupColumn && currentOrder[1] === 'asc') {
            table.order([groupColumn, 'desc']).draw();
        }
        else {
            table.order([groupColumn, 'asc']).draw();
        }
    });
    table.on('click', '.dtr-control', function () {
        $('input[data-bootstrap-switch]').bootstrapSwitch();
    });
    table.on('responsive-resize', function (e, datatable, columns) {
        $('input[data-bootstrap-switch]').bootstrapSwitch();
    });
    table.on('switchChange.bootstrapSwitch', '*[data-role="update-order"]', function (e) {
        const id = e.target.getAttribute('data-id'),
            self = $(this);
        Swal.fire({
            icon: 'question',
            text: 'siparişi durumunu değiştirmek istediğinize eminmisiniz?',
            showDenyButton: true,
            confirmButtonText: 'Evet',
            denyButtonText: 'Hayır'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `${baseUrl}/api/order/edit/${id}`,
                    cache: false,
                    processData: false,
                    contentType: false,
                    headers: { Authorization: "Bearer " + jwt },
                    type: 'GET',
                    success: function (req) {
                        Swal.fire({
                            icon: req.icon,
                            text: req.text,
                        });
                    },
                    error: function (qXHR, errorText, exception) {
                        self.bootstrapSwitch('toggleState', true);
                    }
                })
            }
            else {
                self.bootstrapSwitch('toggleState', true);

            }
        })
    });
    table.on('click', '*[data-role="edit-order"]', function () {
        const id = $(this).data('id'),
            orderModalConfirmButton = $('*[data-role="add-order-button"]');
        modal.modal('show');
        modalOverlay.show();
        orderModalConfirmButton.text('Siparişi güncelle')
        $.ajax({
            url: `${baseUrl}/api/order/${id}`,
            type: 'GET',
            processData: false,
            contentType: false,
            cache: false,
            headers: {
                Authorization: 'Beare ' + jwt
            },
            success: function (res) {
                const quantityInput = $('#quantity'),
                    discountInput = $('#total-discount'),
                    kdvInput = $('#kdv'),
                    titleInput = $('#orderModal-title');
                const { order_id, order_KDV, order_discount, order_quantity, title } = res;
                quantityInput.val(order_quantity);
                discountInput.val(order_discount);
                kdvInput.val(order_KDV);
                titleInput.text(`ORD-${order_id}  ${title}`);
                $('#orderForm').attr('data-action',`api/order/update/${order_id}`);

                modalOverlay.hide();
            },
            error: function (qXHR, exception) {
                if (qXHR.status == 401) {
                    alert('kullanıcı girişi yapıladı lütfen giriş yapın');
                }
            }
        });
    });
    table.on('click', '*[data-role="delete-order"]', function () {
        const id = $(this).data('id'),
            self = $(this);
        Swal.fire({
            icon: "question",
            text: 'Siparişi silmek istediğinize eminmisiniz ?',
            showDenyButton: true,
            denyButtonText: 'Hayır',
            confirmButtonText: 'Evet',
        }).then(result => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `${baseUrl}/api/order/remove/${id}`,
                    type: 'GET',
                    contentType: false,
                    processDAta: false,
                    cache: false,
                    headers: {
                        Authorization: 'Beare ' + jwt
                    },
                    success: function (res) {
                        Swal.fire({
                            icon: res.icon,
                            text: res.text
                        });
                        self.closest('tr.odd.parent').hide();
                    },
                    error: function (qXHR, exception) {
                        if (qXHR.status == 401)
                            alert('uzun zamandır giriş yapmadınız işleme devam etmek tekrar için giriş yapın.')
                    }
                });
            }
        });
    });
    $.validator.setDefaults({
        submitHandler: function (form) {
            event.preventDefault();
            modalOverlay.show();
            const action = $(form).attr('data-action'),
                formId = $(form).attr('id');
            let formData = new FormData(),
                data = $('.form-control').serialize();
            formData.append('data', data);
            $.ajax({
                url: `${baseUrl}/${action}`,
                data: formData,
                cache: false,
                processData: false,
                contentType: false,
                headers: { Authorization: "Bearer " + jwt },
                type: 'POST',
                success: function (res) {
                    // do something with the result
                    Swal.fire({
                        icon: res.icon,
                        title: res.text,
                        confirmButtonText: 'Tamam',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            modal.modal('hide');
                            table.ajax.reload();
                        }
                    })
                    modalOverlay.hide();
                },
                error: function (jqXHR, exception) {
                    Swal.fire({
                        icon: 'error',
                        title: 'İşlem sırasında hata oluştu.',
                        confirmButtonText: 'Tamam',
                    }).then((result) => {
                        if (result.isConfirmed) {
                        }
                    })
                    modalOverlay.hide();
                }
            });
        }
    });
    $('#orderForm').validate({
        rules: {
            name: {
                required: true,
            },
        },
        messages: {
            name: {
                required: "Müşteri bilgisini doldurun"
            },
        },
        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.form-group').append(error);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        }
    });
});
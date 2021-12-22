$(function () {

    const modalOverlay = $('.overlay');
    $('#customerTable').on('click' ,'.dtr-control',function(){
        $('input[data-bootstrap-switch]').bootstrapSwitch();
    });
    var table = $("#customerTable").DataTable({
        ajax: {
            url: `${baseUrl}/api/unit/all`,
            headers: { Authorization: "Bearer " + jwt },
            dataSrc: '',
        },
        columns: [
            {
                data: 'id',
                render: function (data, type, row) {
                    return `COS-${data}`;
                }
            },
            { data: 'name' },
            {
                data: { isActive: "isActive", id: "id" },
                render: function (data, type, row) {
                    const isChecked = data.isActive == 1 ? 'checked' : ''
                    return `<input type="checkbox" name="my-checkbox" ${isChecked} class="change-status" data-bootstrap-switch data-off-text="PASİF" data-on-text="AKTİF" data-off-color="danger" data-id="${data.id}" data-on-color="success">`;
                }
            },
            {
                data: { id: 'id', name: 'name' },
                render: function (data, type, row) {
                    let silBtn = `<button class="btn  btn-danger btn-sm mr-2" data-id="${data.id}" data-role="delete-customer">Sil</button>`,
                        editBtn = `<button class="btn  btn-primary btn-sm ml-2" data-id="${data.id}" data-val="${data.name}" data-toggle="modal" data-target="#customerModal" data-role="edit-customer">Düzenle</button>`;
                    return silBtn + editBtn;
                }
            },
        ],
        drawCallback: function () {
            $('input[data-bootstrap-switch]').bootstrapSwitch();
            //do whatever  
        },
        responsive: true,
        lengthChange: false,
        autoWidth: false,
        columnDefs: [
            { width: '10%', targets: 0 },
            { width: '20%', targets: 2 },
            { width: '20%', targets: 3 }
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
                extend: 'print',
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
    table.on( 'responsive-resize', function ( e, datatable, columns ) {
        $('input[data-bootstrap-switch]').bootstrapSwitch();
        
    } );
    
    $('#customerTable').on('click', '*[data-role="delete-customer"]', function () {
        const id = $(this).data('id');
        Swal.fire({
            icon: 'info',
            title: 'Müşteriyi silmek istediğinize eminmisiniz?',
            showDenyButton: true,
            denyButtonText: 'Hayır',
            confirmButtonText: 'Evet',
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `${baseUrl}/api/customer/remove/${id}`,
                    cache: false,
                    processData: false,
                    contentType: false,
                    headers: { Authorization: "Bearer " + jwt },
                    type: 'GET',
                    success: function (req) {
                        Swal.fire({
                            icon: req.icon,
                            title: req.title
                        })
                        table.ajax.reload();
                    },
                    error: function (qXHR, exception) {
                    }
                })
            }

        });
    });
    $('#customerTable').on('click', '*[data-role="edit-customer"]', function () {

        modalOverlay.show();
        const name = $(this).attr('data-val'),
            id = $(this).attr('data-id');
        $('#customerForm').attr('data-action', `api/customer/update/${id}`);
        $('input[name="name"]').val(name);
        modalOverlay.hide();

    });
    $('button[data-role="new-customer"]').on('click', function () {
        modalOverlay.show();

        $('#customerForm').attr('data-action', `api/customer/create`);
        $('input[name="name"]').val('');
        modalOverlay.hide();

    });
    $('.customer-table-body').on('switchChange.bootstrapSwitch', 'input[data-bootstrap-switch]', function (event, state) {
        const id = $(this).data('id');
        
        const self = $(event);
        Swal.fire({
            icon: 'info',
            title: 'Müşteri durumunu değiştirmek istiyormusunuz.',
            showDenyButton: true,
            denyButtonText: 'Hayır',
            confirmButtonText: 'Evet',
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `${baseUrl}/api/customer/edit/${id}`,
                    cache: false,
                    processData: false,
                    contentType: false,
                    headers: { Authorization: "Bearer " + jwt },
                    success: function (req) {
                        Swal.fire({
                            icon: req.icon,
                            title: req.title
                        });
                    },
                    error: function (qXHR, exception) {

                    }
                })
            }
            else {
                table.ajax.reload();
            }
        });
    });
    const refrestCustomerList = function () {
        table.ajax.reload();
    }
    $('*[data-role="new-customer"]').on('click', function () {
        modalOverlay.hide();
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
                success: function (data) {
                    // do something with the result
                    Swal.fire({
                        icon: 'success',
                        title: data,
                        confirmButtonText: 'Tamam',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            $("#customerModal").modal('hide');
                            refrestCustomerList();
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
    $('#customerForm').validate({
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
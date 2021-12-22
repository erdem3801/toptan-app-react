$(function () {

    const modalOverlay = $('.overlay');
    $.validator.setDefaults({
        submitHandler: function (form) {
            event.preventDefault();
            let formData = new FormData(),
                data = $(form).serialize();
            action = $(form).attr('data-action');
            formData.append('data', data);
            createData(`${baseUrl}/${action}`, formData)
                .then(res => {
                    Swal.fire({
                        icon: res.icon,
                        title: res.text,
                        confirmButtonText: 'Tamam',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            $(form).find('input').val('');
                            $(form).attr('data-action', `api/unit/create`)
                            table.ajax.reload();
                        }
                    })
                })
                .catch(error => console.log(error))
        }
    });

    $('#unitForm').validate({
        rules: {
            unitTitle: {
                required: true,
            },
            unitSymbol: {
                required: true,
            },

        },
        messages: {
            unitTitle: {
                required: "Birim başlığını girin"
            },
            unitSymbol: {
                required: "Birim sembolünü girin"
            }
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

    var table = $("#customerTable").DataTable({
        ajax: {
            url: `${baseUrl}/api/unit/all`,
            headers: { Authorization: "Bearer " + jwt },
            dataSrc: '',
        },
        columns: [
            {
                data: 'unit_id',
                render: function (data, type, row) {
                    return `UNI-${data}`;
                }
            },
            { data: 'unit_title' },
            { data: 'unit_symbol' },

            {
                data: { id: 'id', name: 'name' },
                render: function (data, type, row) {
                    let silBtn = `<button class="btn  btn-danger btn-sm mr-2" data-id="${data.unit_id}" data-role="delete-unit">Sil</button>`,
                        editBtn = `<button class="btn  btn-primary btn-sm ml-2" data-id="${data.unit_id}" data-role="edit-unit">Düzenle</button>`;
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

    table.on('click', '.dtr-control', function () {
        $('input[data-bootstrap-switch]').bootstrapSwitch();
    });

    table.on('responsive-resize', function (e, datatable, columns) {
        $('input[data-bootstrap-switch]').bootstrapSwitch();
    });

    table.on('click', '*[data-role="delete-unit"]', function () {
        const id = $(this).data('id');
        deleteData(`${baseUrl}/api/unit/delete/${id}`)
            .then(res => {
                table.ajax.reload();
            })
            .catch(error => console.log(error));
    });
    table.on('click', '*[data-role="edit-unit"]', function () {
        const id = $(this).data('id');
        getData(`${baseUrl}/api/unit/show/${id}`)
            .then(res => {
                console.log(res);
                $('#unitForm').attr('data-action', `api/unit/edit/${id}`)
                $('input[name="unitTitle"]').val(res.unit_title)
                $('input[name="unitSymbol"]').val(res.unit_symbol)
            })
            .catch(error => console.log(error));
    })



});
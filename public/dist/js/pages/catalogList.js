$(function () {

    let modalBody = $('.modal-body'),
        modalTitle = $('.modal-title'),
        modalFooter = $('.modal-footer'),
        modalOverlay = $('.overlay');
    let appendNumber = 10;
    let prependNumber = 1;
    $('#customerTable tbody').on('click', 'tr.group', function () {
        var currentOrder = table.order()[0];
        if (currentOrder[0] === groupColumn && currentOrder[1] === 'asc') {
            table.order([groupColumn, 'desc']).draw();
        }
        else {
            table.order([groupColumn, 'asc']).draw();
        }
    });
    var table = $("#customerTable").DataTable({
        ajax: {
            url: `${baseUrl}/api/catalog/all`,
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
            { data: 'title' },
            {
                data: 'unit_price',
                render: function (data, type, row) {
                    return `${data} TL`
                }
            },
            { data: 'unit' },
            {
                data: { isActive: "isActive", slug: "slug" },
                render: function (data, type, row) {
                    const isChecked = data.isActive == 1 ? 'checked' : ''
                    return `<input type="checkbox" name="my-checkbox" ${isChecked} class="change-status" data-bootstrap-switch data-off-text="PASİF" data-on-text="AKTİF" data-off-color="danger" data-slug="${data.slug}" data-on-color="success">`;
                }
            },
            {
                data: { slug: 'slug', title: 'title' },
                render: function (data, type, row) {
                    let silBtn = `<button class="btn btn-block btn-danger btn-xs" data-slug="${data.slug}" data-role="delete-catalog">Sil</button>`,
                        editBtn = `<button class="btn btn-block  btn-primary btn-xs" data-slug="${data.slug}" data-val="${data.title}" data-toggle="modal" data-target="#catalogModal" data-role="edit-catalog">Düzenle</button>`;
                    return silBtn + editBtn;
                }
            },
        ],

        drawCallback: function (settings) {
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
    table.on('responsive-resize', function (e, datatable, columns) {
        $('input[data-bootstrap-switch]').bootstrapSwitch();
    });
    table.on('click', '.dtr-control', function () {
        $('input[data-bootstrap-switch]').bootstrapSwitch();
    });
    table.on('switchChange.bootstrapSwitch', 'input[data-bootstrap-switch]', function (event, state) {
        const slug = $(this).data('slug');

        console.log('state: ', state);
        const self = $(this);
        Swal.fire({
            icon: 'question',
            text: 'Katalog durumunu değiştirmek istediğinize eminmisiniz?',
            showDenyButton: true,
            denyButtonText: 'Hayır',
            confirmButtonText: 'Evet',
        }).then(result => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `${baseUrl}/api/catalog/update/active?slug=${slug}`,
                    type: 'POST',
                    processData: false,
                    contentType: false,
                    cache: false,
                    headers: { Authorization: 'Baere ' + jwt },
                    success: function (res) {
                        Swal.fire({
                            icon: res.icon,
                            text: res.text
                        });
                    },
                    error: function (qXHR, exception) {
                        Swal.fire({
                            icon: qXHR.responseJSON.icon,
                            text: qXHR.responseJSON.text
                        });
                    }
                });
            }
            else {
                self.bootstrapSwitch('toggleState', true);
            }
        });
    });
    table.on('click', '*[data-role="delete-catalog"]', function () {
        const slug = $(this).data('slug');
        console.log('slug: ', slug);
        Swal.fire({
            icon: 'question',
            text: 'Katalog silmek istediğinize eminmisiniz ?',
            showDenyButton: true,
            denyButtonText: 'Hayır',
            confirmButtonText: 'Evet',
        }).then(result => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `${baseUrl}/api/catalog/delete/${slug}`,
                    type: 'POST',
                    processData: false,
                    contentType: false,
                    cache: false,
                    headers: { authorization: 'Baere ' + jwt },
                    success: function (res) {
                        Swal.fire({
                            icon: res.icon,
                            text: res.text
                        });
                        table.ajax.reload();
                    },
                    error: function (qXHR, exeption) {
                        console.log('qXHR: ', qXHR);
                        if (qXHR.status == 400) {
                            Swal.fire({
                                icon: qXHR.responseJSON.icon,
                                text: qXHR.responseJSON.text
                            });
                        }
                    }
                })
            }
        });

    })
    table.on('click', '*[data-role="edit-catalog"]', function () {
        modalOverlay.show();
        const img = $('#thumbnail'),
            stockButton = $('.unit-button'),
            title = $('#title'),
            price = $('#price'),
            unit = $('#unit'),
            fileInput = $('#file');
        slug = $(this).attr('data-slug');
        $('#catalogForm').attr('data-action', `catalog/edit/${slug}`);
        $.ajax({
            url: baseUrl + `/api/catalog/${slug}`,
            cache: false,
            processData: false,
            contentType: false,
            headers: { Authorization: "Bearer " + jwt },
            type: 'GET',
            success: function (data) {
                fileInput.val(null);
                img.attr('src', `${baseUrl}/${data.url}`);
                title.val(data.title);
                price.val(data.unit_price);
                unit.val(data.unit);
                stockButton.text(data.unit);

                // do something with the result
                modalOverlay.hide();
            },
            error: function (jqXHR, exception) {
                Swal.fire({
                    icon: 'error',
                    title: 'Ürün bulunamadı.',
                    confirmButtonText: 'Tamam',
                }).then((result) => {
                    if (result.isConfirmed) {
                        refreshCatalog();
                        refreshSwiper();
                        $("#catalogModal").modal('hide');
                    }
                })
                modalOverlay.hide();
            }
        });
    });
    $.validator.setDefaults({
        submitHandler: function (form) {
            event.preventDefault();
            //modalOverlay.show();
            const action = $(form).attr('data-action'),
                formId = $(form).attr('id');
            let formData = new FormData(),
                data = $('.form-control').serialize(),
                thumbnail = $('#file').get(0).files[0];
            formData.append('data', data);
            formData.append('thumbnail', thumbnail);
            $.ajax({
                url: `${baseUrl}/${action}`,
                data: formData,
                cache: false,
                processData: false,
                contentType: false,
                type: 'POST',
                headers: { Authorization: "Bearer " + jwt },
                success: function (data) {
                    // do something with the result
                    Swal.fire({
                        icon: 'success',
                        title: data,
                        confirmButtonText: 'Tamam',
                    }).then(result => {
                        table.ajax.reload();
                        $("#catalogModal").modal('hide');
                    });

                    modalOverlay.hide();
                },
                error: function (jqXHR, exception) {
                    Swal.fire({
                        icon: 'error',
                        title: 'İşlem sırasında hata oluştu.',
                        confirmButtonText: 'Tamam',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // $("#catalogModal").modal('hide');
                            // refreshCatalog();
                        }
                    })
                    modalOverlay.hide();
                }
            });
        }
    });
    $('#catalogForm').validate({
        rules: {
            title: {
                required: true,
            },
            price: {
                required: true,
            }
        },
        messages: {
            title: {
                required: "Başlık kısmını doldurun"
            },
            price: {
                required: "ürün fiyatını girin"
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
    $('*[data-role="new-catalog"]').on('click', function () {
        modalOverlay.show();
        const img = $('#thumbnail'),
            title = $('#title'),
            price = $('#price'),
            unit = $('#unit'),
            fileInput = $('#file');
        fileInput.val(null);

        img.attr('src', `${baseUrl}/public/dist/img/default/no-image.jpg`);
        title.val('');
        price.val('0');
        $('#catalogForm').attr('data-action', 'catalog/create');
        // createForm();
        modalOverlay.hide();
    });

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
        $('.total-discount').val(totalDiscount);
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
    $('button[data-filter]').on('click', function () {
        alert();
    })
});
$(function () {
    let modalBody = $('.modal-body'),
        modalTitle = $('.modal-title'),
        modalFooter = $('.modal-footer'),
        modalOverlay = $('.overlay');
    let appendNumber = 10;
    let prependNumber = 1;
    const swiper = new Swiper('.swiper', {
        slidesPerView: 1,
        observer: true,
        loop: true,
        observeParents: true,
        centeredSlides: true,
        autoHeight: true,
        spaceBetween: 30,
        pagination: {
            el: '.swiper-pagination',
            type: 'fraction',
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
    let refreshCatalog = function () {
        $.ajax({
            url: `${baseUrl}/api/catalog`,
            cache: false,
            processData: false,
            headers: { Authorization: "Bearer " + jwt },
            contentType: false,
            type: 'GET',
            success: function (req) {
                const ribbonsContainer = $('.ribbons-container');
                ribbonsContainer.html('');
                req.forEach((element, index) => {
                    const { id, title, slug, unit_price, unit, url } = element;
                    const colsm4 = $('<div />', { class: 'col-md-4 col-sm-6 mb-2' }),
                        ribbonContainer = $('<div />', { class: 'ribbon-container position-relative p-3 bg-gray', style: `background-image : url(${baseUrl}/${url})` }),
                        ribbonhref = $('<button />', { class: 'btn text-light modal-btn', 'data-toggle': 'modal', 'data-target': '#catalogViewModal', 'data-role': 'view-category', 'data-rank': index, 'data-title': title, 'data-price': unit_price, 'data-unit': unit }),
                        ribbonWraper = $('<div />', { class: 'ribbon-wrapper ribbon-xl' }),
                        ribbon = $('<div />', { class: 'ribbon bg-secondary' }),
                        editButton = $('<button />', { type: 'button', class: 'btn btn-tool mr-5', 'data-toggle': 'modal', 'data-target': '#catalogModal', 'data-id': id, 'data-role': 'edit-category', 'data-slug': slug }),
                        deleteButton = $('<button />', { type: 'button', class: 'btn btn-tool', 'data-id': id, 'data-role': 'delete-category', 'data-slug': slug }),
                        editIcon = $('<i />', { class: 'fas fa-wrench' }),
                        deleteIcon = $('<i />', { class: 'fas fa-trash' }),
                        textContainer = $('<div />', { class: 'text-container' }),
                        titleRibbon = $('<h2 />', { text: title }),
                        priceRibbon = $('<h4 />', { text: `${unit_price} TL/${unit}` });
                    editButton.append(editIcon);
                    deleteButton.append(deleteIcon);
                    ribbon.append(editButton).append(deleteButton);
                    ribbonWraper.append(ribbon);
                    textContainer.append(titleRibbon).append(priceRibbon);
                    ribbonhref.append(textContainer);
                    ribbonContainer.append(ribbonWraper);
                    ribbonContainer.append(ribbonhref);
                    colsm4.append(ribbonContainer);
                    ribbonsContainer.append(colsm4);
                    if ($('.edit-items').hasClass('active')) {
                        $('.ribbon-wrapper').fadeIn();
                    }
                    else {
                        $('.ribbon-wrapper').fadeOut();
                    }
                });
            },
            error: function (jqXHR, exception) {
            }
        });
    }
    let refreshSwiper = function () {
        const swiperWrapper = $('.swiper-wrapper');
        swiperWrapper.html('');
        $.ajax({
            url: `${baseUrl}/api/catalog`,
            cache: false,
            processData: false,
            headers: { Authorization: "Bearer " + jwt },
            contentType: false,
            type: 'GET',
            success: function (req) {
                req.forEach(element => {
                    const { id, url, slug, title, unit, unit_price } = element;
                    const swiperSlide = $('<div />', { class: 'swiper-slide' }),
                        img = $('<img>', { class: 'img-thumbnail', alt: 'thumbnail', src: `${baseUrl}/${url}`, 'data-id': id, 'data-title': title, 'data-unit': unit, 'data-price': unit_price });
                    swiperSlide.append(img);
                    swiperWrapper.append(swiperSlide);
                });
                swiper.update();
            },
            error: function (jqXHR, exception) {
            }
        });
    }
    let refreshOrder = function () {
        $.ajax({
            url: `${baseUrl}/api/order`,
            cache: false,
            processData: false,
            headers: { Authorization: "Bearer " + jwt },
            contentType: false,
            type: 'GET',
            success: function (req) {
                const orderBody = $('.order-body');
                let totalOrderPrice = 0;
                const firstItem = $('.order-item').clone().get(0);
                orderBody.html('');
                orderBody.append($(firstItem));
                req.forEach((element, index) => {
                    const { order_id, url, title, unit_price, order_quantity, order_discount, order_KDV, updated } = element;
                    const orderItem = $('.order-item').clone().get(0);
                    const price = calOrderPrice(order_quantity, order_KDV, order_discount, unit_price);
                    totalOrderPrice += price;
                    // Apply each element to the Date function
                    $(orderItem).show();
                    $(orderItem).find('.title').text(title);
                    $(orderItem).find('.total-price span').text(`${price.toFixed(2)} TL`);
                    $(orderItem).find('*[data-role="order-delete"]').attr('data-id', order_id);
                    $(orderItem).find('*[data-role="order-edit"]').attr('data-id', order_id);
                    $(orderItem).find('.img-thumbnail').attr('src', `${baseUrl}/${url}`);
                    orderBody.append($(orderItem));

                });
                $('.total-order-price').text(`${totalOrderPrice.toFixed(2)} TL`);
            },
            error: function (jqXHR, exception) {
            }
        });
    }
    refreshOrder();
    refreshSwiper();
    refreshCatalog();
    swiper.on('slideChangeTransitionStart', function () {
        const activeImg = $('.swiper-slide-active img');
        $('.catalogViewModal-title').text(`${activeImg.data('title')} - ${activeImg.data('price')}  TL/${activeImg.data('unit')}`)
    });
   
    $('*[data-role="add-cart"]').on('click', function () {
        const activeImg = $('.swiper-slide-active img');
        $('#unit-btn').html(activeImg.data('unit'));
        $('#catalog-id').val(activeImg.data('id'))
    });
    $('.order-body').on('click', '*[data-role="order-delete"]', function () {
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
                        refreshOrder();
                        refreshDropdownOrder();

                    },
                    error: function (jqXHR, exception) {
                    }
                });
            }
        });
    });
    $('*[data-role="new-category"]').on('click', function () {
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
        $('#catalogForm').attr('data-action', 'api/catalog/create');
        // createForm();
        modalOverlay.hide();
    });
    $('.ribbons-container').on('click', '*[data-role="view-category"]', function () {
        modalOverlay.show();
        const rank = $(this).data('rank'),
            title = $(this).data('title'),
            price = $(this).data('price'),
            unit = $(this).data('unit');
        swiper.slideTo(rank, 0);
        $('.catalogViewModal-title').html(`${title} - ${price} TL/${unit}`);
        modalOverlay.hide();
    });
    $('.ribbons-container').on('click', '*[data-role="edit-category"]', function () {
        modalOverlay.show();
        const img = $('#thumbnail'),
            title = $('#title'),
            price = $('#price'),
            buttonunit = $('.unit-button'),
            inputunit = $('.unit-input'),
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
                buttonunit.text(data.unit);
                inputunit.val(data.unit);
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
    $('.ribbons-container').on('click', '*[data-role="delete-category"]', function () {
        // TODO :  eğer ürün için sipariş varsa siparişleri silmek istediği sorulacak
        const slug = $(this).attr('data-slug'),
            self = $(this);
        Swal.fire({
            icon: 'info',
            title: 'Ürün silmek istiyormusunuz ?',
            showDenyButton: true,
            confirmButtonText: 'Evet',
            denyButtonText: 'Hayır',
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: baseUrl + `/api/catalog/delete/${slug}`,
                    cache: false,
                    processData: false,
                    contentType: false,
                    headers: { Authorization: "Bearer " + jwt },
                    type: 'POST',
                    success: function (data) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Ürün Silindi.',
                            confirmButtonText: 'Tamam',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                self.closest('.col-sm-4').fadeOut();
                            }
                        })
                    },
                    error: function (jqXHR, exception) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Ürün Silinemedi.',
                            confirmButtonText: 'Tamam',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                refreshCatalog();
                                refreshSwiper();
                                $("#catalogModal").modal('hide');
                            }
                        })
                    }
                })
            }
        })
    })

    $('.edit-items').on('click', function () {
        const self = $(this)
        modalButtons = $('.modal-btn');
        if (self.hasClass('active')) {
            $('.ribbon-wrapper').fadeOut();
            self.removeClass('active');
            modalButtons.removeClass('disabled');
        }
        else {
            $('.ribbon-wrapper').fadeIn();
            self.addClass('active');
            modalButtons.addClass('disabled');
        }
    })
    $(".btn").on("click", function (event) {
        if ($(this).hasClass("disabled")) {
            event.stopPropagation()
        }
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
                success: function (res) {
                    // do something with the result
                    Swal.fire({
                        icon: res.icon,
                        title: res.text,
                        confirmButtonText: 'Tamam',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            if (formId == 'catalogForm') {
                                refreshCatalog();
                                refreshSwiper();
                                $("#catalogModal").modal('hide');
                            } else if (formId == 'orderForm') {
                                $("#orderFormModal").modal('hide');
                                refreshOrder();
                                refreshDropdownOrder();

                            }
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
    $('#orderForm').validate({
        rules: {
            discount: {
                required: true,
            },
            quantity: {
                required: true,
            },
            kdv: {
                required: true,
            }
        },
        messages: {
            discount: {
                required: "Siparişe iskonto uygulanmadı"
            },
            quantity: {
                required: "Sipariş için miktar verilmedi"
            },
            kdv: {
                required: "KDV uygulanmadı"
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
});
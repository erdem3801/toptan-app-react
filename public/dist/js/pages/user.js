$(function () {
    $.validator.setDefaults({
        submitHandler: function (form) {
            event.preventDefault();
            const formId = $(form).attr('id');

            const action = $(form).attr('data-action');
            const method = $(form).attr('data-method');
            let formData = new FormData(),
                data = $(form).serialize();

            formData.append('data', data);
            $.ajax({
                url: `${baseUrl}/${action}`,
                data: formData,
                cache: false,
                processData: false,
                contentType: false,
                type: method,
                success: function (data) {
                    console.log('data: ', data);
                    // do something with the result
                    const redirectTo = getCookie('redirectTo');
                    console.log('redirectTo: ', redirectTo);
                    if (redirectTo){
                        window.location.href = redirectTo;
                        setCookie('redirectTo',window.location.href,-1);

                    }
                    else
                        window.location.href = baseUrl + data.href;

                },
                error: function (jqXHR, exception) {
                    Swal.fire({
                        icon: 'error',
                        title: 'İşlem sırasında hata oluştu.',
                        confirmButtonText: 'Tamam',
                    });
                    console.log(exception, jqXHR.status)
                }
            });
        }
    });
    $('#loginForm').validate({
        rules: {
            user: {
                required: true,
            },
            password: {
                required: true,
            }
        },
        messages: {
            user: {
                required: "kullanıcı adı veya mail adresinizi girin"
            },
            password: {
                required: "şifrenizi girin"

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
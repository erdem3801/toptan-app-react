let loadUsers = (async () => {
    getData(`${baseUrl}/api/users/all`)
        .then(users => {
            users.forEach(element => {
                const item = $('.first-element').clone().get(0),
                    $item = $(item);
                updateUserCard($item, element);
                $('.first-element').after($item)
            });
        })
        .catch(async (error) => {
            const result = await Swal.fire({
                icon: 'warning',
                text: 'Uzun süredir giriş yapmadınız güvenlik için tekrar giriş yapın',
                confirmButtonText: 'Evet'
            });
            if (result) {
                setCookie('redirectTo', window.location.href, 1);
                window.location.href = `${baseUrl}/login`;
            }
        })
})();
let updateUserCard = function ($item, data) {
    const { id, name,password, type, email } = data;
    console.log('password: ', password);
    $item.removeClass('first-element').attr('data-key', id);
    $item.find('.widget-user-username input').val(name);
    $item.find('input[name="email"]').val(email);
    $item.find('input[name="password"]').val(password);

    $item.find('.edit-button').attr('data-target', id);
    $item.find('.delete-button').attr('data-target', id);
    $item.find('.user-status').val(type);
    $item.find('.widget-user-image input').attr('id', `input-user-${id}`).attr('data-target', `thumbnail-user-${id}`);
    $item.find('.widget-user-image .change-thumbnail').attr('data-target', `input-user-${id}`);
    $item.find('.widget-user-image #thumbnail').attr('id', `thumbnail-user-${id}`);
    $item.find('input[data-bootstrap-switch]').bootstrapSwitch();
    $item.find('[data-mask]').inputmask();
}
$('.row').on('click', '.edit-button', function () {
    const target = $(this).data('target'),
        isActive = $(this).hasClass('active');
    // clear all atrubutes
    $('input[type="text"],.user-status').prop('disabled', true).removeClass('border-info  border-width-2 active').addClass('border-0')
    $('.visible').hide();
    $('.hidden').hide();
    $(this).removeClass('active');
    if (!isActive) {
        $(`*[data-key="${target}"]`).find('input,.user-status').prop('disabled', false).addClass('border-info  border-width-2 active').removeClass('border-0')
        $(`*[data-key="${target}"]`).find('.visible').show();
        $(`*[data-key="${target}"]`).find('.hidden').show();
        $(this).addClass('active');
    }
})
$('.row').on('click', '.delete-button', async function () {
    const target = $(this).data('target');
    console.log('target: ', target);
    const result = await Swal.fire({
        icon: 'question',
        text: 'Kullanıcıyı silmek istyediğinize eminmisiniz ?',
        showDenyButton: true,
        denyButtonText: 'Hayır',
        confirmButtonText: 'Evet'
    });
    if (result.isConfirmed) {
        deleteData(`${baseUrl}/api/users/delete/${target}`).then(user => {
            console.log('user: ', user);
            Swal.fire({
                icon: 'info',
                text: 'Kullanıcı Silindi',
                timer: 1500,
                showConfirmButton: false
            })
            $(`*[data-key="${target}"]`).remove();
        })
    }
})
$('.row').on('click', '.change-thumbnail', function () {
    const target = $(this).data('target');
    $(`#${target}`).click();
})
$('.row').on('change', 'input , select', function () {
    const data = $(this).closest('.col-md-4').find('input,select').serialize();
    const id = $(this).closest('.col-md-4').data('key');
    const fd = new FormData();
    fd.append('data',data);
    updateData(`${baseUrl}/api/users/update/${id}`)
        .then(response => console.log('response: ', response))
        .catch(error => console.log('error: ', error));
})
$('button[data-role="new-user"]').on('click', function () {
    createData(`${baseUrl}/api/users/create`).then(user => {
        const item = $('.first-element').clone().get(0),
            $item = $(item);
        updateUserCard($item, user);
        $item.removeClass('first-element');
        // clear all atrubutes
        $('input[type="text"],.user-status').prop('disabled', true).removeClass('border-info  border-width-2 active').addClass('border-0')
        $('.visible').hide();
        $('.hidden').hide();
        
        $item.addClass('active');
        $('.first-element').after($item);

        $(`*[data-key="${user.id}"]`).find('input,.user-status').prop('disabled', false).addClass('border-info  border-width-2 active').removeClass('border-0')
        $(`*[data-key="${user.id}"]`).find('.visible').show();
        $(`*[data-key="${user.id}"]`).find('.hidden').show();

    }).catch(error => {
        Swal.fire({
            icon: 'error',
            text: 'İşlem sırasında hata oluştu',
            confirmButtonText: 'Evet'
        });
    })
})

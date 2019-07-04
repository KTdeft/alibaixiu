$('#modifyForm').on('submit', function() {
  var formData = $(this).serialize()
  $.ajax({
    type: 'put',
    url: '/users/password',
    data: formData,
    success: function() {
      alert('密码修改成功，请重新登录');
      location.href = '/admin/login.html'
    }
  })
  return false
})
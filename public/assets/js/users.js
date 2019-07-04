// 当表单发生提交行为
$('#userForm').on('submit', function() {
  // 获取表单中输入的内容，并将其格式化为参数字符串
  var formData = $(this).serialize()
  // 向服务器发送添加用户请求
  $.ajax({
    type:'post',
    url:'/users',
    data: formData,
    success:function() {
      alert('用户添加成功');
      location.reload()
    },
    error:function() {
      alert('用户添加失败');
    }
  })
  return false
})

// 当用户选择文件的时候
$('#avatar').on('change', function() {
  // 用户选择到的文件
  // this.files[0]
  var formData = new FormData()
  
  formData.append('avatar', this.files[0])

  $.ajax({
    type:'post',
    url:'/upload',
    data: formData,
    // 告诉$.ajax方法不要解析请求参数
    processData: false,
    // 告诉$.ajax方法不要设置请求参数的类型
    contentType: false,
    success: function (response) {
      // 返回上传之后的图片地址
      $('#preview').attr('src', response[0].avatar)
      $('#hiddenAvatar').val(response[0].avatar)
    }
  })
})
// 当表单发生提交行为
$('#userForm').on('submit', function () {
  // 获取表单中输入的内容，并将其格式化为参数字符串
  var formData = $(this).serialize()
  // 向服务器发送添加用户请求
  $.ajax({
    type: 'post',
    url: '/users',
    data: formData,
    success: function () {
      alert('用户添加成功');
      location.reload()
    },
    error: function () {
      alert('用户添加失败');
    }
  })
  return false
})

// 当用户选择文件的时候 通过事件委托触发
$('#formBox').on('change', '#avatar', function () {
  // 用户选择到的文件
  // this.files[0]
  var formData = new FormData()

  formData.append('avatar', this.files[0])

  $.ajax({
    type: 'post',
    url: '/upload',
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

// 显示用户列表
$.ajax({
  type: 'get',
  url: '/users',
  success: function (res) {
    var html = template('userTpl', {
      data: res
    })
    $('#usersBox').html(html)
  }
})

// 当切换全选input的时候，下面所有的input跟着来改变状态
$('#selectAll').on('change', function () {
  var bool = $(this).prop('checked')
  $('#usersBox').find('.status').prop('checked', bool)
  // 根据是否全选来 显隐 批量删除
  if (bool == true) {
    $('#deleteMany').show()
  } else {
    $('#deleteMany').hide()
  }
})

// 当tbody中的input全部选中时，我们就让全选也是选中状态
$('#usersBox').on('change', '.status', function () {
  // 获取所有的input框
  var inputs = $('#usersBox').find('.status')
  if (inputs.length == inputs.filter(':checked').length) {
    $('#selectAll').prop('checked', true)
  } else {
    $('#selectAll').prop('checked', false)
  }
  // input框的勾选数量 >= 2时，显示批量删除
  if (inputs.filter(':checked').length >= 2) {
    $('#deleteMany').show()
  } else {
    $('#deleteMany').hide()
  }
})

// 实现用户删除 通过事件委托
$('#userBox').on('click', '.delete', function () {
  if (confirm('整的要删除次用户吗')) {
    var id = $(this).attr('data-id')
    $.ajax({
      type: 'delete',
      url: '/users/' + id,
      success: function () {
        location.reload()
      }
    })
  }
})

// 实现批量删除
$('#deleteMany').on('click', function () {
  if (confirm('确定要删除吗？')) {
    // 先找到所有 选中的input
    var selectAll = $('#usersBox').find('.status').filter(':checked')
    var arr = []
    // 使用jQ中的 each方法遍历
    selectAll.each(function (index, domEle) {
      // console.log(domEle);
      // console.log($(domEle).attr('data-id'));
      arr.push($(domEle).attr('data-id'))
    })
    // 发送删除请求
    $.ajax({
      type: 'delete',
      url: '/users/' + arr.join('-'),
      data: {},
      success: function (result) {
        location.reload()
      }
    })
  }
})

// 实现用户编辑 通过事件委托
$('#usersBox').on('click', '.edit', function () {
  // 获取被点击用户的id
  var id = $(this).attr('data-id')
  // 根据id获取详细信息
  $.ajax({
    type: 'get',
    url: '/users/' + id,
    success: function (res) {
      // console.log(res);
      var html = template('modifyFormTpl', res)
      $('#formBox').html(html)
    }
  })
})

// 提交修改后的表单
$('#formBox').on('submit', '#userForm', function () {
  // 收集表单数据
  // console.log($(this).serialize());
  var formData = $(this).serialize()
  var id = $(this).attr('data-id')
  $.ajax({
    type: 'put',
    url: '/users/' + id,
    data: formData,
    success: function (res) {
      alert('信息修改成功');
      location.reload()
    }
  })
  return false
})
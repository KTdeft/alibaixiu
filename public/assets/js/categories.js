// 添加分类
$('#addCategory').on('submit', function() {
  $.ajax({
    type: 'post',
    url: '/categories',
    data: $(this).serialize(),
    success: function(){
      location.reload()
    }
  })
  return false
})

// 展示分类列表数据
$.ajax({
  type:'get',
  url:'/categories',
  success:function(result){
    // console.log(result)
    var html = template('categoryListTpl',{data: result})
    $('#categoryList').html(html)
  }
})

// 编辑功能实现
$('#categoryList').on('click', '.edit', function() {
  var id = $(this).attr('data-id')
  // console.log(id)
  $.ajax({
    type:'get',
    url:'/categories/' + id,
    success:function(result){
      console.log(result)
      var html = template('modifyFormTpl', result)
      $('#formBox').html(html)
    }
  })
})

// 编辑功能提交
$('#formBox').on('submit', '#modifyCategory', function() {
  //获取管理员在表单中输入的内容
  var formData = $(this).serialize();
  //获取要修改的分类id
  var id = $(this).attr('data-id');
  $.ajax({
    type: 'put',
    url: '/categories/' + id,
    data: formData,
    success: function() {
      location.reload();
    }
  })
  //阻止表单默认行为
  return false;
})

// 当切换全选input的时候，下面所有的input跟着来改变状态
$('#selectAll').on('change', function () {
  var bool = $(this).prop('checked')
  $('#categoryList').find('.status').prop('checked', bool)
  // 根据是否全选来 显隐 批量删除
  if (bool == true) {
    $('#deleteMany').show()
  } else {
    $('#deleteMany').hide()
  }
})

// 当tbody中的input全部选中时，我们就让全选也是选中状态
$('#categoryList').on('change', '.status', function () {
  // 获取所有的input框
  var inputs = $('#categoryList').find('.status')
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
$('#categoryList').on('click', '.delete', function () {
  if (confirm('真的要删除此分类吗')) {
    var id = $(this).attr('data-id')
    $.ajax({
      type: 'delete',
      url: '/categories/' + id,
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
    var selectAll = $('#categoryList').find('.status').filter(':checked')
    // console.log(selectAll);
    var arr = []
    // 使用jQ中的 each方法遍历
    selectAll.each(function (index, domEle) {
      // console.log(domEle);
      // console.log($(domEle).attr('data-id'));
      arr.push($(domEle).attr('data-id'))
    })
    // console.log(arr);
    // 发送删除请求
    $.ajax({
      type: 'delete',
      url: '/categories/' + arr.join('-'),
      data: {},
      success: function (result) {
        location.reload()
      }
    })
  }
})
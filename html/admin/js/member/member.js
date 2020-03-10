layui.use(["layer", "laypage", 'form'], function () {
  //用户总数
  let count;
  //获取用户总数
  $.ajax({
    url: '/jewelryEvaluation/admin/user/getUserCount',
    type: 'GET',
    async: false,
    contentType: "application/json",
    success: function (result) {
      if (isSuccess(result)) {
        count = result.count;
      }
    }
  });
  //初始化分页
  var laypage = layui.laypage;
  //执行一个laypage实例
  laypage.render({
    elem: "elem", //注意，这里的 test1 是 ID，不用加 # 号
    limit: 10,//一行最多显示个数
    count: count, //数据总数，从服务端得到
    jump: function (obj, first) {
      //第一次默认加载第一页
      if (first) {
        obj.curr = 1;
      }
      //获取用户列表
      $.ajax({
        url: "/jewelryEvaluation/admin/user/getAllUser",
        type: "POST",
        data: JSON.stringify(obj.curr),
        contentType: "application/json",
        success: function (result) {
          if (isSuccess(result)) {
            let data = result.data;
            const tbody = $("tbody");
            //清空表格内容
            tbody.empty();
            //添加内容
            const userList = JSON.parse(data.userList);
            for (const i in userList) {
              const str = joint(userList[i]);
              tbody.append(str);
            }
            //渲染选中框
            const form = layui.form;
            form.render('checkbox');
          } else {
            //返回登录页面
            loginPage();
          }
        },
        error: function (xhr, status, error) {
          //返回登录页面
          loginPage();
        }
      });
    }
  });
});


//拼接表格内容
function joint(user) {
  let str;
  str = '\
  <tr>\
    <td>\
      <input type="checkbox" name="id" value="'+user.userId+'" lay-skin="primary">\
    </td>\
    <td>'+ user.userId + '</td>\
    <td>'+ user.username + '</td>\
    <td>'+ user.email + '</td>\
    <td>'+ user.phoneNumber + '</td>\
    <td>'+ user.lastVisitTime + '</td>\
    <td>'+ user.creatTime + '</td>\
    <td class="td-status">\
    ';
  if (user.status === 0) {
    str = str + '\
      <span class="layui-btn layui-btn-normal layui-btn-mini">已启用</span>\
      </td>\
      <td class="td-manage">\
        <a onclick="member_stop(this,'+user.userId+')" href="javascript:;" title="停用">\
        <i class="layui-icon">&#xe601;</i>\
      ';
  } else {
    str = str + '\
      <span class="layui-btn layui-btn-normal layui-btn-mini layui-btn-disabled">已停用</span>\
      </td>\
      <td class="td-manage">\
        <a onclick="member_stop(this,'+user.userId+')" href="javascript:;" title="启用">\
        <i class="layui-icon">&#xe62f;</i>\
      ';
  }
  str = str + '\
      </a>\
      <a title="编辑" onclick="xadmin.open(\'编辑\',\'member-edit.html?userId='+user.userId+'\',600,330)" href="javascript:;">\
        <i class="layui-icon">&#xe642;</i>\
      </a>\
      <a onclick="xadmin.open(\'修改密码\',\'member-password.html?userId='+user.userId+'\',600,225)" title="修改密码" href="javascript:;">\
        <i class="layui-icon">&#xe631;</i>\
      </a>\
      <a title="删除" onclick="member_del(this,'+user.userId+')" href="javascript:;">\
        <i class="layui-icon">&#xe640;</i>\
      </a>\
    </td>\
  </tr>\
  ';
  return str;
}

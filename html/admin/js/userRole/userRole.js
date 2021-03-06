layui.use(["layer", "laypage", 'form'], function () {
    //珠宝总数
    let count;
    //获取用户总数
    $.ajax({
        url: '/jewelryEvaluation/admin/userRole/getUserRoleCount',
        type: 'GET',
        async: false,
        contentType: "application/json",
        success: function (result) {
            if (isSuccess(result)) {
                count = result.data.count;
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
                url: "/jewelryEvaluation/admin/userRole/getAllUserRole",
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
                        const userRoleList = JSON.parse(data.userRoleList);
                        for (const i in userRoleList) {
                            const str = joint(userRoleList[i]);
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
function joint(userRole) {
    let str;
    str = '\
  <tr>\
    <td>\
      <input type="checkbox" name="id" value="' + userRole.id + '" lay-skin="primary">\
    </td>\
    <td>' + userRole.id + '</td>\
    <td>' + userRole.user.userId + '</td>\
    <td>' + userRole.user.username + '</td>\
    <td>' + userRole.role.roleId + '</td>\
    <td>' + userRole.role.roleName + '</td>\
    <td class="td-status">\
    ';
    str = str + '\
      </a>\
      <a title="编辑" onclick="xadmin.open(\'编辑\',\'userRole-edit.html?id=' + userRole.id + '\',600,330)" href="javascript:;">\
        <i class="layui-icon">&#xe642;</i>\
      </a>\
      <a title="删除" onclick="member_del(this,' + userRole.id + ')" href="javascript:;">\
        <i class="layui-icon">&#xe640;</i>\
      </a>\
    </td>\
  </tr>\
  ';
    return str;
}

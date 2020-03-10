//用户登录
layui.use("form", function() {
  //判断是否已存在 token
  if (window.localStorage.getItem("token") !== undefined) {
      //验证 token 的有效性
      if (checkToken()) {
      route('index.html');
    }
  }

  const form = layui.form;
  //监听提交
  form.on("submit(login)", function(data) {
    layer.msg('登录中...');
    const param = data.field;
    $.ajax({
      url: "/jewelryEvaluation/admin/user/login",
      type: "POST",
      // 后端通过 @HttpRequestBody直接接收
      data: JSON.stringify(param),
      contentType: "application/json",
      success: function(result) {
        if (isSuccess(result)) {
          let data = result.data;
          layer.msg('登录成功');
          //存储 token
          window.localStorage.setItem("token", data.token);
          //页面跳转
          route('index.html');
        } else {
          let msg = result.msg;
          layer.msg(msg);
        }
      },
      error: function(xhr, status, error) {
        layer.msg('登陆失败:服务器错误');
      }
    });
    return false;
  });
  
});

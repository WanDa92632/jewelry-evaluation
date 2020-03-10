//设置全局参数
$.ajaxSetup({
    async: true, // 默认同异加载
    type: "POST", // 默认使用POST方式
    contentType: "application/json",
    dataType: 'json',
    headers: { // 默认添加请求头
        "Authorization": "Bearer " + window.localStorage.getItem("token"),
    }
});

//检验 token 的有效性
function checkToken() {
    let isEffective = false;
    $.ajax({
        url: "/jewelryEvaluation/admin/user/tokenCheck",
        type: "POST",
        async: false,
        contentType: "application/json",
        success: function (result) {
            isEffective = isSuccess(result);
        },
        error: function (xhr, status, error) {
            isEffective = false;
        }
    });
    return isEffective;
}

/**清空 token **/
function deleteToken() {
    window.localStorage.removeItem("token");
    //跳转登录页面
    loginPage();
}

/**跳转到其他页面**/
function route(url) {
    //判断是否存在 token，其他页面都需要登录后才能访问， 减少了未登录时，访问其他页面的请求次数。
    if (window.localStorage.getItem("token") === undefined) {
        alert(window.localStorage.getItem("token"));
        layer.msg("请在登录后访问！", {icon: 4, time: 500}, function name() {
            loginPage();
        });
    }
    location.href = url;
}

function getQueryVariable(variable) {
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split("=");
        if (pair[0] === variable) {
            return pair[1];
        }
    }
    return false;
}

// 判断请求是否成功
function isSuccess(data) {
    if (data.status===200){
        return true;
    }
}

/*跳转到登录页面*/
function loginPage() {
    top.location.href = 'login.html';
}

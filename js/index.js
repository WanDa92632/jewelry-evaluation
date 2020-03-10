let chosenMap = {};

layui.use(['form', 'carousel', 'layer', 'element'], function () {
    var form = layui.form,
        $ = layui.jquery,
        carousel = layui.carousel,
        element = layui.element,
        layer = layui.layer;

    // 加载珠宝饰品选择框
    loadPage();

    // 监听表单提交
    form.on('submit(formSubmit)', function (data) {
        // layer.msg(JSON.stringify(data.field));
        layer.msg('价格评估中...', {
            icon: 16,
            shade: 0.01,
            time: 0
        });

        // 禁用提交按钮
        $("#formSubmit").addClass('layui-btn-disabled');
        let formData = data.field;
        $.ajax({
            url: "/jewelryEvaluation/frontend/evaluation/" + data.field.type,
            type: "POST",
            data: JSON.stringify(formData),
            contentType: "application/json",
            success: function (result) {
                // 开启禁用按钮
                $("#formSubmit").removeClass('layui-btn-disabled');
                // 关闭加载提示  提示
                layer.close(layer.msg());
                if (isSuccess(result)) {
                    let msg = result.msg + ":" + result.data.price;
                    layer.msg(msg);
                }
            },
            error:function (result) {
                // 开启禁用按钮
                $("#formSubmit").removeClass('layui-btn-disabled');
            }
        });
        return false;
    });

    // 监听饰品类别选择，显示相应的详细选项
    form.on('select(type)', function (data) {
        let name = data.elem.name; // 元素 name
        let id = "#" + name; // 元素 id
        const type = data.value; // 得到被选中的值
        const text = $(id + ' option:selected').text(); // 获取选中的文本
        let typeInfo = $('#type_info');
        if (type === "") {
            chosenMap = {};
            // 隐藏参数选择框
            $("#parameter").slideUp();
            // 隐藏类别详细信息
            typeInfo.slideUp();
        } else {
            // 获取简介
            $.get("/jewelryEvaluation/frontend/jewelry/jewelry?jewelryCode=" + type, function (result, status) {
                if (isSuccess(result)) {
                    let data = result.data;
                    typeInfo.html(data.jewelry.jewelryIntroduction);
                    // 显示珠宝饰品简介
                    typeInfo.slideDown("slow");
                } else {
                    layer.msg(result.msg);
                }
            });
            // 避免重复选择同种类珠宝饰品，导致所选参数清空
            if (text !== chosenMap["type"]) {
                // 渲染珠宝属性选择
                loadParameterSelect(type);
            }
        }

    });

    // 监听参数选择，显示相应的种类介绍
    form.on('select(parameter)', function (data) {
        // TODO 显示相应的种类介绍
        let name = data.elem.name;
        let id = "#" + name;
        const value = data.value; // 得到被选中的值
        if (value === "") {
            // 隐藏种类详细信息
            $(id + "Content").slideUp();
        } else {
            // 获取简介
            $.get("/jewelryEvaluation/frontend/jewelry/parametervalue?parameterValueCode=" + value, function (result, status) {
                if (isSuccess(result)) {
                    let data = result.data;
                    if (data.parameterValue.parameterIntroduction !== null) {
                        let parameterIntroduction = data.parameterValue.parameterIntroduction;
                        if (parameterIntroduction !== null && parameterIntroduction.length > 0) {
                            let str = "<p>";
                            str += parameterIntroduction;
                            /*预览图片*/
                            str += "<a href='javascript:' class='layui-btn layui-btn-xs layui-btn-radius layui-btn-primary' id='view_image'>点击查看预览图片</a>";
                            str += "</p>";
                            $(id + "Content").html(str);
                            $(id + "Content").slideDown("slow");
                        }
                    }
                } else {
                    layer.msg(result.msg);
                }
            });
        }
    });

    /**
     * 添加已选择标签
     */
    form.on('select()', function (data) {
        let name = data.elem.name; // 元素 name
        let id = "#" + name; // 元素 id
        const value = data.value; // 得到被选中的值
        const text = $(id + ' option:selected').text(); // 获取选中的文本
        if (value === "") {
            delete chosenMap[name];
        } else {
            if (name === "type" && chosenMap.hasOwnProperty("type") && chosenMap[name] !== text) {
                chosenMap = {};
            }
            chosenMap[name] = text;
        }
        loadButton();
    });

    // 重新加载已选择标签
    function loadButton() {
        $("#chosen").html("");
        for (let key in chosenMap) {
            var text = " <div class='layui-btn layui-btn-sm layui-btn-radius layui-btn-primary data'>" + chosenMap[key] + "</div>";
            $('#chosen').append(text)
        }
    }

    // 初始化轮播图
    carousel.render({
        elem: '#test1'
        , width: '100%' //设置容器宽度
        , height: '200px'
        , arrow: 'always' //始终显示箭头
        //,anim: 'updown' //切换动画方式
    });

    // 查看样图
    $('#parameter').on('click', '#view_image', function () {
        // TODO 通过来链接获取图片，图片存放在云上
        $.getJSON('../image/img.json', function (json) {
            layer.photos({
                photos: json
                , anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
            });
        });
    });

    // 渲染参数选择框
    function loadParameterSelect(typeValue) {
        $.ajax({
            url: "/jewelryEvaluation/frontend/jewelry/parameter",
            type: "GET",
            data: {
                jewelryCode: typeValue
            },
            contentType: "application/json",
            success: function (result) {
                if (isSuccess(result)) {
                    let data = result.data;
                    let parameter = $("#parameter");
                    // 清空参数选项
                    parameter.html("");
                    form.render('select');
                    // 参数列表
                    const parameterList = data.parameterList;
                    for (const i in parameterList) {
                        if (!parameterList.hasOwnProperty(i)) continue;
                        // 参数索引
                        const id = "index_" + parameterList[i].parameterIndex;
                        const index = "#index_" + parameterList[i].parameterIndex;
                        let str = "<div class='layui-form-item'>";
                        // 判断参数类型 选择框/文本框
                        if (parameterList[i].parameterValueList.length <= 0) {
                            str = str + "<input type='text' class='layui-input' name='" + parameterList[i].parameterCode + "' required lay-verify='required' lay-filter='parameter' placeholder='请输入" + parameterList[i].parameterName + "' autocomplete='off'>";
                        } else {
                            str = str + "<select id='" + parameterList[i].parameterCode + "' name='" + parameterList[i].parameterCode + "' lay-verify='required' lay-filter='parameter'>";
                            // 参数值列表
                            var parameterValueList = parameterList[i].parameterValueList;
                            str = str + "<option value=''>请选择" + parameterList[i].parameterName + "</option> ";
                            // 初始化参数数组
                            // 其他选项
                            for (var j in parameterValueList) {
                                if (!parameterValueList.hasOwnProperty(j)) continue;
                                str = str + "<option value='" + parameterValueList[j].parameterValueCode + "'>" + parameterValueList[j].parameterValueName + "</option>";
                            }
                            str = str + "</select>";
                        }
                        str = str + "</div>";
                        // 参数介绍模块
                        str = str +
                            "<div class='introduction' id='" + parameterList[i].parameterCode + "Content'" + ">" +
                            "</div>";
                        parameter.append(str);
                        // 渲染
                        form.render('select');
                        // 显示
                        parameter.slideDown("slow");
                    }
                } else {
                    layer.msg(result.msg);
                }
            }
        })
    }

    // 渲染珠宝选择框
    function loadPage() {
        $.ajax({
            url: "/jewelryEvaluation/frontend/jewelry/jewelrys",
            type: "GET",
            contentType: "application/json",
            success: function (result) {
                if (isSuccess(result)) {
                    let data = result.data;
                    // 取出珠宝列表信息
                    const jewelryList = data.jewelryList;
                    for (var i in jewelryList) {
                        if (!jewelryList.hasOwnProperty(i)) continue;
                        // 拼接字符串
                        let str = "<option value='" + jewelryList[i].jewelryCode + "'>" + jewelryList[i].jewelryName + "</option>";
                        // 动态插入
                        $("#type").append(str);
                    }
                    // 重新渲染选择框
                    form.render('select')
                } else {
                    layer.msg(result.msg);
                }
            }
        });
    }
});


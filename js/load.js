// function loadIndex() {
// // 加载珠宝饰品选择框
//     $.ajax({
//         url: "/jewelry-evaluation/api/jewelry_data",
//         type: "GET",
//         contentType: "application/json",
//         success: function (result) {
//             if (result.success) {
//                 // 取出珠宝列表信息
//                 jewelryList = result.jewelryList;
//                 for (var i in jewelryList) {
//                     if (!jewelryList.hasOwnProperty(i)) continue;
//                     // 拼接字符串
//                     let str = "<option value=\"" + jewelryList[i].jewelryCode + "\">" + jewelryList[i].jewelryName + "</option>";
//                     // 动态插入
//                     $("#type").append(str);
//                 }
//                 // 重新渲染选择框
//                 form.render('select')
//             }
//         }
//     });
// }
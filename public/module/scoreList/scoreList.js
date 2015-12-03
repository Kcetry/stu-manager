define(["smartgrid","text!./scoreList.html","css!./scoreList.css"], function(sm,scoreList) {
    avalon.templateCache.scoreList = scoreList;
    var scoreList = avalon.define("scoreList", function(vm) {
        vm.$skipArray = ["smartgrid"];
        vm.type = "";
        vm.data;
        vm.add = function() {
            vm.isDisplay = !vm.isDisplay;
            vm.type = "post";
        }
        vm.submit = function() {
            var data = {name:scoreForm.name,number:scoreForm.number,subname:scoreForm.gender,score:scoreForm.score};
            var type;
            if(vm.type == "post") url = '/student';
            if(vm.type == "put") url = '/student/'+vm.selectedId
            avalon.ajax({
                url: url,
                type: vm.type,
                cache: false,
                data:data
            }).done(function(res) {
                console.log(res);
                vm.render();
                vm.isDisplay = !vm.isDisplay;
                vm.type = "";
            }); 
        }
        vm.back = function() {
            vm.isDisplay = !vm.isDisplay;
            vm.type = "";
        }

        vm.render = function() {

            avalon.ajax({
                url: '/student/score',
                type: 'get',
                cache: false,
            }).done(function(res) {
                var datas = [];
                
                for(var a in res.data) {
                    for(var b in res.data[a].scores) {
                        var item = {};
                        item.name = res.data[a].name;
                        item.number = res.data[a].number;
                        item.subject = res.data[a].scores[b].subject.name;
                        item.score = res.data[a].scores[b].score;
                         console.log(item);
                        datas.push(item);
                    }
                }
                console.log(datas);
                avalon.vmodels.sgScoreList.render(datas);
                vm.data = res.data;
            });               
        }
        vm.isDisplay = false;
        vm.selectedId = "";
        vm.smartgrid = {
            pageable: true,
            noResult: "暂无数据",
            selectable: {type: "Radio", width: 20},
            dropdownData: [
                {name: "无",value: "null"},
                {name: "修改", value: "put"},
                {name: "删除",value: "del"}
            ],
            dropdown : {
                width: 100,
                listWidth: 100,
                onChange:function(e) {
                    var state;
                    if(e == "null") {
                        return;
                    }else if(vm.selectedId){
                        if(e == "put") vm.isDisplay = !vm.isDisplay;
                        if(e == "del"){
                            avalon.ajax({
                                url: '/student/'+vm.selectedId,
                                type: 'delete',
                                cache: false,
                            }).done(function(res) {
                                avalon.vmodels.sgScoreList.render(res.data);
                                vm.render();
                            }); 
                        }
                        vm.type = "put";    
                    }else {
                        console.log("select a row")
                    }
                },           
            },
            onRowSelect: function(rowData,isSelected,dataIndex)  {
                if(isSelected) {
                    vm.selectedId = rowData._id;
                }
                for(var a in vm.data) {
                    if(vm.selectedId == vm.data[a]._id) {
                        scoreForm.name = vm.data[a].name;
                        scoreForm.number = vm.data[a].number;
                        scoreForm.subject = vm.data[a].subject;
                        scoreForm.score = vm.data[a].score;
                    }
                }
            },
            htmlHelper: {
                //opera列包装成dropdown组件
                dropdown: function(vmId, field, index, cellValue, rowData, disable) {
                    var option = "<option ms-repeat='dropdownData' ms-attr-value='el.value' ms-attr-label='el.name' ms-selected='el.value == " + cellValue + "'></option>"
                    return '<select ms-widget="dropdown" rowindex="' +index+'" field="'+field+'" vmId="'+vmId+'" ' + (disable ? "disabled" : "") + '>' + option + '</select>'
                }                
            },
            pager: {prevText: "<",nextText: ">",perPages: 20,showPages: 5,totalItems: 120,
                onJump: function(event, page) {
                    console.log("event" + JSON.stringify(event) + "page=" + (page !== vm.currentPage));
                }
            },
            columns: [
                {key: "name",name: "姓名",width: 200}, 
                {key: "number",name: "学号",width: 200}, 
                {key: "subject", name: "科目",width: 200}, 
                {key: "score",name: "成绩",width: 200},
                {key: "opera", name: "操作",width: 200,format: "dropdown"},
            ]
        }
    })
    var scoreForm = avalon.define("scoreForm", function(vm) {
        vm.number = ""
        vm.name = ""
        vm.subject = ""
        vm.score = ""
    })
    scoreList.render();
    avalon.vmodels.root.scoreList = "scoreList"
})
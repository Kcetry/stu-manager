define(["smartgrid","text!./stuList.html","css!./stuList.css"], function(sm,stuList) {
    avalon.templateCache.stuList = stuList;
    var stuList = avalon.define("stuList", function(vm) {
        vm.$skipArray = ["smartgrid"];
        vm.type = "";
        vm.data;
        vm.add = function() {
            vm.isDisplay = !vm.isDisplay;
            vm.type = "post";
        }
        vm.submitStu = function() {
            var data = {name:stuForm.name,number:stuForm.number,gender:stuForm.gender,classes:stuForm.classes};
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
                url: '/student',
                type: 'get',
                cache: false,
            }).done(function(res) {
                avalon.vmodels.sgStuList.render(res.data);
                vm.data = res.data;
            });               
        }

        vm.getStuId = function(stuName) {
            for(var a in vm.data) {
                if(stuName== vm.data[a].name) {
                    console.log(vm.data[a]);
                    return vm.data[a]._id;
                }
            }
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
                                avalon.vmodels.sgStuList.render(res.data);
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
                        stuForm.name = vm.data[a].name;
                        stuForm.number = vm.data[a].number;
                        stuForm.classes = vm.data[a].classes;
                        stuForm.gender = vm.data[a].gender;
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
                {key: "name", name: "姓名", width: 150}, 
                {key: "gender", name: "性别", width: 150}, 
                {key: "classes", name: "班级", width: 150}, 
                {key: "number", name: "学号", width: 150},
                {key: "opeartion", name: "操作", width: 150,format: "dropdown"},
            ],
        }
    })
    var stuForm = avalon.define("stuForm", function(vm) {
        vm.name = ""
        vm.gender = ""
        vm.classes = ""
        vm.number = ""
    })
    stuList.render();
    avalon.vmodels.root.stuList = "stuList"
    return {
        getStuId:stuList.getStuId
    }
})
define(["smartgrid","text!./subList.html","css!./subList.css"], function(sm,subList) {
    avalon.templateCache.subList = subList;
    var subList = avalon.define("subList", function(vm) {
        vm.$skipArray = ["smartgrid"];
        vm.type = "";
        vm.data;
        vm.add = function() {
            vm.isDisplay = !vm.isDisplay;
            vm.type = "post";
        }
        vm.submit = function() {
            var data = {name:subForm.name};
            var type;
            if(vm.type == "post") url = '/subject';
            if(vm.type == "put") url = '/subject/'+vm.selectedId
            avalon.ajax({
                url: url,
                type: vm.type,
                cache: false,
                data:data
            }).done(function(res) {
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
                url: '/subject',
                type: 'get',
                cache: false,
            }).done(function(res) {
                avalon.vmodels.sgSubList.render(res.data);
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
                                url: '/subject/'+vm.selectedId,
                                type: 'delete',
                                cache: false,
                            }).done(function(res) {
                                avalon.vmodels.sgSubList.render(res.data);
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
                        subForm.name = vm.data[a].name;
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
                {key: "_id", name: "编号", width: 270}, 
                {key: "name", name: "名称", width: 270}, 
                {key: "opeartion", name: "操作", width: 270,format: "dropdown"},
            ],
        }
    })
    var subForm = avalon.define("subForm", function(vm) {
        vm.name = ""
    })
    subList.render();
    avalon.vmodels.root.subList = "subList"
})
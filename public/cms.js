require.config({
	baseUrl:'',
	paths:{
		text:'vendor/require/text',
		css:'vendor/require/css',
		domReady:'vendor/require/domReady',
		avalon:'vendor/avalon/avalon.shim',
        smartgrid: 'vendor/oniui/smartgrid/avalon.smartgrid',
        draggable: 'vendor/oniui/avalon.draggable',
        dropdown: 'vendor/oniui/dropdown/avalon.dropdown',
        loading: 'vendor/oniui/loading/avalon.loading',
        pager: 'vendor/oniui/pager/avalon.pager',
        scrollbar: 'vendor/oniui/scrollbar/avalon.scrollbar',
        getModel: 'vendor/oniui/avalon.getModel',
        mmRequest: 'vendor/oniui/mmRequest/mmRequest',
        mmPromise: 'vendor/oniui/mmPromise/mmPromise',
        jquery:"vendor/jquery-1.11.1.min"
	},
	priority:['text','css'],
	shim: {
		avalon: {
			exports:'avalon'
		}
	}
});

require(['avalon',"mmRequest",'jquery','domReady!'],function(avalon,mmRequest) {
	avalon.templateCache.empty="&nbsp;"
	var root = avalon.define("root", function(vm) {
        vm.stuList = "empty",
        vm.subList = "empty",
        vm.scoreList = "empty",
        vm.isDisHome = 0,
        vm.index = 0,
        vm.name = "",
        vm.passwd = "",
        vm.vcode = "",
        vn.login = function() {
            var data = {name:vm.name,passwd:vm.passwd,vcode:vm.vcode}
            console.log(data);
            mmRequest.ajax({
                url: '/login',
                type: 'post',
                cache: false,
                data:data
            }).done(function(res) {
                console.log("dfDfdf");
                console.log(res.code);
                if(res.code==10000) {
                    vm.isDisHome = 1;
                }
            })
        }
        vm.btnClick = function (index) {
            vm.index = index;
        }
	});
    if(localStorage.getItem("jd-stu-admin")) {
        root.isDisHome = 1;
    }

    $('.vcodeImg').append('<img class="vcodeImg" src="http://115.28.28.88:5610/code">');

	require([
        './module/stuList/stuList',
        './module/subList/subList',
        './module/scoreList/scoreList',
     ]);


	avalon.scan()
})
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
        mmPromise: 'vendor/oniui/mmPromise/mmPromise'
	},
	priority:['text','css'],
	shim: {
		avalon: {
			exports:'avalon'
		}
	}
});

require(['avalon',"mmRequest",'domReady!'],function(avalon,mmRequest) {
	avalon.templateCache.empty="&nbsp;"
	var root = avalon.define("root", function(vm) {
        vm.stuList = "empty",
        vm.subList = "empty",
        vm.scoreList = "empty",
        vm.isDisHome = 0,
        vm.index = 0,

        vm.btnClick = function (index) {
            vm.index = index;
        }
	});
    if(localStorage.getItem("jd-stu-admin")) {
        root.isDisHome = 1;
    }

	require([
        './module/stuList/stuList',
        './module/subList/subList',
        './module/scoreList/scoreList',
     ]);
    console.log("dfDfdf");
    mmRequest.ajax({
        url: '/code',
        type: 'get',
        cache: false,
    }).done(function(res) {
        console.log("dfDfdf");
        console.log(JSON.string(res));
    })
	avalon.scan()
})
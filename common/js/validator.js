(function(validator, undefined) {
	
	var _ = function (obj) {
        if (obj instanceof _) return obj;
        if (!(this instanceof _)) return new _(obj);
    };
	_.isArray = function(obj) {
		
		return Object.prototype.toString.call(obj) === '[object Array]';
	}
	
	_.isObject = function(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
	}
	
	validator.validate = function(items) {
		var _this = this,pass=true;
		/*[
			{
				val:'此处应是待校验的值'
				, check:[
					{
						required:true
						,message:"请填写必填项"
					}
					,{
						email:true
						,message:"请填写有效的邮件地址"
					}
					,{
						url:true
						,message:"请填写有效URL路径"
					}
					,{
						date:true
						,message:"请填写有效的日期格式"
					}
					,{
						number:true
						,message:"请填写有效的邮件地址"
					}
					,{
						digits:true
						,message:"请填写有效的邮件地址"
					}
					,{
						maxlength:true
						,to:10
						,message:"请填写有效的邮件地址"
					}
					,{
						minlength:true
						,from:10
						,message:"请填写有效的邮件地址"
					}
					,{
						rangelength:true
						,from: 1
						,to: 2
						,message:"请填写有效的邮件地址"
					}
					,{
						range:true
						,from:1
						,to:10
						,message:"请填写有效的邮件地址"
					}
					,{
						max:true
						,to:11;
						,message:"请填写有效的邮件地址"
					}
					,{
						min:true
						,from:12,
						,message:"请填写有效的邮件地址"
					}
				]
			}
		]*/
		
		
		if(_.isArray(items)) {
			
			for(var i=0; i<items.length; i++) {
				var checks = items[i].check;
				if( checks && _.isArray(checks)){
					
					for(var j=0; j<checks.length; j++) {
						
						if(_this.validCheck(items[i].val,checks[j]) == false) {
							pass = false;
							alert(checks[j].message);
							
							break;
						}
					}
					
				}
			}
			
			
			return pass;
		} else {
			alert('validator配置不正确');
			return false;
		}
	}
	
	validator.validCheck = function(value,check) {
			
			if(_.isObject(check)) {
				
				// 有required校验
				if(check.required == true) {
					// 做必填项check
					if(value && value.length>0) {
						return true;
					}
					return false;
				}
				
				// 有email校验
				if(check.email == true) {
					
					return /^[\u4E00-\u9FA5a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test( value );
				}
				
				// 有url校验
				if(check.url == true) {
					
					return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test( value );
				}
				
				// 有date校验
				if(check.date == true) {
					
					return !/Invalid|NaN/.test(new Date(value).toString());
				}
				
				// 有number校验
				if(check.number == true) {
					
					return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
				}
				
				// 有digits校验
				if(check.digits == true) {
					
					return /^\d+$/.test(value);
				}
				
				// 有maxlength校验
				if(check.maxlength == true) {
					
					return value.length <= check.to;
				}
				
				// 有minlength校验
				if(check.minlength == true) {
					
					return value.length >= check.from;
				}
				
				// 有rangelength校验
				if(check.rangelength == true) {
					
					return value.length>= check.from && value.length<=check.to;
				}
				
				// 有range校验
				if(check.range == true) {
					
					return value >= check.from && value<=check.to;
				}
				
				// 有max校验
				if(check.max == true) {
					
					return value<=check.to;
				}
				
				// 有min校验
				if(check.min == true) {
					
					return value>=check.from;
				}
			} else {
				
				alert("validator配置不正确");
				return true;
			}
		}
	
	
})(window.validator = {});

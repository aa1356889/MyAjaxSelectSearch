/**
  需要引入<link href="@base.BaseHelper.PlugUrlContent("/BoostrapSelectSeach/bootstrap-select.css")" rel="stylesheet" /> 样式
  var sel = new MySelect({ containerId: "select", Url: "@Url.Action("GetUsers","Users")", showText: "选择人员" });
  option:{
       containerId 容器id  会自动在容器上生成按钮
       showText  按钮默认text
       Url 后台拿数据的url  数据返回格式{ RecordId ="val", Text =""}对象数组 
       默认传递到服务器的参数 star开始索引  end 结束索引  keword 搜索文字  默认加载13条 如果如果超过13条则生成滚动条 滚动加载第二页 滚动发送请求第二页的参数到服务器 以此类推

       获得选中的节点对象 :sel.GetSelectVal()
       获得当前所有本地数据 sel.Data
  }
**/

var MySelect = (function () {
    function MySelect(options) {
        this.containerId = options.containerId
        this.$containerDom = $("#" + this.containerId);
        this.showText = options.hasOwnProperty("showText") ? options.showText : "请选择";
        this.Url = options.hasOwnProperty("Url") ? options.Url : "";
        this.Data = {length:0};
        this.pageIndex = 1;
        this.pageSize = 13;
      
        MySelect.prototype.InitButton.call(this);
        Registerscroll(this);
        
    }
    MySelect.prototype.add = function (key, value) {
        if (!key) {
            throw "必须写入正确的键";
        }
        this.Data["key" + key] = value;
        this.Data.length++;

    }
    MySelect.prototype.clear = function () {
        this.Data = { length: 0 };
    }
    MySelect.prototype.remove = function (key) {
        if (this.hasOwnProperty("key" + key)) {
            this.Data.length--;
        }
      return  delete this.data["key" + key];
    }
    MySelect.prototype.get = function (key) {
        if (this.Data.hasOwnProperty("key" + key)) {
            return this.Data["key" + key];
        }
        return undefined;
    }
    //跟指定div注册滚动监听事件
    function Registerscroll(obj) {
        if (!Registerscroll.hasOwnProperty("type")) {
            Registerscroll["type"] = true;
        }
        var nScrollHight = 0; //滚动距离总长(注意不是滚动条的长度)
        var nScrollTop = 0;   //滚动到的当前位置
        var index= true;
        var domID = obj.containerId + "Menu";
        var $domUl=$("#"+domID)
        $("#" + domID).scroll(function () {
            var nDivHight = $("#" + domID).height();
            nScrollHight = $(this)[0].scrollHeight;
            nScrollTop = $(this)[0].scrollTop;
         
            if ((nScrollTop + nDivHight + 10) >= nScrollHight && (nScrollHight >= 108) && Registerscroll.type == true) {
                console.log(obj.pageIndex);
                Registerscroll.type = false;//ajax 不会成功返回之前不能执行新的请求
                obj.pageIndex++;
                Seach.call($("#"+obj.containerId + "text")[0], obj,true);
        }
        })
    }
    MySelect.prototype.showLoding = function () {
       this.$domUl.append("<li class=\"no-results loding active\"  style=\"display: list-item;\">&nbsp;&nbsp;&nbsp;正在加载............</li>");
    }

    MySelect.prototype.closeLoding = function () {
        this.$domUl.children(".loding").remove();
    }
    MySelect.prototype.InitButton = function () {
       
        //var windowHeight = $(window).height()
        //var className = (windowHeight - domTop) > 500 ? "caret" : domTop > 500 ? "caret" : "caret";
        this.$Buttion = $("<button type=\"button\" class=\"btn dropdown-toggle selectpicker btn-default\" data-toggle=\"dropdown\"><span class=\"filter-option pull-left\" id=\"" + this.containerId + "ShowText\">" + this.showText + "</span>&nbsp;<span class=\"caret\"></span></button>")
        this.$containerDom.html("");
        var th = this;
     
        this.$containerDom.append(this.$Buttion);
        var textDomeId = this.containerId + "text";
        this.$SelectDome = $("<div class=\"dropdown-menu open\" style=\"max-height:409px; overflow: hidden; min-height: 92px;\"><div class=\"bootstrap-select-searchbox\"><input type=\"text\" id=\"" + textDomeId + "\" class=\"input-block-level form-control\"></div><ul style=\"top:initial;border:0px;min-height:92px;max-height:268px;overflow-y:auto;\" id=\"" + this.containerId + "Menu\" class=\"dropdown-menu inner selectpicker\" role=\"menu\" style=\"max-height: 359px; overflow-y: auto; min-height: 80px;\"></ul></div>");
        $("body").append(this.$SelectDome);
        $("#" + textDomeId).keyup(function () {
            keUp.call(this, th);
        });
        //第一次加载数据

        this.$domUl = $("#" + this.containerId + "Menu");
        this.$Buttion.click(function () {
            var domTop = th.$containerDom.offset().top;
            var domleft = th.$containerDom.offset().left;
           

            th.$SelectDome.css("width", th.$Buttion.width());
            th.$SelectDome.css("top", domTop + th.$Buttion.height() + 10);
            th.$SelectDome.css("left", domleft);
            th.$SelectDome.css("height","317px")
            //选择区域块
          
            var seTop = domTop, bottom = domTop + th.$SelectDome.height();
            var left = domleft, right = domleft + th.$SelectDome.width();
            if (!th.$SelectDome.is(':visible')) {　　//如果node是隐藏的则显示node元素，否则隐藏

                th.$SelectDome.show();
                th.$SelectDome.click(function () {
                    return false;
                })
                $("body").click(function (e) {
                    $("#" + th.containerId + "text").val("");
                        th.$SelectDome.hide();
                   
                })
            } else {
                th.$SelectDome.hide();
            }
            $("#" + textDomeId).keyup();
            Seach.call($("#" + textDomeId), th);
            return false;
        })
      
    
       

     
    }
    function keUp(obj) {
        obj.pageIndex = 1;
        if (!keUp.hasOwnProperty("topTime")) {
            keUp["topTime"];
            keUp["currentTime"];
        }
        if (!keUp.topTime) {
            keUp.topTime = new Date().getTime();
           
            keUp.currentTime = keUp.topTime;
            return;
        } else {
            keUp.topTime = keUp.currentTime;
            keUp.currentTime = new Date().getTime()
        }
        var $th = $(this);
        window.setTimeout(function () {
            index = new Date().getTime() - keUp.currentTime;
        
            if (index >= 900 &&index<=1000) {

                Seach.call($th, obj);
                   }
        }, 900)
     
    }
    MySelect.prototype.GetSelectVal = function () {
        if (!this.hasOwnProperty("$SelectNode") || !this.$SelectNode || this.$SelectNode.length <= 0) {
            return "";
        }
        var val = this.$SelectNode.attr("rel");
        return this.get(val);
    }
    function Seach(obj, isClear) {
        var val = $(this).val();
        var $th = $(this);
        if (!obj.Url) {
            $("#" + obj.containerId + "Menu").html("");
            obj.$SelectDome.css("height", $("#" + obj.containerId + "Menu").height());
            return;
        }
        var data = { keword: val };
        if (isClear == true) {
            obj.$domUl.unbind("scroll")
    
            Registerscroll.type = true;
        } else {
         
            $th.unbind("keyup");
        }
        var star = (obj.pageIndex - 1) * obj.pageSize;
        var end = obj.pageIndex * obj.pageSize;
        if (val == "" || !val) {
            data["start"] = star;
            data["end"] = end;
            data.keword = "";
        } else {
            data["start"] = star;
            data["end"] = end;
            data.keword = val;
        }

              
        //取消 去拿数据
      
        obj.showLoding();
      
        $.ajax({
            type: "post",
            url: obj.Url,
            data: data,
            success: function (ajadata) {
                obj.closeLoding();
                var ajaxObj = ajadata;
                //Areca.AjaxPorcess(ajadata, function (ajaxObj) {
                    if (!isClear) {
                        $("#" + obj.containerId + "Menu").html("");
        
                        obj.clear();
                    }
                    if (isClear == true) {

                        Registerscroll(obj);
                    } else {
                        $th.keyup(function () {
                            keUp.call($th, obj);
                        });
                    }
               
                    $("#" + obj.containerId + "Menu").children(".nodata").remove();
                    if (!ajaxObj.Data || ajaxObj.Data.length <= 0&&isClear!=true) {
                        $("#" + obj.containerId + "Menu").append("<li class=\"no-results nodata active\" style=\"display: list-item;\">没找到相关信息.... \"" + val + "\"</li>");
                        obj.$SelectDome.css("height", $("#" + obj.containerId + "Menu").height() + 50);
                        return;
                    }
                 
                    ajaxObj.Data.forEach(function (node,i) {
                      
                        var $li = $("<li rel=\"" + node.RecordId + "\"><a tabindex=\"" + node.RecordId + "\" class=\"\" style=\"\"><span class=\"text\">" + node.Text + "</span></a></li>");
                        obj.add(node.RecordId, node);
                        $("#" + obj.containerId + "Menu").append($li);
                        $li.click(function () {
                            if ($(this).children("a").children("i").length > 0) {
                                $(this).children("a").children("i").remove();
                                obj["$SelectNode"] = null;
                                $("#" + obj.containerId + "ShowText").text(obj.showText);
                            } else {
                                var $tli = $("#" + obj.containerId + "Menu li");
                                obj["$SelectNode"] = $(this);
                                //obj.$SelectDome.hide();
                                $("#" + obj.containerId + "ShowText").text(obj.GetSelectVal().Text)
                                $tli.children("a").children("i").remove();
                                $(this).children("a").append("<i class=\"glyphicon glyphicon-ok icon-ok check-mark\"></i>");
                            }
                        })
                    })
                    $("#" + obj.containerId + "Menu").children(".nodata").remove();
                    console.log($("#" + obj.containerId + "Menu").height()+"|"+($("#" + obj.containerId + "Menu").height() + 50));
                    obj.$SelectDome.css("height", $("#" + obj.containerId + "Menu").height() + 50);
                //});
            }
        });

    }
    return MySelect;
  
})();
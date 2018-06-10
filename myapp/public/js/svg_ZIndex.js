  //SVG_ZIndex函数用来控制svg元素的显示顺序,使得被选中的元素不被未被选中的元素遮挡。
        //降低效率，不要用
        function SVG_ZIndex(elements) {
          var elements_arr = [];
          // 遍历节点列表，初始化一些设置
          for (var i = 0, len = elements.length; i < len; i++) {
            var elem = elements[i];
            // 某些类型的节点可能没有getAttribute属性，你也可以根据nodeType属性来判断
            if (!elem.getAttribute) continue;

            // 递归子节点
            if (elem.childNodes) {
              SVG_ZIndex(elem.childNodes);
            }
            // 默认所有元素都处于第1级
            if (!elem.getAttribute("z-index")) {
              elem.setAttribute("z-index", 1);
            }
            elements_arr.push(elem);
          }

          if (elements_arr.length === 0) return;

          // 根据z-index属性进行排序
          elements_arr.sort(function (e1, e2) {
            var z1 = e1.getAttribute("z-index");
            var z2 = e2.getAttribute("z-index");
            if (z1 === z2) {
              return 0;
            } else if (z1 < z2) {
              return -1;
            } else {
              return 1;
            }
          });
          // 排序完成后，按顺序移动这些元素
          var parent = elements_arr[0] && elements_arr[0].parentNode;
          for (var i = 0, len = elements_arr.length; i < len; i++) {
            var elem = elements_arr[i];
            // 提示：appendChild里的elem节点如果在页面中已经存在
            // 那么表示这个节点从原来的地方移动到parent最后的地方，而不是以一个新节点插入
            parent.appendChild(elem);
          }
        }
   
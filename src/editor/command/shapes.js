/**
 * @file shapes.js
 * @author mengke01
 * @date 
 * @description
 * 轮廓合并操作
 */


define(
    function(require) {

        var pathJoin = require('graphics/pathJoin');
        var lang = require('common/lang');
        
        // shape的组合操作
        function combineShape(shapes, relation) {
            
            var pathList = shapes.map(function(path) {
                return path.points;
            });

            var result = pathJoin(pathList, relation);

            // 检查有shapes没有改变过
            var changed = false;
            if (result.length === pathList.length) {
                for (var i = 0, l = result.length; i < l; i ++ ) {
                    if (result[i] !== pathList[i]) {
                        changed = true;
                        break;
                    }
                }
            }
            else {
                changed = true;
            }

            // 有改变则更新节点集合
            if (changed) {

                var fontLayer = this.fontLayer;
                var resultLength = result.length;
                var shapesLength = shapes.length;
                var length = Math.min(resultLength, shapesLength);
                
                // 替换原来位置的
                for (var i = 0; i < length; i++) {
                    shapes[i].points = lang.clone(result[i]);
                }

                // 移除多余的
                if (shapesLength > length) {
                    for (var i = length; i < shapesLength; i++) {
                        fontLayer.removeShape(shapes[i]);
                    }
                    shapes.splice(length, shapesLength - length);
                }

                // 添加新的shape
                if (resultLength > length) {
                    for (var i = length; i < resultLength; i++) {
                        var shape = fontLayer.addShape('path', {
                            points: result[i]
                        });
                        shapes.push(shape);
                    }
                }

                fontLayer.refresh();
            }

            return shapes;
        }


        var support = {

            /**
             * 结合
             */
            joinshapes: function(shapes) {
                combineShape.call(this, shapes, pathJoin.JOIN);
            },

            /**
             * 相交
             */
            intersectshapes: function(shapes) {
                combineShape.call(this, shapes, pathJoin.INTERSECT);
            },

            /**
             * 相切
             */
            tangencyshapes: function(shapes) {
                combineShape.call(this, shapes, pathJoin.TANGENCY);
            }
        };

        return support;
    }
);
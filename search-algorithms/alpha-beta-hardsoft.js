(function () {
  'use strict';

  window.search = window.search || {};

  search.AlphaBetaHardSoft = function (evaluate, getChildren, maxDepth) {
    function calculateMaxChild(children, depth, min, max) {
      var bestchild = { evaluation: min };

      _.forEach(children, function (child) {
        child.evaluation = search(child, depth, bestchild.evaluation, max).evaluation;
        if (child.evaluation > bestchild.evaluation) {
          bestchild = child;
        }
        if (child.evaluation >= max) {
          bestchild = { evaluation: max };
          return false;
        }
      });

      return bestchild;
    }

    function calculateMinChild(children, depth, min, max) {
      var bestchild = { evaluation: max };

      _.forEach(children, function (child) {
        child.evaluation = search(child, depth, min, bestchild.evaluation).evaluation;
        if (child.evaluation < bestchild.evaluation) {
          bestchild = child;
        }
        if (child.evaluation <= min) {
          bestchild = { evaluation: min };
          return false;
        }
      });

      return bestchild;
    }

    function search(node, depth, min, max) {
      var children = getChildren(node),
          isLeaf = !children.length,
          isDepthValid = depth < maxDepth,
          isMaximizationLevel = depth % 2 == 0;

      node.min = min;
      node.max = max;

      if (isLeaf || !isDepthValid) {
        node.evaluation = evaluate(node);
        return node;
      }

      if (isMaximizationLevel) {
        node.chosen = calculateMaxChild(children, depth + 1, min, max);
      } else {
        node.chosen = calculateMinChild(children, depth + 1, min, max);
      }

      node.children = children;
      return node.chosen;
    }

    this.search = _.partial(search, _, 0, -Infinity, Infinity);
  };

}());
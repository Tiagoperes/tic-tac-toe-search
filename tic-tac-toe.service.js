(function () {
  'use strict';

  var AI_MARK = false,
      LOOK_AHEAD = Infinity;

  function Node(parent, indexOfPositionToBeChanged, valueOfPosition) {
    var self = this;

    this.parent = parent;
    this.depth = parent ? parent.depth + 1 : 0;

    if (parent) {
      this.state = _.clone(parent.state);
      this.state[indexOfPositionToBeChanged] = valueOfPosition;
      this.move = { index: indexOfPositionToBeChanged, mark: valueOfPosition };
    } else {
      this.state = [null, null, null, null, null, null, null, null, null];
    }
  }

  function getChildren(node) {
    var mark = node.move ? !node.move.mark : AI_MARK;

    if (isGameOver(node.state, node.move.mark)) return [];

    return _.reduce(node.state, function (children, value, index) {
      if (value === null) {
        children.push(new Node(node, index, mark));
      }
      return children;
    }, []);
  }

  function isGameOver(state, mark) {
    var st = state,
        l1 = _.every([st[0], st[1], st[2]], _.partial(_.isEqual, mark)),
        l2 = _.every([st[3], st[4], st[5]], _.partial(_.isEqual, mark)),
        l3 = _.every([st[6], st[7], st[8]], _.partial(_.isEqual, mark)),
        c1 = _.every([st[0], st[3], st[6]], _.partial(_.isEqual, mark)),
        c2 = _.every([st[1], st[4], st[7]], _.partial(_.isEqual, mark)),
        c3 = _.every([st[2], st[5], st[8]], _.partial(_.isEqual, mark)),
        d1 = _.every([st[0], st[4], st[8]], _.partial(_.isEqual, mark)),
        d2 = _.every([st[2], st[4], st[6]], _.partial(_.isEqual, mark));

    return l1 || l2 || l3 || c1 || c2 || c3 || d1 || d2;
  }

  function evaluate(node) {
    var points = isGameOver(node.state, AI_MARK) - isGameOver(node.state, !AI_MARK);
    return points / node.depth;
  }

  window.ticTacToe = {
    searchAgents: {
      minimax: new search.Minimax(evaluate, getChildren, LOOK_AHEAD),
      alphaBeta: new search.AlphaBetaHardSoft(evaluate, getChildren, LOOK_AHEAD)
    },
    Node: Node,
    AI_MARK: AI_MARK
  };

}());
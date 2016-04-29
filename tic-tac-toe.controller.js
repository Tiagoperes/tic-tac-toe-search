(function () {
  'use strict';

  var node, player, searchMethod;

  function start() {
    restartGame();
    searchMethod = 'minimax';
    bindSearchMethodSelector();
    bindGameActions();
    bindRestartButton();
  }

  function restartGame() {
    node = new ticTacToe.Node();
    player = !ticTacToe.AI_MARK;
    printState();
    $('#resultPanel').hide();
    $('.result').hide();
    $('#searchTree').html('');
    $('#game table').removeAttr('style');
  }

  function bindSearchMethodSelector() {
    $('#searchMethodSelector').change(function () {
      searchMethod = $(this).val();
      restartGame();
    });
  }

  function bindRestartButton() {
    $('#restart').click(function () {
      restartGame();
      $('#resultPanel').hide();
    });
  }

  function toSymbol(value) {
    var hash = {
      'false': 'o',
      'true': 'x',
      'null': ''
    };
    return hash[value];
  }

  function printState() {
    _.forEach(node.state, function (value, index) {
      var symbol = toSymbol(value);
      $('#game td[data-index="' + index + '"]').attr('class', 'symbol-' + symbol).html(symbol);
    });
  }

  function stateToHtml(state, isChosen) {
    var matrix = _.chunk(state, 3),
        chosenClass = isChosen ? 'chosen': '',
        html = '<table class="board ' + chosenClass + '">';

    _.forEach(matrix, function (line, indexLine) {
      html += '<tr>';
      _.forEach(line, function (column, indexColumn) {
        var symbol = toSymbol(column);
        html += '<td class="symbol-' + symbol + '">' + symbol + '</td>'
      });
      html += '</tr>';
    });

    return $(html + '</table>');
  }

  function expandTreeNode(item, treeNode) {
    var subList;
    item.append('<ul></ul>');
    subList = item.find('ul');
    _.forEach(treeNode.children, function (child) {
      printTreeNode(subList, child, treeNode.chosen === child);
    });
    item.addClass('expanded');
  }

  function collapseTreeNode(item) {
    item.find('ul:first').remove();
    item.removeClass('expanded');
  }

  function bindExpandButton(parentList, treeNode) {
    var item = $(parentList.find('li').last());
    item.find('button').click(function () {
      return item.hasClass('expanded') ? collapseTreeNode(item) : expandTreeNode(item, treeNode);
    });
  }

  function truncate(number) {
    return Math.floor(number * 1000) / 1000;
  }

  function getCutData(treeNode) {
    if (treeNode.evaluation === undefined && _.isEmpty(treeNode.children)) {
      if (treeNode.depth % 2) {
        return '<div class="node-data-item node-cut-beta"><i class="fa fa-scissors"></i>poda &beta;</div>';
      }
      return '<div class="node-data-item node-cut-alpha"><i class="fa fa-scissors"></i>poda &alpha;</div>';
    }
    return '';
  }

  function getMinMaxData(treeNode) {
    var isMax = treeNode.depth % 2 === 0,
        interval = treeNode.max !== undefined ? (' [' + truncate(treeNode.min) + ', ' + truncate(treeNode.max) + ']') : '';

    if (isMax && !_.isEmpty(treeNode.children)) {
      return '<div class="node-data-item node-max"><i class="fa fa-arrow-up"></i>max' + interval + '</div>';
    }
    if (!isMax && !_.isEmpty(treeNode.children)) {
      return '<div class="node-data-item node-min"><i class="fa fa-arrow-down"></i>min' + interval + '</div>';
    }
    return '';
  }

  function getEvaluationData(treeNode) {
    if (treeNode.evaluation !== undefined) {
      return '<div class="node-data-item node-evaluation"><i class="fa fa-heartbeat"></i>' + truncate(treeNode.evaluation) + '</div>';
    }
    return '';
  }

  function getNodeData(treeNode) {
    return '<div class="node-data">' + getEvaluationData(treeNode) + getMinMaxData(treeNode) + getCutData(treeNode) + '</div>';
  }

  function printTreeNode(parentList, treeNode, isChosen) {
    var board = stateToHtml(treeNode.state, isChosen),
        nodeData = getNodeData(treeNode),
        button = _.isEmpty(treeNode.children) ? '' : '<button class="expand-button"></button>',
        item = '<li></li>';

    parentList.append($(item).append(board).append(nodeData).append(button));
    bindExpandButton(parentList, treeNode);
  }

  function printSearchTree() {
    $('#searchTree').html('');
    printTreeNode($('#searchTree'), node.parent);
  }

  function bindGameActions() {
    $('#game td').click(function (ev) {
      var index = $(ev.target).attr('data-index');
      if (player == !ticTacToe.AI_MARK && node.state[index] === null) {
        node = new ticTacToe.Node(node, index, player);
        printState();
        player = !player;
        $('body, #game td').css('cursor', 'wait');
        verifyEndGame();
        setTimeout(playAI);
      }
    });
  }

  function endGame() {
    $('#resultPanel').show();
    $('#game table').css('pointer-events', 'none');
  }

  function verifyEndGame() {
    if (node.evaluation === 1) {
      $('.result.lose').show();
      endGame();
    }
    else if (node.evaluation === -1) {
      $('.result.win').show();
      endGame();
    }
    else if (!_.filter(node.state, _.isNull).length) {
      $('.result.draw').show();
      endGame();
    }
  }

  function playAI() {
    node.depth = 0;
    node = ticTacToe.searchAgents[searchMethod].search(node);
    printState();
    printSearchTree();
    verifyEndGame();
    player = !player;
    $('body, #game td').removeAttr('style');
  }

  start();
}());
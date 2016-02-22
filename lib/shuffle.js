/* eslint no-unused-vars:0 */
/*global window, document, getComputedStyle*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactMotion = require('react-motion');

var _reactMotionLibStripStyle = require('react-motion/lib/stripStyle');

var _reactMotionLibStripStyle2 = _interopRequireDefault(_reactMotionLibStripStyle);

var Shuffle = _react2['default'].createClass({

  displayName: 'Shuffle',

  propTypes: {
    springConfig: _react2['default'].PropTypes.shape({
      stiffness: _react2['default'].PropTypes.number,
      damping: _react2['default'].PropTypes.number
    }),
    scale: _react2['default'].PropTypes.bool,
    fade: _react2['default'].PropTypes.bool,
    initial: _react2['default'].PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      springConfig: undefined, // uses react-motion default
      scale: true,
      fade: true,
      initial: false
    };
  },
  componentDidMount: function componentDidMount() {
    this._makePortal();
    window.addEventListener('resize', this._renderClones);
    this._renderClones();
  },

  componentWillUnmount: function componentWillUnmount() {
    if (this.container !== null) {
      this.container.removeChild(this._portalNode);
    }
    window.removeEventListener('resize', this._renderClones);
  },

  componentDidUpdate: function componentDidUpdate() {
    this._renderClones();
  },

  _makePortal: function _makePortal() {
    this._portalNode = document.createElement('div');
    this._portalNode.style.left = '0px';
    this._portalNode.style.top = '0px';
    this._portalNode.style.position = 'absolute';
    if (this.container !== null) {
      this.container.appendChild(this._portalNode);
    }
  },

  _renderClones: function _renderClones() {
    var _this = this;

    var styles = [];
    var defaultStyles = [];
    _react2['default'].Children.forEach(this.props.children, function (child) {
      var ref = child.key;
      var node = _this._refs[ref];
      var rect = node.getBoundingClientRect();
      var computedStyle = getComputedStyle(node);
      var marginTop = parseInt(computedStyle.marginTop, 10);
      var marginLeft = parseInt(computedStyle.marginLeft, 10);

      styles.push({
        key: child.key,
        style: {
          width: (0, _reactMotion.spring)(rect.width, _this.props.springConfig),
          height: (0, _reactMotion.spring)(rect.height, _this.props.springConfig),
          left: (0, _reactMotion.spring)(node.offsetLeft - marginLeft, _this.props.springConfig),
          top: (0, _reactMotion.spring)(node.offsetTop - marginTop, _this.props.springConfig),
          scale: _this.props.scale ? (0, _reactMotion.spring)(1) : 1,
          opacity: _this.props.fade ? (0, _reactMotion.spring)(1) : 1
        },
        data: child
      });
      defaultStyles.push({
        key: child.key,
        style: {
          width: rect.width,
          height: rect.height,
          left: node.offsetLeft - marginLeft,
          top: node.offsetTop - marginTop,
          scale: _this.props.scale ? 0 : 1,
          opacity: _this.props.fade ? 0 : 1
        },
        data: child
      });
    });

    _reactDom2['default'].unstable_renderSubtreeIntoContainer(this, _react2['default'].createElement(
      _reactMotion.TransitionMotion,
      {
        willLeave: function (style) {
          return _extends({}, style.style, {
            opacity: (0, _reactMotion.spring)(0, _this.props.springConfig),
            scale: (0, _reactMotion.spring)(0, _this.props.springConfig) });
        },
        willEnter: function (style) {
          return _extends({}, (0, _reactMotionLibStripStyle2['default'])(style.style), {
            opacity: 0,
            scale: 0
          });
        },
        defaultStyles: this.props.initial ? defaultStyles : null,
        styles: styles },
      function (interpolatedStyles) {
        return _react2['default'].createElement(
          'div',
          null,
          interpolatedStyles.map(function (config) {
            return _react2['default'].cloneElement(config.data, {
              key: config.key,
              style: {
                position: 'absolute',
                width: config.style.width,
                height: config.style.height,
                left: config.style.left,
                top: config.style.top,
                opacity: config.style.opacity,
                transform: 'scale(' + config.style.scale + ')'
              }
            });
          })
        );
      }
    ), this._portalNode);
  },
  _childrenWithRefs: function _childrenWithRefs() {
    var _this2 = this;

    return _react2['default'].Children.map(this.props.children, function (child) {
      return _react2['default'].cloneElement(child, { ref: function ref(r) {
          _this2._refs = _this2._refs || {};
          _this2._refs[child.key] = r;
        } });
    });
  },
  render: function render() {
    var _this3 = this;

    return _react2['default'].createElement(
      'div',
      _extends({ ref: function (ref) {
          return _this3.container = ref;
        }, style: { position: 'relative' } }, this.props),
      _react2['default'].createElement(
        'div',
        { style: { opacity: 0 } },
        this._childrenWithRefs()
      )
    );
  }
});

exports['default'] = Shuffle;
module.exports = exports['default'];
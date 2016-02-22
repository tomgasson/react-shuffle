/* eslint no-unused-vars:0 */
/*global window, document, getComputedStyle*/

import React from 'react';
import ReactDom from 'react-dom';
import { TransitionMotion, spring } from 'react-motion'
import stripStyle from 'react-motion/lib/stripStyle'

const Shuffle = React.createClass({

  displayName: 'Shuffle',

  propTypes: {
    springConfig: React.PropTypes.shape({
      stiffness: React.PropTypes.number,
      damping: React.PropTypes.number
    }),
    scale: React.PropTypes.bool,
    fade: React.PropTypes.bool,
    initial: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      springConfig: undefined, // uses react-motion default
      scale: true,
      fade: true,
      initial: false
    }
  },
  componentDidMount() {
    this._makePortal();
    window.addEventListener('resize', this._renderClones);
    this._renderClones();
  },

  componentWillUnmount() {
    if (this.container !== null){
      this.container.removeChild(this._portalNode);
    }
    window.removeEventListener('resize', this._renderClones);
  },

  componentDidUpdate() {
    this._renderClones();
  },

  _makePortal() {
    this._portalNode = document.createElement('div');
    this._portalNode.style.left = '0px';
    this._portalNode.style.top = '0px';
    this._portalNode.style.position = 'absolute';
    if (this.container !== null){
      this.container.appendChild(this._portalNode);
    }
  },

  _renderClones() {
    let styles = []
    let defaultStyles = []
    React.Children.forEach(this.props.children, child => {
      let ref = child.key;
      let node = this._refs[ref];
      let rect = node.getBoundingClientRect();
      let computedStyle = getComputedStyle(node);
      let marginTop = parseInt(computedStyle.marginTop, 10);
      let marginLeft = parseInt(computedStyle.marginLeft, 10);

      styles.push({
        key: child.key,
        style: {
          width: spring(rect.width, this.props.springConfig),
          height: spring(rect.height, this.props.springConfig),
          left: spring(node.offsetLeft - marginLeft, this.props.springConfig),
          top: spring(node.offsetTop - marginTop, this.props.springConfig),
          scale: this.props.scale ? spring(1) : 1,
          opacity: this.props.fade ? spring(1) : 1
        },
        data: child
      })
      defaultStyles.push({
        key: child.key,
        style: {
          width: rect.width,
          height: rect.height,
          left: node.offsetLeft - marginLeft,
          top: node.offsetTop - marginTop,
          scale: this.props.scale ? 0 : 1,
          opacity: this.props.fade ? 0 : 1
        },
        data: child
      })
    })

    ReactDom.unstable_renderSubtreeIntoContainer(this,(
      <TransitionMotion
        willLeave={style => ({
          ...style.style,
          opacity:spring(0, this.props.springConfig),
          scale:spring(0, this.props.springConfig)}
        )}
        willEnter={style => ({
          ...stripStyle(style.style),
          opacity:0,
          scale:0
        })}
        defaultStyles={this.props.initial?defaultStyles:null}
        styles={styles}>
        {interpolatedStyles =>
          <div>
            {interpolatedStyles.map(config => {
              return React.cloneElement(config.data, {
                key: config.key,
                style: {
                  position: 'absolute',
                  width: config.style.width,
                  height: config.style.height,
                  left: config.style.left,
                  top: config.style.top,
                  opacity: config.style.opacity,
                  transform: `scale(${config.style.scale})`
                }
              })
            })}
          </div>
        }
      </TransitionMotion>
    ), this._portalNode);
  },
  _childrenWithRefs() {
    return React.Children.map(this.props.children, (child) =>
      React.cloneElement(child,{ref: (r) => {
        this._refs = this._refs || {}
        this._refs[child.key] = r
      }})
    );
  },
  render() {
    return (
      <div ref={(ref) => this.container = ref} style={{position: 'relative'}} {...this.props}>
        <div style={{opacity: 0}}>
          {this._childrenWithRefs()}
        </div>
      </div>
    );
  }
});

export default Shuffle;

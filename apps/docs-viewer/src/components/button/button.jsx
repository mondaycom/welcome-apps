import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import "./button.css";

const propTypes = {
  active: PropTypes.bool,
  block: PropTypes.bool,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  keepsize: PropTypes.bool,
  outline: PropTypes.bool,
  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  getRef: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  onClick: PropTypes.func,
  size: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.any,
  successIcon: PropTypes.string,
  successText: PropTypes.string,
  rightIcon: PropTypes.bool,
  success: PropTypes.bool
};

const defaultProps = {
  color: "primary",
  tag: "button"
};

class Button extends Component {
  constructor(props) {
    super(props);
  }

  onClick = e => {
    const { disabled, loading, onClick, success } = this.props;
    if (disabled || loading || success) {
      e.preventDefault();
      return;
    }

    if (onClick) {
      onClick(e);
    }
  };

  componentDidMount() {
    this.isComponentMounted = true;
  }

  componentWillUnmount() {
    this.isComponentMounted = false;
  }

  renderText(text) {
    return <span>{text}</span>;
  }

  renderIcon(icon, className) {
    return <span className={`ds-i ${className} ${icon}`} />;
  }

  renderContentWithIcon(text, icon, isIconOnRightSide) {
    if (isIconOnRightSide) {
      return (
        <span>
          {this.renderText(text)} {this.renderIcon(icon, "right")}
        </span>
      );
    }
    return (
      <span>
        {this.renderIcon(icon, "left")} {this.renderText(text)}
      </span>
    );
  }

  renderContent() {
    const {
      loading,
      icon,
      rightIcon,
      children,
      successIcon,
      successText,
      success
    } = this.props;
    if (loading) {
      return <div className="loader" />;
    }
    if (success) {
      return this.renderContentWithIcon(successText, successIcon, rightIcon);
    }
    if (icon) {
      return this.renderContentWithIcon(children, icon, rightIcon);
    }
    return children;
  }

  render() {
    let {
      active,
      block,
      className,
      color,
      outline,
      size,
      loading,
      keepsize,
      tag: Tag,
      getRef,
      icon,
      success,
      successText,
      rightIcon,
      successIcon,
      style,
      ...attributes
    } = this.props;

    const classes = classNames(
      className,
      "ds-btn",
      success
        ? "ds-btn-success-mode"
        : `ds-btn${outline ? "-outline" : ""}-${color}${
            loading ? "-loading" : ""
          }`,
      size ? `ds-btn-${size}` : false,
      block ? "ds-btn-block" : false,
      { active, disabled: this.props.disabled }
    );

    if (attributes.href && Tag === "button") {
      Tag = "a";
    }

    let tagProps = { ...attributes, className: classes, onClick: this.onClick };
    if (style != null) {
      tagProps.style = style;
    }

    return (
      <Tag {...tagProps} ref={getRef}>
        {this.renderContent()}
      </Tag>
    );
  }
}

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;

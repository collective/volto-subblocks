import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isEqual } from 'lodash'
import Icon from '@plone/volto/components/theme/Icon/Icon'
import dragSVG from '@plone/volto/icons/drag.svg'
import trashSVG from '@plone/volto/icons/delete.svg'
import './volto-subblocks.css'

/**
 * Edit subblock
 * @class Edit
 * @extends Component
 */
class SubblockEdit extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    data: PropTypes.objectOf(PropTypes.any).isRequired,
    index: PropTypes.number.isRequired, //index of block in subblock array
    selected: PropTypes.bool.isRequired,
    block: PropTypes.string.isRequired, //parent block container
    onChangeBlock: PropTypes.func.isRequired,
    onChangeFocus: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    openObjectBrowser: PropTypes.func.isRequired,
  }

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs WysiwygEditor
   */
  constructor(props) {
    super(props)
    /*

    //example
    this.state = {
      focusOn: 'title',
    }

    */

    if (!__SERVER__) {
    }
  }

  /**
   * Component will receive props
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {}

  onChange = obj => {
    for (var key in obj) {
      if (!isEqual(obj[key], this.props.data[key])) {
        this.props.onChangeBlock(this.props.index, {
          ...this.props.data,
          [key]: obj[key],
        })
      }
    }
  }
  onChangeSidebar = (id, obj) => {
    this.onChange(obj)
  }
  focusOn = e => {
    this.setState({ focusOn: e })
  }
  onFocus = event => {
    this.props.onSubblockChangeFocus(this.props.index)
  }
  focusNode = () => {
    this.onFocus()
  }

  renderDNDButton = () => {
    return this.props.connectDragSource(
      <div className="dragsubblock">
        <Icon className="drag handle" name={dragSVG} size="18px" />
      </div>,
    )
  }
  renderDeleteButton() {
    return (
      this.props.selected && (
        <Button
          icon
          basic
          onClick={() => this.props.onDelete(this.props.index)}
          className="delete-button"
          aria-label="delete"
        >
          <Icon name={trashSVG} size="18px" />
        </Button>
      )
    )
  }
}

export default SubblockEdit

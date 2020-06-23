import React, { Component } from 'react'
import PropTypes from 'prop-types'
import move from 'lodash-move'
import { isEqual } from 'lodash'
import { defineMessages } from 'react-intl'
import { Button } from 'semantic-ui-react'

import './volto-subblocks.css'

const messages = defineMessages({
  addBlock: {
    id: 'Add block',
    defaultMessage: 'Add block',
  },
})

class SubblocksEdit extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    data: PropTypes.objectOf(PropTypes.any).isRequired,
    index: PropTypes.number.isRequired,
    selected: PropTypes.bool.isRequired,
    block: PropTypes.string.isRequired,
    onAddBlock: PropTypes.func.isRequired,
    onChangeBlock: PropTypes.func.isRequired,
    onDeleteBlock: PropTypes.func.isRequired,
    onMutateBlock: PropTypes.func.isRequired,
    onFocusPreviousBlock: PropTypes.func.isRequired,
    onFocusNextBlock: PropTypes.func.isRequired,
    onSelectBlock: PropTypes.func.isRequired,
    openObjectBrowser: PropTypes.func.isRequired,
    pathname: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props)
    let subblocks = []

    if (!__SERVER__) {
      if (props.data && props.data.subblocks) {
        subblocks = props.data.subblocks
      }
    }

    this.state = { subblocks }
  }

  state = {
    subblocks: [],
    subIndexSelected: 0,
  }

  /**
   * Component will receive props
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    if (this.props.selected) {
      this.node.focus()
    }
    if (this.state.subblocks.length === 0) {
      this.addSubblock()
    }
  }

  /**
   * Component will receive props
   * @method componentWillUnmount
   * @returns {undefined}
   */
  componentWillUnmount() {
    if (this.props.selected && this.node) {
      this.node.focus()
    }
  }

  /**
   * Change handler
   * @method onChange
   * @param {object} subblocks list.
   * @returns {undefined}
   */
  onChangeSubblocks = (subblockIndex, subblock) => {
    if (!isEqual(subblock, this.state.subblocks[subblockIndex])) {
      var subblocks = this.state.subblocks

      subblocks[subblockIndex] = subblock

      this.props.onChangeBlock(this.props.block, {
        ...this.props.data,
        subblocks: subblocks,
        lastChange: new Date().getTime(),
      })

      this.setState({ subblocks })
    }
  }

  /**
   * Move block handler
   * @method onMoveBlock
   * @param {number} dragIndex Drag index.
   * @param {number} hoverIndex Hover index.
   * @returns {undefined}
   */
  onMoveSubblock = (dragIndex, hoverIndex) => {
    const subblocks = move(this.props.data.subblocks, dragIndex, hoverIndex)

    this.props.onChangeBlock(this.props.block, {
      ...this.props.data,
      subblocks: subblocks,
    })

    this.setState({ subblocks })
  }

  addSubblock = () => {
    var s = this.state.subblocks
    var id = new Date().getTime().toString()
    var newBlock = { id: id }
    s.push({})
    this.setState({
      subblocks: s,
    })
    var index = this.state.subblocks.length - 1
    this.onChangeSubblocks(index, newBlock)
    this.onSubblockChangeFocus(index)
  }

  onSubblockChangeFocus = (index) => {
    this.setState({ subIndexSelected: index })
  }

  deleteSubblock = (index) => {
    var sbb = this.state.subblocks
    var subblocks = [...sbb.slice(0, index), ...sbb.slice(index + 1)]
    this.setState({ subblocks })
    this.props.onChangeBlock(this.props.block, {
      ...this.props.data,
      subblocks: subblocks,
    })
  }

  renderAddBlockButton = (title) => {
    return (
      this.props.selected && (
        <Button onClick={this.addSubblock} className="add-element">
          {title ? title : this.props.intl.formatMessage(messages.addBlock)}
        </Button>
      )
    )
  }

  isSubblockSelected = (subindex) => {
    return this.props.selected && this.state.subIndexSelected === subindex
  }
  subblockProps = {
    block: this.props.block,
    onSubblockChangeFocus: this.onSubblockChangeFocus,
    onChangeBlock: this.onChangeSubblocks,
    onMoveSubblock: this.onMoveSubblock,
    onDelete: this.deleteSubblock,
    nblock: this.state.subblocks.length,
  }
}

export default SubblocksEdit

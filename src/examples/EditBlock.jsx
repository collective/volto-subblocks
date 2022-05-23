/**
 * Edit text block.
 * @module components/manage/Blocks/Title/Edit
 */

import React from 'react';
import { injectIntl, defineMessages } from 'react-intl';
import { compose } from 'redux';
import { TextEditorWidget } from '@package/components';
import { injectDNDSubblocks, SubblockEdit, Subblock } from 'volto-subblocks';

const messages = defineMessages({
  titlePlaceholder: {
    id: 'Title placeholder',
    defaultMessage: 'Title...',
  },
  descriptionPlaceholder: {
    id: 'Description placeholder',
    defaultMessage: 'Description...',
  },
});
/**
 * Edit text block class.
 * @class Edit
 * @extends Component
 */
class EditBlock extends SubblockEdit {
  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs WysiwygEditor
   */
  constructor(props) {
    super(props);
    this.state = {
      focusOn: 'title',
    };
    if (!__SERVER__) {
    }
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    if (__SERVER__) {
      return <div />;
    }

    return (
      <Subblock subblock={this}>
        <>
          <TextEditorWidget
            data={this.props.data}
            fieldName="title"
            selected={this.props.selected || this.state.focusOn === 'title'}
            block={this.props.block}
            onChangeBlock={this.onChange}
            placeholder={this.props.intl.formatMessage(
              messages.titlePlaceholder,
            )}
            focusOn={this.focusOn}
            nextFocus="description"
          />
          <TextEditorWidget
            data={this.props.data}
            fieldName="description"
            selected={this.state.focusOn === 'description'}
            block={this.props.block}
            onChangeBlock={this.onChange}
            placeholder={this.props.intl.formatMessage(
              messages.descriptionPlaceholder,
            )}
          />
        </>
      </Subblock>
    );
  }
}

export default compose(injectIntl, injectDNDSubblocks)(EditBlock);

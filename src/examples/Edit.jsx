import React from 'react';
import { Grid } from 'semantic-ui-react';

import {
  withDNDContext,
  SubblocksEdit,
  SubblocksWrapper,
} from 'volto-subblocks';
import EditBlock from './EditBlock';

import { SidebarPortal } from '@plone/volto/components';
import Sidebar from './Sidebar.jsx';

/**
 * Edit text block class.
 * @class Edit
 * @extends Component
 */
class Edit extends SubblocksEdit {
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
      <SubblocksWrapper node={this.node}>
        <Grid stackable columns="equal" verticalAlign="top">
          <Grid.Row columns={3}>
            {this.state.subblocks.map((subblock, subindex) => (
              <Grid.Column key={subblock.id}>
                <EditBlock
                  data={subblock}
                  index={subindex}
                  selected={this.isSubblockSelected(subindex)}
                  {...this.subblockProps}
                  openObjectBrowser={this.props.openObjectBrowser}
                />
              </Grid.Column>
            ))}

            {this.props.selected && (
              <Grid.Column>{this.renderAddBlockButton()}</Grid.Column>
            )}
          </Grid.Row>
        </Grid>

        <SidebarPortal selected={this.props.selected}>
          <Sidebar
            {...this.props}
            data={this.props.data}
            onChangeBlock={this.onChangeSubblocks}
            selected={this.state.subIndexSelected}
            setSelected={this.onSubblockChangeFocus}
          />
        </SidebarPortal>
      </SubblocksWrapper>
    );
  }
}

export default React.memo(withDNDContext(Edit));

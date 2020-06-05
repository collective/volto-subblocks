# volto-subblocks

A widget for [Volto](https://github.com/plone/volto) to have a block with subblocks

To be used with mrs-developer, see [Volto docs](https://docs.voltocms.com/customizing/add-ons/) for further usage informations.

## Install mrs-developer and configure your Volto project

In your Volto project:

```bash
yarn add mrs-developer collective/volto-subblocks
```

and in `package.json`:

```json
  "scripts": {
    "develop:npx": "npx -p mrs-developer missdev --config=jsconfig.json --output=addons",
    "develop": "missdev --config=jsconfig.json --output=addons",
    "preinstall": "if [ -f $(pwd)/node_modules/.bin/missdev ]; then yarn develop; else yarn develop:npx; fi",
    "postinstall": "rm -rf ./node_modules/volto-* && yarn omelette",
    ...
  }
```

Create a `mrs.developer.json` file:

```json
{
  "volto-subblocks": {
    "url": "git@github.com:collective/volto-subblocks.git"
  }
}
```

In `jsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "volto-subblocks": ["addons/volto-subblocks"]
    },
    "baseUrl": "src"
  }
}
```

Fix tests, in `package.json`:

```json
"jest": {
    ...
    "moduleNameMapper": {
      "@plone/volto/(.*)$": "<rootDir>/node_modules/@plone/volto/src/$1",
      "@package/(.*)$": "<rootDir>/src/$1",
      "volto-subblocks/(.*)$": "<rootDir>/src/addons/volto-subblocks/src/$1",
      "~/(.*)$": "<rootDir>/src/$1"
    },
    "testMatch": [
      "**/__tests__/**/*.[jt]s?(x)",
      "**/?(*.)+(spec|test).[jt]s?(x)",
      "!**/src/addons/volto/**/*"
    ],
    ...
```

Edit `.eslintrc`:

```json
{
  "extends": "./node_modules/@plone/volto/.eslintrc",
  "settings": {
    "import/resolver": {
      "alias": {
        "map": [
          ["@plone/volto", "@plone/volto/src"],
          ["@package", "./src"],
          ["volto-subblocks", "./src/addons/volto-subblocks/src"]
        ],
        "extensions": [".js", ".jsx", ".json"]
      },
      "babel-plugin-root-import": {
        "rootPathSuffix": "src"
      }
    }
  }
}
```

Add `src/addons` in `.gitignore`:

```
# .gitignore
src/addons
```

Then, run `mrs-developer` and install dependencies:

```bash
yarn develop
yarn
```

## Usage

This is meant to edit blocks with sub-blocks, where the sub-blocks are all of the same type.

### SubblocksEdit

The edit component of the parent block must extend the class `SubblocksEdit`.

In the `render()` function of this component, you have to iterate on `this.state.subblocks` to draw subblocks.

#### Usage

- You could insert the add button simply writing `{this.renderAddBlockButton()}`
- You could insert the remove button for each subblock, simply writing `{this.renderDeleteBlockButton(subindex)}` where 'subindex' is the index of subblock.

- `this.state.subblocks`: contains subblocks. Used to iterate on subblocks
- `this.state.subIndexSelected`: contains the index of the current selected subblock
- `this.onChangeSubblocks(subblockIndex, subblock)`: function to call when a subblock value is changed. The param _subblock_ is the subblock object with new value/values.
- `this.onMove(dragIndex, hoverIndex)`: function to call when a subblock changes his position / order in subblock list.
  - _dragIndex_: initial index of the item
  - _hoverIndex_: destination index of the item.
- `this.onChangeFocus(index)`: called when the focus on subblocks change. _index_ is the index of the focused subblock .
- `this.deleteSubblock(index)`: function to call to delete subblock at _index_ position.
- `this.renderAddBlockButton(title)`: renders the add block button. If _title_ is passed, the title is displayed on button. By default the title is _'Add block'_.

#### Example

```jsx
import React from 'react'
import { Grid } from 'semantic-ui-react'
import { SubblocksEdit, withDNDContext } from 'volto-subblocks'
import { SidebarPortal } from '@plone/volto/components'
import EditBlock from './Block/EditBlock'
import Sidebar from './Sidebar'

class Edit extends SubblocksEdit {
  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    if (__SERVER__) {
      return <div />
    }

    return (
      <div
        className="volto-subblocks"
        ref={node => {
          this.node = node
        }}
      >
        <Grid stackable columns="equal" verticalAlign="top">
          <Grid.Row columns={4}>
            {this.state.subblocks.map((subblock, subindex) => (
              <Grid.Column key={subblock.id}>
                <EditBlock
                  data={subblock}
                  index={subindex}
                  selected={this.props.selected && this.state.subIndexSelected === subindex}
                  block={this.props.block}
                  openObjectBrowser={this.props.openObjectBrowser}
                  onChangeBlock={this.onChangeSubblocks}
                  onChangeFocus={this.onSubblockChangeFocus}
                  onDelete={this.deleteSubblock}
                  onMove={this.onMoveSubblock}
                />
              </Grid.Column>
            ))}

            {this.props.selected && <Grid.Column>{this.renderAddBlockButton()}</Grid.Column>}
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
      </div>
    )
  }
}

export default React.memo(withDNDContext(Edit))
```

### SubblockEdit
The edit component of the subblock must extend the class SubblockEdit

If you want to enable drag&drop to reorder subblocks, you have to return content from this function:

- this.props.connectDropTarget
- this.props.connectDragPreview
- this.props.connectDragSource
  and compose with DNDSubblocks.

- `this.onChange(obj)` to call when the subblock changes. _obj_ is the object of subblock with new values
- `this.onFocus(event)` to call when subblock receive focus
- `this.focusNode()` to call when you focus the subblock
- `this.renderDNDButton()` renders drag & drop button for subblock.
- `this.renderDeleteButton()` renders delete button to delete subblock.

#### Example

```jsx
/**
 * Edit text block.
 * @module components/manage/Blocks/Title/Edit
 */

import React from 'react'
import { compose } from 'redux'
import cx from 'classnames'
import { Placeholder } from 'semantic-ui-react'
import { injectIntl, defineMessages } from 'react-intl'
import { SubblockEdit, DNDSubblocks } from 'volto-subblocks'

import { TextEditorWidget } from '@package/components'
import ViewIcon from './ViewIcon'

const messages = defineMessages({
  iconPlaceholder: {
    id: 'Icon placeholder',
    defaultMessage: 'Select an icon...',
  },
  descriptionPlaceholder: {
    id: 'Description placeholder',
    defaultMessage: 'Description...',
  },
})

class EditBlock extends SubblockEdit {
  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs EditBlock
   */
  constructor(props) {
    super(props)
    this.state = {
      focusOn: 'description',
    }
    if (!this.props.data.block_style) {
      this.props.data.block_style = 'underline'
    }
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    if (__SERVER__) {
      return <div />
    }

    return this.props.connectDropTarget(
      this.props.connectDragPreview(
        this.props.connectDragSource(
          <div
            className={cx('volto-subblock', this.props.data.block_style, {
              isDragging: this.props.isDragging,
            })}
            onFocus={this.onFocus}
            ref={node => {
              this.node = node
            }}
          >
            {this.renderDNDButton()}
            {this.renderDeleteButton()}
            <div onClick={this.focusNode}>
              {!this.props.data.icon && (
                <Placeholder style={{ height: 50, width: 50 }}>
                  <Placeholder.Image />
                </Placeholder>
              )}
              <ViewIcon icon={this.props.data.icon} size="40px" />
            </div>
            <TextEditorWidget
              data={this.props.data}
              fieldName="description"
              selected={this.state.focusOn === 'description'}
              block={this.props.block}
              onChangeBlock={this.onChange}
              placeholder={this.props.intl.formatMessage(messages.descriptionPlaceholder)}
            />
          </div>,
        ),
      ),
    )
  }
}

export default React.memo(compose(injectIntl, ...DNDSubblocks)(EditBlock))
;``
```

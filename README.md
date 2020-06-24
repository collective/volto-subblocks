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
If you want to enable drag&drop to reorder subblocks, you have to use the HOC 'withDNDContext'.

```jsx
export default withDNDContext(Edit);
```

In the `render()` function of this component, you have to:

- wrap all content with 'SubblocksWrapper' component:

```jsx
<SubblocksWrapper node={this.node}>...</SubblocksWrapper>
```

- iterate on `this.state.subblocks` to draw subblocks.
- render each subblock passing this props:
  ```jsx
  <EditBlock
    data={subblock}
    index={subindex}
    selected={this.isSubblockSelected(subindex)}
    {...this.subblockProps}
  />
  ```

#### Usage

- You could insert the add button simply writing `{this.renderAddBlockButton()}`

* `this.state.subblocks`: contains subblocks. Used to iterate on subblocks
* `this.state.subIndexSelected`: contains the index of the current selected subblock
* `this.onChangeSubblocks(subblockIndex, subblock)`: function to call when a subblock value is changed.
  - _subblockIndex_: is the index of the subblock in subblocks array
  - _subblock_: is the subblock object with new value/values.
* `this.onMoveSubblock(dragIndex, hoverIndex)`: function to call when a subblock changes his position / order in subblock list.
  - _dragIndex_: initial index of the item
  - _hoverIndex_: destination index of the item.
* `this.onSubblockChangeFocus(index)`: called when the focus on subblocks changes.
  - _index_: is the index of the focused subblock.
* `this.deleteSubblock(index)`: function to call to delete subblock at _index_ position.
* `this.isSubblockSelected(index)`: return true if subblock ad _index_ position is selected.
* `this.renderAddBlockButton(title)`: renders the add block button.
  - _title_: if given, the title is displayed on button. Default the title is _'Add block'_.
* `this.subblockProps`: it's an object that contains default props for edit each subblock.

#### Example

```jsx
import React from 'react';
import {
  withDNDContext,
  SubblocksEdit,
  SubblocksWrapper,
} from 'volto-subblocks';
import EditBlock from './EditBlock';

class Edit extends SubblocksEdit {
  render() {
    if (__SERVER__) {
      return <div />;
    }

    return (
      <SubblocksWrapper node={this.node}>
        ...
        {this.state.subblocks.map((subblock, subindex) => (
          <EditBlock
            data={subblock}
            index={subindex}
            selected={this.isSubblockSelected(subindex)}
            {...this.subblockProps}
            openObjectBrowser={this.props.openObjectBrowser}
          />
        ))}
        {this.props.selected && this.renderAddBlockButton()}
        ...
      </SubblocksWrapper>
    );
  }
}

export default React.memo(withDNDContext(Edit));
```

### SubblockEdit

The edit component of the subblock must extend the class SubblockEdit

If you want to enable drag&drop to reorder subblocks, you have to compose with `DNDSubblocks`.

```jsx
export default compose(...DNDSubblocks)(EditBlock);
```

In the `render()` function of this component, you have to:

- wrap all content with 'Subblock' component. By default Subblock component is draggable. If you prefer not to make subblocks draggable, you could add the prop `draggable={false}`:

```jsx
<Subblock subblock={this}>...</Subblock>
```

#### Example

```jsx
import React from 'react';
import { compose } from 'redux';
import { DNDSubblocks, SubblockEdit, Subblock } from 'volto-subblocks';

class EditBlock extends SubblockEdit {
  render() {
    if (__SERVER__) {
      return <div />;
    }

    return <Subblock subblock={this}>...</Subblock>;
  }
}

export default React.memo(compose(...DNDSubblocks)(EditBlock));
```

### SubblocksWrapper

It's the wrapper to use in parent component.
Properties:

- `node`: the 'node' var that will contain ref for this node.
- `className`: to add class or classes to the wrapper.

#### Example

```jsx
<SubblocksWrapper node={this.node} className="additional_class">
  ....
</SubblocksWrapper>
```

### Subblock

It's the wrapper for each subblock. Use it in subblock edit component.
Properties:

- `subblock`: the current class instance of subblock
- `className`: to add class or classes to the wrapper.
- `draggable`: default `true`. If you don't want to make your subblock sortable with drag&drop, you can pass `false`.

#### Example

```jsx
<Subblock subblock={this} className="additional_class" draggable={false}>
  ....
</Subblock>
```

## Authors

This product was developed by **RedTurtle Technology** team.

[![RedTurtle Technology Site](https://avatars1.githubusercontent.com/u/1087171?s=100&v=4)](http://www.redturtle.it/)

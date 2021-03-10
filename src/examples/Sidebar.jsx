import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Accordion } from 'semantic-ui-react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { LinkToWidget } from '@package/components';
import { Icon } from '@plone/volto/components';
import upSVG from '@plone/volto/icons/up-key.svg';
import downSVG from '@plone/volto/icons/down-key.svg';
import redraft from 'redraft';
import config from '@plone/volto/registry';

const Sidebar = ({
  data,
  block,
  onChangeBlock,
  openObjectBrowser,
  required = false,
  selected = 0,
  setSelected,
  intl,
}) => {
  return (
    <Segment.Group raised>
      <header className="header pulled">
        <h2>
          <FormattedMessage id="TextBlocks" defaultMessage="Text Blocks" />
        </h2>
      </header>

      <Accordion fluid styled className="form">
        {data.subblocks &&
          data.subblocks.map((subblock, index) => (
            <div key={'subblock' + index}>
              <Accordion.Title
                active={selected === index}
                index={index}
                onClick={() => setSelected(selected === index ? null : index)}
              >
                {subblock.title
                  ? redraft(
                      subblock.title,
                      config.settings.ToHTMLRenderers,
                      config.settings.ToHTMLOptions,
                    )
                  : `Blocco ${index + 1}`}
                {selected === index ? (
                  <Icon name={upSVG} size="20px" />
                ) : (
                  <Icon name={downSVG} size="20px" />
                )}
              </Accordion.Title>
              <Accordion.Content active={selected === index}>
                <LinkToWidget
                  data={subblock}
                  openObjectBrowser={openObjectBrowser}
                  onChange={(name, value) => {
                    onChangeBlock(index, {
                      ...subblock,
                      [name]: value,
                    });
                  }}
                />
              </Accordion.Content>
            </div>
          ))}
      </Accordion>
    </Segment.Group>
  );
};

Sidebar.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  block: PropTypes.string.isRequired,
  onChangeBlock: PropTypes.func.isRequired,
  openObjectBrowser: PropTypes.func.isRequired,
  selected: PropTypes.any,
  setSelected: PropTypes.func,
};

export default injectIntl(Sidebar);
